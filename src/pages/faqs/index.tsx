import Navigation from '@/components/Navigation';
import SeoHead from '@/components/atoms/SeoHead';
import Footer from '@/components/landing/Footer';
import { getAllFaqs } from '@/lib/faq';
import { TextField } from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';

export async function getStaticProps() {
  const faqs = getAllFaqs();
  return {
    props: { faqs },
  };
}

export default function FaqKeywords({ faqs }: { faqs: any }) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredFaqs, setFilteredFaqs] = useState(faqs);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const lowerCaseQuery = query.toLowerCase();

    // Tokenize the search query into words
    const queryWords = lowerCaseQuery.split(/\s+/); // Splits by spaces

    const filtered = faqs
      .map((faq: any) => {
        // Count matches in keyword and content
        const keywordMatch = queryWords.filter((word) => faq.keyword.toLowerCase().includes(word)).length;

        const contentMatch = queryWords.filter((word) => faq.content.toLowerCase().includes(word)).length;

        // Total match score
        const matchScore = keywordMatch * 2 + contentMatch; // Weight keyword matches higher

        return { ...faq, matchScore };
      })
      .filter((faq: any) => faq.matchScore > 0) // Only keep items with matches
      .sort((a: any, b: any) => b.matchScore - a.matchScore); // Sort by best match

    setFilteredFaqs(filtered);
  };

  return (
    <>
      <SeoHead title="FAQs" />
      <div className="bg-[#FFFCFE]">
        <Navigation />
        <h2 className="md:text-[60px] text-[42px] font-bold text-center md:mt-[72px] mt-[60px] mb-1">
          Frequently Asked
          <span className="inline md:text-[60px] text-[42px] font-bold text-[#CD1B78]"> Questions</span>
        </h2>
        <p className="text-center text-[#080808] md:text-[24px] text-lg px-3">Got Questions? We’ve Got Answers. Find quick answers to common inquiries.</p>

        <div className="flex justify-center mt-[40px] md:mt-[80px]">
          <TextField
            id="outlined-basic"
            label="How can we help you?"
            variant="outlined"
            className="w-full rounded-full max-h-[78px] max-w-[980px] mx-4 md:mx-auto"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <ul className="flex mb-4 flex-col px-3 md:px-4 items-center md:mt-[72px] mt-[60px] md:gap-[30px] gap-4">
          {filteredFaqs
            .sort((a: { slug: string }, b: { slug: string }) => {
              if (a.slug === 'onboarding') return -1;
              if (b.slug === 'onboarding') return 1;
              return 0;
            })
            .map((faq: any) => (
              <li key={faq.slug} className="w-full bg-white py-[16px] md:px-4 px-2 rounded-[8px] shadow-md max-w-[967px] mx-auto">
                <Link href={`/faqs/${faq.slug}`} className="flex items-center md:gap-[24px] gap-[16px]">
                  {faq.image && (
                    <div className="md:p-[10px] p-[8px] bg-[#CD1B78] rounded-md">
                      <img src={faq.image} alt={faq.keyword} className="object-contain md:w-[40px] w-[32px] md:h-[40px] h-[32px]" />
                    </div>
                  )}
                  <p className="md:text-[24px] text-[16px] font-semibold text-[#363636] m-0 font-urbanist">{faq.keyword}</p>
                </Link>
              </li>
            ))}
        </ul>
        <Footer />
      </div>
    </>
  );
}
