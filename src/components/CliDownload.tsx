import Button from './Button';

const CliDownload = () => {
  const downloadOptions = [
    {
      platform: 'Windows',
      icon: '🪟',
      description: 'Compatible with Windows 10+',
      downloadUrl: '#',
    },
    {
      platform: 'macOS',
      icon: '🍎',
      description: 'Compatible with macOS 10.15+',
      downloadUrl: '#',
    },
    {
      platform: 'Linux',
      icon: '🐧',
      description: 'Compatible with most distributions',
      downloadUrl: '#',
    },
  ];

  return (
    <section className="bg-gray-50 py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 leading-tight">
            CLI{' '}
            <span className="font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Tool
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
            Monitor your websites directly from your terminal. Lightweight, fast, and designed for developers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {downloadOptions.map((option, index) => (
            <div
              key={index}
              className="relative bg-white border border-gray-200 rounded-2xl p-8 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl flex flex-col items-center text-center min-h-[280px]"
            >
              {/* Coming Soon Overlay */}
              <div className="absolute inset-0 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="text-2xl font-semibold text-black mb-2 py-2">Coming soon</div>
                </div>
              </div>

              <div className="text-6xl mb-4">{option.icon}</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">{option.platform}</h3>
              <p className="text-gray-600 mb-6 font-light">{option.description}</p>
              
              <Button
                variant="primary"
                size="lg"
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium"
                disabled={true}
              >
                Download for {option.platform}
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">
            Want to be notified when the CLI is ready?{' '}
            <a 
              href="https://discord.com/invite/uZvWbpwJZS" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-gray-900 underline font-medium"
            >
              Join our Discord
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default CliDownload;