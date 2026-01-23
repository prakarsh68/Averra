import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-black text-neutral-200 font-sans selection:bg-amber-500 selection:text-black">
      
      {/* ================= HERO SECTION ================= */}
      <header className="relative bg-black text-white overflow-hidden border-b border-neutral-800">
        

        {/* Abstract Background Element */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute right-0 top-0 w-1/2 h-full bg-amber-600 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/4"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-32 md:py-40 relative z-10 flex flex-col items-center text-center">
          <div className="inline-block px-3 py-1 mb-6 text-xs font-bold tracking-widest text-amber-400 uppercase bg-amber-900/20 rounded-full border border-amber-600/40">
            AI That Watches Over Earth
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white">
            AVERRA
          </h1>
          <p className="text-xl md:text-2xl text-neutral-400 max-w-3xl mb-10 leading-relaxed">
            An AI-powered disaster intelligence platform that transforms satellite imagery into real-time, visual, and actionable insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Primary Gold Button */}
            <Link to="/map">
                <button className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg transition shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                View Live Map
                </button>
            </Link>
            
            {/* Secondary Outline Button -> Changed to Alert Now */}
            <Link to="/alerts">
              <button className="w-full sm:w-auto px-8 py-4 bg-transparent border border-neutral-700 hover:border-red-500/50 hover:text-red-500 text-neutral-300 font-semibold rounded-lg transition flex items-center justify-center gap-2">
                <span>⚠</span> Alert Now
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* ================= ABOUT & PROBLEM/SOLUTION ================= */}
      <section id="about" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">From Reactive to <span className="text-amber-500">Proactive</span></h2>
            <p className="text-lg text-neutral-400 mb-6">
              Current disaster management systems are often fragmented and slow. Natural disasters cause massive destruction due to delayed detection and lack of real-time situational awareness.
            </p>
            <p className="text-lg text-neutral-400">
              AVERRA leverages satellite imagery and deep learning to not just detect disasters, but to assess damage severity and support decision-making in near real-time.
            </p>
          </div>
          <div className="bg-neutral-900 p-8 rounded-2xl shadow-2xl border border-neutral-800">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
              <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_red]"></span> The Problem
            </h3>
            <ul className="space-y-3 mb-8 text-neutral-400">
              <li className="flex gap-2">❌ <span className="flex-1">Delayed detection & manual reporting</span></li>
              <li className="flex gap-2">❌ <span className="flex-1">Fragmented disaster data</span></li>
              <li className="flex gap-2">❌ <span className="flex-1">Poor visualization for decision makers</span></li>
            </ul>

            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
              <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_orange]"></span> The AVERRA Solution
            </h3>
            <ul className="space-y-3 text-neutral-400">
              <li className="flex gap-2 text-white"><span className="text-amber-500">✔</span> <span className="flex-1">Automated analysis of satellite images</span></li>
              <li className="flex gap-2 text-white"><span className="text-amber-500">✔</span> <span className="flex-1">Damage severity classification</span></li>
              <li className="flex gap-2 text-white"><span className="text-amber-500">✔</span> <span className="flex-1">Visual impact zones on interactive maps</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================= KEY FEATURES ================= */}
      <section className="bg-neutral-950 py-20 px-6 border-y border-neutral-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Core Capabilities</h2>
            <p className="text-neutral-500 max-w-2xl mx-auto">
              Combining space-based data with artificial intelligence to minimize loss of life and infrastructure.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon="🛰" 
              title="AI Detection" 
              desc="Deep learning algorithms analyze satellite imagery to detect floods, wildfires, and earthquakes automatically."
            />
            <FeatureCard 
              icon="🏚" 
              title="Damage Classification" 
              desc="Granular severity assessment ranging from 'No Damage' to 'Destroyed' for precise resource allocation."
            />
            <FeatureCard 
              icon="🗺" 
              title="Visual Intelligence" 
              desc="We don't just send text alerts. We visualize segmentation of affected regions on interactive maps."
            />
            <FeatureCard 
              icon="⚡" 
              title="Real-time Alerts" 
              desc="Near real-time disaster awareness allowing governments and NGOs to respond immediately."
            />
            <FeatureCard 
              icon="📊" 
              title="Analytics Dashboard" 
              desc="Track disaster trends, generate structured reports, and download data for official use."
            />
            <FeatureCard 
              icon="🏛" 
              title="Government Ready" 
              desc="Scalable design built for Disaster Management Authorities, Smart Cities, and Relief Agencies."
            />
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-white mb-16">How AVERRA Works</h2>
        <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-neutral-900 via-amber-900 to-neutral-900 -z-10 transform -translate-y-1/2"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 text-center">
                <Step number="1" title="Data Collection" desc="Satellite & ground data ingest" />
                <Step number="2" title="AI Analysis" desc="Models detect disaster patterns" />
                <Step number="3" title="Classification" desc="Severity levels assessed" />
                <Step number="4" title="Visualization" desc="Impact zones mapped" />
                <Step number="5" title="Action" desc="Alerts & reports generated" />
            </div>
        </div>
      </section>

      {/* ================= TECH STACK & FUTURE ================= */}
      <section className="bg-neutral-900 text-neutral-300 py-20 px-6 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Under The Hood</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-amber-500 mb-2">AI & Backend</h4>
                <div className="flex flex-wrap gap-2">
                  <TechBadge>PyTorch</TechBadge>
                  <TechBadge>OpenCV</TechBadge>
                  <TechBadge>Scikit-learn</TechBadge>
                  <TechBadge>FastAPI</TechBadge>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-amber-500 mb-2">Frontend & Maps</h4>
                <div className="flex flex-wrap gap-2">
                  <TechBadge>React.js</TechBadge>
                  <TechBadge>Tailwind CSS</TechBadge>
                  <TechBadge>Leaflet</TechBadge>
                  <TechBadge>Chart.js</TechBadge>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-amber-500 mb-2">Data Sources</h4>
                <div className="flex flex-wrap gap-2">
                  <TechBadge>Sentinel-2</TechBadge>
                  <TechBadge>xView2</TechBadge>
                  <TechBadge>NASA Earthdata</TechBadge>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black p-8 rounded-2xl border border-neutral-800 shadow-lg">
            <h3 className="text-2xl font-bold text-white mb-4">🔮 Future Scope</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-amber-500 mt-1">➜</span>
                <span>Integration with drones for low-altitude verification.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-500 mt-1">➜</span>
                <span>Real-time evacuation route planning algorithms.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-500 mt-1">➜</span>
                <span>Mobile app for field responders to upload ground-truth data.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-black text-neutral-500 py-12 text-center border-t border-neutral-900">
        <p className="mb-4 text-lg font-bold text-white tracking-wider">AVERRA</p>
        <p className="mb-8 max-w-md mx-auto">Helping governments, NGOs, and emergency responders minimize loss of life.</p>
        <p className="text-sm">© {new Date().getFullYear()} AVERRA Project. All rights reserved.</p>
      </footer>

    </div>
  );
};

