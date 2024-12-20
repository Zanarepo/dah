import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pt-16"> {/* Added padding-top */}
      {/* Header Section */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-10 px-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold">Who We Are</h1>
        <p className="text-base sm:text-lg mt-3 max-w-2xl mx-auto">
          At MyDatafy, we believe in creating a better future by empowering
          communities and organizations through technology and innovation.
        </p>
      </header>

      {/* Mission Section */}
      <section className="flex flex-col md:flex-row items-center py-10 px-6 gap-6 lg:gap-16 lg:px-32">
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-extrabold text-blue-700 mb-4">Our Mission</h2>
          <p className="text-base leading-relaxed text-gray-700">
            Our mission is to empower individuals and organizations by
            providing innovative solutions tailored to their unique needs. We
            aim to foster collaboration, drive innovation, and enable growth in
            every community we serve.
          </p>
        </div>
        <img
          src="/images/logos2.png"
          alt="Our Mission"
          className="w-full md:w-1/2 rounded-lg shadow-lg object-cover"
        />
      </section>

      {/* Values Section */}
      <section className="bg-gradient-to-b from-blue-50 to-gray-100 py-10 px-6 lg:px-32">
        <h2 className="text-center text-3xl font-bold text-blue-800 mb-8">
          Our Core Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Integrity", description: "We uphold the highest standards of honesty." },
            { title: "Innovation", description: "We constantly innovate to solve challenges." },
            { title: "Collaboration", description: "Teamwork drives our success." },
            { title: "Excellence", description: "We aim for top-notch quality in everything." },
          ].map((value, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md text-center transition hover:scale-105"
            >
              <h3 className="text-xl font-semibold text-blue-700 mb-4">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="py-10 px-6 lg:px-32">
        <h2 className="text-center text-3xl font-bold text-blue-800 mb-8">
          Meet the Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { name: "Prince Zana", role: "Runs Things Here", img: "/images/Zana1.jpg" },
            { name: "Uncle ObongEtte", role: "Chief Investor", img: "/images/ObongEtte.jpg" },
            { name: "Paul Evalsam", role: "Investor", img: "/images/Paul.jpg" },
            { name: "Mba Ndem", role: "Investor", img: "/images/Mba.jpg" },
            { name: "Patrick Agba", role: "Investor", img: "/images/Patrick.jpg" },
            { name: "Nseyen Ubong", role: "Investor", img: "/images/Sandy.jpg" },
            { name: "Unique Eyoanwan", role: "Just Vibes", img: "/images/Eyoanwan.jpg" },
            { name: "Grace Daniel", role: "Unpaid Consultant", img: "/images/Grace.jpg" },
          ].map((member, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition"
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-20 h-20 mx-auto rounded-full mb-3 object-cover"
              />
              <h3 className="text-lg font-bold text-gray-800">{member.name}</h3>
              <p className="text-gray-600 text-sm">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Closing Image Section 
      <section className="py-10">
        <img
          src="/images/Welcome.jpg"
          alt="About Us"
          className="w-full h-56 sm:h-60 object-cover rounded-lg shadow-lg"
        />
      </section>*/}
    </div>
  );
};

export default About;
