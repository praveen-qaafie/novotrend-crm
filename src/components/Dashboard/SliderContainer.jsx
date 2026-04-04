import React, { useState, useRef } from "react";

export default function SliderContainer({
  title,
  children,
  showSeeAll = true,
  onSeeAllClick = () => {},
  itemWidth = 200, // Default width for calculating scroll distance
  className = "",
}) {
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: -itemWidth * 2, behavior: "smooth" });
      setTimeout(checkScrollButtons, 300);
    }
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: itemWidth * 2, behavior: "smooth" });
      setTimeout(checkScrollButtons, 300);
    }
  };

  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScrollButtons();

      const handleScroll = () => checkScrollButtons();
      container.addEventListener("scroll", handleScroll);

      // Check on resize
      const handleResize = () => setTimeout(checkScrollButtons, 100);
      window.addEventListener("resize", handleResize);

      return () => {
        container.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [children]);

  return (
    <div className={`mb-8 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
        <div className="flex items-center gap-2">
          {/* Navigation Arrows */}
          <div className="flex items-center gap-1">
            <button
              onClick={scrollLeft}
              className={`p-2 rounded-full border transition-all ${
                showLeftArrow
                  ? "border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                  : "border-gray-200 text-gray-300 cursor-not-allowed"
              }`}
              disabled={!showLeftArrow}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={scrollRight}
              className={`p-2 rounded-full border transition-all ${
                showRightArrow
                  ? "border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                  : "border-gray-200 text-gray-300 cursor-not-allowed"
              }`}
              disabled={!showRightArrow}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Slider Content */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onScroll={checkScrollButtons}
        >
          {children}

          {/* See All Card */}
          {showSeeAll && (
            <div className="flex-shrink-0">
              <button
                onClick={onSeeAllClick}
                className="w-48 h-full min-h-[200px] bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-600 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-white border border-gray-300 flex items-center justify-center mb-3 group-hover:border-gray-400 transition-all">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
                <span className="font-medium">See all</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
