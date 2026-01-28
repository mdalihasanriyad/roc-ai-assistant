import { useState, useCallback } from "react";
import { toast } from "sonner";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

export const useAIChat = () => {
  const [isLoading, setIsLoading] = useState(false);

  const streamChat = useCallback(
    async ({
      messages,
      onDelta,
      onDone,
      onError,
    }: {
      messages: ChatMessage[];
      onDelta: (deltaText: string) => void;
      onDone: () => void;
      onError: (error: string) => void;
    }) => {
      setIsLoading(true);

      try {
        const resp = await fetch(CHAT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages }),
        });

        if (!resp.ok) {
          const errorData = await resp.json().catch(() => ({}));
          const errorMessage = errorData.error || "Failed to connect to AI";
          
          if (resp.status === 429) {
            toast.error("Rate limit exceeded. Please wait a moment and try again.");
          } else if (resp.status === 402) {
            toast.error("AI credits exhausted. Please add more credits to continue.");
          } else {
            toast.error(errorMessage);
          }
          
          onError(errorMessage);
          setIsLoading(false);
          return;
        }

        if (!resp.body) {
          throw new Error("No response body");
        }

        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let textBuffer = "";
        let streamDone = false;

        while (!streamDone) {
          const { done, value } = await reader.read();
          if (done) break;
          
          textBuffer += decoder.decode(value, { stream: true });

          // Process line-by-line as data arrives
          let newlineIndex: number;
          while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
            let line = textBuffer.slice(0, newlineIndex);
            textBuffer = textBuffer.slice(newlineIndex + 1);

            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (line.startsWith(":") || line.trim() === "") continue;
            if (!line.startsWith("data: ")) continue;

            const jsonStr = line.slice(6).trim();
            if (jsonStr === "[DONE]") {
              streamDone = true;
              break;
            }

            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content as string | undefined;
              if (content) onDelta(content);
            } catch {
              // Incomplete JSON split across chunks - put it back and wait for more data
              textBuffer = line + "\n" + textBuffer;
              break;
            }
          }
        }

        // Final flush for any remaining buffered lines
        if (textBuffer.trim()) {
          for (let raw of textBuffer.split("\n")) {
            if (!raw) continue;
            if (raw.endsWith("\r")) raw = raw.slice(0, -1);
            if (raw.startsWith(":") || raw.trim() === "") continue;
            if (!raw.startsWith("data: ")) continue;
            const jsonStr = raw.slice(6).trim();
            if (jsonStr === "[DONE]") continue;
            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content as string | undefined;
              if (content) onDelta(content);
            } catch {
              /* ignore partial leftovers */
            }
          }
        }

        onDone();
      } catch (error) {
        console.error("Stream chat error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        toast.error("Failed to get AI response");
        onError(message);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { streamChat, isLoading };
};
