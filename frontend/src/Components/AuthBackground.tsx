import React from "react";
import { motion } from "framer-motion";

const AuthBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Large Circle */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Small Circle */}
      <motion.div
        className="absolute top-40 right-20 w-16 h-16 bg-[#00C6D7]/20 rounded-full blur-lg"
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Triangle */}
      <motion.div
        className="absolute bottom-32 left-1/4 w-0 h-0 border-l-[30px] border-r-[30px] border-b-[52px] border-l-transparent border-r-transparent border-b-white/15 blur-sm"
        animate={{
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Square */}
      <motion.div
        className="absolute bottom-20 right-1/3 w-20 h-20 bg-[#1976D2]/20 rotate-45 blur-lg"
        animate={{
          scale: [1, 1.3, 1],
          rotate: [45, 135, 45],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating Dots */}
      <motion.div
        className="absolute top-1/3 left-1/2 w-3 h-3 bg-white/30 rounded-full"
        animate={{
          y: [0, -30, 0],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute top-2/3 right-1/4 w-2 h-2 bg-[#00C6D7]/40 rounded-full"
        animate={{
          y: [0, 25, 0],
          x: [0, -15, 0],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Hexagon */}
      <motion.div
        className="absolute top-1/2 left-20 w-12 h-12 bg-gradient-to-r from-[#1976D2]/20 to-[#00C6D7]/20 blur-sm"
        style={{
          clipPath: 'polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)',
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default AuthBackground;