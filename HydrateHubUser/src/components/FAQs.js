import React, { useState } from 'react';
import '../styles/index.css'; // Assuming global styles or additional styles

const FAQs = () => {
  // Define state for the active question to track which answer is open
  const [activeQuestion, setActiveQuestion] = useState(null);

  // Toggle the active question
  const toggleQuestion = (index) => {
    if (activeQuestion === index) {
      setActiveQuestion(null); // Close if already open
    } else {
      setActiveQuestion(index); // Open the clicked question
    }
  };

  // FAQs data
  const faqData = [
    {
      question: 'What is HydrateHub?',
      answer: 'HydrateHub is a platform that connects you with trusted vendors who provide high-quality filtered water delivered directly to your doorstep.'
    },
    {
      question: 'How do I place an order?',
      answer: 'You can place an order through our website or mobile app. Simply search for vendors near you, select the water type, and schedule a delivery time.'
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept all major credit cards, PayPal, and various digital payment platforms. You can securely pay online during checkout.'
    },
    {
      question: 'Is there a delivery fee?',
      answer: 'Delivery fees vary depending on the vendor and your location. The fee will be displayed during the checkout process before you confirm your order.'
    },
    {
      question: 'How do I contact customer support?',
      answer: 'You can reach our customer support team by emailing support@hydratehub.com. We’re here to help with any issues or questions you may have.'
    }
  ];

  return (
    <div id="vendors-container" className="flex flex-col min-h-screen">
    {/* Top Section */}
    <div id="vendors-image-section" className="relative w-full h-96 bg-cover bg-center" style={{ backgroundImage: `url('/images/water11.jpg')` }}>
    <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center">
       <h1 className="text-4xl sm:text-5xl font-bold text-white text-center mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 text-center">
            Get answers to common questions about HydrateHub.
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <section id="faq-section" className="py-16 bg-gray-50 w-full">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-6">
            Frequently Asked Questions
          </h2>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white shadow-md rounded-lg p-6">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleQuestion(index)}
                >
                  <h3 className="text-xl font-semibold text-gray-800">
                    {faq.question}
                  </h3>
                  <span className="text-gray-600">
                    {activeQuestion === index ? '-' : '+'}
                  </span>
                </div>

                {/* Answer Section (collapsible) */}
                {activeQuestion === index && (
                  <p className="text-gray-600 mt-4">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQs;
