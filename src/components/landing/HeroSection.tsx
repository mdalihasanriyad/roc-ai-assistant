import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Palette } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden pt-24">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt=""
          className="h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
      </div>

      {/* Gradient Mesh Overlay */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-60" />

      {/* Animated Glow Orbs */}
      <motion.div
        className="absolute left-1/4 top-1/3 h-96 w-96 rounded-full bg-primary/20 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute right-1/4 top-1/2 h-72 w-72 rounded-full bg-cyan-600/20 blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.2, 0.4],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="container relative z-10 flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center px-4">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="glass-card inline-flex items-center gap-2 px-4 py-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              Powered by GPT-4 & Gemini
            </span>
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 max-w-4xl text-center text-4xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl"
        >
          Your AI-Powered{" "}
          <span className="gradient-text">Design Intelligence</span>{" "}
          Platform
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-10 max-w-2xl text-center text-lg text-muted-foreground md:text-xl"
        >
          Chat, reason, and generate stunning interior and architectural designs 
          with the power of advanced AI. Transform your vision into reality.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col gap-4 sm:flex-row"
        >
          <Link to="/register">
            <Button size="lg" className="btn-glow group gap-2 px-8">
              Start Creating
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="outline" className="gap-2 px-8">
              View Demo
            </Button>
          </Link>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-4"
        >
          <div className="glass-card flex items-center gap-2 px-4 py-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm">AI Chat & Reasoning</span>
          </div>
          <div className="glass-card flex items-center gap-2 px-4 py-2">
            <Palette className="h-4 w-4 text-primary" />
            <span className="text-sm">Image Generation</span>
          </div>
          <div className="glass-card flex items-center gap-2 px-4 py-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm">Design Intelligence</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
