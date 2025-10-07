import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Roadmap - Exit1.dev',
  description: 'See what we\'re building next for Exit1.dev monitoring platform',
};

export default function RoadmapPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Roadmap</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-muted-foreground mb-8">
            Here&apos;s what we&apos;re working on to make Exit1.dev even better.
          </p>
          
          <div className="space-y-8">
            <div className="border-l-4 border-green-500 pl-6">
              <h2 className="text-2xl font-semibold mb-4">✅ Recently Completed</h2>
              <ul className="space-y-2">
                <li>• Free unlimited website monitoring</li>
                <li>• Real-time alerts via email, Slack, and Discord</li>
                <li>• SSL certificate monitoring</li>
                <li>• Global monitoring locations</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-6">
              <h2 className="text-2xl font-semibold mb-4">🚧 In Progress</h2>
              <ul className="space-y-2">
                <li>• Enhanced analytics dashboard</li>
                <li>• Mobile app for iOS and Android</li>
                <li>• API rate limiting improvements</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-gray-400 pl-6">
              <h2 className="text-2xl font-semibold mb-4">📋 Planned</h2>
              <ul className="space-y-2">
                <li>• Advanced alerting rules and conditions</li>
                <li>• Team collaboration features</li>
                <li>• Custom monitoring intervals</li>
                <li>• Integration with more third-party services</li>
                <li>• White-label monitoring solutions</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 p-6 bg-muted rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Have a suggestion?</h3>
            <p className="mb-4">
              We&apos;d love to hear your ideas for new features. 
              <a href="/contact" className="text-primary hover:underline ml-1">
                Get in touch with us
              </a> and let us know what you&apos;d like to see.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
