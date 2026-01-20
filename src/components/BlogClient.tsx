'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { SearchInput } from '@/components/SearchInput';
import { BlogPostMeta } from '@/lib/markdownLoader';
import { POSTS_PER_PAGE } from '@/lib/blogPagination';
import blogData from '@/content/blog.json';
import { InsetCard } from '@/components/InsetCard';
import { PageSection, SectionContent } from '@/components/PageLayout';

interface BlogClientProps {
  posts: BlogPostMeta[];
  categories: string[];
  currentPage?: number;
}

export function BlogClient({ posts, categories, currentPage = 1 }: BlogClientProps) {
  const initialPage = Math.max(1, currentPage);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [startPage, setStartPage] = useState(initialPage);
  const [loadedPage, setLoadedPage] = useState(initialPage);

  useEffect(() => {
    setStartPage(initialPage);
    setLoadedPage(initialPage);
  }, [initialPage]);

  const isDefaultFilter = (category: string, query: string) =>
    category === 'All' && !query.trim();

  const getPageHref = (page: number) => (page <= 1 ? '/blog' : `/blog/page/${page}`);

  const updateUrl = (page: number) => {
    if (typeof window === 'undefined') {
      return;
    }

    window.history.replaceState(window.history.state, '', getPageHref(page));
  };

  const resetPagination = () => {
    setStartPage(1);
    setLoadedPage(1);
    updateUrl(1);
  };

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

  const totalPosts = filteredPosts.length;
  const totalPages = Math.max(1, Math.ceil(totalPosts / POSTS_PER_PAGE));
  const startIndex = (startPage - 1) * POSTS_PER_PAGE;
  const endIndex = Math.min(loadedPage * POSTS_PER_PAGE, totalPosts);
  const visiblePosts = filteredPosts.slice(startIndex, endIndex);
  const visibleCountLabel = visiblePosts.length;
  const canLoadMore = loadedPage < totalPages;
  const showPagination = totalPages > 1 && isDefaultFilter(selectedCategory, searchQuery);
  const activePage = Math.min(loadedPage, totalPages);
  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, index) => index + 1),
    [totalPages]
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    resetPagination();
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    resetPagination();
  };

  const handleLoadMore = () => {
    setLoadedPage((current) => {
      const nextPage = Math.min(current + 1, totalPages);
      if (nextPage !== current && isDefaultFilter(selectedCategory, searchQuery)) {
        updateUrl(nextPage);
      }
      return nextPage;
    });
  };

  return (
    <>
      <PageSection className="py-8">
        <SectionContent size="xl">
          <div className="space-y-6">
            <div className="w-full max-w-md mx-auto">
              <SearchInput
                onSearch={handleSearch}
                placeholder="Search articles..."
                aria-label="Search blog articles"
                className="w-full"
              />
            </div>

            <div className="flex flex-wrap gap-2 justify-center overflow-x-auto pb-2">
              {categories.map((category) => {
                const isSelected = selectedCategory === category;
                return (
                  <Button
                    key={category}
                    variant="outline"
                    size="sm"
                    onClick={() => handleCategoryChange(category)}
                    className={`rounded-full px-4 py-2 text-sm font-medium cursor-pointer whitespace-nowrap transition-all duration-200 ${
                      isSelected
                        ? 'text-white/50 hover:bg-white/85'
                        : 'border-white/20 text-white hover:bg-white/5'
                    }`}
                  >
                    {category}
                  </Button>
                );
              })}
            </div>

            <div className="text-center text-sm text-white/60">
              {totalPosts === 1 ? (
                <span>Showing 1 article</span>
              ) : (
                <span>
                  {visibleCountLabel < totalPosts
                    ? `Showing ${visibleCountLabel} of ${totalPosts} articles`
                    : `Showing ${totalPosts} articles`}
                </span>
              )}
              {searchQuery && (
                <span> for &quot;{searchQuery}&quot;</span>
              )}
            </div>
          </div>
        </SectionContent>
      </PageSection>

      <PageSection className="flex flex-col">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-8 sm:py-12" role="status" aria-live="polite">
            <div className="mb-4">
              <svg
                className="mx-auto h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-white/60"
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
            <h3 className="text-base sm:text-lg font-medium text-white mb-2">
              No articles found
            </h3>
            <p className="text-sm sm:text-base text-white/60">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {visiblePosts.map((post) => (
                <InsetCard
                  key={post.id}
                  className="group cursor-pointer border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.35)]"
                >
                  <CardContent className="p-10 h-full">
                    <div className="mb-4">
                      <Badge variant="secondary" className="mb-2 text-xs bg-white/10 text-white border border-white/10">
                        {post.categoryName}
                      </Badge>
                      <div className="flex items-center text-sm text-white/60 mb-3 flex-wrap gap-2">
                        <span>{post.formattedDate}</span>
                        <span className="mx-2">•</span>
                        <span>{post.readTime}</span>
                        <span className="mx-2">•</span>
                        <div className="flex items-center gap-2">
                          <Image
                            src="/Morten-Pradsgaard.jpg"
                            alt="Morten Pradsgaard"
                            width={20}
                            height={20}
                            className="rounded-full border border-white/20"
                          />
                          <Link href="/about" className="text-white hover:underline cursor-pointer interactive">
                            {post.author}
                          </Link>
                        </div>
                      </div>
                    </div>

                    <Link href={`/blog/${post.slug}`} className="block cursor-pointer">
                      <h3 className="text-lg sm:text-xl font-semibold mb-3 group-hover:text-white transition-colors duration-200 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm sm:text-base text-white/60 leading-relaxed mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center text-white font-medium group-hover:translate-x-1 transition-transform duration-200 text-sm sm:text-base">
                        Read more
                        <svg
                          className="ml-2 w-4 h-4"
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
                </InsetCard>
              ))}
            </div>
            {canLoadMore && (
              <div className="mt-auto flex justify-center items-center py-10">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleLoadMore}
                  className="rounded-full border-white/30 text-white hover:bg-white/10 cursor-pointer"
                >
                  Load more
                </Button>
              </div>
            )}
            {showPagination && (
              <nav aria-label="Blog pagination" className="mt-6 flex flex-wrap items-center justify-center gap-2 pb-10">
                {activePage > 1 ? (
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="rounded-full border-white/20 text-white hover:bg-white/10"
                  >
                    <Link href={getPageHref(activePage - 1)} rel="prev">
                      Prev
                    </Link>
                  </Button>
                ) : (
                  <span className="rounded-full border border-white/10 px-3 py-2 text-xs text-white/30" aria-disabled="true">
                    Prev
                  </span>
                )}

                {pageNumbers.map((page) => {
                  const isCurrent = page === activePage;
                  return (
                    <Button
                      key={page}
                      asChild
                      variant="outline"
                      size="sm"
                      className={`rounded-full border-white/20 text-white hover:bg-white/10 ${isCurrent ? 'bg-white/10 border-white/60' : ''}`}
                    >
                      <Link href={getPageHref(page)} aria-current={isCurrent ? 'page' : undefined}>
                        {page}
                      </Link>
                    </Button>
                  );
                })}

                {activePage < totalPages ? (
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="rounded-full border-white/20 text-white hover:bg-white/10"
                  >
                    <Link href={getPageHref(activePage + 1)} rel="next">
                      Next
                    </Link>
                  </Button>
                ) : (
                  <span className="rounded-full border border-white/10 px-3 py-2 text-xs text-white/30" aria-disabled="true">
                    Next
                  </span>
                )}
              </nav>
            )}
          </>
        )}
      </PageSection>
    </>
  );
}
