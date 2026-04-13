function Contact() {
  return (
    <main className="max-w-2xl mx-auto px-6 pb-24 pt-14">
      <div className="mb-10 text-center">
        <span className="inline-block border border-white/20 text-textBase/50 text-[0.65rem] font-semibold tracking-[0.15em] uppercase px-4 py-1.5 rounded-full mb-6">
          Get In Touch
        </span>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-textBase tracking-tight mb-4">
          Contact Us
        </h1>
        <p className="text-textBase/50 text-sm leading-relaxed max-w-sm mx-auto">
          Have questions about the project or want to collaborate? Reach out to
          our team.
        </p>
      </div>

      {/* Contact Card */}
      <div className="bg-card rounded-2xl p-8 flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <span className="text-textBase/40 text-[0.7rem] font-semibold tracking-widest uppercase">
            Email
          </span>
          <a
            href="mailto:team@example.com"
            className="text-primary text-sm font-medium hover:underline underline-offset-4 transition"
          >
            team@example.com
          </a>
        </div>

        <div className="border-t border-white/10" />

        <div className="flex flex-col gap-1">
          <span className="text-textBase/40 text-[0.7rem] font-semibold tracking-widest uppercase">
            Project
          </span>
          <span className="text-textBase text-sm">
            Fake Financial News Prediction System
          </span>
        </div>

        <div className="border-t border-white/10" />

        <div className="flex flex-col gap-1">
          <span className="text-textBase/40 text-[0.7rem] font-semibold tracking-widest uppercase">
            Team
          </span>
          <span className="text-textBase text-sm">
            Team Alpha &mdash; Group Project
          </span>
        </div>
      </div>
    </main>
  );
}

export default Contact;
