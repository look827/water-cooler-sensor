import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ArrowDownRight, Layers, Droplets, Cpu, Activity, Monitor } from 'lucide-react';
import { HARDWARE_HOTSPOTS, HardwareHotspot } from '../data/projectData';

interface HeroSectionProps {
  onOpenSlides: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenSlides }) => {
  const [activeHotspot, setActiveHotspot] = useState<HardwareHotspot>(HARDWARE_HOTSPOTS[0]);
  const stageRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), {
    stiffness: 180,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7, 7]), {
    stiffness: 180,
    damping: 22,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const getHotspotIcon = (id: HardwareHotspot['id']) => {
    switch (id) {
      case 'display':
        return <Monitor className="h-4 w-4" aria-hidden="true" />;
      case 'sensors':
        return <Droplets className="h-4 w-4" aria-hidden="true" />;
      case 'motherboard':
        return <Cpu className="h-4 w-4" aria-hidden="true" />;
      case 'valve':
        return <Activity className="h-4 w-4" aria-hidden="true" />;
    }
  };

  return (
    <section id="overview" className="relative overflow-hidden border-b border-[#0E2611]/10 bg-[#F6F7F2]">
      <div className="mx-auto max-w-7xl px-6 pt-12 pb-16 lg:pt-16 lg:pb-20">
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Editorial Pitch */}
          <div className="flex flex-col justify-between lg:col-span-6">
            <div>
              <p className="text-xs font-medium text-[#476249] tracking-wide">
                Campus Hydration Telemetry · Commercial Build ₹16,000
              </p>

              <h1
                className="mt-4 font-display font-semibold tracking-tight text-[#0E2611] [text-wrap:balance]"
                style={{ fontSize: 'clamp(2.35rem, 4.1vw, 3.75rem)', lineHeight: 1.06 }}
              >
                Know every drop, spot every clog before the tap runs dry.
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-[#2C442E] sm:text-lg">
                Heavy student usage drains campus water coolers without warning while sediment clogs go unnoticed. Our sensor retrofit pairs ultrasonic level tracking, inline flow monitoring, and an instant staff alert display into one ₹16,000 unit.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#simulator"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#0E3A13] px-5 py-3 text-sm font-semibold text-[#F6F7F2] whitespace-nowrap shrink-0 transition-transform duration-150 hover:bg-[#16511D] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E3A13]"
                >
                  <span>Launch Interactive Cooler</span>
                  <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
                </a>

                <button
                  type="button"
                  onClick={onOpenSlides}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#0E2611]/20 bg-white px-4 py-3 text-sm font-medium text-[#0E2611] whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-[#EDF1E6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E3A13]"
                >
                  <Layers className="h-4 w-4 text-[#476249]" aria-hidden="true" />
                  <span>View Original Slides</span>
                </button>
              </div>
            </div>

            {/* Active Hardware Hotspot Readout */}
            <motion.div
              key={activeHotspot.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 rounded-xl border border-[#0E2611]/12 bg-white p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5 text-sm font-semibold text-[#0E2611]">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EDF3E8] text-[#0E3A13]">
                    {getHotspotIcon(activeHotspot.id)}
                  </span>
                  <span>{activeHotspot.label}</span>
                </div>
                <span className="font-mono text-sm font-semibold tabular-nums text-[#8A6700]">
                  {activeHotspot.cost}
                </span>
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-[#354E37]">
                {activeHotspot.description}
              </p>
              <p className="mt-3 text-xs font-medium text-[#5A755C]">
                Select any numbered node on the cutaway diagram to inspect its role.
              </p>
            </motion.div>
          </div>

          {/* Right Interactive 3D-Tilt Hardware Cutaway */}
          <div
            ref={stageRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative flex min-h-[440px] items-center justify-center rounded-2xl bg-[#0D2E12] p-6 sm:p-8 lg:col-span-6"
            style={{ perspective: 1100 }}
          >
            {/* Subtle engineering coordinate grid */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-2xl opacity-15"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(220,235,210,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(220,235,210,0.2) 1px, transparent 1px)',
                backgroundSize: '36px 36px',
              }}
            />

            <motion.div
              style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
              className="relative w-full max-w-md rounded-xl border border-[#8FA876]/30 bg-[#123A18]/90 p-5 shadow-2xl"
            >
              <div className="mb-3 flex items-center justify-between text-xs text-[#C7D8BC]">
                <span>Cooler Retrofit Blueprint</span>
                <span className="font-mono tabular-nums text-[#E5B82A]">40L Stainless Reservoir</span>
              </div>

              {/* Interactive Cutaway Schematic */}
              <div className="relative mx-auto aspect-[4/3] w-full overflow-hidden rounded-lg border border-[#8FA876]/25 bg-[#09210D]">
                <svg
                  viewBox="0 0 400 300"
                  className="h-full w-full"
                  role="img"
                  aria-label="Interactive Water Cooler Sensor cutaway diagram"
                >
                  <defs>
                    <linearGradient id="heroTankWater" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.82" />
                      <stop offset="100%" stopColor="#0284C7" stopOpacity="0.95" />
                    </linearGradient>
                    <clipPath id="heroTankClip">
                      <rect x="92" y="88" width="146" height="156" rx="10" />
                    </clipPath>
                  </defs>

                  {/* Cooler Outer Chassis */}
                  <rect
                    x="74"
                    y="32"
                    width="252"
                    height="236"
                    rx="14"
                    fill="#153E1B"
                    stroke="#8FA876"
                    strokeOpacity="0.45"
                    strokeWidth="2"
                  />

                  {/* Top Display Bezel */}
                  <rect
                    x="150"
                    y="44"
                    width="100"
                    height="32"
                    rx="6"
                    fill="#081C0B"
                    stroke="#E5B82A"
                    strokeWidth="1.5"
                  />
                  <text
                    x="200"
                    y="64"
                    textAnchor="middle"
                    fill="#F6F7F2"
                    fontSize="12"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="600"
                  >
                    76% · 30.4L
                  </text>

                  {/* Inner Insulated Water Tank */}
                  <rect
                    x="92"
                    y="88"
                    width="146"
                    height="156"
                    rx="10"
                    fill="#0B2910"
                    stroke="#6F8C5A"
                    strokeWidth="1.5"
                  />

                  {/* Animated Water Volume inside Tank */}
                  <g clipPath="url(#heroTankClip)">
                    <motion.g
                      animate={{ x: [0, -40, 0] }}
                      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <path
                        d="M 52 132 Q 92 122 132 132 T 212 132 T 292 132 L 292 260 L 52 260 Z"
                        fill="url(#heroTankWater)"
                      />
                    </motion.g>
                    <motion.g
                      animate={{ x: [-30, 10, -30] }}
                      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                      opacity={0.45}
                    >
                      <path
                        d="M 52 136 Q 92 146 132 136 T 212 136 T 292 136 L 292 260 L 52 260 Z"
                        fill="#7DD3FC"
                      />
                    </motion.g>
                  </g>

                  {/* Ultrasonic Probe + Pulse */}
                  <rect x="132" y="88" width="22" height="10" rx="2" fill="#E5B82A" />
                  <motion.line
                    x1="143"
                    y1="98"
                    x2="143"
                    y2="128"
                    stroke="#7DD3FC"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  />

                  {/* Motherboard Bay on Right */}
                  <rect
                    x="254"
                    y="108"
                    width="54"
                    height="88"
                    rx="6"
                    fill="#0A230E"
                    stroke="#8FA876"
                    strokeOpacity="0.6"
                    strokeWidth="1.5"
                  />
                  <rect x="264" y="122" width="34" height="24" rx="3" fill="#2A582F" />
                  <circle cx="272" cy="162" r="4" fill="#E5B82A" />
                  <circle cx="288" cy="162" r="4" fill="#38BDF8" />
                  <path
                    d="M 254 152 H 238 M 254 128 H 238"
                    stroke="#8FA876"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />

                  {/* Outlet Manifold & Flow Sensor */}
                  <path
                    d="M 165 244 V 258 H 348"
                    fill="none"
                    stroke="#94A3B8"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  <rect x="195" y="248" width="30" height="20" rx="4" fill="#0284C7" stroke="#E0F2FE" strokeWidth="1.5" />
                  <motion.circle
                    cx="285"
                    cy="258"
                    r="2.5"
                    fill="#7DD3FC"
                    animate={{ cx: [230, 342], opacity: [0, 1, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
                  />
                </svg>

                {/* Interactive Clickable Hotspot Buttons */}
                {HARDWARE_HOTSPOTS.map((spot, idx) => {
                  const isActive = activeHotspot.id === spot.id;
                  return (
                    <button
                      key={spot.id}
                      type="button"
                      onClick={() => setActiveHotspot(spot)}
                      aria-label={`Inspect ${spot.label}`}
                      style={{ left: `${spot.xPercent}%`, top: `${spot.yPercent}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer flex h-8 w-8 items-center justify-center rounded-full font-mono text-xs font-semibold transition-transform duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                        isActive
                          ? 'scale-110 bg-[#E5B82A] text-[#0B220D] shadow-lg ring-4 ring-[#E5B82A]/30'
                          : 'bg-[#F6F7F2] text-[#0E2611] hover:scale-105'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Quick Component Switcher Tabs */}
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {HARDWARE_HOTSPOTS.map((spot, idx) => {
                  const isActive = activeHotspot.id === spot.id;
                  return (
                    <button
                      key={spot.id}
                      type="button"
                      onClick={() => setActiveHotspot(spot)}
                      className={`cursor-pointer truncate rounded-lg px-2.5 py-2 text-left text-xs font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E5B82A] ${
                        isActive
                          ? 'bg-[#E5B82A] text-[#0B220D] font-semibold'
                          : 'bg-[#194B20] text-[#D8E5D0] hover:bg-[#225E2A]'
                      }`}
                    >
                      {idx + 1}. {spot.label.split(' ')[0]}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Full-Width 4-Column Summary Strip Below Hero Split */}
        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-[#0E2611]/12 bg-[#0E2611]/12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white p-5">
            <p className="text-xs font-medium text-[#526D54]">Total Solution Cost</p>
            <p className="mt-1.5 font-mono text-2xl font-semibold tabular-nums text-[#0E2611]">
              ₹16,000
            </p>
            <p className="mt-1 text-xs text-[#3C563E]">Complete commercial unit ready for deployment</p>
          </div>
          <div className="bg-white p-5">
            <p className="text-xs font-medium text-[#526D54]">Component Price Range</p>
            <p className="mt-1.5 font-mono text-2xl font-semibold tabular-nums text-[#0E2611]">
              ₹2,000 – ₹6,000
            </p>
            <p className="mt-1 text-xs text-[#3C563E]">Modular parts across four core subsystems</p>
          </div>
          <div className="bg-white p-5">
            <p className="text-xs font-medium text-[#526D54]">Critical Faults Solved</p>
            <p className="mt-1.5 font-mono text-2xl font-semibold tabular-nums text-[#0E2611]">
              3 Core Issues
            </p>
            <p className="mt-1 text-xs text-[#3C563E]">Scarcity, staff blind spots, and pipe clogs</p>
          </div>
          <div className="bg-white p-5">
            <p className="text-xs font-medium text-[#526D54]">Telemetry Cadence</p>
            <p className="mt-1.5 font-mono text-2xl font-semibold tabular-nums text-[#0E2611]">
              Live Readout
            </p>
            <p className="mt-1 text-xs text-[#3C563E]">Instant level display for students and staff</p>
          </div>
        </div>
      </div>
    </section>
  );
};
