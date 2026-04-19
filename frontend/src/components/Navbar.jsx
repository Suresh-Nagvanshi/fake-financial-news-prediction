import { useState} from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const userEmail = localStorage.getItem("userEmail");

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    window.location.href = "/";
  };

  const linkClass = ({ isActive }) =>
    `text-xs font-semibold tracking-widest uppercase transition-colors duration-200 ${
      isActive ? "text-primary" : "text-[#EFEEEA]/50 hover:text-textBase"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-3xl border-b-2 border-primary/30 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
      
      <div className="absolute bottom-[-50px] left-1/2 -translate-x-1/2 w-[50%] h-[100px] bg-primary/20 blur-[80px] pointer-events-none"></div>

      <div className="w-full pl-10 pr-24 h-16 flex items-center justify-between relative z-10">
        
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2.5">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M11 6L3 12L11 18Z" fill="#FE7743"/>
            <path d="M13 6L21 12L13 18Z" fill="#FE7743"/>
          </svg>
          <span className="font-heading text-xl font-bold text-textBase">
            Fin<span className="text-primary">Verify</span>
          </span>
        </NavLink>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-10">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/about" className={linkClass}>About</NavLink>
          <NavLink to="/contact" className={linkClass}>Contact</NavLink>

          {userEmail ? (
            <>
              <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>

              {/* User Email */}
              <span className="text-xs text-gray-400 hidden lg:block">
                {userEmail}
              </span>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="px-4 py-1.5 text-xs font-semibold uppercase text-primary border border-primary/40 rounded-md hover:bg-primary/10"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/auth"
              className="px-4 py-1.5 text-xs font-semibold uppercase text-primary border border-primary/40 rounded-md hover:bg-primary/10"
            >
              Login
            </NavLink>
          )}
        </ul>

        {/* Mobile Toggle */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-6 py-4 flex flex-col gap-4 bg-background">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/about" className={linkClass}>About</NavLink>
          <NavLink to="/contact" className={linkClass}>Contact</NavLink>

          {userEmail ? (
            <>
              <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
              <button onClick={handleLogout} className="text-primary">
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/auth" className="text-primary">Login</NavLink>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;