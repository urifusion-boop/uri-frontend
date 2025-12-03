import Navigation from '@/components/Navigation';
import SeoHead from '@/components/atoms/SeoHead';
import Footer from '@/components/landing/Footer';
import { BlogPost, getAllBlogPosts } from '@/lib/blog';
import { TextField } from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';

export async function getStaticProps() {
  const posts = getAllBlogPosts();
  return {
    props: { posts },
  };
}

export default function BlogIndex({ posts }: { posts: BlogPost[] }) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredPosts, setFilteredPosts] = useState(posts);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const lowerCaseQuery = query.toLowerCase();

    if (!query.trim()) {
      setFilteredPosts(posts);
      return;
    }

    const queryWords = lowerCaseQuery.split(/\s+/);

    const filtered = posts
      .map((post) => {
        const titleMatch = queryWords.filter((word) => post.title.toLowerCase().includes(word)).length;
        const excerptMatch = queryWords.filter((word) => post.excerpt.toLowerCase().includes(word)).length;
        const contentMatch = queryWords.filter((word) => post.content.toLowerCase().includes(word)).length;

        const matchScore = titleMatch * 3 + excerptMatch * 2 + contentMatch;

        return { ...post, matchScore };
      })
      .filter((post) => post.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);

    setFilteredPosts(filtered);
  };

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
      <SeoHead title="Blog" />
      <div className="bg-[#FFFCFE] min-h-screen">
        <Navigation />
        <h2 className="md:text-[60px] text-[42px] font-bold text-center md:mt-[72px] mt-[60px] mb-1">
          Our <span className="inline md:text-[60px] text-[42px] font-bold text-[#CD1B78]">Blog</span>
        </h2>
        <p className="text-center text-[#080808] md:text-[24px] text-lg px-3">Insights, updates, and tips to help you grow with social media intelligence.</p>

        <div className="flex justify-center mt-[40px] md:mt-[80px]">
          <TextField
            id="blog-search"
            label="Search articles..."
            variant="outlined"
            className="w-full rounded-full max-h-[78px] max-w-[980px] mx-4 md:mx-auto"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <div className="max-w-[1200px] mx-auto px-4 mt-[60px] md:mt-[80px] mb-[100px]">
          {filteredPosts.length === 0 ? (
            <p className="text-center text-[#666] text-lg">No blog posts found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                  <article className="bg-white rounded-[16px] shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                    {post.image && (
                      <div className="relative h-[200px] overflow-hidden">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        {post.category && <span className="absolute top-4 left-4 bg-[#CD1B78] text-white text-xs font-semibold px-3 py-1 rounded-full">{post.category}</span>}
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-[20px] font-semibold text-[#363636] mb-2 group-hover:text-[#CD1B78] transition-colors">{post.title}</h3>
                      <p className="text-[#666] text-[14px] mb-4 flex-grow line-clamp-3">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-[12px] text-[#999]">
                        <span>{post.author}</span>
                        <span>{formatDate(post.date)}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}
