import React from 'react';

function About() {
  const steps = [
    { num: "01", title: "Input Text", desc: "Paste any financial news headline or full article text into the analyzer." },
    { num: "02", title: "Process", desc: "Our DistilBERT NLP model intelligently processes the text on the FastAPI backend." },
    { num: "03", title: "Verify", desc: "Receive an instant Real or Fake verdict along with a deep-learning confidence score." },
  ];

  const stack = [
    { label: "Frontend", value: "React.js + Tailwind" },
    { label: "Backend", value: "FastAPI + Python" },
    { label: "ML Model", value: "DistilBERT (Transformers)" },
    { label: "UI / UX", value: "Glassmorphism & Gradients" }
  ];

  return (
    <main className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center">
      {/* Background Glow Overlay */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl w-full mx-auto px-6 pb-32 pt-20 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* Left: Text & Features */}
        <div className="flex flex-col">
          <div className="mb-12">
            <span className="inline-block border border-primary/30 bg-primary/10 text-primary text-[0.65rem] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6 shadow-[0_0_15px_rgba(254,119,67,0.2)]">
              About The Project
            </span>
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-textBase to-textBase/40 tracking-tight mb-6 leading-tight">
              Empowering <br/><span className="text-primary glow-text">Truth</span> in Finance.
            </h1>
            <p className="text-textBase/60 text-lg md:text-xl leading-relaxed font-light mt-2">
              We leverage advanced artificial intelligence to detect whether financial statements are legitimate or fabricated, utilizing a custom fine-tuned NLP model.
            </p>
          </div>

          <div className="flex flex-col gap-6 mb-10">
            {steps.map((step, i) => (
              <div key={i} className="group bg-card/20 hover:bg-card/40 border border-white/5 hover:border-primary/40 rounded-3xl p-6 md:p-8 flex items-start gap-6 lg:gap-8 transition-all duration-300 backdrop-blur-xl cursor-default shadow-lg hover:shadow-[0_0_40px_rgba(254,119,67,0.15)] hover:-translate-y-1">
                <span className="font-heading text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-primary to-orange-400 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                  {step.num}
                </span>
                <div className="mt-1">
                  <h3 className="font-bold text-textBase text-lg md:text-xl mb-2">{step.title}</h3>
                  <p className="text-textBase/50 text-sm md:text-base leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Graphic & Stack */}
        <div className="flex flex-col lg:items-end gap-12 w-full animate-fade-in-up">
          {/* Generated Image Wrapper */}
          <div className="relative w-full max-w-lg aspect-square lg:aspect-[4/5] rounded-[3rem] p-1 bg-gradient-to-tr from-card to-white/5 shadow-2xl overflow-hidden group border border-white/10 hover:border-primary/40 transition-all duration-700 mx-auto">
             <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition duration-700 pointer-events-none mix-blend-overlay z-20" />
             <div className="w-full h-full rounded-[2.8rem] overflow-hidden bg-background relative z-10">
                <img 
                   src="/images/about.png" 
                   alt="AI Financial Analysis" 
                   className="w-full h-full object-cover transform group-hover:scale-110 transition duration-[1.5s] ease-out shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] opacity-90 group-hover:opacity-100" 
                />
             </div>
          </div>

          {/* Architecture Box */}
          <div className="w-full max-w-lg bg-card/20 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 hover:shadow-[0_15px_50px_rgba(0,0,0,0.5)] hover:border-white/20 transition-all duration-500 mx-auto group">
            <h2 className="font-heading text-xl font-bold text-textBase mb-8 tracking-tight flex items-center gap-4">
              <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_12px_rgba(254,119,67,0.9)] animate-pulse" /> Architecture
            </h2>
            <div className="flex flex-col gap-6">
              {stack.map((item, i) => (
                <div key={i} className="flex justify-between items-center group/item hover:bg-white/5 p-2 -mx-2 rounded-xl transition-colors">
                  <span className="text-textBase/50 text-sm md:text-base font-medium group-hover/item:text-textBase/90 transition-colors">{item.label}</span>
                  <div className="h-px flex-1 mx-4 lg:mx-6 border-b border-dashed border-white/10 group-hover/item:border-primary/30 transition-colors" />
                  <span className="text-textBase text-sm font-bold bg-white/5 px-4 py-1.5 rounded-lg border border-white/5 group-hover/item:border-primary/30 group-hover/item:bg-primary/10 group-hover/item:text-primary transition-all shadow-sm">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
      </div>
    </main>
  );
}

export default About;
