'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SearchInput } from '@/components/SearchInput';
import { BlogPostMeta } from '@/lib/markdownLoader';
import blogData from '@/content/blog.json';

interface BlogClientProps {
  posts: BlogPostMeta[];
  categories: string[];
}

export function BlogClient({ posts, categories }: BlogClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = useMemo(() => {
    let filtered = posts;

    if (selectedCategory !== 'All') {
      const selectedCategoryData = blogData.categories.find(cat => cat.name === selectedCategory);
      if (selectedCategoryData) {
        filtered = filtered.filter(post => post.category === selectedCategoryData.id);
      }
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [posts, selectedCategory, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <>
      <section className="py-4 sm:py-6 lg:py-8 border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4 sm:space-y-6">
            {/* Search - full width on mobile */}
            <div className="w-full max-w-md mx-auto">
              <SearchInput
                onSearch={handleSearch}
                placeholder="Search articles..."
                aria-label="Search blog articles"
                className="w-full"
              />
            </div>

            {/* Category buttons - scrollable on mobile */}
            <div className="flex flex-wrap gap-2 justify-center overflow-x-auto pb-2 sm:pb-0">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`cursor-pointer whitespace-nowrap flex-shrink-0 text-xs sm:text-sm transition-all duration-200 interactive ${
                    selectedCategory === category 
                      ? 'glass-primary border backdrop-blur-md' 
                      : 'backdrop-blur-md border-primary/20 hover:bg-primary/10'
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>

            <div className="text-center text-xs sm:text-sm text-muted-foreground">
              {filteredPosts.length === 1 ? (
                <span>Showing 1 article</span>
              ) : (
                <span>Showing {filteredPosts.length} articles</span>
              )}
              {searchQuery && (
                <span> for &quot;{searchQuery}&quot;</span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-8 sm:py-12" role="status" aria-live="polite">
              <div className="mb-4">
                <svg
                  className="mx-auto h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-sm sm:text-base lg:text-lg font-medium text-foreground mb-2">
                No articles found
              </h3>
              <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="group hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer border border-primary/20 backdrop-blur-md bg-background/50 glow-card interactive">
                  <CardContent className="p-3 sm:p-4 lg:p-6">
                    <div className="mb-2 sm:mb-3 lg:mb-4">
                      <Badge variant="secondary" className="mb-2 text-xs">
                        {post.category}
                      </Badge>
                      <div className="flex items-center text-xs sm:text-sm text-muted-foreground mb-2">
                        <span>{post.readTime}</span>
                        <span className="mx-2">•</span>
                        <span>{post.author}</span>
                      </div>
                    </div>
                    
                    <Link href={`/blog/${post.slug}`} className="block">
                      <h3 className="text-sm sm:text-base lg:text-lg xl:text-xl font-semibold mb-2 sm:mb-3 group-hover:text-primary transition-colors duration-200 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed mb-3 sm:mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center text-primary font-medium group-hover:translate-x-1 transition-transform duration-200 text-xs sm:text-sm lg:text-base">
                        Read more
                        <svg
                          className="ml-2 w-3 h-3 sm:w-4 sm:h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
