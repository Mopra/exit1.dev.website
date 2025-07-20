import { Link } from 'react-router-dom';
import { getPrivacyContent } from '../utils/contentLoader';

const Privacy = () => {
  const content = getPrivacyContent();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <svg 
              className="text-blue-600 w-12 h-12" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {content.header.title}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {content.header.description}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-8">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {content.sections.introduction.title}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {content.sections.introduction.content}
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="text-blue-600 w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
              {content.sections.informationCollection.title}
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {content.sections.informationCollection.subsections.accountInfo.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {content.sections.informationCollection.subsections.accountInfo.description}
                </p>
                <ul className="list-disc list-inside text-gray-700 mt-2 ml-4 space-y-1">
                  {content.sections.informationCollection.subsections.accountInfo.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {content.sections.informationCollection.subsections.oauthInfo.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {content.sections.informationCollection.subsections.oauthInfo.description}
                </p>
                <ul className="list-disc list-inside text-gray-700 mt-2 ml-4 space-y-1">
                  {content.sections.informationCollection.subsections.oauthInfo.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {content.sections.informationCollection.subsections.serviceData.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {content.sections.informationCollection.subsections.serviceData.description}
                </p>
                <ul className="list-disc list-inside text-gray-700 mt-2 ml-4 space-y-1">
                  {content.sections.informationCollection.subsections.serviceData.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {content.sections.informationCollection.subsections.technicalInfo.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {content.sections.informationCollection.subsections.technicalInfo.description}
                </p>
                <ul className="list-disc list-inside text-gray-700 mt-2 ml-4 space-y-1">
                  {content.sections.informationCollection.subsections.technicalInfo.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {content.sections.dataUsage.title}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {content.sections.dataUsage.description}
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              {content.sections.dataUsage.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {content.sections.dataSharing.title}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {content.sections.dataSharing.description}
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              {content.sections.dataSharing.items.map((item, index) => (
                <li key={index}>
                  <strong>{item.title}</strong> {item.description}
                </li>
              ))}
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="text-green-600 w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10z"/>
              </svg>
              {content.sections.dataSecurity.title}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {content.sections.dataSecurity.description}
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              {content.sections.dataSecurity.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {content.sections.dataRetention.title}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {content.sections.dataRetention.description}
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              {content.sections.dataRetention.items.map((item, index) => (
                <li key={index}>
                  <strong>{item.title}</strong> {item.description}
                </li>
              ))}
            </ul>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {content.sections.userRights.title}
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {content.sections.userRights.subsections.accessControl.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {content.sections.userRights.subsections.accessControl.description}
                </p>
                <ul className="list-disc list-inside text-gray-700 mt-2 ml-4 space-y-1">
                  {content.sections.userRights.subsections.accessControl.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {content.sections.userRights.subsections.accountDeletion.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {content.sections.userRights.subsections.accountDeletion.description}
                </p>
                <ul className="list-disc list-inside text-gray-700 mt-2 ml-4 space-y-1">
                  {content.sections.userRights.subsections.accountDeletion.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Cookies and Tracking */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {content.sections.cookies.title}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {content.sections.cookies.description}
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              {content.sections.cookies.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              {content.sections.cookies.additionalInfo}
            </p>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {content.sections.thirdParty.title}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {content.sections.thirdParty.description}
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              {content.sections.thirdParty.items.map((item, index) => (
                <li key={index}>
                  <strong>{item.title}</strong> {item.description}
                </li>
              ))}
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              {content.sections.thirdParty.additionalInfo}
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {content.sections.childrenPrivacy.title}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {content.sections.childrenPrivacy.content}
            </p>
          </section>

          {/* International Transfers */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {content.sections.internationalTransfers.title}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {content.sections.internationalTransfers.content}
            </p>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {content.sections.policyChanges.title}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {content.sections.policyChanges.content}
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {content.sections.contact.title}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {content.sections.contact.description}
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">
                <strong>Email:</strong> {content.sections.contact.contactInfo.email}
              </p>
              <p className="text-gray-700">
                <strong>Discord:</strong> <a href={content.sections.contact.contactInfo.discord.url} className="text-blue-600 hover:text-blue-800 underline cursor-pointer">{content.sections.contact.contactInfo.discord.text}</a>
              </p>
            </div>
          </section>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 cursor-pointer"
          >
            {content.navigation.backToHome}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Privacy; 