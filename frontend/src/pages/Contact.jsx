import React, { useState } from 'react';
import { buildUrl, apiRequest } from "../config/api";

function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const teamMembers = [
    'Suresh Nagvanshi',
    'Nihal Panwar',
    'Faraz Ahmed',
    'Astha Shukla',
    'Tisha Chhabra'
  ];

  // 🔥 NEW SUBMIT FUNCTION (FASTAPI)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = {
      email: e.target.email.value,
      message: e.target.message.value,
      project_id: "2981684724860189987"
    };

    try {
      const res = await apiRequest(buildUrl("/contact"), {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitted(true);
        e.target.reset();
      } else {
        alert("Submission failed");
      }

    } catch (error) {
      console.error(error);
      alert("Server error");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center py-24">
      
      {/* Background Effects */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />

      <div className="max-w-7xl w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* LEFT SECTION */}
        <div className="lg:col-span-5">
          <h1 className="text-5xl font-bold mb-4">Let's Connect</h1>
          <p className="text-gray-400 mb-8">
            Reach out to collaborate or ask about our AI system.
          </p>

          <div className="bg-gray-900 p-6 rounded-2xl">
            <h3 className="text-xl mb-4">Executive Team</h3>
            {teamMembers.map((name) => (
              <div key={name} className="py-2 text-gray-300">
                {name}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SECTION (FORM) */}
        <div className="lg:col-span-7">
          <div className="bg-gray-900 p-8 rounded-2xl">

            {submitted ? (
              <div className="text-green-400 text-lg">
                ✅ Your query has been submitted successfully!
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Enter your email"
                  className="p-4 rounded bg-black text-white border border-gray-700"
                />

                <textarea
                  name="message"
                  required
                  rows="5"
                  placeholder="Enter your message"
                  className="p-4 rounded bg-black text-white border border-gray-700"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-orange-500 p-4 rounded text-white font-bold"
                >
                  {loading ? "Submitting..." : "Post Query"}
                </button>

              </form>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}

export default Contact;
