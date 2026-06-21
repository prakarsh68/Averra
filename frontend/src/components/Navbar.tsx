import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import LiveClock from "./LiveClock";

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Define navigation items (Icons removed)
  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "AI Detect", path: "/ai-detect" },
    { name: "Damage Assess", path: "/damage" },
    { name: "Visual Intel", path: "/visual" },
  ];

  // Helper to check if link is active
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10 shadow-2xl">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          
          {/* --- LOGO --- */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-tr from-amber-600 to-amber-400 rounded flex items-center justify-center font-bold text-black shadow-[0_0_15px_rgba(245,158,11,0.5)] group-hover:scale-110 transition duration-300">
              A
            </div>
          </Link>

          {/* --- DESKTOP NAVIGATION --- */}
          <div className="hidden md:flex items-center gap-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  relative px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2
                  ${isActive(item.path) 
                    ? "text-amber-500 bg-amber-900/10 shadow-[0_0_10px_rgba(245,158,11,0.1)] border border-amber-500/20" 
                    : "text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent"}
                `}
              >
                {item.name}
                
                {/* Active Indicator Dot */}
                {isActive(item.path) && (
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-amber-500 rounded-full shadow-[0_0_5px_orange]"></span>
                )}
              </Link>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-2 border border-green-500/30 px-3 py-1 rounded">
  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
  <LiveClock />
</div>
          {/* --- MOBILE MENU BUTTON --- */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-neutral-400 hover:text-white focus:outline-none"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE DROPDOWN --- */}
      {isOpen && (
        <div className="md:hidden bg-neutral-900 border-b border-neutral-800 absolute w-full left-0 animate-fade-in-down">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`
                  block px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors
                  ${isActive(item.path)
                    ? "bg-amber-900/20 text-amber-500 border border-amber-500/20"
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-white"}
                `}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;