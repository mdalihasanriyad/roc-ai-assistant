import { motion } from "framer-motion";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-14 w-14",
};

const textSizes = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-3xl",
};

export const Logo = ({ size = "md", showText = true }: LogoProps) => {
  return (
    <div className="flex items-center gap-3">
      <motion.div
        className={`${sizeClasses[size]} relative flex items-center justify-center`}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/30 to-cyan-600/30 blur-lg" />
        
        {/* Main logo container */}
        <div className="relative flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-primary to-cyan-600 shadow-glow-sm">
          {/* Inner geometric shape */}
          <svg
            viewBox="0 0 24 24"
            className="h-2/3 w-2/3"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Stylized "R" with AI neural network vibe */}
            <path d="M4 20V4h8a4 4 0 0 1 0 8H4" className="stroke-background" />
            <path d="M12 12l8 8" className="stroke-background" />
            {/* Neural dots */}
            <circle cx="16" cy="8" r="1.5" className="fill-background stroke-none" />
            <circle cx="20" cy="20" r="1.5" className="fill-background stroke-none" />
          </svg>
        </div>
      </motion.div>
      
      {showText && (
        <span className={`${textSizes[size]} font-bold tracking-tight`}>
          <span className="text-foreground">Roc</span>
          <span className="gradient-text"> AI</span>
        </span>
      )}
    </div>
  );
};
