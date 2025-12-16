import React from "react";

function AboutUs() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="hero min-h-[60vh] bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-extrabold">About Us</h1>
            <p className="mt-4 text-lg md:text-xl opacity-90">
              Empowering freelancers and clients to connect seamlessly, with
              fairness, trust, and instant rewards.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
            FreelanceHub was built to empower{" "}
            <span className="font-semibold text-indigo-600">
              students and part-time workers
            </span>
            . We saw the struggles of high fees on other platforms and decided
            to make freelancing affordable and instantly rewarding with{" "}
            <span className="font-semibold text-indigo-600">fast payments</span>
            .
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
            Our mission is simple:{" "}
            <span className="font-semibold text-indigo-600">
              connect talent with opportunities
            </span>{" "}
            at the lowest fees, while ensuring freelancers get paid instantly.
            We believe in{" "}
            <span className="font-semibold">fairness, trust, and growth</span>.
          </p>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Meet the Team</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            {[
              {
                name: "Brian Jones",
                role: "Founder & CEO",
                img: "https://via.placeholder.com/150",
              },
              {
                name: "Ananya Sharma",
                role: "Head of Operations",
                img: "https://via.placeholder.com/150",
              },
              {
                name: "Rohit Patel",
                role: "Tech Lead",
                img: "https://via.placeholder.com/150",
              },
            ].map((member, i) => (
              <div
                key={i}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition"
              >
                <figure className="px-10 pt-10">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                </figure>
                <div className="card-body items-center text-center">
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-gray-600 text-sm">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Our Skills</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {[
              {
                title: "Web Development",
                desc: "React, Next.js, Node.js, and more.",
              },
              {
                title: "Content & Marketing",
                desc: "Blogs, campaigns, and SEO strategies.",
              },
              {
                title: "Design & Creativity",
                desc: "UI/UX, branding, and graphic design.",
              },
            ].map((skill, i) => (
              <div
                key={i}
                className="card bg-base-100 shadow-md hover:shadow-lg transition"
              >
                <div className="card-body">
                  <h3 className="text-lg font-semibold">{skill.title}</h3>
                  <p className="text-gray-600 mt-2">{skill.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clients */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Our Clients</h2>
          <p className="mt-2 text-gray-600">
            Trusted by startups, businesses, and communities.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            {["Client 1", "Client 2", "Client 3"].map((client, i) => (
              <img
                key={i}
                src="https://via.placeholder.com/120x50"
                alt={client}
                className="h-12 object-contain"
              />
            ))}
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

export default AboutUs;
