import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  HARDWARE_COMPONENTS,
  TOTAL_COMMERCIAL_COST,
  COMPONENT_COST_MIN,
  COMPONENT_COST_MAX,
} from '../data/projectData';

const formatINR = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

export const CostBreakdownSection: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);
  const [unitCount, setUnitCount] = useState<number>(1);
  const [bulkMode, setBulkMode] = useState<'standard' | 'bulk'>('standard');

  // Optional 10% bulk component fabrication discount for multi-unit campus deployments
  const discountFactor = bulkMode === 'bulk' && unitCount >= 5 ? 0.9 : 1;
  const activeComponent = HARDWARE_COMPONENTS[hoveredIndex] || HARDWARE_COMPONENTS[0];

  const perUnitTotal = Math.round(TOTAL_COMMERCIAL_COST * discountFactor);
  const fleetTotal = perUnitTotal * unitCount;

  // Chart geometry mirroring Slide 2 area graph (0 to 7000 scale across 4 items)
  const chartWidth = 520;
  const chartHeight = 250;
  const padLeft = 56;
  const padRight = 32;
  const padTop = 24;
  const padBottom = 40;
  const plotWidth = chartWidth - padLeft - padRight;
  const plotHeight = chartHeight - padTop - padBottom;
  const maxY = 7000;

  const points = HARDWARE_COMPONENTS.map((item, idx) => {
    const x = padLeft + (idx / (HARDWARE_COMPONENTS.length - 1)) * plotWidth;
    const adjustedCost = Math.round(item.cost * discountFactor);
    const y = padTop + plotHeight - (adjustedCost / maxY) * plotHeight;
    return {
      ...item,
      adjustedCost,
      x,
      y,
    };
  });

  const linePath = points
    .map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`)
    .join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padTop + plotHeight} L ${points[0].x} ${padTop + plotHeight} Z`;

  return (
    <section id="cost" className="border-b border-[#0E2611]/10 bg-[#F6F7F2] py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-[#476249]">
              Commercial Cost Model
            </p>
            <h2
              className="mt-2 font-display font-semibold tracking-tight text-[#0E2611] [text-wrap:balance]"
              style={{ fontSize: 'clamp(1.85rem, 3vw, 2.65rem)', lineHeight: 1.12 }}
            >
              Built commercially for {formatINR(TOTAL_COMMERCIAL_COST)} per cooler.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#354E37] sm:text-base">
              Component costs stay within the {formatINR(COMPONENT_COST_MIN)} – {formatINR(COMPONENT_COST_MAX)} range, keeping campus-wide retrofits practical without replacing existing cooler hardware.
            </p>
          </div>

          {/* Pricing Tier Selector */}
          <div
            role="group"
            aria-label="Deployment pricing tier"
            className="inline-flex items-center gap-1 rounded-xl border border-[#0E2611]/12 bg-[#EAEEDF] p-1"
          >
            <button
              type="button"
              onClick={() => setBulkMode('standard')}
              className={`cursor-pointer rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E3A13] ${
                bulkMode === 'standard'
                  ? 'bg-[#0E3A13] text-[#F6F7F2]'
                  : 'text-[#2D4730] hover:text-[#0E2611]'
              }`}
            >
              Standard Build (₹16,000)
            </button>
            <button
              type="button"
              onClick={() => {
                setBulkMode('bulk');
                if (unitCount < 5) setUnitCount(5);
              }}
              className={`cursor-pointer rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E3A13] ${
                bulkMode === 'bulk'
                  ? 'bg-[#0E3A13] text-[#F6F7F2]'
                  : 'text-[#2D4730] hover:text-[#0E2611]'
              }`}
            >
              Campus Rollout (5+ Units)
            </button>
          </div>
        </div>

        {/* Main 2-Column Interactive Chart + Cost Ledger */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
          {/* LEFT: Interactive Area Chart (Honoring Slide 2 Area Chart) */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#0E2611]/12 bg-[#0D2B10] p-6 text-[#F6F7F2] lg:col-span-6">
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-[#A9C295]">
                    Component Cost Curve (INR per Unit)
                  </p>
                  <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-white">
                    {activeComponent.name}: {formatINR(Math.round(activeComponent.cost * discountFactor))}
                  </p>
                </div>
                <span className="font-mono text-xs tabular-nums text-[#E5B82A]">
                  {Math.round((activeComponent.cost / TOTAL_COMMERCIAL_COST) * 100)}% of budget
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[#C7D8BC]">
                {activeComponent.specDetail}
              </p>
            </div>

            <div className="my-4 w-full">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full overflow-visible"
                role="img"
                aria-label="Interactive area chart of Water Cooler Sensor component costs"
              >
                <defs>
                  <linearGradient id="costAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D4A017" stopOpacity="0.68" />
                    <stop offset="100%" stopColor="#D4A017" stopOpacity="0.08" />
                  </linearGradient>
                </defs>

                {/* Horizontal Y-Axis Gridlines (0 to 7000 matching Slide 2) */}
                {[0, 1000, 2000, 3000, 4000, 5000, 6000, 7000].map((tick) => {
                  const y = padTop + plotHeight - (tick / maxY) * plotHeight;
                  return (
                    <g key={tick}>
                      <line
                        x1={padLeft}
                        y1={y}
                        x2={chartWidth - padRight}
                        y2={y}
                        stroke="#8FA876"
                        strokeOpacity={tick === 0 ? 0.45 : 0.16}
                        strokeWidth="1"
                      />
                      <text
                        x={padLeft - 10}
                        y={y + 4}
                        textAnchor="end"
                        fill="#A9C295"
                        fontSize="11"
                        fontFamily="JetBrains Mono, monospace"
                      >
                        {tick.toLocaleString('en-IN')}
                      </text>
                    </g>
                  );
                })}

                {/* Area Fill */}
                <motion.path
                  d={areaPath}
                  fill="url(#costAreaGrad)"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45 }}
                />

                {/* Top Stroke Line */}
                <motion.path
                  d={linePath}
                  fill="none"
                  stroke="#E5B82A"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                />

                {/* Interactive Data Nodes */}
                {points.map((pt, idx) => {
                  const isActive = idx === hoveredIndex;
                  return (
                    <g
                      key={pt.serial}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onClick={() => setHoveredIndex(idx)}
                    >
                      {/* Vertical guideline on active node */}
                      {isActive && (
                        <line
                          x1={pt.x}
                          y1={pt.y}
                          x2={pt.x}
                          y2={padTop + plotHeight}
                          stroke="#F6F7F2"
                          strokeOpacity="0.4"
                          strokeDasharray="3 3"
                        />
                      )}

                      {/* Hit target */}
                      <circle cx={pt.x} cy={pt.y} r="18" fill="transparent" />

                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isActive ? 7 : 5}
                        fill={isActive ? '#F6F7F2' : '#E5B82A'}
                        stroke="#09200B"
                        strokeWidth="2.5"
                      />

                      <text
                        x={pt.x}
                        y={pt.y - 12}
                        textAnchor="middle"
                        fill={isActive ? '#FFFFFF' : '#E5B82A'}
                        fontSize="11"
                        fontWeight="600"
                        fontFamily="JetBrains Mono, monospace"
                      >
                        ₹{pt.adjustedCost.toLocaleString('en-IN')}
                      </text>

                      <text
                        x={pt.x}
                        y={padTop + plotHeight + 22}
                        textAnchor="middle"
                        fill={isActive ? '#FFFFFF' : '#B9CCB0'}
                        fontSize="11.5"
                        fontWeight={isActive ? '600' : '400'}
                        fontFamily="Plus Jakarta Sans, sans-serif"
                      >
                        {pt.shortLabel}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#8FA876]/20 pt-4 text-xs text-[#C7D8BC]">
              <span>Hover or select any point on the curve to inspect module pricing.</span>
              <span className="font-mono tabular-nums text-[#E5B82A]">
                Range: {formatINR(Math.round(COMPONENT_COST_MIN * discountFactor))} –{' '}
                {formatINR(Math.round(COMPONENT_COST_MAX * discountFactor))}
              </span>
            </div>
          </div>

          {/* RIGHT: Interactive Cost Table + Campus Scale Estimator */}
          <div className="flex flex-col justify-between gap-6 lg:col-span-6">
            <div className="overflow-hidden rounded-2xl border border-[#0E2611]/12 bg-white">
              <div className="grid grid-cols-12 border-b border-[#0E2611]/10 bg-[#C89D0A] px-5 py-3.5 text-xs font-semibold text-[#0E2611]">
                <div className="col-span-2">S. No.</div>
                <div className="col-span-6">Component</div>
                <div className="col-span-4 text-right">Cost ({unitCount} {unitCount === 1 ? 'Unit' : 'Units'})</div>
              </div>

              <div className="divide-y divide-[#0E2611]/10">
                {HARDWARE_COMPONENTS.map((item, idx) => {
                  const isHighlighted = idx === hoveredIndex;
                  const unitPrice = Math.round(item.cost * discountFactor);
                  const lineTotal = unitPrice * unitCount;
                  return (
                    <button
                      key={item.serial}
                      type="button"
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onClick={() => setHoveredIndex(idx)}
                      className={`grid w-full cursor-pointer grid-cols-12 items-center px-5 py-4 text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#0E3A13] ${
                        isHighlighted ? 'bg-[#FDF8E4]' : 'bg-white hover:bg-[#FAFBF7]'
                      }`}
                    >
                      <div className="col-span-2 font-mono text-xs font-semibold tabular-nums text-[#476249]">
                        0{item.serial}
                      </div>
                      <div className="col-span-6 pr-3">
                        <p className="text-sm font-semibold text-[#0E2611]">{item.name}</p>
                        <p className="mt-0.5 text-xs text-[#476249]">{item.role}</p>
                      </div>
                      <div className="col-span-4 text-right">
                        <p className="font-mono text-sm font-semibold tabular-nums text-[#0E2611]">
                          {formatINR(lineTotal)}
                        </p>
                        {unitCount > 1 && (
                          <p className="font-mono text-[11px] tabular-nums text-[#5A755C]">
                            {formatINR(unitPrice)} each
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Total Row */}
              <div className="grid grid-cols-12 items-center border-t border-[#0E2611]/15 bg-[#0E3A13] px-5 py-4 text-[#F6F7F2]">
                <div className="col-span-8">
                  <p className="text-xs font-medium text-[#B9CCB0]">
                    Total Implementation Cost
                    {bulkMode === 'bulk' && unitCount >= 5 ? ' (10% Multi-Unit Fabrications)' : ''}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-white">
                    Ready-to-deploy across {unitCount} {unitCount === 1 ? 'water cooler' : 'water coolers'}
                  </p>
                </div>
                <div className="col-span-4 text-right">
                  <p className="font-mono text-xl font-semibold tabular-nums text-[#E5B82A]">
                    {formatINR(fleetTotal)}
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Unit Count Slider */}
            <div className="rounded-2xl border border-[#0E2611]/12 bg-white p-5">
              <div className="flex items-center justify-between gap-4">
                <label htmlFor="cooler-units-slider" className="text-sm font-semibold text-[#0E2611]">
                  Campus Rollout Scale Estimator
                </label>
                <span className="font-mono text-sm font-semibold tabular-nums text-[#0E3A13]">
                  {unitCount} {unitCount === 1 ? 'Cooler' : 'Coolers'}
                </span>
              </div>
              <input
                id="cooler-units-slider"
                type="range"
                min={1}
                max={20}
                step={1}
                value={unitCount}
                onChange={(e) => setUnitCount(Number(e.target.value))}
                className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#E4E9DA] accent-[#0E3A13]"
              />
              <div className="mt-1.5 flex justify-between font-mono text-[11px] text-[#526D54]">
                <span>1 Unit (Pilot)</span>
                <span>5 Units (Floor Wing)</span>
                <span>10 Units</span>
                <span>20 Units (Full Campus)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
