import React from "react";

function Contact() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-indigo-600 text-white py-20 text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold">Get in Touch</h2>
        <p className="mt-4 text-lg max-w-2xl mx-auto opacity-90">
          Have questions, feedback, or want to collaborate? We’d love to hear
          from you.
        </p>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 grid gap-10 md:grid-cols-2">
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition">
            <h3 className="text-2xl font-bold text-gray-900">
              Send us a Message
            </h3>
            <form action="#" method="POST" className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  required
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-gray-900">
              Contact Information
            </h3>
            <p className="mt-4 text-gray-600">
              We’ll get back to you within 24 hours.
            </p>
            <ul className="mt-6 space-y-4 text-gray-700">
              <li>
                <span className="font-semibold">📍 Address:</span> Chennai,
                India
              </li>
              <li>
                <span className="font-semibold">📧 Email:</span>{" "}
                support@freelancehub.com
              </li>
              <li>
                <span className="font-semibold">📞 Phone:</span> +91 98765 43210
              </li>
            </ul>

            <div className="mt-6">
              <h4 className="text-lg font-semibold text-gray-900">
                Follow us
              </h4>
              <div className="flex space-x-4 mt-2">
                <a
                  href="#"
                  className="text-indigo-600 hover:text-indigo-800 transition"
                >
                  🌐 Facebook
                </a>
                <a
                  href="#"
                  className="text-indigo-600 hover:text-indigo-800 transition"
                >
                  🐦 Twitter
                </a>
                <a
                  href="#"
                  className="text-indigo-600 hover:text-indigo-800 transition"
                >
                  📸 Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 text-center">
        <p>© 2025 FreelanceHub. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default Contact;
