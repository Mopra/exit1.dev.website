import { Link } from 'react-router-dom';
import { getAllPosts } from '../utils/markdownLoader';
import { useState, useMemo } from 'react';
import blogData from '../content/blog.json';
import SearchInput from '../components/SearchInput';

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const posts = getAllPosts();
  const categories = ['All', ...blogData.categories.map(cat => cat.name)];

  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Filter by category
    if (selectedCategory !== 'All') {
      const selectedCategoryData = blogData.categories.find(cat => cat.name === selectedCategory);
      if (selectedCategoryData) {
        filtered = filtered.filter(post => post.category === selectedCategoryData.id);
      }
    }

    // Filter by search query
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
    <div className="relative" role="main" aria-label="Blog">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white via-gray-50 to-gray-100 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 leading-tight">
              {blogData.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              {blogData.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="bg-white py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Search Input */}
            <div className="max-w-md mx-auto">
              <SearchInput
                onSearch={handleSearch}
                placeholder="Search articles..."
                aria-label="Search blog articles"
                className="w-full"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-4 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 ${
                    selectedCategory === category
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  aria-pressed={selectedCategory === category}
                  aria-label={`Filter by ${category} category`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Results Summary */}
            <div className="text-center text-sm text-gray-600">
              {filteredPosts.length === 1 ? (
                <span>Showing 1 article</span>
              ) : (
                <span>Showing {filteredPosts.length} articles</span>
              )}
              {searchQuery && (
                <span> for "{searchQuery}"</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12" role="status" aria-live="polite">
              <div className="mb-4">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-500">
                {searchQuery 
                  ? `No articles match "${searchQuery}" in the ${selectedCategory} category.`
                  : `No articles in the ${selectedCategory} category.`
                }
              </p>
              {(searchQuery || selectedCategory !== 'All') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="mt-4 text-gray-600 hover:text-gray-900 underline focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              role="feed"
              aria-label="Blog articles"
            >
              {filteredPosts.map((post, index) => (
                <article
                  key={post.id}
                  className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group focus-within:ring-2 focus-within:ring-gray-500 focus-within:ring-offset-2"
                  role="article"
                  aria-labelledby={`post-title-${post.id}`}
                  aria-describedby={`post-excerpt-${post.id}`}
                >
                  <div className="mb-4">
                    <span className="inline-block bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1 rounded-full">
                      {blogData.categories.find(cat => cat.id === post.category)?.name || post.category}
                    </span>
                  </div>
                  
                  <h2 
                    id={`post-title-${post.id}`}
                    className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-gray-700 transition-colors duration-200"
                  >
                    {post.title}
                  </h2>
                  
                  <p 
                    id={`post-excerpt-${post.id}`}
                    className="text-gray-600 leading-relaxed mb-6"
                  >
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{post.readTime}</span>
                  </div>
                  
                  <div className="mt-6">
                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center text-gray-900 font-medium hover:text-gray-700 transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded"
                      aria-describedby={`post-title-${post.id}`}
                    >
                      Read full article
                      <svg
                        className="ml-2 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog; 