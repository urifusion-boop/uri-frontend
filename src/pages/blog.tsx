import Navigation from '@/components/Navigation';
import SeoHead from '@/components/atoms/SeoHead';
import Footer from '@/components/landing/Footer';
import { BlogPost, getAllBlogPosts } from '@/lib/blog';
import Image from 'next/image';
import Link from 'next/link';

export async function getStaticProps() {
  const posts = getAllBlogPosts();

  return {
    props: {
      posts,
    },
  };
}

export default function BlogPage({ posts }: { posts: BlogPost[] }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getImageUrl = (post: BlogPost) => post.image || 'https://source.unsplash.com/600x400/?africa,business';

  return (
    <>
      <SeoHead title="Blog" />
      <div className="bg-[#FFFCFE] min-h-screen">
        <Navigation />
        <section className="max-w-[1100px] mx-auto px-4 mt-24 mb-[100px]">
          <h1 className="md:text-[40px] text-[28px] font-bold text-[#141416] mb-6 underline">Insights</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                <div className="relative h-[200px] rounded-[16px] overflow-hidden">
                  <Image src={getImageUrl(post)} alt={post.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                  {post.category && <span className="absolute top-3 left-3 bg-[#CD1B78] text-white text-xs font-semibold px-3 py-1 rounded-full">{post.category}</span>}
                </div>
                <h2 className="text-[18px] font-semibold text-[#141416] mt-3">{post.title}</h2>
                <p className="text-[#666] text-sm mt-1">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-[#666] text-xs mt-2">
                  <span>{post.author}</span>
                  <span>{formatDate(post.date)}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
}
