import Navigation from '@/components/Navigation';
import SeoHead from '@/components/atoms/SeoHead';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { BlogPost, getAllBlogPosts } from '@/lib/blog';
import { Share2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

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

  const handleShare = (post: BlogPost) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const url = `${origin}/blog/${post.slug}`;
    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      (navigator as any).share({ title: post.title, text: post.excerpt || post.title, url }).catch(() => {});
      return;
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard
        .writeText(url)
        .then(() => toast('Link copied to clipboard'))
        .catch(() => toast('Unable to copy link'));
      return;
    }
    toast('Sharing not supported on this device');
  };

  return (
    <>
      <SeoHead title="Blog" />
      <div className="bg-[#FFFCFE] min-h-screen">
        <Navigation />
        <section className="max-w-[1100px] mx-auto px-4 mt-20">
          <div className="relative overflow-hidden rounded-[20px] border border-[#F0E6F6] bg-gradient-to-br from-[#F8E9FF] via-[#FFF2FA] to-[#FFFCFE] p-8 md:p-12 text-center">
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-[#CD1B78]/10 blur-2xl" />
            <div className="absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-[#3b0aa0]/10 blur-2xl" />

            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#CD1B78]/10 border border-[#CD1B78]/20 text-[#CD1B78] text-sm font-medium mb-6">
              <span className="h-2 w-2 rounded-full bg-[#CD1B78]" />
              Insights for the African market
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-[#3b0aa0]">URI Blog</h1>
            <p className="mt-4 text-[#4b5563] text-base sm:text-lg max-w-2xl mx-auto">Stories, playbooks, and signal-driven growth tactics for founders and teams building for Africa.</p>
          </div>
        </section>
        <section className="max-w-[1100px] mx-auto px-4 mt-10 mb-[100px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                <div className="relative h-[200px] rounded-[16px] overflow-hidden">
                  <Image src={getImageUrl(post)} alt={post.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                  {post.category && <span className="absolute top-3 left-3 bg-[#CD1B78] text-white text-xs font-semibold px-3 py-1 rounded-full">{post.category}</span>}
                </div>
                <h2 className="text-[18px] font-semibold text-[#141416] mt-3">{post.title}</h2>
                <p className="text-[#666] text-sm mt-1">{post.excerpt}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-4 text-[#666] text-xs">
                    <span>{post.author}</span>
                    <span>{formatDate(post.date)}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label="Share post"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleShare(post);
                    }}
                    className="text-[#3b0aa0] hover:text-[#3b0aa0]"
                  >
                    <Share2 />
                    Share
                  </Button>
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
