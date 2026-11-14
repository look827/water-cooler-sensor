import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Droplets,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  Wrench,
  CupSoda,
  Waves,
  BellRing,
} from 'lucide-react';

const TANK_CAPACITY_LITERS = 40;

type PresetKey = 'normal' | 'rush' | 'low' | 'clog';

export const CoolerSimulator: React.FC = () => {
  const [waterLevelPct, setWaterLevelPct] = useState<number>(74);
  const [usageRateLph, setUsageRateLph] = useState<number>(18);
  const [alertThresholdPct, setAlertThresholdPct] = useState<number>(25);
  const [isClogged, setIsClogged] = useState<boolean>(false);
  const [isDispensing, setIsDispensing] = useState<'glass' | 'bottle' | null>(null);
  const [isRefilling, setIsRefilling] = useState<boolean>(false);
  const [staffDispatched, setStaffDispatched] = useState<boolean>(false);
  const [activePreset, setActivePreset] = useState<PresetKey>('normal');
  const [totalDispensedLiters, setTotalDispensedLiters] = useState<number>(12.5);

  // Passive student traffic simulation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setWaterLevelPct((prev) => {
        if (isRefilling) {
          const next = Math.min(100, prev + 3.5);
          if (next >= 100) {
            setIsRefilling(false);
            setStaffDispatched(false);
          }
          return next;
        }
        if (isClogged) {
          // Flow is heavily restricted when clogged
          return Math.max(0, prev - 0.08);
        }
        // Drain proportional to student usage rate (L/hr scaled for interactive feedback)
        const drainPerTick = (usageRateLph / 40) * 0.65;
        return Math.max(0, Number((prev - drainPerTick).toFixed(2)));
      });
    }, 600);

    return () => clearInterval(interval);
  }, [usageRateLph, isClogged, isRefilling]);

  const currentLiters = (waterLevelPct / 100) * TANK_CAPACITY_LITERS;
  const isLowWater = waterLevelPct <= alertThresholdPct;
  const flowRateLpm = isClogged
    ? 0.2
    : waterLevelPct <= 1
      ? 0.0
      : isDispensing
        ? 2.8
        : Number((1.4 + (usageRateLph / 60) * 1.1).toFixed(1));

  const statusState = isClogged
    ? {
        key: 'clog',
        label: 'Clog Detected',
        detail: 'Outlet flow dropped below 0.3 L/min. Blockage sensor triggered.',
        badgeClass: 'bg-[#991B1B] text-white',
      }
    : waterLevelPct <= 2
      ? {
          key: 'empty',
          label: 'Tank Depleted',
          detail: 'Reservoir empty. Refill intake required immediately.',
          badgeClass: 'bg-[#991B1B] text-white',
        }
      : isLowWater
        ? {
            key: 'low',
            label: 'Low Reserve',
            detail: `Water dropped below ${alertThresholdPct}% staff alert threshold.`,
            badgeClass: 'bg-[#B45309] text-white',
          }
        : {
            key: 'nominal',
            label: 'Nominal Flow',
            detail: 'Water availability and outlet pressure are within target bounds.',
            badgeClass: 'bg-[#166534] text-white',
          };

  const handleDispense = useCallback(
    (type: 'glass' | 'bottle') => {
      if (waterLevelPct <= 0.5) return;
      const volumeLiters = type === 'glass' ? 0.25 : 1.0;
      const actualDropLiters = isClogged ? volumeLiters * 0.25 : volumeLiters;
      const pctDrop = (actualDropLiters / TANK_CAPACITY_LITERS) * 100;

      setIsDispensing(type);
      setWaterLevelPct((prev) => Math.max(0, Number((prev - pctDrop).toFixed(1))));
      setTotalDispensedLiters((prev) => Number((prev + actualDropLiters).toFixed(2)));

      setTimeout(() => {
        setIsDispensing(null);
      }, 650);
    },
    [isClogged, waterLevelPct]
  );

  const handleApplyPreset = (preset: PresetKey) => {
    setActivePreset(preset);
    setStaffDispatched(false);
    setIsRefilling(false);
    if (preset === 'normal') {
      setWaterLevelPct(74);
      setUsageRateLph(18);
      setAlertThresholdPct(25);
      setIsClogged(false);
    } else if (preset === 'rush') {
      setWaterLevelPct(48);
      setUsageRateLph(52);
      setAlertThresholdPct(25);
      setIsClogged(false);
    } else if (preset === 'low') {
      setWaterLevelPct(18);
      setUsageRateLph(24);
      setAlertThresholdPct(25);
      setIsClogged(false);
    } else if (preset === 'clog') {
      setWaterLevelPct(62);
      setUsageRateLph(20);
      setAlertThresholdPct(25);
      setIsClogged(true);
    }
  };

  const handleDispatchStaff = () => {
    setStaffDispatched(true);
    setTimeout(() => {
      setIsClogged(false);
      if (waterLevelPct < 80) {
        setIsRefilling(true);
      }
      setActivePreset('normal');
    }, 900);
  };

  // Water tank SVG Y coordinates: empty y=268, full y=88 (height 180)
  const clampedPct = Math.max(0, Math.min(100, waterLevelPct));
  const surfaceY = 268 - (clampedPct / 100) * 176;

  return (
    <section id="simulator" className="border-b border-[#0E2611]/10 bg-[#0D2B10] py-16 lg:py-24 text-[#F6F7F2]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-[#A9C295]">
              Interactive Hardware Sandbox
            </p>
            <h2
              className="mt-2 font-display font-semibold tracking-tight text-white [text-wrap:balance]"
              style={{ fontSize: 'clamp(1.85rem, 3vw, 2.65rem)', lineHeight: 1.12 }}
            >
              Simulate usage spikes, low reserves, and pipe clogs live.
            </h2>
          </div>

          {/* Preset Scenario Selector */}
          <div
            role="group"
            aria-label="Simulation presets"
            className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-[#8FA876]/25 bg-[#09200B] p-1.5"
          >
            {(
              [
                { id: 'normal', label: 'Normal Flow' },
                { id: 'rush', label: 'Peak Rush' },
                { id: 'low', label: 'Low Tank Alert' },
                { id: 'clog', label: 'Simulate Clog' },
              ] as const
            ).map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyPreset(preset.id)}
                className={`cursor-pointer rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E5B82A] ${
                  activePreset === preset.id
                    ? 'bg-[#E5B82A] text-[#09200B]'
                    : 'text-[#C8D8BC] hover:bg-[#143D18] hover:text-white'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Two-Zone Sandbox Layout (60% Interactive Stage / 40% Control Deck) */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
          {/* LEFT STAGE: Interactive Cooler Cutaway */}
          <div className="relative flex flex-col justify-between rounded-2xl border border-[#8FA876]/25 bg-[#09200B] p-6 sm:p-8 lg:col-span-7">
            {/* Top Embedded Display Readout (Represents ₹6,000 Display Module) */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#8FA876]/25 bg-[#0E2F12] px-5 py-4">
              <div>
                <p className="text-xs font-medium text-[#A9C295]">
                  Cooler Display Unit (₹6,000 Module)
                </p>
                <div className="mt-1 flex items-baseline gap-3">
                  <span className="font-mono text-3xl font-semibold tabular-nums text-white">
                    {Math.round(clampedPct)}%
                  </span>
                  <span className="font-mono text-sm tabular-nums text-[#7DD3FC]">
                    {currentLiters.toFixed(1)} / {TANK_CAPACITY_LITERS}.0 L
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-start sm:items-end gap-1.5">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${statusState.badgeClass}`}
                >
                  {statusState.key === 'nominal' ? (
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : (
                    <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  <span>{statusState.label}</span>
                </span>
                <span className="font-mono text-xs tabular-nums text-[#C8D8BC]">
                  Outlet Flow: {flowRateLpm.toFixed(1)} L/min
                </span>
              </div>
            </div>

            {/* Interactive SVG Tank & Tap Mechanism */}
            <div className="relative my-6 flex items-center justify-center">
              <svg
                viewBox="0 0 560 330"
                className="w-full max-w-[540px]"
                role="img"
                aria-label={`Water cooler tank simulation at ${Math.round(clampedPct)} percent capacity`}
              >
                <defs>
                  <linearGradient id="simWaterFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.88" />
                    <stop offset="100%" stopColor="#0369A1" stopOpacity="0.96" />
                  </linearGradient>
                  <clipPath id="simTankClip">
                    <rect x="86" y="88" width="210" height="182" rx="12" />
                  </clipPath>
                </defs>

                {/* Intake Pipe from Main Supply */}
                <path
                  d="M 32 54 H 146 V 88"
                  fill="none"
                  stroke="#64748B"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                {isRefilling && (
                  <motion.path
                    d="M 146 88 V 265"
                    stroke="#7DD3FC"
                    strokeWidth="6"
                    strokeDasharray="8 6"
                    animate={{ strokeDashoffset: [28, 0] }}
                    transition={{ duration: 0.45, repeat: Infinity, ease: 'linear' }}
                  />
                )}

                {/* Cooler Insulated Tank Body */}
                <rect
                  x="72"
                  y="74"
                  width="238"
                  height="210"
                  rx="18"
                  fill="#123917"
                  stroke="#8FA876"
                  strokeOpacity="0.45"
                  strokeWidth="2"
                />
                <rect
                  x="86"
                  y="88"
                  width="210"
                  height="182"
                  rx="12"
                  fill="#061708"
                  stroke="#4E6D44"
                  strokeWidth="1.5"
                />

                {/* Graduated Volume Markings */}
                {[
                  { pct: 100, y: 98, label: '40L' },
                  { pct: 75, y: 141, label: '30L' },
                  { pct: 50, y: 184, label: '20L' },
                  { pct: 25, y: 227, label: '10L' },
                ].map((mark) => (
                  <g key={mark.label}>
                    <line
                      x1="88"
                      y1={mark.y}
                      x2="104"
                      y2={mark.y}
                      stroke="#8FA876"
                      strokeOpacity="0.55"
                      strokeWidth="1.5"
                    />
                    <text
                      x="64"
                      y={mark.y + 4}
                      textAnchor="end"
                      fill="#A9C295"
                      fontSize="11"
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {mark.label}
                    </text>
                  </g>
                ))}

                {/* Alert Threshold Line inside Tank */}
                <line
                  x1="88"
                  y1={268 - (alertThresholdPct / 100) * 176}
                  x2="294"
                  y2={268 - (alertThresholdPct / 100) * 176}
                  stroke="#E5B82A"
                  strokeWidth="1.5"
                  strokeDasharray="5 4"
                />
                <text
                  x="290"
                  y={268 - (alertThresholdPct / 100) * 176 - 5}
                  textAnchor="end"
                  fill="#E5B82A"
                  fontSize="10"
                  fontFamily="JetBrains Mono, monospace"
                >
                  ALERT {alertThresholdPct}%
                </text>

                {/* Animated Water Volume */}
                <g clipPath="url(#simTankClip)">
                  <motion.g
                    animate={{ y: surfaceY - 120 }}
                    transition={{ type: 'spring', stiffness: 90, damping: 18 }}
                  >
                    <motion.path
                      d="M 40 120 Q 95 110 150 120 T 260 120 T 370 120 L 370 360 L 40 360 Z"
                      fill="url(#simWaterFill)"
                      animate={{ x: [0, -45, 0] }}
                      transition={{
                        duration: isDispensing || isRefilling ? 1.8 : 4.2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                    <motion.path
                      d="M 40 124 Q 95 134 150 124 T 260 124 T 370 124 L 370 360 L 40 360 Z"
                      fill="#7DD3FC"
                      opacity={0.35}
                      animate={{ x: [-35, 15, -35] }}
                      transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  </motion.g>
                </g>

                {/* Ultrasonic Level Sensor at Top of Tank */}
                <rect
                  x="176"
                  y="74"
                  width="32"
                  height="16"
                  rx="3"
                  fill="#E5B82A"
                />
                <motion.line
                  x1="192"
                  y1="90"
                  x2="192"
                  y2={Math.max(94, surfaceY)}
                  stroke="#E5B82A"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  animate={{ opacity: [0.35, 0.95, 0.35] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Motherboard Controller Box */}
                <rect
                  x="332"
                  y="94"
                  width="88"
                  height="108"
                  rx="10"
                  fill="#103114"
                  stroke="#8FA876"
                  strokeOpacity="0.5"
                  strokeWidth="1.5"
                />
                <text
                  x="376"
                  y="116"
                  textAnchor="middle"
                  fill="#C8D8BC"
                  fontSize="10"
                  fontFamily="Plus Jakarta Sans, sans-serif"
                  fontWeight="600"
                >
                  MOTHERBOARD
                </text>
                <rect x="348" y="128" width="56" height="32" rx="4" fill="#1C4E22" />
                <text
                  x="376"
                  y="148"
                  textAnchor="middle"
                  fill="#F6F7F2"
                  fontSize="10"
                  fontFamily="JetBrains Mono, monospace"
                >
                  ₹5,000
                </text>
                <circle
                  cx="358"
                  cy="180"
                  r="5"
                  fill={isClogged || isLowWater ? '#EF4444' : '#22C55E'}
                />
                <text
                  x="370"
                  y="184"
                  fill="#C8D8BC"
                  fontSize="10"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {isClogged ? 'FAULT' : isLowWater ? 'ALERT' : 'OK'}
                </text>

                {/* Sensor Wiring Harness */}
                <path
                  d="M 208 82 H 376 V 94"
                  fill="none"
                  stroke="#E5B82A"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
                <path
                  d="M 376 202 V 248 H 355"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />

                {/* Outlet Pipe & Flow/Clog Sensor */}
                <path
                  d="M 296 248 H 458 V 264"
                  fill="none"
                  stroke="#64748B"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Flow Sensor Collar */}
                <rect
                  x="325"
                  y="236"
                  width="44"
                  height="24"
                  rx="5"
                  fill={isClogged ? '#991B1B' : '#0284C7'}
                  stroke="#F6F7F2"
                  strokeWidth="1.5"
                />
                <text
                  x="347"
                  y="251"
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="9"
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="600"
                >
                  FLOW
                </text>

                {/* Visual Clog Blockage Inside Pipe */}
                {isClogged && (
                  <g>
                    <circle cx="402" cy="248" r="7" fill="#D97706" />
                    <circle cx="410" cy="245" r="5" fill="#B45309" />
                    <circle cx="408" cy="252" r="5.5" fill="#F59E0B" />
                    <text
                      x="408"
                      y="228"
                      textAnchor="middle"
                      fill="#FBBF24"
                      fontSize="11"
                      fontFamily="JetBrains Mono, monospace"
                      fontWeight="600"
                    >
                      CLOG
                    </text>
                  </g>
                )}

                {/* Pouring Stream when Dispensing */}
                <AnimatePresence>
                  {isDispensing && waterLevelPct > 0.5 && (
                    <motion.line
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      x1="458"
                      y1="270"
                      x2="458"
                      y2="306"
                      stroke={isClogged ? '#F59E0B' : '#38BDF8'}
                      strokeWidth={isClogged ? 2 : 6}
                      strokeDasharray={isClogged ? '4 5' : 'none'}
                      strokeLinecap="round"
                    />
                  )}
                </AnimatePresence>

                {/* Student Cup / Bottle Receiver */}
                <path
                  d="M 438 286 L 444 316 H 472 L 478 286 Z"
                  fill={isDispensing ? '#38BDF8' : '#143D18'}
                  fillOpacity={isDispensing ? 0.65 : 0.9}
                  stroke="#C8D8BC"
                  strokeWidth="2"
                />
                <text
                  x="458"
                  y="328"
                  textAnchor="middle"
                  fill="#A9C295"
                  fontSize="10"
                  fontFamily="Plus Jakarta Sans, sans-serif"
                >
                  Student Tap
                </text>
              </svg>
            </div>

            {/* Bottom Diagnostic Strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#8FA876]/20 pt-4 text-xs text-[#C8D8BC]">
              <span>{statusState.detail}</span>
              <span className="font-mono tabular-nums text-[#E5B82A]">
                Session Dispensed: {totalDispensedLiters.toFixed(2)} L
              </span>
            </div>
          </div>

          {/* RIGHT DECK: Interactive Controls & Staff Alert Feed */}
          <div className="flex flex-col justify-between gap-6 rounded-2xl border border-[#8FA876]/25 bg-[#123716] p-6 lg:col-span-5">
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-semibold text-white">
                  Direct Cooler Controls
                </h3>
                <p className="mt-1 text-xs text-[#B9CCB0]">
                  Trigger student pours, inject a pipe clog, or refill the tank to observe sensor reactions.
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleDispense('glass')}
                    disabled={waterLevelPct <= 0.5}
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#0284C7] px-3.5 py-2.5 text-xs font-semibold text-white transition-colors duration-150 hover:bg-[#0369A1] disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <CupSoda className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="whitespace-nowrap">Dispense 250ml</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDispense('bottle')}
                    disabled={waterLevelPct <= 0.5}
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#0E7490] px-3.5 py-2.5 text-xs font-semibold text-white transition-colors duration-150 hover:bg-[#155E75] disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <Droplets className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="whitespace-nowrap">Fill Bottle (1L)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsClogged((prev) => !prev);
                      setStaffDispatched(false);
                    }}
                    className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-3.5 py-2.5 text-xs font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E5B82A] ${
                      isClogged
                        ? 'border-[#F59E0B] bg-[#B45309] text-white hover:bg-[#92400E]'
                        : 'border-[#8FA876]/35 bg-[#0A250D] text-[#E5EFE0] hover:bg-[#194A1E]'
                    }`}
                  >
                    <Wrench className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="whitespace-nowrap">
                      {isClogged ? 'Clear Pipe Clog' : 'Simulate Pipe Clog'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsRefilling(true);
                      setStaffDispatched(false);
                    }}
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#8FA876]/35 bg-[#0A250D] px-3.5 py-2.5 text-xs font-semibold text-[#E5EFE0] transition-colors duration-150 hover:bg-[#194A1E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E5B82A]"
                  >
                    <Waves className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="whitespace-nowrap">
                      {isRefilling ? 'Refilling...' : 'Refill Main Tank'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Labeled Parameter Sliders */}
              <div className="space-y-4 border-t border-[#8FA876]/20 pt-5">
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <label htmlFor="usage-slider" className="font-medium text-[#E5EFE0]">
                      Student Demand Rate
                    </label>
                    <span className="font-mono font-semibold tabular-nums text-[#E5B82A]">
                      {usageRateLph} L/hr
                    </span>
                  </div>
                  <input
                    id="usage-slider"
                    type="range"
                    min={0}
                    max={60}
                    step={2}
                    value={usageRateLph}
                    onChange={(e) => setUsageRateLph(Number(e.target.value))}
                    className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#081C0A] accent-[#E5B82A]"
                  />
                  <div className="mt-1 flex justify-between font-mono text-[11px] text-[#8FA876]">
                    <span>0 L/hr (Idle)</span>
                    <span>30 L/hr</span>
                    <span>60 L/hr (Break Rush)</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs">
                    <label htmlFor="threshold-slider" className="font-medium text-[#E5EFE0]">
                      Staff Alert Threshold
                    </label>
                    <span className="font-mono font-semibold tabular-nums text-[#7DD3FC]">
                      {alertThresholdPct}% ({((alertThresholdPct / 100) * TANK_CAPACITY_LITERS).toFixed(0)} L)
                    </span>
                  </div>
                  <input
                    id="threshold-slider"
                    type="range"
                    min={10}
                    max={50}
                    step={5}
                    value={alertThresholdPct}
                    onChange={(e) => setAlertThresholdPct(Number(e.target.value))}
                    className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#081C0A] accent-[#38BDF8]"
                  />
                  <div className="mt-1 flex justify-between font-mono text-[11px] text-[#8FA876]">
                    <span>10%</span>
                    <span>30%</span>
                    <span>50%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Staff Notification & Resolution Console */}
            <div className="rounded-xl border border-[#8FA876]/25 bg-[#09200B] p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <BellRing className="h-4 w-4 text-[#E5B82A]" aria-hidden="true" />
                  <span>Facility Staff Dispatch</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('normal')}
                  className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-[#A9C295] hover:text-white focus-visible:outline-2 focus-visible:outline-[#E5B82A]"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Reset</span>
                </button>
              </div>

              <AnimatePresence mode="wait">
                {isClogged || isLowWater ? (
                  <motion.div
                    key="alert-active"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="mt-3 space-y-3"
                  >
                    <p className="text-xs leading-relaxed text-[#FDE68A]">
                      {isClogged
                        ? 'Alert dispatched to campus staff: Clog or blockage detected at cooler outlet.'
                        : `Alert dispatched to campus staff: Tank at ${Math.round(clampedPct)}%, below ${alertThresholdPct}% threshold.`}
                    </p>
                    <button
                      type="button"
                      onClick={handleDispatchStaff}
                      disabled={staffDispatched}
                      className="w-full cursor-pointer rounded-lg bg-[#E5B82A] px-4 py-2.5 text-xs font-semibold text-[#09200B] transition-colors duration-150 hover:bg-[#F2C94C] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      {staffDispatched
                        ? 'Staff En Route — Clearing Fault...'
                        : 'Acknowledge & Dispatch Staff'}
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="alert-clear"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="mt-2.5 text-xs leading-relaxed text-[#A9C295]"
                  >
                    No maintenance action required. Staff receive instant notification automatically if capacity drops below {alertThresholdPct}% or outlet flow clogs.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
