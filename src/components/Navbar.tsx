import React from 'react';

interface NavbarProps {
  onOpenSlides: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSlides }) => {
  return (
    <header className="sticky top-0 z-40 border-b border-[#0E2611]/10 bg-[#F6F7F2]/92 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-6 py-3.5">
        <a
          href="#overview"
          className="font-display text-lg font-semibold tracking-tight text-[#0E2611] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0E3A13]"
        >
          Water Cooler Sensor
        </a>

        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#2A422C]"
        >
          <a
            href="#overview"
            className="whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-[#0E2611] hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0E3A13]"
          >
            Overview
          </a>
          <a
            href="#simulator"
            className="whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-[#0E2611] hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0E3A13]"
          >
            Live Simulator
          </a>
          <a
            href="#problems"
            className="whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-[#0E2611] hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0E3A13]"
          >
            Problem &amp; Fix
          </a>
          <a
            href="#cost"
            className="whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-[#0E2611] hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0E3A13]"
          >
            Cost Model
          </a>
          <button
            type="button"
            onClick={onOpenSlides}
            className="cursor-pointer whitespace-nowrap shrink-0 text-left transition-colors duration-150 hover:text-[#0E2611] hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0E3A13]"
          >
            Original Slides
          </button>
        </nav>

        <div className="flex items-center shrink-0">
          <a
            href="#simulator"
            className="inline-flex items-center justify-center rounded-lg bg-[#0E3A13] px-4 py-2 text-xs font-semibold text-[#F6F7F2] whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-[#16511D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E3A13]"
          >
            Test Live Sensor
          </a>
        </div>
      </div>
    </header>
  );
};
