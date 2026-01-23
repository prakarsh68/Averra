import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Map from "./pages/Map";
import Reports from "./pages/Reports";
import AIDetect from "./pages/AIDetect";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import DamageDetect from "./pages/DamageDetect";
import VisualAI from "./pages/VisualAI";


function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<Map />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/ai-detect" element={<AIDetect />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/damage" element={<DamageDetect />} />
          <Route path="/visual" element={<VisualAI />} />


        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
