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
    <footer className="border-t border-white/40 mt-20">
      <div className="w-full px-10 py-10">
        {/* Top row — 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">
          {/* Col 1 — Project info */}
          <div>
            <p className="text-[0.65rem] font-semibold tracking-widest uppercase text-textBase/30 mb-3">
              Project
            </p>
            <p className="text-textBase text-sm font-semibold mb-1">
              Fake Financial News Detector
            </p>
            <p className="text-textBase/40 text-xs leading-relaxed">
              AI-powered credibility checker for financial news using NLP.
            </p>
            {/* Version badge */}
            <span className="inline-block mt-3 border border-white/15 text-textBase/40 text-[0.65rem] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-md">
              v1.0
            </span>
          </div>

          {/* Col 2 — Team */}
          <div>
            <p className="text-[0.65rem] font-semibold tracking-widest uppercase text-textBase/30 mb-3">
              Team Alpha
            </p>
            <ul className="flex flex-col gap-1.5">
              {team.map((member) => (
                <li
                  key={member}
                  className="text-textBase/60 text-xs flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-primary inline-block shrink-0"></span>
                  {member}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Tech stack + GitHub */}
          <div>
            <p className="text-[0.65rem] font-semibold tracking-widest uppercase text-textBase/30 mb-3">
              Tech Stack
            </p>
            <div className="flex flex-wrap gap-2 mb-5">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="bg-card border border-white/10 text-textBase/60 text-[0.68rem] font-medium px-2.5 py-1 rounded-md"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* GitHub link */}
            <a
              href="https://github.com/Suresh-Nagvanshi/fake-financial-news-prediction.git"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-white/15 text-textBase/50 hover:text-textBase hover:border-white/30 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors duration-150"
            >
              {/* GitHub SVG icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              View on GitHub
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/8 pt-5 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-textBase/25 text-xs">
            &copy; {new Date().getFullYear()} Fake Financial News Prediction
            System. All rights reserved.
          </p>
          <p className="text-textBase/20 text-xs">
            Built with React &amp; FastAPI
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
