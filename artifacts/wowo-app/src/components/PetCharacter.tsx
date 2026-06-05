import { motion } from "framer-motion";

interface PetCharacterProps {
  mood?: "idle" | "happy" | "sad";
  className?: string;
}

export function PetCharacter({ mood = "idle", className }: PetCharacterProps) {
  const isHappy = mood === "happy";
  const isSad = mood === "sad";

  return (
    <motion.div
      className={`relative w-48 h-48 mx-auto ${className}`}
      animate={
        isHappy
          ? { y: [0, -15, 0], scale: [1, 1.05, 1] }
          : isSad
          ? { y: [0, 5, 0], scale: [1, 0.95, 1] }
          : { y: [0, -5, 0] }
      }
      transition={{
        duration: isHappy || isSad ? 0.5 : 2,
        repeat: isHappy || isSad ? 2 : Infinity,
        ease: "easeInOut",
      }}
    >
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
        {/* Body */}
        <path
          d="M40 100C40 66.8629 66.8629 40 100 40C133.137 40 160 66.8629 160 100C160 133.137 133.137 160 100 160C66.8629 160 40 133.137 40 100Z"
          fill="currentColor"
          className="text-white"
        />
        {/* Ears */}
        <path
          d="M45 65C35 45 45 25 55 35C65 45 75 55 65 65C55 75 45 65 45 65Z"
          fill="currentColor"
          className="text-primary"
        />
        <path
          d="M155 65C165 45 155 25 145 35C135 45 125 55 135 65C145 75 155 65 155 65Z"
          fill="currentColor"
          className="text-primary"
        />
        
        {/* Eyes */}
        {isHappy ? (
          <>
            <path d="M70 85C80 75 90 85 90 85" stroke="#4A3B32" strokeWidth="4" strokeLinecap="round" />
            <path d="M110 85C120 75 130 85 130 85" stroke="#4A3B32" strokeWidth="4" strokeLinecap="round" />
          </>
        ) : isSad ? (
          <>
            <path d="M70 85C80 95 90 85 90 85" stroke="#4A3B32" strokeWidth="4" strokeLinecap="round" />
            <path d="M110 85C120 95 130 85 130 85" stroke="#4A3B32" strokeWidth="4" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="80" cy="85" r="8" fill="#4A3B32" />
            <circle cx="120" cy="85" r="8" fill="#4A3B32" />
          </>
        )}
        
        {/* Blush */}
        <circle cx="65" cy="105" r="10" fill="#FFB5A7" opacity="0.6" />
        <circle cx="135" cy="105" r="10" fill="#FFB5A7" opacity="0.6" />
        
        {/* Nose/Mouth */}
        <path
          d="M100 100L95 105C95 105 97.5 110 100 110C102.5 110 105 105 105 105L100 100Z"
          fill="#4A3B32"
        />
        {isSad ? (
          <path d="M95 115C95 115 100 112 105 115" stroke="#4A3B32" strokeWidth="3" strokeLinecap="round" />
        ) : (
          <path d="M90 110C90 110 95 118 100 115C105 118 110 110 110 110" stroke="#4A3B32" strokeWidth="3" strokeLinecap="round" />
        )}
      </svg>
    </motion.div>
  );
}
