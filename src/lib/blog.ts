import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

const blogDirectory = path.join(process.cwd(), 'src/markdown/blog');

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  image?: string;
  category?: string;
  content: string;
}

export function getAllBlogPosts(): BlogPost[] {
  // Check if directory exists
  if (!fs.existsSync(blogDirectory)) {
    console.warn(`Blog directory not found at ${blogDirectory}`);
    return [];
  }

  try {
    const fileNames = fs.readdirSync(blogDirectory);

    return fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .map<BlogPost | null>((fileName) => {
        try {
          const filePath = path.join(blogDirectory, fileName);
          const fileContents = fs.readFileSync(filePath, 'utf8');
          const { data, content } = matter(fileContents);

          const post: BlogPost = {
            slug: fileName.replace(/\.md$/, ''),
            title: data.title || '',
            excerpt: data.excerpt || '',
            date: data.date || '',
            author: data.author || '',
            image: data.image,
            category: data.category,
            content,
          };

          return post;
        } catch (error) {
          console.error(`Error processing blog file ${fileName}:`, error);
          return null;
        }
      })
      .filter((post): post is BlogPost => post !== null)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error reading blog directory:', error);
    return [];
  }
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  try {
    const filePath = path.join(blogDirectory, `${slug}.md`);

    if (!fs.existsSync(filePath)) {
      throw new Error(`Blog post not found: ${slug}`);
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || '',
      excerpt: data.excerpt || '',
      date: data.date || '',
      author: data.author || '',
      image: data.image,
      category: data.category,
      content,
    };
  } catch (error) {
    console.error(`Error getting blog post for slug ${slug}:`, error);
    return null;
  }
}
