import fs from "fs";
import path from "path";
import matter from "gray-matter";

const faqsDirectory = path.join(process.cwd(), "src/markdown/faqs");

export function getAllFaqs() {
  // Check if directory exists
  if (!fs.existsSync(faqsDirectory)) {
    console.warn(`FAQs directory not found at ${faqsDirectory}`);
    return [];
  }

  try {
    const fileNames = fs.readdirSync(faqsDirectory);

    return fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map((fileName) => {
        try {
          const filePath = path.join(faqsDirectory, fileName);
          const fileContents = fs.readFileSync(filePath, "utf8");
          const { data, content } = matter(fileContents);

          return {
            slug: fileName.replace(/\.md$/, ""),
            ...data,
            content,
          };
        } catch (error) {
          console.error(`Error processing FAQ file ${fileName}:`, error);
          return null;
        }
      })
      .filter(Boolean); // Remove any null entries from failed processing
  } catch (error) {
    console.error("Error reading FAQs directory:", error);
    return [];
  }
}

export function getFaqBySlug(slug: string) {
  try {
    const filePath = path.join(faqsDirectory, `${slug}.md`);

    if (!fs.existsSync(filePath)) {
      throw new Error(`FAQ not found: ${slug}`);
    }

    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      ...data,
      content,
    };
  } catch (error) {
    console.error(`Error getting FAQ for slug ${slug}:`, error);
    return null;
  }
}
