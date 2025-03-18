import React from 'react';
import '../styles/index.css'; // Assuming global styles or additional styles

const PrivacyPolicy = () => {
  return (
    <div id="vendors-container" className="flex flex-col min-h-screen">
    {/* Top Section */}
    <div id="vendors-image-section" className="relative w-full h-96 bg-cover bg-center" style={{ backgroundImage: `url('/images/water11.jpg')` }}>
    <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center">
         <h1 className="text-4xl sm:text-5xl font-bold text-white text-center mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 text-center">
            Your Privacy, Our Priority.
          </p>
        </div>
      </div>

      {/* Introduction Section */}
      <section id="introduction" className="py-16 bg-gray-50">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
            Introduction
          </h2>
          <p className="text-lg sm:text-xl text-gray-600">
            At HydrateHub, we value your privacy and are committed to protecting your personal data. This Privacy Policy outlines the types of data we collect, how we use it, and the measures we take to keep it safe.
          </p>
        </div>
      </section>

      {/* Data Collection Section */}
      <section id="data-collection" className="py-16 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-6">
            Data We Collect
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-6">
            We collect various types of personal data, including:
          </p>
          <ul className="list-disc list-inside text-left text-gray-600 space-y-4">
            <li>Personal Information: Name, email address, and contact details provided during signup.</li>
            <li>Transactional Data: Details of your purchases and services used.</li>
            <li>Usage Data: Information about how you interact with our website, including your IP address and browser data.</li>
            <li>Cookies: Data collected through cookies and similar tracking technologies.</li>
          </ul>
        </div>
      </section>

      {/* Use of Data Section */}
      <section id="use-of-data" className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-6">
            How We Use Your Data
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-6">
            The data we collect is used to:
          </p>
          <ul className="list-disc list-inside text-left text-gray-600 space-y-4">
            <li>Provide, manage, and improve our services.</li>
            <li>Process transactions and deliver water services.</li>
            <li>Communicate with you regarding your account or services.</li>
            <li>Analyze how you use our platform to enhance your experience.</li>
            <li>Ensure compliance with legal obligations and protect the security of our platform.</li>
          </ul>
        </div>
      </section>

      {/* Third-Party Sharing Section */}
      <section id="third-party-sharing" className="py-16 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-6">
            Sharing Your Data
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-6">
            We may share your personal data with trusted third parties in the following circumstances:
          </p>
          <ul className="list-disc list-inside text-left text-gray-600 space-y-4">
            <li>Service providers who help us operate our platform and deliver services.</li>
            <li>Legal authorities, if required by law to protect our rights or comply with legal processes.</li>
            <li>With your consent, when we need to share your data for specific purposes.</li>
          </ul>
        </div>
      </section>

      {/* User Rights Section */}
      <section id="user-rights" className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-6">
            Your Rights
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-6">
            You have the right to:
          </p>
          <ul className="list-disc list-inside text-left text-gray-600 space-y-4">
            <li>Access the personal data we hold about you.</li>
            <li>Request the correction or deletion of your personal data.</li>
            <li>Opt out of marketing communications at any time.</li>
            <li>Restrict or object to the processing of your data.</li>
          </ul>
        </div>
      </section>

      {/* Contact Information Section */}
      <section id="contact-info" className="py-16 bg-white">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
            Contact Us
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-6">
            If you have any questions about this Privacy Policy or how we handle your data, feel free to contact us at:
          </p>
          <p className="text-lg sm:text-xl font-semibold text-gray-800">
            privacy@hydratehub.com
          </p>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
