import Navigation from '@/components/Navigation';
import SeoHead from '@/components/atoms/SeoHead';
import Footer from '@/components/landing/Footer';
import { BlogPost, getBlogPostBySlug } from '@/lib/blog';
import Image from 'next/image';
import { remark } from 'remark';
import html from 'remark-html';

export async function getStaticProps() {
  const post = getBlogPostBySlug('billion-dollar-tweet-piggyvest');

  if (!post) {
    return { notFound: true };
  }

  const processedContent = await remark().use(html).process(post.content);
  const contentHtml = processedContent.toString();

  return {
    props: {
      post: { ...post, contentHtml },
    },
  };
}

export default function BlogPage({ post }: { post: BlogPost & { contentHtml: string } }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const contentWithEmbeds = transformYouTubeLinksToEmbeds(post.contentHtml);

  return (
    <>
      <SeoHead title={post.title} />
      <div className="bg-[#FFFCFE] min-h-screen">
        <Navigation />
        <article className="max-w-[900px] mx-auto px-4 mt-24 mb-[100px]">
          <div className="relative h-[300px] md:h-[400px] rounded-[16px] overflow-hidden mb-8">
            <Image src={previewImageUrl} alt={post.title} fill className="object-cover" />
            {post.category && <span className="absolute top-4 left-4 bg-[#CD1B78] text-white text-sm font-semibold px-4 py-2 rounded-full">{post.category}</span>}
          </div>
          <h1 className="md:text-[48px] text-[32px] font-bold text-[#141416] mb-4">{post.title}</h1>
          <div className="flex items-center gap-6 text-[#666] mb-8">
            <span>{post.author}</span>
            <span>{formatDate(post.date)}</span>
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
