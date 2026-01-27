import { useState } from "react";
import { motion } from "framer-motion";
import {
  Wand2,
  Download,
  RefreshCw,
  Sparkles,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const roomTypes = [
  "Living Room",
  "Bedroom",
  "Kitchen",
  "Bathroom",
  "Office",
  "Dining Room",
  "Outdoor",
];

const styles = [
  "Modern",
  "Minimalist",
  "Luxury",
  "Rustic",
  "Industrial",
  "Scandinavian",
  "Contemporary",
  "Traditional",
];

const colorPalettes = [
  "Neutral",
  "Warm",
  "Cool",
  "Monochrome",
  "Bold & Vibrant",
  "Earthy",
  "Pastel",
];

export const ImageGenerationPanel = () => {
  const [roomType, setRoomType] = useState("");
  const [style, setStyle] = useState("");
  const [colorPalette, setColorPalette] = useState("");
  const [instructions, setInstructions] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  const handleGenerate = () => {
    if (!roomType || !style) return;

    setIsGenerating(true);

    // Simulate image generation
    setTimeout(() => {
      // Using placeholder images for demo
      setGeneratedImages([
        `https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&h=400&fit=crop`,
        `https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&h=400&fit=crop`,
        `https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&h=400&fit=crop`,
        `https://images.unsplash.com/photo-1616137466211-f939a420be84?w=600&h=400&fit=crop`,
      ]);
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="flex h-full">
      {/* Left Panel - Controls */}
      <div className="w-80 shrink-0 border-r border-border overflow-y-auto">
        <div className="p-6">
          <div className="mb-6 flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Image Generation</h2>
          </div>

          <div className="space-y-5">
            {/* Room Type */}
            <div className="space-y-2">
              <Label>Room Type *</Label>
              <Select value={roomType} onValueChange={setRoomType}>
                <SelectTrigger className="input-glow">
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  {roomTypes.map((type) => (
                    <SelectItem key={type} value={type.toLowerCase()}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Style */}
            <div className="space-y-2">
              <Label>Design Style *</Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger className="input-glow">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  {styles.map((s) => (
                    <SelectItem key={s} value={s.toLowerCase()}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Color Palette */}
            <div className="space-y-2">
              <Label>Color Palette</Label>
              <Select value={colorPalette} onValueChange={setColorPalette}>
                <SelectTrigger className="input-glow">
                  <SelectValue placeholder="Select colors" />
                </SelectTrigger>
                <SelectContent>
                  {colorPalettes.map((palette) => (
                    <SelectItem key={palette} value={palette.toLowerCase()}>
                      {palette}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Special Instructions */}
            <div className="space-y-2">
              <Label>Special Instructions</Label>
              <Textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Add any specific requirements, furniture preferences, or details..."
                className="min-h-24 input-glow"
              />
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={!roomType || !style || isGenerating}
              className="w-full btn-glow gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Designs
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Powered by Google Gemini
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Results */}
      <div className="flex-1 overflow-y-auto p-6">
        {generatedImages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
              <ImageIcon className="h-10 w-10 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">No Images Yet</h3>
            <p className="max-w-sm text-muted-foreground">
              Fill in the options on the left and click "Generate Designs" to
              create stunning interior visualizations.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Generated Designs</h3>
              <Button variant="outline" size="sm" onClick={handleGenerate}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {generatedImages.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-xl glass-card"
                >
                  <img
                    src={image}
                    alt={`Generated design ${index + 1}`}
                    className="aspect-[4/3] w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-end justify-end gap-2 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button size="sm" variant="secondary">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                  <div className="absolute left-3 top-3">
                    <span className="rounded-full bg-background/80 px-2 py-1 text-xs font-medium backdrop-blur-sm">
                      Variation {index + 1}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
