const SkipLink = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
    >
      Skip to main content
    </a>
  );
};

export default SkipLink; 