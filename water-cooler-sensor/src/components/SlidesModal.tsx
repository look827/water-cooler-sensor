import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { ORIGINAL_SLIDES } from '../data/projectData';

interface SlidesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SlidesModal: React.FC<SlidesModalProps> = ({ isOpen, onClose }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setActiveIndex((i) => (i + 1) % ORIGINAL_SLIDES.length);
      if (e.key === 'ArrowLeft')
        setActiveIndex((i) => (i - 1 + ORIGINAL_SLIDES.length) % ORIGINAL_SLIDES.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const currentSlide = ORIGINAL_SLIDES[activeIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="slides-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl overflow-hidden rounded-2xl border border-[#8FA876]/30 bg-[#0D2B10] text-[#F6F7F2] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#8FA876]/20 px-6 py-4">
              <div>
                <h3 id="slides-modal-title" className="font-display text-lg font-semibold text-white">
                  {currentSlide.title}
                </h3>
                <p className="text-xs text-[#B9CCB0]">{currentSlide.caption}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close slides modal"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-[#8FA876]/25 bg-[#09200B] text-[#F6F7F2] transition-colors hover:bg-[#194A1E] focus-visible:outline-2 focus-visible:outline-white"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="relative bg-[#071909] p-4 sm:p-6">
              {imgErrors[currentSlide.id] ? (
                <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-xl border border-[#8FA876]/20 bg-[#0D2B10] p-8 text-center">
                  <ImageIcon className="h-10 w-10 text-[#8FA876]" aria-hidden="true" />
                  <p className="text-sm font-semibold text-white">{currentSlide.title}</p>
                  <p className="max-w-md text-xs text-[#B9CCB0]">{currentSlide.caption}</p>
                </div>
              ) : (
                <img
                  src={currentSlide.src}
                  alt={currentSlide.alt}
                  referrerPolicy="no-referrer"
                  onError={() =>
                    setImgErrors((prev) => ({ ...prev, [currentSlide.id]: true }))
                  }
                  className="mx-auto max-h-[64vh] w-full rounded-xl object-contain"
                />
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#8FA876]/20 px-6 py-3.5">
              <div className="flex items-center gap-2">
                {ORIGINAL_SLIDES.map((slide, idx) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                      idx === activeIndex
                        ? 'bg-[#E5B82A] text-[#09200B]'
                        : 'bg-[#123716] text-[#C8D8BC] hover:bg-[#194A1E]'
                    }`}
                  >
                    Slide 0{idx + 1}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex((i) => (i - 1 + ORIGINAL_SLIDES.length) % ORIGINAL_SLIDES.length)
                  }
                  aria-label="Previous slide"
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-[#8FA876]/25 bg-[#09200B] text-[#F6F7F2] hover:bg-[#194A1E]"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveIndex((i) => (i + 1) % ORIGINAL_SLIDES.length)}
                  aria-label="Next slide"
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-[#8FA876]/25 bg-[#09200B] text-[#F6F7F2] hover:bg-[#194A1E]"
                >
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
