function Footer() {
  const team = [
    "Suresh Nagvanshi",
    "Nihal Panwar",
    "Faraz Ahmed",
    "Astha Shukla",
    "Tisha Chhabra",
  ];

  const techStack = ["React.js", "FastAPI", "DistilBERT", "Tailwind CSS"];

  return (
    <footer className="relative mt-32 border-t-2 border-primary/30 bg-card overflow-hidden shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
      {/* Subtle Top Glow emitting from the orange border */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[200px] bg-primary/10 blur-[100px] pointer-events-none"></div>
      
      <div className="w-full max-w-7xl mx-auto px-6 py-12">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1.5 shrink-0">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 6L3 12L11 18Z" fill="#FE7743"/>
                  <path d="M13 6L21 12L13 18Z" fill="#FE7743"/>
                </svg>
              </div>
              <h3 className="text-textBase font-heading font-bold text-lg tracking-tight">
                Fin<span className="text-primary">Verify</span>
              </h3>
            </div>
            <p className="text-textBase/50 text-sm leading-relaxed max-w-xs mb-6 font-body">
              Securing financial intelligence with state-of-the-art NLP. 
              Analyze, verify, and predict market manipulation in real-time.
            </p>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-textBase/40 text-[0.65rem] font-bold tracking-widest uppercase">
                System Operational v1.2
              </span>
            </div>
          </div>

          {/* Team Column */}
          <div className="md:col-span-3">
            <h4 className="text-[0.7rem] font-bold tracking-[0.2em] uppercase text-primary mb-6">
              the team
            </h4>
            <ul className="space-y-3">
              {team.map((member) => (
                <li
                  key={member}
                  className="text-textBase/60 text-sm font-medium hover:text-textBase transition-colors duration-200 flex items-center gap-3 group"
                >
                  <span className="w-1.5 h-[1px] bg-white/20 group-hover:w-3 group-hover:bg-primary transition-all duration-300"></span>
                  {member}
                </li>
              ))}
            </ul>
          </div>

          {/* Technology & Links Column */}
          <div className="md:col-span-4">
            <h4 className="text-[0.7rem] font-bold tracking-[0.2em] uppercase text-primary mb-6">
              Architecture
            </h4>
            <div className="flex flex-wrap gap-2 mb-8">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-textBase/70 text-[0.7rem] font-semibold hover:border-primary/40 hover:text-textBase transition-all cursor-default"
                >
                  {tech}
                </span>
              ))}
            </div>

            <a
              href="https://github.com/Suresh-Nagvanshi/fake-financial-news-prediction.git"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl bg-textBase text-background font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-xl shadow-black/20"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Repository
            </a>
          </div>
        </div>

        {/* Legal Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-textBase/20 text-[0.7rem] font-medium tracking-wide">
            &copy; {new Date().getFullYear()} FINVERIFY. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8">
            <span className="text-textBase/20 text-[0.7rem] font-bold cursor-pointer hover:text-primary transition-colors">PRIVACY</span>
            <span className="text-textBase/20 text-[0.7rem] font-bold cursor-pointer hover:text-primary transition-colors">TERMS</span>
            <span className="text-textBase/20 text-[0.7rem] font-bold cursor-pointer hover:text-primary transition-colors">SECURITY</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
