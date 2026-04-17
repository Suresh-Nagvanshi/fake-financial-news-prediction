import React from 'react';
import { useForm, ValidationError } from '@formspree/react';

function Contact() {
  const [state, handleSubmit] = useForm(import.meta.env.VITE_FORMSPREE_FORM_ID);

  const teamMembers = [
    'Suresh Nagvanshi',
    'Nihal Panwar',
    'Faraz Ahmed',
    'Astha Shukla',
    'Tisha Chhabra'
  ];

  return (
    <main className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center py-24">
      {/* Ambient Background Glows */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

      <div className="max-w-7xl w-full mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left Column: Context & Enhanced Executive Team */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="mb-10">
            <span className="inline-block border border-white/10 bg-white/5 text-textBase text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-6 backdrop-blur-md shadow-sm">
              Get In Touch
            </span>
            <h1 className="font-heading text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-textBase/50 tracking-tight mb-4 leading-tight">
              Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Connect.</span>
            </h1>
            <p className="text-textBase/60 text-lg leading-relaxed font-light">
              We're building the future of financial integrity. Reach out to collaborate on AI-driven detection models or to inquire about our systems.
            </p>
          </div>

          {/* Elevated Team Section */}
          <div className="relative p-7 rounded-[2rem] bg-card/30 backdrop-blur-xl border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.4)]">
            <h3 className="font-heading font-semibold text-xl text-textBase mb-6 flex items-center gap-3">
              <span className="w-1.5 h-6 rounded-full bg-gradient-to-b from-primary to-cyan-500" /> 
              Executive Team
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {teamMembers.map((name) => {
                const initials = name.split(' ').map(n => n[0]).join('');
                
                return (
                  <div key={name} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-300 group/card cursor-default">
                    {/* Dynamic Avatar */}
                    <div className="w-11 h-11 shrink-0 rounded-full bg-gradient-to-br from-white/5 to-white/10 border border-white/10 flex items-center justify-center group-hover/card:border-cyan-500/50 group-hover/card:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all duration-300">
                      <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-primary">
                        {initials}
                      </span>
                    </div>
                    {/* Name Only */}
                    <span className="text-sm font-medium text-textBase/90 group-hover/card:text-white transition-colors">
                      {name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Native Embedded Form */}
        <div className="lg:col-span-7">
          <div className="bg-card/40 backdrop-blur-xl w-full rounded-[2rem] border border-white/10 p-8 md:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.4)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
            
            <h2 className="text-2xl font-bold text-textBase mb-2 font-heading relative z-10">Submit Inquiry</h2>
            <p className="text-textBase/50 text-sm mb-8 relative z-10">Send your query directly to our secure inbox via Formspree.</p>
            
            {state.succeeded ? (
              <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-6 rounded-2xl flex items-center gap-4 relative z-10 animate-fade-in">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="font-medium">Your inquiry has been posted successfully! We will get back to you soon.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-10">
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold tracking-widest text-textBase/60 uppercase mb-2 ml-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email" 
                    name="email"
                    required
                    className="w-full bg-background/50 border border-white/10 rounded-2xl px-5 py-4 text-textBase placeholder-textBase/20 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all shadow-inner"
                    placeholder="you@domain.com"
                  />
                  <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-400 text-sm mt-2 ml-1" />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-xs font-semibold tracking-widest text-textBase/60 uppercase mb-2 ml-1">
                    Your Query
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows="5"
                    className="w-full bg-background/50 border border-white/10 rounded-2xl px-5 py-4 text-textBase placeholder-textBase/20 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all shadow-inner resize-none"
                    placeholder="How can we help you?"
                  />
                  <ValidationError prefix="Message" field="message" errors={state.errors} className="text-red-400 text-sm mt-2 ml-1" />
                </div>
                
                <input type="hidden" name="Project ID" value="2981684724860189987" />
                
                <button 
                  type="submit" 
                  disabled={state.submitting}
                  className="mt-4 w-full bg-primary hover:bg-orange-500 text-white font-bold py-4 px-6 rounded-2xl shadow-[0_0_20px_rgba(254,119,67,0.3)] hover:shadow-[0_0_30px_rgba(254,119,67,0.5)] transition-all flex justify-center items-center gap-2 hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {state.submitting ? 'Transmitting...' : 'Post Query'}
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