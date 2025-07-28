import Button from './Button';

const CliDownload = () => {
  const downloadOptions = [
    {
      platform: 'Windows',
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M0 3.45L9.65 2.25v9.2H0V3.45zm10.85-1.3L24 0v11.45H10.85V2.15zM0 12.55h9.65v9.2L0 20.55v-8zm10.85 0H24V24l-13.15-2.2v-9.25z"/>
        </svg>
      ),
      description: 'Compatible with Windows 10+',
      downloadUrl: '#',
    },
    {
      platform: 'macOS',
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5M13.17 6.55C13.76 5.8 14.17 4.78 14.03 3.74C13.15 3.81 12.1 4.36 11.5 5.08C10.96 5.68 10.46 6.73 10.63 7.72C11.61 7.8 12.62 7.25 13.17 6.55Z"/>
        </svg>
      ),
      description: 'Compatible with macOS 10.15+',
      downloadUrl: '#',
    },
    {
      platform: 'Linux',
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.132 1.884 1.071.771-.06 1.592-.536 2.257-1.306.631-.765 1.683-1.084 2.378-1.503.348-.199.629-.469.649-.853.023-.4-.2-.811-.714-1.376v-.097l-.003-.003c-.17-.2-.25-.535-.338-.926-.085-.401-.182-.786-.492-1.046h-.003c-.059-.054-.123-.067-.188-.135a.357.357 0 00-.19-.064c.431-1.278.264-2.55-.173-3.694-.533-1.41-1.465-2.638-2.175-3.483-.796-1.005-1.576-1.957-1.56-3.368.026-2.152.236-6.133-3.544-6.139z"/>
        </svg>
      ),
      description: 'Compatible with Ubuntu 18.04+ and other distributions',
      downloadUrl: '#',
    },
  ];

  return (
    <section className="py-24 bg-gray-50 relative opacity-30">
      {/* Coming Soon Overlay */}
      <div className="absolute inset-0 backdrop-blur-sm flex items-center justify-center z-10">
        <div className="text-center">
          <div className="text-2xl font-semibold text-black mb-2 py-2">CLI downloads coming soon...</div>
          <div className="text-sm text-black">We're working on it</div>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Download for Your Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get started with our CLI tool in seconds. Available for all major operating systems.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {downloadOptions.map((option) => (
            <div
              key={option.platform}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-xl mb-6 text-gray-700">
                  {option.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {option.platform}
                </h3>
                <p className="text-gray-600 mb-6">{option.description}</p>
                <Button
                  href={option.downloadUrl}
                  className="w-full justify-center"
                >
                  Download for {option.platform}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Alternative Installation Methods
            </h3>
            <p className="text-gray-600">
              Prefer using package managers? We've got you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">Package Managers</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-mono text-sm text-gray-800 mb-2">
                  # Homebrew (macOS/Linux)
                </div>
                <code className="text-sm text-gray-600">
                  brew install exit1-cli
                </code>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-mono text-sm text-gray-800 mb-2">
                  # Chocolatey (Windows)
                </div>
                <code className="text-sm text-gray-600">
                  choco install exit1-cli
                </code>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">Direct Download</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-mono text-sm text-gray-800 mb-2">
                  # Download binary directly
                </div>
                <code className="text-sm text-gray-600">
                  curl -O https://releases.exit1.dev/cli/latest<br />
                  chmod +x exit1-cli && mv exit1-cli /usr/local/bin/
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CliDownload;