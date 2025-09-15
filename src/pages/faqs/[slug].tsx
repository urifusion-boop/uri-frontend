import { HelpQuestionIcon } from "@/components/atoms/Icons";
import Header from "@/components/landing/Header";
import { getAllFaqs, getFaqBySlug } from "@/lib/faq";
import Typography from "@mui/material/Typography";
import { remark } from "remark";
import html from "remark-html";
import { FiArrowLeft, FiPlus } from "react-icons/fi";
import { useState } from "react";
import UpperFooter from "@/components/landing/UpperFooter";
import SeoHead from "@/components/atoms/SeoHead";
import { useRouter } from "next/router";

export async function getStaticPaths() {
  const faqs = getAllFaqs();
  const paths = faqs.map((faq) => ({
    params: { slug: faq?.slug },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }: { params: any }) {
  const faq = getFaqBySlug(params.slug);
  const processedContent = await remark().use(html).process(faq?.content);

  const contentHtml = processedContent.toString();

  return {
    props: {
      faq: {
        ...faq,
        contentHtml,
      },
    },
  };
}

export default function FaqPage({ faq }: { faq: any }) {
  const router = useRouter();

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const parser = new DOMParser();
  const doc = parser.parseFromString(faq.contentHtml, "text/html");

  const contentSections = Array.from(doc.querySelectorAll("ul > li")).map(
    (li) => {
      const key = li.querySelector("strong")?.textContent || "";

      let description = li.innerHTML
        .replace(`<strong>${key}</strong>`, "")
        .trim();
      description = description.replace(/<\/?p>/g, "").trim();

      return {
        key,
        description,
      };
    }
  );

  return (
    <>
      <SeoHead title={`Faq: ${faq.keyword}`} />
      <div className="bg-[#FFFCFE] min-h-screen">
        <Header />

        {/* Back Button */}
        <div className="max-w-[1230px] mx-auto px-4 mt-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#CD1B78] font-medium text-sm sm:text-xl hover:underline"
          >
            <FiArrowLeft />
            Back
          </button>
        </div>

        <h2 className="md:text-[60px] text-[42px] font-bold text-center md:mt-[72px] mt-[60px]">
          Frequently Asked
          <span className="inline md:text-[60px] text-[42px] font-bold text-[#CD1B78]">
            {" "}
            Questions
          </span>
        </h2>
        <p className="text-center text-[#080808] md:text-[24px] text-lg px-3">
          Got Questions? We’ve Got Answers. Find quick answers to common
          inquiries.
        </p>

        <div className="px-4 mt-[60px] md:mt-[120px] max-w-[1230px] mx-auto">
          <h3 className="text-[#141416] font-[500] md:text-[24px] text-lg">
            {faq.keyword}
          </h3>

          <ul className="md:mt-[60px] mt-[40px] md:space-y-[64px] space-y-8 md:mb-[400px] mb-[200px]">
            {contentSections.map((section, index) => (
              <li
                key={index}
                className="border border-[#7676764D]/50 border-b-[#CD1B78] p-6 rounded-lg flex gap-3 items-start"
              >
                <HelpQuestionIcon />
                <div className="w-full">
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() =>
                      setActiveIndex(activeIndex === index ? null : index)
                    }
                  >
                    <Typography className="text-[#242A2D] font-[500] md:text-[24px] text-lg">
                      {section.key}
                    </Typography>
                    <div
                      className={`transform transition-transform duration-300 ${activeIndex === index ? "rotate-45" : ""}`}
                    >
                      <FiPlus />
                    </div>
                  </div>
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      activeIndex === index
                        ? "grid-rows-[1fr] opacity-100 mt-4"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <Typography
                        className="text-[#242A2D] font-[400] md:text-[20px] text-base"
                        sx={{
                          whiteSpace: "pre-line",
                        }}
                        dangerouslySetInnerHTML={{
                          __html: section.description,
                        }}
                      />
                      {/* {section.description}
                      </Typography> */}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <UpperFooter />
      </div>
    </>
  );
}
