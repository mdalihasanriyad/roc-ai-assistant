import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const IMAGE_GEN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-image`;

interface GenerationParams {
  roomType: string;
  style: string;
  colorPalette?: string;
  instructions?: string;
}

interface GenerationResult {
  images: string[];
  description?: string;
}

export const useImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [description, setDescription] = useState<string>("");

  const generateImages = async (params: GenerationParams): Promise<void> => {
    if (!params.roomType || !params.style) {
      toast({
        title: "Missing required fields",
        description: "Please select a room type and design style.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedImages([]);
    setDescription("");

    try {
      const response = await fetch(IMAGE_GEN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        if (response.status === 429) {
          toast({
            title: "Rate limit exceeded",
            description: "Please wait a moment before generating more images.",
            variant: "destructive",
          });
          return;
        }
        
        if (response.status === 402) {
          toast({
            title: "Credits exhausted",
            description: "AI credits have been exhausted. Please add more credits.",
            variant: "destructive",
          });
          return;
        }

        throw new Error(errorData.error || "Failed to generate image");
      }

      const data: GenerationResult = await response.json();

      if (data.images && data.images.length > 0) {
        setGeneratedImages(data.images);
        setDescription(data.description || "");
        toast({
          title: "Image generated!",
          description: "Your design visualization is ready.",
        });
      } else {
        throw new Error("No images returned from the API");
      }
    } catch (error) {
      console.error("Image generation error:", error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const clearImages = () => {
    setGeneratedImages([]);
    setDescription("");
  };

  return {
    isGenerating,
    generatedImages,
    description,
    generateImages,
    clearImages,
  };
};
