import SeoHead from '@/components/atoms/SeoHead';
import Footer from '@/components/landing/Footer';
import Navigation from '@/components/Navigation';
import { BlogPost, getAllBlogPosts, getBlogPostBySlug } from '@/lib/blog';
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

  return {
    props: {
      post: {
        ...post,
        contentHtml,
      },
    },
  };
}

interface BlogPostPageProps {
  post: BlogPost & { contentHtml: string };
}

export default function BlogPostPage({ post }: BlogPostPageProps) {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

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
          {post.image && (
            <div className="relative h-[300px] md:h-[400px] rounded-[16px] overflow-hidden mb-8">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
              {post.category && <span className="absolute top-4 left-4 bg-[#CD1B78] text-white text-sm font-semibold px-4 py-2 rounded-full">{post.category}</span>}
            </div>
          )}

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
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </article>

        <Footer />
      </div>
    </>
  );
}
