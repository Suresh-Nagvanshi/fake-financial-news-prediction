import { useState } from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `text-xs font-semibold tracking-widest uppercase transition-colors duration-200 ${
      isActive ? "text-primary" : "text-[#EFEEEA]/50 hover:text-textBase"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-white/40">
      <div className="w-full pl-10 pr-24 h-16 flex items-center justify-between">
        {/* Brand + Logo — far left */}
        <NavLink to="/" className="flex items-center gap-2.5">
          {
            /* ── Logo slot ─ */
            <img
              src="/logo.png"
              alt="FinVerify logo"
              className="w-7 h-7 object-contain"
            />
          }
          <span className="font-heading text-xl font-bold text-textBase tracking-tight">
            Fin<span className="text-primary">Verify</span>
          </span>
        </NavLink>

        {/* Desktop links — right */}
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
        </ul>

        {/* Hamburger — mobile */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1 cursor-pointer bg-transparent border-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-0.5 bg-textBase/50 transition-all duration-200 origin-center ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-textBase/50 transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-textBase/50 transition-all duration-200 origin-center ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      {/* Mobile dropdown */}
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
        </div>
      )}
    </nav>
  );
}

export default Navbar;
