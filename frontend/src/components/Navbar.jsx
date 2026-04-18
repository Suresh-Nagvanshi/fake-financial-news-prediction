import { useState } from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `text-xs font-semibold tracking-widest uppercase transition-colors duration-200 ${
      isActive ? "text-primary" : "text-[#EFEEEA]/50 hover:text-textBase"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-3xl border-b-2 border-primary/30 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
      
      {/* Bottom Glow */}
      <div className="absolute bottom-[-50px] left-1/2 -translate-x-1/2 w-[50%] h-[100px] bg-primary/20 blur-[80px] pointer-events-none"></div>

      <div className="w-full pl-10 pr-24 h-16 flex items-center justify-between relative z-10">
        
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 shrink-0">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M11 6L3 12L11 18Z" fill="#FE7743"/>
              <path d="M13 6L21 12L13 18Z" fill="#FE7743"/>
            </svg>
          </div>
          <span className="font-heading text-xl font-bold text-textBase tracking-tight">
            Fin<span className="text-primary">Verify</span>
          </span>
        </NavLink>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-10 list-none m-0 p-0">
          <li>
            <NavLink to="/" end className={linkClass}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={linkClass}>
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={linkClass}>
              Contact
            </NavLink>
          </li>

          {/* Login Button (Fixed) */}
          <li>
            <NavLink
              to="/login"
              className="px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-primary border border-primary/40 rounded-md transition-all duration-300 hover:bg-primary/10 hover:shadow-[0_0_15px_rgba(254,119,67,0.5)] hover:scale-105"
            >
              Login
            </NavLink>
          </li>
        </ul>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1 cursor-pointer bg-transparent border-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-0.5 bg-textBase/50 transition-all duration-200 origin-center ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-textBase/50 transition-all duration-200 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-textBase/50 transition-all duration-200 origin-center ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-background border-t border-white/10 px-8 py-4 flex flex-col gap-4">
          <NavLink
            to="/"
            end
            className={linkClass}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </NavLink>

          <NavLink
            to="/about"
            className={linkClass}
            onClick={() => setMenuOpen(false)}
          >
            About
          </NavLink>

          <NavLink
            to="/contact"
            className={linkClass}
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </NavLink>

          {/* Mobile Login */}
          <NavLink
            to="/login"
            className="mt-2 px-4 py-2 text-xs font-semibold tracking-widest uppercase text-center text-primary border border-primary/40 rounded-md transition-all duration-300 hover:bg-primary/10"
            onClick={() => setMenuOpen(false)}
          >
            Login
          </NavLink>
        </div>
      )}
    </nav>
  );
}

export default Navbar;