import { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts, CATEGORIES, getCategoryName } from '@/lib/blog';
import { Calendar, Clock, Tag, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog – Thallo',
  description: 'Learn about budgeting, financial health, debt management, and building wealth. Expert insights from the Thallo team.',
  openGraph: {
    title: 'Blog – Thallo',
    description: 'Learn about budgeting, financial health, debt management, and building wealth.',
    type: 'website',
    url: 'https://usethallo.com/blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog – Thallo',
    description: 'Learn about budgeting, financial health, debt management, and building wealth.',
  },
};

export default function BlogIndexPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const allPosts = getAllPosts();
  const selectedCategory = searchParams.category;
  
  const filteredPosts = selectedCategory
    ? allPosts.filter((post) => post.category === selectedCategory)
    : allPosts;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a7a6d] to-[#146b5f] flex items-center justify-center p-1">
            <img src="/thallo-logo-white.png" alt="Thallo" className="w-full h-full object-contain" />
          </div>
          <span className="text-xl font-display font-bold">Thallo</span>
        </Link>
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to Home
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-foreground">
          Financial Health Insights
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Expert advice on budgeting, saving, debt management, and building real wealth. Written by Ted Melittas.
        </p>
      </section>

      {/* Category Filter */}
      <section className="max-w-6xl mx-auto px-6 pb-8">
        <div className="flex flex-wrap gap-2">
          <Link href="/blog">
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                !selectedCategory
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              All Posts
            </button>
          </Link>
          {CATEGORIES.map((category) => (
            <Link key={category.slug} href={`/blog?category=${category.slug}`}>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category.slug
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {category.name}
              </button>
            </Link>
          ))}
        </div>
      </section>

      {/* Posts Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No posts found in this category yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <article className="glass-card rounded-2xl p-6 h-full hover:border-primary/30 transition-all group">
                  {post.image && (
                    <div className="mb-4 rounded-lg overflow-hidden bg-muted h-48">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                      {getCategoryName(post.category)}
                    </span>
                  </div>

                  <h2 className="text-xl font-display font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {post.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readingTime}
                    </span>
                  </div>

                  {post.tags.length > 0 && (
                    <div className="flex items-center gap-2 mt-4 flex-wrap">
                      <Tag className="w-3 h-3 text-muted-foreground" />
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex items-center text-sm text-primary font-medium group-hover:translate-x-1 transition-transform">
                    Read more <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
