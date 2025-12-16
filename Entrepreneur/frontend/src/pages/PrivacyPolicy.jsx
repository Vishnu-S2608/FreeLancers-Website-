import React from 'react'

function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-24 text-center">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold drop-shadow-lg">Privacy Policy</h2>
        <p className="mt-4 text-lg sm:text-xl max-w-3xl mx-auto text-gray-100">
          Your privacy matters to us. Learn how we collect, use, and protect your data.
        </p>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-16 bg-gray-50 flex-grow">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 bg-white rounded-xl shadow-xl p-10 space-y-10">
          
          {/** Policy Sections */}
          {[
            {
              title: "1. Introduction",
              content: "At FreelanceHub, we value your privacy. This policy explains how we handle your personal information when you use our platform to find work or hire freelancers."
            },
            {
              title: "2. Information We Collect",
              content: [
                "Personal details like name, email, phone number.",
                "Payment details for secure transactions.",
                "Profile information (skills, portfolio, work history).",
                "Usage data like login times, searches, and preferences."
              ]
            },
            {
              title: "3. How We Use Your Data",
              content: [
                "Match freelancers with clients.",
                "Process payments securely and instantly.",
                "Improve our platform and provide better support.",
                "Prevent fraud and ensure a safe marketplace."
              ]
            },
            {
              title: "4. Sharing of Information",
              content: "We do not sell your personal data. Information may only be shared with trusted service providers (like payment gateways) strictly for operational purposes."
            },
            {
              title: "5. Data Security",
              content: "We use encryption, secure servers, and regular audits to keep your data safe."
            },
            {
              title: "6. Your Rights",
              content: <>You have the right to access, update, or delete your personal information at any time by contacting us at <span className="font-semibold text-indigo-600 hover:underline cursor-pointer">support@freelancehub.com</span>.</>
            },
            {
              title: "7. Updates to This Policy",
              content: "We may update this Privacy Policy from time to time. Changes will be notified on this page with the updated date."
            },
            {
              title: "8. Contact Us",
              content: [
                "Email: support@freelancehub.com",
                "Phone: +91 98765 43210"
              ]
            }
          ].map((section, idx) => (
            <div key={idx}>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{section.title}</h3>
              {Array.isArray(section.content) ? (
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  {section.content.map((item, i) => <li key={i} className="hover:text-indigo-600 transition-colors">{item}</li>)}
                </ul>
              ) : (
                <p className="text-gray-700 leading-relaxed">{section.content}</p>
              )}
            </div>
          ))}

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 text-center">
        <p className="text-sm sm:text-base">© 2025 FreelanceHub. All Rights Reserved.</p>
      </footer>

    </div>
  )
}

export default PrivacyPolicy
