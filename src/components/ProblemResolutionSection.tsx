import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { PROBLEMS_AND_RESOLUTIONS } from '../data/projectData';

type ViewMode = 'compare' | 'problem' | 'resolution';

export const ProblemResolutionSection: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>(PROBLEMS_AND_RESOLUTIONS[0].id);
  const [viewMode, setViewMode] = useState<ViewMode>('compare');

  const activeItem =
    PROBLEMS_AND_RESOLUTIONS.find((item) => item.id === selectedId) || PROBLEMS_AND_RESOLUTIONS[0];

  return (
    <section id="problems" className="border-b border-[#0E2611]/10 bg-[#F6F7F2] py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-[#476249]">
              Problem &amp; Resolution Matrix
            </p>
            <h2
              className="mt-2 font-display font-semibold tracking-tight text-[#0E2611] [text-wrap:balance]"
              style={{ fontSize: 'clamp(1.85rem, 3vw, 2.65rem)', lineHeight: 1.12 }}
            >
              Three everyday campus water failures, solved at the tap.
            </h2>
          </div>

          {/* Interactive View Filter Tabs */}
          <div
            role="group"
            aria-label="Comparison view filter"
            className="inline-flex items-center gap-1 rounded-xl border border-[#0E2611]/12 bg-[#EAEEDF] p-1"
          >
            {(
              [
                { id: 'compare', label: 'Side-by-Side' },
                { id: 'problem', label: 'Problem State' },
                { id: 'resolution', label: 'Sensor Fix' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setViewMode(tab.id)}
                className={`cursor-pointer rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E3A13] ${
                  viewMode === tab.id
                    ? 'bg-[#0E3A13] text-[#F6F7F2] shadow-sm'
                    : 'text-[#2D4730] hover:text-[#0E2611]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Problem-Resolution Matrix Rows */}
        <div className="mt-10 overflow-hidden rounded-2xl border border-[#0E2611]/12 bg-white">
          <div className="hidden md:grid md:grid-cols-12 border-b border-[#0E2611]/10 bg-[#EEF2E6] px-6 py-3.5 text-xs font-semibold text-[#334D35]">
            <div className="md:col-span-1">Index</div>
            {(viewMode === 'compare' || viewMode === 'problem') && (
              <div className={viewMode === 'compare' ? 'md:col-span-5' : 'md:col-span-11'}>
                Problem
              </div>
            )}
            {(viewMode === 'compare' || viewMode === 'resolution') && (
              <div className={viewMode === 'compare' ? 'md:col-span-6' : 'md:col-span-11'}>
                Resolution
              </div>
            )}
          </div>

          <div className="divide-y divide-[#0E2611]/10">
            {PROBLEMS_AND_RESOLUTIONS.map((row) => {
              const isSelected = row.id === selectedId;
              return (
                <button
                  key={row.id}
                  type="button"
                  onClick={() => setSelectedId(row.id)}
                  className={`grid w-full cursor-pointer grid-cols-1 gap-4 px-6 py-6 text-left transition-colors duration-150 md:grid-cols-12 md:items-center focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#0E3A13] ${
                    isSelected ? 'bg-[#F3F7EC]' : 'bg-white hover:bg-[#F9FBF6]'
                  }`}
                >
                  <div className="md:col-span-1">
                    <span
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg font-mono text-xs font-semibold tabular-nums ${
                        isSelected
                          ? 'bg-[#0E3A13] text-[#F6F7F2]'
                          : 'bg-[#EEF2E6] text-[#334D35]'
                      }`}
                    >
                      {row.index}
                    </span>
                  </div>

                  {(viewMode === 'compare' || viewMode === 'problem') && (
                    <div className={viewMode === 'compare' ? 'md:col-span-5' : 'md:col-span-11'}>
                      <div className="flex items-start gap-2.5">
                        <AlertCircle
                          className="mt-0.5 h-4 w-4 shrink-0 text-[#B45309]"
                          aria-hidden="true"
                        />
                        <div>
                          <p className="text-sm font-semibold text-[#0E2611]">
                            {row.problemTitle}
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-[#476249]">
                            {row.problemSummary}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {(viewMode === 'compare' || viewMode === 'resolution') && (
                    <div className={viewMode === 'compare' ? 'md:col-span-6' : 'md:col-span-11'}>
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2
                          className="mt-0.5 h-4 w-4 shrink-0 text-[#15803D]"
                          aria-hidden="true"
                        />
                        <div>
                          <p className="text-sm font-semibold text-[#0E2611]">
                            {row.resolutionTitle}
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-[#354E37]">
                            {row.resolutionSummary}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Row Interactive Inspection Drawer */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeItem.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 grid grid-cols-1 gap-6 rounded-2xl border border-[#0E2611]/12 bg-[#0D2B10] p-6 text-[#F6F7F2] lg:grid-cols-12 lg:items-center lg:p-8"
          >
            <div className="lg:col-span-5">
              <p className="font-mono text-xs font-medium text-[#E5B82A]">
                Selected Case {activeItem.index} · {activeItem.sensorModule}
              </p>
              <h3 className="mt-2 font-display text-xl font-semibold text-white">
                {activeItem.resolutionTitle}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#C7D8BC]">
                {activeItem.resolutionSummary}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-5">
              <div className="rounded-xl border border-[#8FA876]/25 bg-[#09200B] p-4">
                <p className="text-xs font-medium text-[#FBBF24]">Before Sensor</p>
                <p className="mt-1.5 text-sm font-medium text-white">
                  {activeItem.metricBefore}
                </p>
              </div>
              <div className="rounded-xl border border-[#8FA876]/25 bg-[#123A16] p-4">
                <p className="text-xs font-medium text-[#7DD3FC]">With Water Cooler Sensor</p>
                <p className="mt-1.5 text-sm font-medium text-white">
                  {activeItem.metricAfter}
                </p>
              </div>
            </div>

            <div className="flex lg:col-span-2 lg:justify-end">
              <a
                href="#simulator"
                className="inline-flex items-center gap-2 rounded-lg bg-[#E5B82A] px-4 py-2.5 text-xs font-semibold text-[#09200B] whitespace-nowrap transition-colors duration-150 hover:bg-[#F2C94C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span>Test in Sandbox</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
