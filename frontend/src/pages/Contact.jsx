import React from 'react';
import { useForm, ValidationError } from '@formspree/react';

function Contact() {
  // Initialize Formspree hook using the direct Form ID (Hash) from environment variables
  const [state, handleSubmit] = useForm(import.meta.env.VITE_FORMSPREE_FORM_ID);

  return (
    <main className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center pt-24 pb-32">
      {/* Toned down background blur for depth without visual overload */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl w-full mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
        
        {/* Left Column: Context & Team Roster */}
        <div className="flex flex-col justify-center lg:sticky lg:top-32">
          <div className="mb-12">
            <span className="inline-block border border-white/10 bg-white/5 text-textBase text-xs font-bold tracking-widest uppercase px-5 py-2 rounded-full mb-6 shadow-sm">
              Get In Touch
            </span>
            <h1 className="font-heading text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-textBase to-textBase/40 tracking-tight mb-6 leading-tight">
              Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Connect.</span>
            </h1>
            <p className="text-textBase/60 text-lg leading-relaxed max-w-lg font-light">
              We're building the future of financial integrity. Reach out to collaborate on AI-driven models or to inquire about our project.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-card/20 border border-white/5 backdrop-blur-md">
            <h3 className="font-heading font-semibold text-xl text-textBase mb-6 flex items-center gap-3">
              <span className="w-2 h-6 rounded-full bg-gradient-to-b from-primary to-cyan-500" /> Executive Team
            </h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-base text-textBase/70">
              {['Suresh Nagvanshi', 'Nihal Panwar', 'Faraz Ahmed', 'Astha Shukla', 'Tisha Chhabra'].map((name) => (
                <div key={name} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="font-medium">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Native Form Placement */}
        <div className="bg-card w-full rounded-3xl border border-white/10 p-8 md:p-10 shadow-2xl">
          <h2 className="text-2xl font-bold text-textBase mb-2 font-heading">Submit Inquiry</h2>
          <p className="text-textBase/50 text-sm mb-8">Send your query directly to our secure inbox.</p>
          
          {state.succeeded ? (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-4 rounded-xl flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Your inquiry has been posted successfully! We will get back to you soon.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
                  rows="6"
                  className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-textBase focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors resize-none"
                  placeholder="How can we help you?"
                />
                <ValidationError prefix="Message" field="message" errors={state.errors} className="text-red-400 text-sm mt-1" />
              </div>
              
              <input type="hidden" name="Project ID" value="2981684724860189987" />
              
              <button 
                type="submit" 
                disabled={state.submitting}
                className="mt-4 w-full bg-primary hover:bg-orange-500 text-white font-bold py-3 px-6 rounded-xl shadow-[0_0_20px_rgba(254,119,67,0.3)] transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {state.submitting ? 'Sending...' : 'Post Query'}
              </button>
            </form>
          )}
        </div>
        
      </div>
    </main>
  );
}

export default Contact;