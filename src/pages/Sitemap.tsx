import { generateSitemap } from '../utils/sitemapGenerator';
import { formatDate } from '../utils/formatDate';

const Sitemap = () => {
  const sitemap = generateSitemap();

  const groupedUrls = sitemap.urls.reduce((acc, url) => {
    const category = url.loc === '/' ? 'Main Pages' : 
                   url.loc.startsWith('/blog/') ? 'Blog Posts' : 
                   'Other Pages';
    
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(url);
    return acc;
  }, {} as Record<string, typeof sitemap.urls>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Sitemap
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Complete list of all pages on exit1.dev
            </p>
            <p className="text-sm text-gray-500">
              Last updated: {formatDate(sitemap.lastUpdated)}
            </p>
          </div>

          {/* Sitemap Content */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            {Object.entries(groupedUrls).map(([category, urls]) => (
              <div key={category} className="mb-8 last:mb-0">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                  {category}
                </h2>
                <div className="space-y-3">
                  {urls.map((url) => (
                    <div key={url.loc} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-1">
                        <a 
                          href={url.loc}
                          className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                          {url.loc === '/' ? 'Home' : url.loc.replace(/^\//, '').replace(/-/g, ' ')}
                        </a>
                        {url.lastmod && (
                          <p className="text-sm text-gray-500 mt-1">
                            Last updated: {formatDate(url.lastmod)}
                          </p>
                        )}
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <div>Priority: {url.priority}</div>
                        <div>Update: {url.changefreq}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Download Links */}
          <div className="mt-8 text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/sitemap.xml"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Download XML Sitemap
              </a>
              <a
                href="/sitemap.txt"
                className="inline-flex items-center px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
              >
                Download Text Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sitemap; 