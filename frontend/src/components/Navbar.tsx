import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-dark2 text-white px-8 py-4 flex justify-between items-center border-b border-gold/30">
      <h1 className="text-2xl font-extrabold bg-goldShine bg-clip-text text-transparent drop-shadow-md tracking-widest">
        AVERRA 🌍
      </h1>
      <div className="space-x-6 text-lg">
        <Link to="/" className="hover:text-goldLight transition">Home</Link>
        <Link to="/map" className="hover:text-goldLight transition">Map</Link>
        <Link to="/reports" className="hover:text-goldLight transition">Reports</Link>
        <Link to="/ai-detect" className="hover:text-goldLight transition">AIDetect</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/damage">Damage AI</Link>
        <Link to="/visual">Visual AI</Link>


      </div>
    </nav>
  );
};

export default Navbar;
