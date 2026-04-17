import React, { useState } from 'react';
import { useForm, ValidationError } from '@formspree/react';

function Contact() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Initialize Formspree hook using the direct Form ID (Hash)
  const [state, handleSubmit] = useForm("mdayevqk");

  return (
    <main className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center pt-24 pb-32">
      {/* Dynamic Background Blur Blobs */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[130px] pointer-events-none mix-blend-screen" />

      <div className="max-w-7xl w-full mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* Abstract Isometric Graphic */}
        <div className="order-2 lg:order-1 relative w-full flex justify-center items-center h-full min-h-[400px]">
            <div className="relative group w-full max-w-[500px]">
                <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-cyan-500 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-50 transition duration-[1.5s] pointer-events-none" />
                <div className="relative rounded-[3rem] border border-white/10 overflow-hidden bg-card/30 backdrop-blur-md transform transition-all duration-700 ease-out hover:-translate-y-3 shadow-[0_30px_60px_rgba(0,0,0,0.8)]">
                  <img 
                     src="/images/contact.png" 
                     alt="Futuristic Contact Interface" 
                     className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1s] ease-in-out mix-blend-lighten"
                  />
                </div>
            </div>
        </div>

        {/* Text & Contact Details */}
        <div className="order-1 lg:order-2 flex flex-col justify-center">
          <div className="mb-12">
            <span className="inline-block border border-white/10 bg-white/5 text-textBase text-xs font-bold tracking-widest uppercase px-5 py-2 rounded-full mb-6 shadow-sm backdrop-blur-xl">
              Get In Touch
            </span>
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-textBase to-textBase/40 tracking-tight mb-6 leading-tight">
              Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Connect.</span>
            </h1>
            <p className="text-textBase/50 text-lg md:text-xl leading-relaxed max-w-lg font-light">
              We're building the future of financial integrity. Reach out to collaborate on AI-driven financial models or to inquire about our project.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            {/* Actionable General Inquiries Card */}
            <div 
               onClick={() => setIsModalOpen(true)}
               className="bg-card/20 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 hover:bg-card/40 hover:border-primary/30 transition-all duration-500 group shadow-xl hover:shadow-[0_20px_40px_rgba(254,119,67,0.1)] hover:-translate-y-2 cursor-pointer"
            >
               <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-[0_0_15px_rgba(254,119,67,0.1)] group-hover:shadow-[0_0_25px_rgba(254,119,67,0.5)]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
               </div>
               <span className="block text-textBase/40 text-[0.7rem] font-bold tracking-widest uppercase mb-1">General Inquiries</span>
               <span className="text-textBase font-medium text-lg hover:text-primary transition-colors block">Send a Query &rarr;</span>
            </div>

            {/* Location Card */}
            <div className="bg-card/20 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 hover:bg-card/40 hover:border-cyan-500/30 transition-all duration-500 group shadow-xl hover:shadow-[0_20px_40px_rgba(6,182,212,0.1)] hover:-translate-y-2 cursor-default">
               <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-500 shadow-[0_0_15px_rgba(6,182,212,0.1)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
               </div>
               <span className="block text-textBase/40 text-[0.7rem] font-bold tracking-widest uppercase mb-1">Headquarters</span>
               <span className="text-textBase font-medium text-lg block">Tech Hub, New Delhi</span>
            </div>
          </div>

          <div className="relative p-8 rounded-3xl overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-r from-card to-white/5 pointer-events-none" />
             <div className="absolute inset-0 border border-white/5 rounded-3xl pointer-events-none" />
             <div className="relative z-10">
               <h3 className="font-heading font-semibold text-xl text-textBase mb-6 flex items-center gap-3">
                 <span className="w-2 h-6 rounded-full bg-gradient-to-b from-primary to-cyan-500" /> Executive Team
               </h3>
               <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-base text-textBase/70">
                  {['Suresh Nagvanshi', 'Nihal Panwar', 'Faraz Ahmed', 'Astha Shukla', 'Tisha Chhabra'].map((name, i) => (
                    <div key={name} className="flex items-center gap-3 hover:text-textBase transition-colors group/name">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/5 border border-white/10 group-hover/name:bg-primary/20 group-hover/name:border-primary/50 transition-colors">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary group-hover/name:scale-150 transition-transform" />
                      </div>
                      <span className="font-medium">{name}</span>
                    </div>
                  ))}
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Inquiry Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-card w-full max-w-lg rounded-3xl border border-white/10 p-8 shadow-2xl animate-fade-in-up">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-textBase/40 hover:text-textBase transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-textBase mb-2 font-heading">Submit Inquiry</h2>
            <p className="text-textBase/50 text-sm mb-6">Send your query directly to our secure inbox via Formspree.</p>
            
            {state.succeeded ? (
              <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-4 rounded-xl flex items-center gap-3">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
                 <span>Your inquiry has been posted successfully! We will get back to you soon.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold tracking-widest text-textBase/60 uppercase mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email" 
                    name="email"
                    required
                    className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-textBase focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                    placeholder="you@domain.com"
                  />
                  <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-400 text-sm mt-1" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-xs font-semibold tracking-widest text-textBase/60 uppercase mb-2">
                    Your Query
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows="4"
                    className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-textBase focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors resize-none"
                    placeholder="How can we help you?"
                  />
                  <ValidationError prefix="Message" field="message" errors={state.errors} className="text-red-400 text-sm mt-1" />
                </div>
                <input type="hidden" name="Project ID" value="2981684724860189987" />
                <button 
                  type="submit" 
                  disabled={state.submitting}
                  className="mt-2 w-full bg-primary hover:bg-orange-500 text-white font-bold py-3 px-6 rounded-xl shadow-[0_0_20px_rgba(254,119,67,0.3)] transition-all flex justify-center items-center gap-2 hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {state.submitting ? 'Sending...' : 'Post Query'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </main>
  );
}

export default Contact;
