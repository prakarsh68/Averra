import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Map from "./pages/Map";
import Reports from "./pages/Reports";
import AIDetect from "./pages/AIDetect";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import DamageDetect from "./pages/DamageDetect";
import VisualAI from "./pages/VisualAI";
import Alerts from "./pages/Alerts";

// Layout Component to handle conditional Navbar logic
const Layout = () => {
  const location = useLocation();
  
  // Define which routes should hide the Navbar (Full Screen Mode)
  const hideNavbarRoutes = ["/dashboard"];
  const showNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      
      {/* Add padding-top only when Navbar is visible to prevent overlap */}
      <div className={showNavbar ? "pt-20" : ""}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<Map />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/ai-detect" element={<AIDetect />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/damage" element={<DamageDetect />} />
          <Route path="/visual" element={<VisualAI />} />
          <Route path="/alerts" element={<Alerts />} />
        </Routes>
      </div>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black text-neutral-200 font-sans selection:bg-amber-500 selection:text-black">
        <Layout />
      </div>
    </BrowserRouter>
  );
}

export default App;