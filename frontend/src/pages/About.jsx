function About() {
  const steps = [
    {
      num: "01",
      title: "Input",
      desc: "Paste any financial news headline or full article text into the analyzer.",
    },
    {
      num: "02",
      title: "Analyze",
      desc: "Our DistilBERT NLP model processes the text through the FastAPI backend.",
    },
    {
      num: "03",
      title: "Result",
      desc: "Receive an instant Real or Fake verdict along with a confidence score.",
    },
  ];

  const stack = [
    { label: "Frontend", value: "React.js + Tailwind CSS" },
    { label: "Backend", value: "FastAPI (Python)" },
    { label: "ML Model", value: "DistilBERT (HuggingFace)" },
    { label: "Dataset", value: "Financial News CSV" },
  ];

  return (
    <main className="max-w-2xl mx-auto px-6 pb-24 pt-14">
      <div className="mb-12 text-center">
        <span className="inline-block border border-white/20 text-textBase/50 text-[0.65rem] font-semibold tracking-[0.15em] uppercase px-4 py-1.5 rounded-full mb-6">
          About The Project
        </span>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-textBase tracking-tight mb-4">
          How It Works
        </h1>
        <p className="text-textBase/50 text-sm leading-relaxed max-w-md mx-auto">
          A full-stack AI application that detects whether financial news is
          real or fake using a fine-tuned DistilBERT model.
        </p>
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-3 mb-14">
        {steps.map((step, i) => (
          <div
            key={i}
            className="bg-card rounded-xl p-5 flex items-start gap-5"
          >
            <span className="font-heading text-xl font-bold text-primary shrink-0 w-8">
              {step.num}
            </span>
            <div>
              <h3 className="font-semibold text-textBase text-sm mb-1">
                {step.title}
              </h3>
              <p className="text-textBase/45 text-sm leading-relaxed">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Tech Stack */}
      <div className="bg-card rounded-2xl p-6">
        <h2 className="font-heading text-base font-semibold text-textBase mb-5 tracking-tight">
          Tech Stack
        </h2>
        <div className="flex flex-col gap-3">
          {stack.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b border-white/8 pb-3 last:border-0 last:pb-0"
            >
              <span className="text-textBase/45 text-sm">{item.label}</span>
              <span className="text-textBase text-sm font-medium">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default About;
