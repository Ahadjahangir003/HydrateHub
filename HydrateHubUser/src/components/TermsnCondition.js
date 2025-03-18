import React from 'react';
import '../styles/index.css';
const TermsnConditions = () => {
  return (
    <div id="vendors-container" className="flex flex-col min-h-screen">
    {/* Top Section */}
    <div id="vendors-image-section" className="relative w-full h-96 bg-cover bg-center" style={{ backgroundImage: `url('/images/water11.jpg')` }}>
    <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white text-center mb-4">
            Terms and Conditions
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 text-center">
            Please read these terms carefully before using our services.
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
            By accessing or using HydrateHub, you agree to comply with and be bound by the following terms and conditions. These terms apply to all users, vendors, and customers interacting with the platform.
          </p>
        </div>
      </section>

      {/* User Responsibilities Section */}
      <section id="user-responsibilities" className="py-16 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-6">
            User Responsibilities
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-6">
            As a user of HydrateHub, you are expected to:
          </p>
          <ul className="list-disc list-inside text-left text-gray-600 space-y-4">
            <li>Provide accurate and up-to-date information during registration and ordering.</li>
            <li>Use the platform for lawful purposes only and refrain from any activities that could harm the service.</li>
            <li>Respect the rights and privacy of other users, vendors, and staff.</li>
            <li>Ensure the security of your account by keeping your login credentials confidential.</li>
          </ul>
        </div>
      </section>

      {/* Service Terms Section */}
      <section id="service-terms" className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-6">
            Service Terms
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-6">
            The HydrateHub service is designed to connect users with vendors of high-quality filtered water. By using this service, you agree to the following terms:
          </p>
          <ul className="list-disc list-inside text-left text-gray-600 space-y-4">
            <li>HydrateHub reserves the right to modify, suspend, or terminate the service at any time without prior notice.</li>
            <li>We do not guarantee the availability of any specific vendor or product at all times.</li>
            <li>Pricing and availability are subject to change without notice, and HydrateHub is not liable for any disruptions in service.</li>
          </ul>
        </div>
      </section>

      {/* Limitation of Liability Section */}
      <section id="liability" className="py-16 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-6">
            Limitation of Liability
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-6">
            To the fullest extent permitted by law, HydrateHub shall not be liable for any indirect, incidental, or consequential damages arising from the use or inability to use our services, even if we have been advised of the possibility of such damages.
          </p>
          <p className="text-lg sm:text-xl text-gray-600">
            Our liability is limited to the maximum extent permitted by law. HydrateHub is not responsible for any damages resulting from the actions of vendors or third-party service providers.
          </p>
        </div>
      </section>

      {/* Governing Law Section */}
      <section id="governing-law" className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-6">
            Governing Law
          </h2>
          <p className="text-lg sm:text-xl text-gray-600">
            These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which HydrateHub operates. Any disputes relating to these terms shall be subject to the exclusive jurisdiction of the courts in that region.
          </p>
        </div>
      </section>

      {/* Contact Information Section */}
      <section id="contact-info" className="py-16 bg-white">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
            Contact Us
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-6">
            If you have any questions or concerns about these terms, please feel free to reach out to us at:
          </p>
          <p className="text-lg sm:text-xl font-semibold text-gray-800">
            support@hydratehub.com
          </p>
        </div>
      </section>
    </div>
  );
};

export default TermsnConditions;
