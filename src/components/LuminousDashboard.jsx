import { useState } from "react";
import { Zap, Droplets, RefreshCw, AlertTriangle, ArrowRight, ShieldCheck, Sun } from "lucide-react";

export default function LuminousDashboard() {
  const [telemetry, setTelemetry] = useState({
    energy: 14.8,
    water: 180,
    leakStatus: "No Leaks",
    peakDemand: "Normal",
    liveFlowRate: 2.4,
  });

  const [loading, setLoading] = useState(false);

  const simulateUpdate = () => {
    setLoading(true);
    setTimeout(() => {
      setTelemetry((prev) => ({
        ...prev,
        energy: parseFloat((12 + Math.random() * 5).toFixed(1)),
        water: Math.round(150 + Math.random() * 60),
        liveFlowRate: parseFloat((1.5 + Math.random() * 2).toFixed(1)),
      }));
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] font-sans p-6 md:p-12 selection:bg-[#00d166]/30">
      {/* Editorial Header */}
      <header className="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="font-display font-bold uppercase tracking-widest text-xs text-[#006d32] bg-[#00d166]/10 px-3 py-1 rounded-full">
            Live Intelligence
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight mt-3 text-[#0b1c30]">
            The Luminous Engine
          </h1>
          <p className="text-[#0b1c30]/60 max-w-md mt-2 text-sm md:text-base font-light">
             smart home resource telemetry with digital fluidity and high-contrast editorial hierarchy.
          </p>
        </div>

        <button
          onClick={simulateUpdate}
          disabled={loading}
          className="self-start md:self-auto inline-flex items-center gap-2 px-5 py-3 rounded-lg font-semibold text-sm transition-all duration-300 bg-[#006d32] text-white hover:bg-[#006d32]/95 hover:shadow-[0_0_20px_rgba(0,209,102,0.3)] disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh Pulse
        </button>
      </header>

      {/* Main Asymmetric Grid */}
      <main className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Layer 1: Energy & Water Main Telemetry (Asymmetric Layout: 60% / 40%) */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* 60% Width Energy Panel */}
          <div className="lg:w-[60%] bg-[#eff4ff] rounded-2xl p-8 shadow-[0_24px_40px_-10px_rgba(11,28,48,0.06)] relative overflow-hidden transition-all duration-300 hover:scale-[1.005]">
            {/* Signature Gradient Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#00d166]/15 to-transparent rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#00d166]/10 rounded-lg text-[#006d32]">
                  <Zap className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <h2 className="text-xs uppercase tracking-wider font-semibold text-[#006d32]/85">Power Stream</h2>
                  <p className="text-lg font-bold">Electricity Consumption</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-[#64ff92] text-[#00210b] rounded-full">
                Active Tracking
              </span>
            </div>

            <div className="my-6">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-7xl md:text-8xl font-black tracking-tight text-[#0b1c30]">
                  {telemetry.energy}
                </span>
                <span className="font-display text-2xl font-bold text-[#0b1c30]/50">kWh</span>
              </div>
              <p className="text-xs text-[#0b1c30]/40 uppercase tracking-widest mt-2">Daily Net Accumulated</p>
            </div>

            {/* Nested Card using Surface Levels */}
            <div className="mt-8 bg-[#ffffff] rounded-xl p-6 shadow-sm border border-[#bbcbb9]/10">
              <h3 className="text-xs uppercase tracking-wider font-bold text-[#0b1c30]/60 mb-4">Hourly Demand Peak</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sun className="w-5 h-5 text-[#006d32]" />
                  <span className="text-sm font-medium">Solar Array Production</span>
                </div>
                <span className="font-display font-bold text-lg text-[#006d32]">+4.2 kW</span>
              </div>
            </div>
          </div>

          {/* 40% Width Water Panel */}
          <div className="lg:w-[40%] bg-[#eff4ff] rounded-2xl p-8 shadow-[0_24px_40px_-10px_rgba(11,28,48,0.06)] relative overflow-hidden transition-all duration-300 hover:scale-[1.005]">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#0070ea]/10 to-transparent rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#0070ea]/10 rounded-lg text-[#0059bb]">
                  <Droplets className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <h2 className="text-xs uppercase tracking-wider font-semibold text-[#0059bb]/85">Water Stream</h2>
                  <p className="text-lg font-bold">Hydration Volume</p>
                </div>
              </div>
            </div>

            <div className="my-6">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-7xl font-black tracking-tight text-[#0b1c30]">
                  {telemetry.water}
                </span>
                <span className="font-display text-2xl font-bold text-[#0b1c30]/50">Gal</span>
              </div>
              <p className="text-xs text-[#0b1c30]/40 uppercase tracking-widest mt-2">Daily Total volume</p>
            </div>

            <div className="mt-8 bg-[#ffffff] rounded-xl p-5 border border-[#bbcbb9]/10">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#0b1c30]/60">Live Flow Rate</span>
                <span className="font-display font-bold text-[#0059bb]">{telemetry.liveFlowRate} GPM</span>
              </div>
              <div className="w-full bg-[#e5eeff] h-1.5 rounded-full mt-3 overflow-hidden">
                <div 
                  className="bg-[#0070ea] h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min((telemetry.liveFlowRate / 5) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

        </div>

        {/* Layer 2: Status & Automation Control (Asymmetric: 40% / 60%) */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* 40% Width Status / Health */}
          <div className="lg:w-[40%] bg-[#e5eeff] rounded-2xl p-8 relative overflow-hidden transition-all duration-300">
            <h2 className="text-xs uppercase tracking-wider font-bold text-[#0b1c30]/60 mb-6">Engine System Health</h2>
            
            <div className="flex flex-col gap-4">
              {/* Status Row 1 */}
              <div className="flex items-center justify-between p-4 bg-[#ffffff] rounded-xl border border-[#bbcbb9]/10">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#006d32]" />
                  <span className="text-sm font-medium">System Integrity</span>
                </div>
                <span className="text-xs uppercase font-bold tracking-wider text-[#006d32] bg-[#64ff92]/20 px-2.5 py-1 rounded">
                  Secure
                </span>
              </div>

              {/* Status Row 2 */}
              <div className="flex items-center justify-between p-4 bg-[#ffffff] rounded-xl border border-[#bbcbb9]/10">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-[#ba1a1a]" />
                  <span className="text-sm font-medium">Leak Sensors</span>
                </div>
                <span className="text-xs uppercase font-bold tracking-wider text-[#0b1c30] bg-[#eff4ff] px-2.5 py-1 rounded">
                  {telemetry.leakStatus}
                </span>
              </div>
            </div>
          </div>

          {/* 60% Width Fluid Action Container */}
          <div className="lg:w-[65%] bg-[#e5eeff] rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-300">
            <div>
              <h2 className="text-xs uppercase tracking-wider font-bold text-[#0b1c30]/60 mb-4">Luminous Automations</h2>
              <h3 className="font-display text-2xl font-bold max-w-md text-[#0b1c30] mb-4">
                Optimize and coordinate resource flows with customized threshold rules.
              </h3>
              <p className="text-sm text-[#0b1c30]/60 max-w-lg mb-8">
                Establish direct limits on water and power thresholds. If demand spikes above critical thresholds, smart routing adjusts immediately.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <a 
                href="#config" 
                className="inline-flex items-center gap-2 text-sm font-bold text-[#006d32] hover:text-[#00d166] transition-colors"
              >
                Configure Threshold Rules
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}





