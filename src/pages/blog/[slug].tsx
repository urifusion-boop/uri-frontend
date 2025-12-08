import SeoHead from '@/components/atoms/SeoHead';
import Footer from '@/components/landing/Footer';
import Navigation from '@/components/Navigation';
import { BlogPost, getAllBlogPosts, getBlogPostBySlug } from '@/lib/blog';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FiArrowLeft, FiCalendar, FiUser } from 'react-icons/fi';
import { remark } from 'remark';
import html from 'remark-html';

export async function getStaticPaths() {
  const posts = getAllBlogPosts();
  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    return { notFound: true };
  }

  const processedContent = await remark().use(html).process(post.content);
  const contentHtml = processedContent.toString();

  // Extract first YouTube video id for top embed section
  const shortMatch = contentHtml.match(/(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/);
  const watchMatch = contentHtml.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/);
  const firstVideoId = (shortMatch && shortMatch[1]) || (watchMatch && watchMatch[1]) || null;

  return {
    props: {
      post: {
        ...post,
        contentHtml,
      },
      firstVideoId,
    },
  };
}

interface BlogPostPageProps {
  post: BlogPost & { contentHtml: string };
  firstVideoId: string | null;
}

export default function BlogPostPage({ post, firstVideoId }: BlogPostPageProps) {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const contentWithEmbeds = transformYouTubeLinksToEmbeds(post.contentHtml);

  return (
    <>
      <SeoHead title={post.title} />
      <div className="bg-[#FFFCFE] min-h-screen">
        <Navigation />

        <div className="max-w-[900px] mx-auto px-4 mt-6">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-[#CD1B78] font-medium text-sm sm:text-xl hover:underline">
            <FiArrowLeft />
            Back to Blog
          </button>
        </div>

        <article className="max-w-[900px] mx-auto px-4 mt-8 mb-[100px]">
          {firstVideoId && (
            <div className="bg-background border-2 border-border rounded-2xl shadow-strong overflow-hidden mb-8">
              <div className="px-4 sm:px-6 pt-4 sm:pt-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">How do I schedule posts across my social media platforms?</h2>
                <p className="text-sm text-muted-foreground mb-4">Watch the walkthrough to start using URI efficiently.</p>
              </div>
              <div className="px-2 sm:px-3 pb-4 sm:pb-6">
                <a href={`https://www.youtube.com/watch?v=${firstVideoId}`} target="_blank" rel="noopener noreferrer" className="block">
                  <Image src={previewImageUrl} alt="Blog video preview" width={1200} height={675} className="w-full h-auto rounded-xl" priority />
                </a>
              </div>
            </div>
          )}
          <div className="relative h-[300px] md:h-[400px] rounded-[16px] overflow-hidden mb-8">
            <a href={firstVideoId ? `https://www.youtube.com/watch?v=${firstVideoId}` : '#'} target="_blank" rel="noopener noreferrer" className="block">
              <Image src={previewImageUrl} alt={post.title} fill className="object-cover" />
            </a>
            {post.category && <span className="absolute top-4 left-4 bg-[#CD1B78] text-white text-sm font-semibold px-4 py-2 rounded-full">{post.category}</span>}
          </div>

          <h1 className="md:text-[48px] text-[32px] font-bold text-[#141416] mb-4">{post.title}</h1>

          <div className="flex items-center gap-6 text-[#666] mb-8">
            <div className="flex items-center gap-2">
              <FiUser className="text-[#CD1B78]" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCalendar className="text-[#CD1B78]" />
              <span>{formatDate(post.date)}</span>
            </div>
          </div>

          <div
            className="prose prose-lg max-w-none prose-headings:text-[#141416] prose-p:text-[#363636] prose-a:text-[#CD1B78] prose-strong:text-[#141416] prose-ul:text-[#363636] prose-ol:text-[#363636]"
            dangerouslySetInnerHTML={{ __html: contentWithEmbeds }}
          />
        </article>

        <Footer />
      </div>
    </>
  );
}
const transformYouTubeLinksToEmbeds = (input: string) => {
  const replaceShort = input.replace(
    /<a[^>]*href=["'](?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})["'][^>]*>[^<]*<\/a>|(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/g,
    (_match, id1, id2) => {
      const videoId = id1 || id2;
      return `
<div class="rounded-[16px] overflow-hidden my-6">
  <iframe
    width="100%"
    height="360"
    src="https://www.youtube.com/embed/${videoId}?autoplay=0"
    title="YouTube video player"
    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
    style="border:0;border-radius:16px"
  ></iframe>
</div>`;
    }
  );

  const replaceWatch = replaceShort.replace(
    /<a[^>]*href=["'](?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})["'][^>]*>[^<]*<\/a>|(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/g,
    (_match, id1, id2) => {
      const videoId = id1 || id2;
      return `
<div class="rounded-[16px] overflow-hidden my-6">
  <iframe
    width="100%"
    height="360"
    src="https://www.youtube.com/embed/${videoId}?autoplay=0"
    title="YouTube video player"
    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
    style="border:0;border-radius:16px"
  ></iframe>
</div>`;
    }
  );

  return replaceWatch;
};

const previewImageUrl = 'https://source.unsplash.com/1200x675/?africa,business';
