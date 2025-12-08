import Navigation from '@/components/Navigation';
import SeoHead from '@/components/atoms/SeoHead';
import Footer from '@/components/landing/Footer';
import { BlogPost, getAllBlogPosts } from '@/lib/blog';
import { TextField } from '@mui/material';
import Link from 'next/link';
import { useMemo, useState } from 'react';

export async function getStaticProps() {
  const posts = getAllBlogPosts();
  return {
    props: { posts },
  };
}

export default function BlogIndex({ posts }: { posts: BlogPost[] }) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 9;

  const categories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set).sort()];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const queryWords = lowerCaseQuery.trim() ? lowerCaseQuery.split(/\s+/) : [];
    let list = posts;

    if (selectedCategory !== 'All') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (queryWords.length === 0) {
      return list;
    }

    return list
      .map((post) => {
        const titleMatch = queryWords.filter((word) => post.title.toLowerCase().includes(word)).length;
        const excerptMatch = queryWords.filter((word) => post.excerpt.toLowerCase().includes(word)).length;
        const contentMatch = queryWords.filter((word) => post.content.toLowerCase().includes(word)).length;
        const matchScore = titleMatch * 3 + excerptMatch * 2 + contentMatch;
        return { ...post, matchScore } as BlogPost & { matchScore: number };
      })
      .filter((post) => post.matchScore > 0)
      .sort((a, b) => (b as any).matchScore - (a as any).matchScore);
  }, [posts, searchQuery, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / pageSize));
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPosts.slice(start, start + pageSize);
  }, [filteredPosts, currentPage]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
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

        <div className="flex justify-center mt-[40px] md:mt-[60px]">
          <TextField
            id="blog-search"
            label="Search articles..."
            variant="outlined"
            className="w-full rounded-full max-h-[78px] max-w-[980px] mx-4 md:mx-auto"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <div className="max-w-[1200px] mx-auto px-4 mt-6">
          <div className="flex flex-wrap gap-2 items-center">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setSelectedCategory(c);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                  selectedCategory === c ? 'bg-[#CD1B78] text-white border-[#CD1B78]' : 'bg-white text-[#363636] border-[#e5e5e5] hover:border-[#CD1B78] hover:text-[#CD1B78]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {searchQuery.trim() === '' && selectedCategory === 'All' && posts.length > 0 && (
          <div className="max-w-[1200px] mx-auto px-4 mt-[40px] md:mt-[60px]">
            <Link href={`/blog/${posts[0].slug}`} className="group">
              <article className="relative rounded-[16px] overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                {posts[0].image && (
                  <div className="h-[260px] md:h-[360px]">
                    <img src={posts[0].image} alt={posts[0].title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                  {posts[0].category && <span className="inline-block mb-3 bg-[#CD1B78] text-white text-xs font-semibold px-3 py-1 rounded-full">{posts[0].category}</span>}
                  <h3 className="text-[22px] md:text-[28px] font-bold">{posts[0].title}</h3>
                  <p className="mt-2 text-sm md:text-base opacity-90 line-clamp-2">{posts[0].excerpt}</p>
                </div>
              </article>
            </Link>
          </div>
        )}

        <div className="max-w-[1200px] mx-auto px-4 mt-[40px] md:mt-[60px] mb-[100px]">
          {paginatedPosts.length === 0 ? (
            <p className="text-center text-[#666] text-lg">No blog posts found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedPosts.map((post) => (
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
                        <span className="flex items-center gap-3">
                          <span>{formatDate(post.date)}</span>
                          <span>{Math.max(1, Math.ceil(post.content.trim().split(/\s+/).length / 200))} min read</span>
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className={`px-4 py-2 rounded-full border text-sm ${currentPage === 1 ? 'text-[#bbb] border-[#eee]' : 'text-[#363636] border-[#e5e5e5] hover:border-[#CD1B78] hover:text-[#CD1B78]'}`}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-9 h-9 rounded-full border text-sm ${
                  currentPage === i + 1 ? 'bg-[#CD1B78] text-white border-[#CD1B78]' : 'bg-white text-[#363636] border-[#e5e5e5] hover:border-[#CD1B78] hover:text-[#CD1B78]'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className={`px-4 py-2 rounded-full border text-sm ${currentPage === totalPages ? 'text-[#bbb] border-[#eee]' : 'text-[#363636] border-[#e5e5e5] hover:border-[#CD1B78] hover:text-[#CD1B78]'}`}
            >
              Next
            </button>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
