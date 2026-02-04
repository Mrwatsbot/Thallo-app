import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  image?: string;
  readingTime: string;
  content: string;
}

const postsDirectory = path.join(process.cwd(), 'content', 'blog');

export function getAllPosts(): BlogPost[] {
  // Create directory if it doesn't exist
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      const stats = readingTime(content);

      return {
        slug,
        title: data.title || 'Untitled',
        description: data.description || '',
        date: data.date || new Date().toISOString(),
        author: data.author || 'Ted Melittas',
        category: data.category || 'financial-health',
        tags: data.tags || [],
        image: data.image,
        readingTime: stats.text,
        content,
      };
    });

  // Sort posts by date (newest first)
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const stats = readingTime(content);

    return {
      slug,
      title: data.title || 'Untitled',
      description: data.description || '',
      date: data.date || new Date().toISOString(),
      author: data.author || 'Ted Melittas',
      category: data.category || 'financial-health',
      tags: data.tags || [],
      image: data.image,
      readingTime: stats.text,
      content,
    };
  } catch (error) {
    return null;
  }
}

export function getPostsByCategory(category: string): BlogPost[] {
  const allPosts = getAllPosts();
  return allPosts.filter((post) => post.category === category);
}

export function getRelatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  const allPosts = getAllPosts();
  
  // Filter out the current post and calculate relevance scores
  const scoredPosts = allPosts
    .filter((p) => p.slug !== post.slug)
    .map((p) => {
      let score = 0;
      
      // Same category = +3 points
      if (p.category === post.category) score += 3;
      
      // Shared tags = +1 point each
      const sharedTags = p.tags.filter((tag) => post.tags.includes(tag));
      score += sharedTags.length;
      
      return { post: p, score };
    });
  
  // Sort by score (descending) and return top N
  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post }) => post);
}

export const CATEGORIES = [
  { slug: 'budgeting-basics', name: 'Budgeting Basics' },
  { slug: 'app-comparisons', name: 'App Comparisons' },
  { slug: 'financial-health', name: 'Financial Health' },
  { slug: 'saving-strategies', name: 'Saving Strategies' },
  { slug: 'debt-management', name: 'Debt Management' },
] as const;

export function getCategoryName(slug: string): string {
  const category = CATEGORIES.find((c) => c.slug === slug);
  return category?.name || slug;
}
