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
          <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.132 1.884 1.071.771-.06 1.592-.536 2.257-1.306.631-.765 1.683-1.084 2.378-1.503.348-.199.629-.469.649-.853.023-.4-.2-.811-.714-1.376v-.097l-.003-.003c-.17-.2-.25-.535-.338-.926-.085-.401-.182-.786-.492-1.046h-.003c-.059-.054-.123-.067-.188-.135a.357.357 0 00-.19-.064c.431-1.278.264-2.55-.173-3.694-.533-1.41-1.465-2.638-2.175-3.483-.796-1.005-1.576-1.957-1.56-3.368.026-2.152.236-6.133-3.544-6.139zm.529 3.405h.013c.213 0 .396.062.584.198.19.135.33.332.438.533.105.259.158.459.166.724 0-.02.006-.04.006-.06v.105a.086.086 0 01-.004-.021l-.004-.024a1.807 1.807 0 01-.15.706.953.953 0 01-.213.335.71.71 0 00-.088-.042c-.104-.045-.198-.064-.284-.133a1.312 1.312 0 00-.22-.066c.05-.06.146-.133.183-.198.053-.128.082-.264.088-.402v-.02a1.21 1.21 0 00-.061-.4c-.045-.134-.101-.2-.183-.333-.084-.066-.167-.132-.267-.132h-.016c-.093 0-.176.03-.262.132a.8.8 0 00-.205.334 1.18 1.18 0 00-.09.4v.019c.002.089.008.179.02.267-.193-.067-.438-.135-.607-.202a1.635 1.635 0 01-.018-.2v-.02a1.772 1.772 0 01.15-.768c.082-.22.232-.406.43-.533a.985.985 0 01.594-.2zm-2.962.059h.036c.142 0 .27.048.399.135.146.129.264.288.344.465.09.199.14.4.153.667v.004c.007.134.006.2-.002.266v.08c-.03.007-.056.018-.083.024-.152.055-.274.135-.393.2.012-.09.013-.18.003-.267v-.015c-.012-.133-.04-.2-.082-.333a.613.613 0 00-.166-.267.248.248 0 00-.183-.064h-.021c-.071.006-.13.04-.186.132a.552.552 0 00-.12.27.944.944 0 00-.023.33v.015c.012.135.037.2.08.334.046.134.098.2.166.268.01.009.02.018.034.024-.07.057-.117.07-.176.136a.304.304 0 01-.131.068 2.62 2.62 0 01-.275-.402 1.772 1.772 0 01-.155-.667 1.759 1.759 0 01.08-.668 1.43 1.43 0 01.283-.535c.128-.133.26-.2.418-.2zm1.37 1.706c.332 0 .733.065 1.216.399.293.2.523.269 1.052.468h.003c.255.136.405.266.478.399v-.131a.571.571 0 01.016.47c-.123.31-.516.643-1.063.842v.002c-.268.135-.501.333-.775.465-.276.135-.588.292-1.012.267a1.139 1.139 0 01-.448-.067 3.566 3.566 0 01-.322-.198c-.195-.135-.363-.332-.612-.465v-.005h-.005c-.4-.246-.616-.512-.686-.71-.07-.268-.005-.47.193-.6.224-.135.38-.271.483-.336.104-.074.143-.102.25-.131h.002c.109-.06.194-.14.308-.334a.926.926 0 00.06-.4h-.002c0-.333.108-.63.288-.864.18-.237.404-.334.684-.334zm-1.849 2.197c.085 0 .193.012.304.067.111.054.18.06.299.202.002 0 .018.09.018.09v.005c.03.136.013.27-.05.395-.008.014-.032.045-.05.08-1.237.496-1.851.9-2.549 1.731-.696.83-1.307 2.043-1.858 3.288a9.857 9.857 0 00-.561 2.146c-.025.4-.011.73.061.936.036.093.086.18.142.258.03.06.07.115.104.17a.19.19 0 01.03.05v.005c.024.056.04.112.06.168h.001c.033.094.078.185.13.270.24.4.729.677 1.309.677.414 0 .803-.258 1.139-.677.27-.334.476-.804.557-1.336h.001c.036-.199.029-.4-.006-.533a.872.872 0 00-.13-.334.271.271 0 00-.181-.135 2.618 2.618 0 00-.310.004c-.072.009-.15.003-.219-.027a.7.7 0 01-.3-.234c-.078-.134-.125-.334-.09-.5.09-.334.361-.411.53-.470.085-.028.178-.027.265-.027.264 0 .52.09.735.334.18.2.31.4.397.668.044.134.067.269.067.4 0 .4-.067.8-.2 1.2a3.434 3.434 0 01-.6 1.067c-.267.334-.6.468-.934.468-.467 0-.934-.267-1.334-.668a2.283 2.283 0 01-.534-.934 2.153 2.153 0 01-.067-.534c0-.4.067-.867.2-1.334.067-.267.134-.534.267-.8.067-.134.134-.267.267-.4.267-.267.6-.467 1.067-.6.134-.067.267-.067.4-.067h.067c.134 0 .267.067.334.134.067.133.067.333-.067.533-.067.134-.2.2-.334.2-.067 0-.134-.067-.2-.134a.4.4 0 01-.067-.133c0-.067.067-.134.134-.2l.067-.067c.067-.067.134-.067.134-.133 0-.067-.067-.067-.134-.067-.134 0-.267.067-.4.134-.067.067-.134.133-.2.2-.067.133-.134.266-.134.4v.067c0 .133.067.266.134.4.067.133.134.266.267.333.133.067.267.067.4.067.267 0 .534-.133.734-.333.2-.2.334-.467.4-.734.067-.267.067-.533 0-.8-.067-.267-.2-.534-.4-.734-.2-.2-.467-.333-.734-.4a1.47 1.47 0 00-.4-.067c-.467 0-.934.2-1.267.533-.333.334-.533.8-.6 1.267-.067.467-.067.934.067 1.334.133.4.333.734.6.934.267.2.6.267.934.267.467 0 .867-.2 1.134-.534.266-.333.466-.8.533-1.333.067-.534.067-1.067-.133-1.534-.2-.466-.534-.866-.934-1.133-.4-.267-.867-.4-1.334-.4-.533 0-1.067.2-1.467.6-.4.4-.667.934-.733 1.467-.067.533-.067 1.066.133 1.533.2.467.533.867.933 1.134.4.266.867.4 1.334.4.533 0 1-.2 1.4-.6.4-.4.667-.934.733-1.467.067-.533.067-1.066-.133-1.533-.2-.467-.533-.867-.933-1.134-.4-.266-.867-.4-1.334-.4-.533 0-1.067.2-1.467.6-.4.4-.667.934-.733 1.467-.067.533-.067 1.066.133 1.533.2.467.533.867.933 1.134.4.266.867.4 1.334.4.533 0 1-.2 1.4-.6.4-.4.667-.934.733-1.467.067-.533.067-1.066-.133-1.533-.2-.467-.533-.867-.933-1.134-.4-.266-.867-.4-1.334-.4-.533 0-1.067.2-1.467.6-.4.4-.667.934-.733 1.467-.067.533-.067 1.066.133 1.533.2.467.533.867.933 1.134.4.266.867.4 1.334.4.533 0 1-.2 1.4-.6.4-.4.667-.934.733-1.467.067-.533.067-1.066-.133-1.533-.2-.467-.533-.867-.933-1.134-.4-.266-.867-.4-1.334-.4-.533 0-1.067.2-1.467.6-.4.4-.667.934-.733 1.467-.067.533-.067 1.066.133 1.533.2.467.533.867.933 1.134.4.266.867.4 1.334.4.533 0 1-.2 1.4-.6.4-.4.667-.934.733-1.467.067-.533.067-1.066-.133-1.533-.2-.467-.533-.867-.933-1.134-.4-.266-.867-.4-1.334-.4-.533 0-1.067.2-1.467.6-.4.4-.667.934-.733 1.467-.067.533-.067 1.066.133 1.533.2.467.533.867.933 1.134.4.266.867.4 1.334.4.533 0 1-.2 1.4-.6.4-.4.667-.934.733-1.467.067-.533.067-1.066-.133-1.533-.2-.467-.533-.867-.933-1.134-.4-.266-.867-.4-1.334-.4-.533 0-1.067.2-1.467.6-.4.4-.667.934-.733 1.467-.067.533-.067 1.066.133 1.533.2.467.533.867.933 1.134.4.266.867.4 1.334.4.533 0 1-.2 1.4-.6.4-.4.667-.934.733-1.467.067-.533.067-1.066-.133-1.533-.2-.467-.533-.867-.933-1.134-.4-.266-.867-.4-1.334-.4-.533 0-1.067.2-1.467.6-.4.4-.667.934-.733 1.467-.067.533-.067 1.066.133 1.533.2.467.533.867.933 1.134.4.266.867.4 1.334.4.533 0 1-.2 1.4-.6.4-.4.667-.934.733-1.467.067-.533.067-1.066-.133-1.533-.2-.467-.533-.867-.933-1.134-.4-.266-.867-.4-1.334-.4-.533 0-1.067.2-1.467.6-.4.4-.667.934-.733 1.467-.067.533-.067 1.066.133 1.533.2.467.533.867.933 1.134.4.266.867.4 1.334.4.533 0 1-.2 1.4-.6.4-.4.667-.934.733-1.467.067-.533.067-1.066-.133-1.533-.2-.467-.533-.867-.933-1.134-.4-.266-.867-.4-1.334-.4-.533 0-1.067.2-1.467.6-.4.4-.667.934-.733 1.467-.067.533-.067 1.066.133 1.533.2.467.533.867.933 1.134.4.266.867.4 1.334.4.533 0 1-.2 1.4-.6.4-.4.667-.934.733-1.467z"/>
        </svg>
      ),
      description: 'Compatible with most distributions',
      downloadUrl: '#',
    },
  ];

  return (
    <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-black py-32 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.05)_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(255,255,255,0.03)_0%,transparent_50%)]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-8 border border-white/20">
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2 3h20c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H2c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2zm0 3v11h20V6H2z"/>
              <path d="M3 8h2v1H3zm3 0h2v1H6zm3 0h8v1H9z"/>
            </svg>
          </div>
          <h2 className="text-4xl md:text-6xl font-light text-white mb-6 leading-tight">
            Terminal{' '}
            <span className="font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Native
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto font-light leading-relaxed mb-8">
            For developers who live in the command line. Monitor your websites with the same elegance and power you expect from your favorite terminal tools.
          </p>
          <div className="inline-flex items-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-6 py-3">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
            <span className="text-gray-300 text-sm font-medium">CLI coming soon • Join our Discord for early access</span>
          </div>
        </div>

        {/* Terminal Demo */}
        <div className="mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-1 shadow-2xl">
              {/* Terminal Header */}
              <div className="flex items-center justify-between px-6 py-4 bg-white/5 rounded-t-xl border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-gray-400 text-sm font-mono">exit1 --help</span>
              </div>
              
              {/* Terminal Content */}
              <div className="p-6 font-mono text-sm">
                <div className="text-green-400 mb-2">$ exit1 websites add "My API" https://api.example.com</div>
                <div className="text-gray-300 mb-4">✓ Website added successfully (checks every 60s)</div>
                
                <div className="text-green-400 mb-2">$ exit1 status</div>
                <div className="text-gray-300 mb-1">┌─────────────────────────────────────────────────────┐</div>
                <div className="text-gray-300 mb-1">│ <span className="text-green-400">●</span> My API        https://api.example.com    <span className="text-green-400">UP</span>    │</div>
                <div className="text-gray-300 mb-1">│ <span className="text-green-400">●</span> Portfolio     https://john.dev          <span className="text-green-400">UP</span>    │</div>
                <div className="text-gray-300 mb-1">│ <span className="text-red-400">●</span> Old Project   https://old.example.com   <span className="text-red-400">DOWN</span>  │</div>
                <div className="text-gray-300 mb-4">└─────────────────────────────────────────────────────┘</div>
                
                <div className="text-green-400 mb-2">$ exit1 alerts setup --discord</div>
                <div className="text-gray-300">Discord webhook configured. You'll get notified instantly.</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {downloadOptions.map((option, index) => (
            <div
              key={index}
              className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 transition-all duration-300 transform hover:-translate-y-2 hover:border-white/20 flex flex-col items-center text-center min-h-[280px] group"
            >
              {/* Coming Soon Overlay */}
              <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="text-2xl font-semibold text-white mb-2 py-2">Coming Soon</div>
                </div>
              </div>

              <div className="text-white mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">{option.icon}</div>
              <h3 className="text-2xl font-semibold text-white mb-3">{option.platform}</h3>
              <p className="text-gray-300 mb-6 font-light">{option.description}</p>
              
              <Button
                variant="primary"
                size="lg"
                className="w-full bg-white/10 hover:bg-white/20 text-white font-medium border border-white/20 hover:border-white/30"
                disabled={true}
              >
                Download for {option.platform}
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-4">
            <p className="text-gray-300">
              Want early access?
            </p>
            <Button
              variant="outline"
              size="md"
              href="https://discord.com/invite/uZvWbpwJZS"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/30 font-medium"
            >
              Join our Discord
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CliDownload;