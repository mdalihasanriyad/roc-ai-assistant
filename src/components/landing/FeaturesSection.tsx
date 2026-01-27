import { motion } from "framer-motion";
import {
  MessageSquare,
  Image,
  FolderKanban,
  Brain,
  Palette,
  Sparkles,
  Layers,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "AI Chat & Reasoning",
    description:
      "Have intelligent conversations with ChatGPT. Get design suggestions, architectural advice, and creative solutions.",
  },
  {
    icon: Image,
    title: "Image Generation",
    description:
      "Generate stunning interior and exterior designs using Google Gemini. Visualize your ideas in seconds.",
  },
  {
    icon: FolderKanban,
    title: "Project Management",
    description:
      "Organize your design projects. Keep chat history, generated images, and notes all in one place.",
  },
  {
    icon: Brain,
    title: "Design Intelligence",
    description:
      "Upload floor plans and sketches. Get AI-powered layout suggestions and furniture placement ideas.",
  },
  {
    icon: Palette,
    title: "Style Customization",
    description:
      "Choose from modern, minimal, luxury, rustic, and more. Generate designs that match your vision.",
  },
  {
    icon: Sparkles,
    title: "AI Personality Modes",
    description:
      "Switch between Designer, Architect, Advisor, and more. Get tailored responses for your needs.",
  },
  {
    icon: Layers,
    title: "Multiple Variations",
    description:
      "Generate multiple design variations with different angles, colors, and styles for each request.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your projects and data are encrypted and secure. Use your own API keys for added privacy.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export const FeaturesSection = () => {
  return (
    <section id="features" className="relative py-24">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-30" />

      <div className="container relative z-10 px-4">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-primary"
          >
            Features
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl"
          >
            Everything You Need to{" "}
            <span className="gradient-text">Design Smarter</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-2xl text-muted-foreground"
          >
            Roc AI combines the power of multiple AI models to give you the
            ultimate design assistant experience.
          </motion.p>
        </div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="feature-card group"
            >
              <div className="feature-card-inner flex flex-col">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
