import { useState } from "react";
import { motion } from "framer-motion";
import {
  Wand2,
  Download,
  RefreshCw,
  Sparkles,
  ImageIcon,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useImageGeneration } from "@/hooks/useImageGeneration";

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

  const { isGenerating, generatedImages, description, generateImages, clearImages } = useImageGeneration();

  const handleGenerate = () => {
    generateImages({
      roomType,
      style,
      colorPalette: colorPalette || undefined,
      instructions: instructions || undefined,
    });
  };

  const handleDownload = async (imageUrl: string, index: number) => {
    try {
      // For base64 images
      if (imageUrl.startsWith("data:")) {
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = `roc-ai-design-${index + 1}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // For regular URLs
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `roc-ai-design-${index + 1}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Download failed:", error);
    }
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
                  Generate Design
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
        {isGenerating ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
              <RefreshCw className="h-10 w-10 text-primary animate-spin" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Generating Your Design</h3>
            <p className="max-w-sm text-muted-foreground">
              AI is creating a stunning {style} {roomType} visualization...
            </p>
          </div>
        ) : generatedImages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
              <ImageIcon className="h-10 w-10 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">No Images Yet</h3>
            <p className="max-w-sm text-muted-foreground">
              Fill in the options on the left and click "Generate Design" to
              create stunning interior visualizations.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Generated Design</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={clearImages}>
                  Clear
                </Button>
                <Button variant="outline" size="sm" onClick={handleGenerate} disabled={isGenerating}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Regenerate
                </Button>
              </div>
            </div>

            {description && (
              <div className="glass-card p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
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
                    alt={`Generated ${style} ${roomType} design ${index + 1}`}
                    className="aspect-[4/3] w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-end justify-end gap-2 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button size="sm" variant="secondary" onClick={() => handleDownload(image, index)}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                  <div className="absolute left-3 top-3">
                    <span className="rounded-full bg-background/80 px-2 py-1 text-xs font-medium backdrop-blur-sm">
                      {style} {roomType}
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
