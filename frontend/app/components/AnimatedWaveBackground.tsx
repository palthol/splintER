import React, { useState, useEffect, useCallback } from "react";

const AnimatedWaveBackground: React.FC = () => {
  // State to capture mouse movement and scroll
  const [offset, setOffset] = useState({ mouseX: 0, mouseY: 0, scrollY: 0 });

  // Update offset on mouse move for subtle parallax effect
  const handleMouseMove = useCallback((e: MouseEvent) => {
    // Calculate offsets relative to the center of the window
    const mouseX = (e.clientX - window.innerWidth / 2) / 30;
    const mouseY = (e.clientY - window.innerHeight / 2) / 30;
    setOffset((prev) => ({ ...prev, mouseX, mouseY }));
  }, []);

  // Update offset on scroll
  const handleScroll = useCallback(() => {
    setOffset((prev) => ({ ...prev, scrollY: window.scrollY }));
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleMouseMove, handleScroll]);

  // Compute inline transforms for each wave layer with different multipliers for the parallax effect
  const layer1Style = {
    transform: `translate(${offset.mouseX * 1}px, ${
      offset.mouseY * 1 + offset.scrollY * 0.05
    }px)`,
  };
  const layer2Style = {
    transform: `translate(${offset.mouseX * 1.5}px, ${
      offset.mouseY * 1.5 + offset.scrollY * 0.1
    }px)`,
  };
  const layer3Style = {
    transform: `translate(${offset.mouseX * 2}px, ${
      offset.mouseY * 2 + offset.scrollY * 0.15
    }px)`,
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* CSS keyframes for horizontal wave animations */}
      <style>{`
        @keyframes waveAnimation1 {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        @keyframes waveAnimation2 {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes waveAnimation3 {
          0% { transform: translateX(0); }
          100% { transform: translateX(-150%); }
        }
      `}</style>

      {/* Wave layer 1 */}
      <div
        style={layer1Style}
        className="absolute inset-0 animate-[waveAnimation1_20s_linear_infinite] opacity-70"
      >
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-full">
          <path fill="#5865F2" d="M0,160L1440,96L1440,320L0,320Z" />
        </svg>
      </div>

      {/* Wave layer 2 */}
      <div
        style={layer2Style}
        className="absolute inset-0 animate-[waveAnimation2_30s_linear_infinite] opacity-50"
      >
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-full">
          <path fill="#2C2F33" d="M0,224L1440,256L1440,320L0,320Z" />
        </svg>
      </div>

      {/* Wave layer 3 */}
      <div
        style={layer3Style}
        className="absolute inset-0 animate-[waveAnimation3_25s_linear_infinite] opacity-30"
      >
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-full">
          <path fill="#23272A" d="M0,96L1440,160L1440,320L0,320Z" />
        </svg>
      </div>
    </div>
  );
};

export default AnimatedWaveBackground;