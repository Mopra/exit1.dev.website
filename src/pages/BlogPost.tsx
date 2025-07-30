import { useParams, Link, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getPostBySlug, type BlogPost } from '../utils/markdownLoader';
import SEO from '../components/SEO';
import TableOfContents from '../components/TableOfContents';

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const postData = await getPostBySlug(slug);
        if (postData) {
          setPost(postData);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <>
      <SEO 
        title={post.title}
        description={post.excerpt}
        canonical={`https://exit1.dev/blog/${slug}`}
        type="article"
        author={post.author}
      />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-white via-gray-50 to-gray-100 py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              to="/blog"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-6"
            >
              <svg
                className="mr-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Blog
            </Link>
          </div>

          <div className="mb-6">
            <span className="inline-block bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1 rounded-full">
              {post.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between text-sm text-gray-500 mb-8">
            <div className="flex items-center space-x-4">
              <span>By <a 
                href="https://www.linkedin.com/in/mopradk/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200 underline"
              >
                {post.author}
              </a></span>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>
          </div>


        </div>
      </section>

      {/* Article Content */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Table of Contents */}
            <div className="lg:col-span-1 lg:self-start">
              <TableOfContents headings={post.headings} />
            </div>
            
            {/* Article Content */}
            <div className="lg:col-span-3">
              <article className="prose prose-lg max-w-none">
                <div 
                  className="markdown-content"
                  dangerouslySetInnerHTML={{ __html: post.htmlContent }}
                />
              </article>
            </div>
          </div>

          {/* Article Footer */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-center">
              <Link
                to="/blog"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <svg
                  className="mr-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Blog
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
    </>
  );
};

export default BlogPostPage; 