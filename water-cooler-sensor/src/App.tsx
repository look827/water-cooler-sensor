/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { MotionConfig, motion, useScroll, useSpring } from 'motion/react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CoolerSimulator } from './components/CoolerSimulator';
import { ProblemResolutionSection } from './components/ProblemResolutionSection';
import { CostBreakdownSection } from './components/CostBreakdownSection';
import { SlidesModal } from './components/SlidesModal';

export default function App() {
  const [slidesOpen, setSlidesOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 32,
    restDelta: 0.001,
  });

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#F6F7F2] text-[#0E2611]">
        {/* Subtle Scroll Progress Indicator */}
        <motion.div
          aria-hidden="true"
          className="fixed top-0 left-0 right-0 z-50 h-0.5 origin-left bg-[#C89D0A]"
          style={{ scaleX }}
        />

        <Navbar onOpenSlides={() => setSlidesOpen(true)} />

        <main>
          <HeroSection onOpenSlides={() => setSlidesOpen(true)} />
          <CoolerSimulator />
          <ProblemResolutionSection />
          <CostBreakdownSection />
        </main>

        <footer className="bg-[#09200B] py-10 text-[#C8D8BC]">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 sm:flex-row sm:items-center">
            <div>
              <p className="font-display text-lg font-semibold text-white">
                Water Cooler Sensor
              </p>
              <p className="mt-1 text-xs text-[#9AB38C]">
                Campus water-level telemetry, staff availability alerts, and clog detection · ₹16,000 commercial build
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs font-medium">
              <a href="#overview" className="hover:text-white transition-colors">
                Overview
              </a>
              <a href="#simulator" className="hover:text-white transition-colors">
                Simulator
              </a>
              <a href="#problems" className="hover:text-white transition-colors">
                Problem &amp; Fix
              </a>
              <a href="#cost" className="hover:text-white transition-colors">
                Cost Model
              </a>
              <button
                type="button"
                onClick={() => setSlidesOpen(true)}
                className="cursor-pointer hover:text-white transition-colors"
              >
                Original Slides
              </button>
            </div>
          </div>
        </footer>

        <SlidesModal isOpen={slidesOpen} onClose={() => setSlidesOpen(false)} />
      </div>
    </MotionConfig>
  );
}