// --- Sub Components ---

interface FeatureCardProps {
  icon: string;
  title: string;
  desc: string;
}

const FeatureCard = ({ icon, title, desc }: FeatureCardProps) => (
  <div className="bg-black p-6 rounded-xl border border-neutral-800 hover:border-amber-500/50 hover:shadow-[0_0_15px_rgba(245,158,11,0.1)] transition duration-300 group">
    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{icon}</div>
    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-500 transition-colors">{title}</h3>
    <p className="text-neutral-400 leading-relaxed">{desc}</p>
  </div>
);

interface StepProps {
  number: string;
  title: string;
  desc: string;
}

const Step = ({ number, title, desc }: StepProps) => (
  <div className="relative bg-black md:bg-transparent p-4 md:p-0 rounded-lg border md:border-none border-neutral-800">
    <div className="w-12 h-12 bg-amber-500 text-black font-extrabold text-xl rounded-full flex items-center justify-center mx-auto mb-4 relative z-10 shadow-[0_0_15px_rgba(245,158,11,0.5)]">
      {number}
    </div>
    <h4 className="font-bold text-white mb-1">{title}</h4>
    <p className="text-sm text-neutral-500">{desc}</p>
  </div>
);

interface TechBadgeProps {
  children: React.ReactNode;
}

const TechBadge = ({ children }: TechBadgeProps) => (
  <span className="px-3 py-1 bg-neutral-800 text-amber-100/80 text-sm rounded-md border border-neutral-700 hover:border-amber-500/30 transition">
    {children}
  </span>
);

export default Home;