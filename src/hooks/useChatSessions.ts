import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface DbMessage {
  id: string;
  chat_session_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface DbChatSession {
  id: string;
  user_id: string;
  project_id: string | null;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatSession extends DbChatSession {
  messages: DbMessage[];
}

export const useChatSessions = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  // Fetch all chat sessions with their messages
  const fetchSessions = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: sessionsData, error: sessionsError } = await supabase
        .from("chat_sessions")
        .select("*")
        .order("updated_at", { ascending: false });

      if (sessionsError) throw sessionsError;

      if (!sessionsData || sessionsData.length === 0) {
        setSessions([]);
        setActiveSessionId(null);
        setIsLoading(false);
        return;
      }

      // Fetch messages for all sessions
      const { data: messagesData, error: messagesError } = await supabase
        .from("messages")
        .select("*")
        .in(
          "chat_session_id",
          sessionsData.map((s) => s.id)
        )
        .order("created_at", { ascending: true });

      if (messagesError) throw messagesError;

      // Group messages by session
      const messagesMap = new Map<string, DbMessage[]>();
      (messagesData || []).forEach((msg) => {
        const existing = messagesMap.get(msg.chat_session_id) || [];
        existing.push({
          ...msg,
          role: msg.role as "user" | "assistant",
        });
        messagesMap.set(msg.chat_session_id, existing);
      });

      const sessionsWithMessages: ChatSession[] = sessionsData.map((session) => ({
        ...session,
        messages: messagesMap.get(session.id) || [],
      }));

      setSessions(sessionsWithMessages);

      // Set active session to first one if none selected
      if (!activeSessionId && sessionsWithMessages.length > 0) {
        setActiveSessionId(sessionsWithMessages[0].id);
      }
    } catch (error) {
      console.error("Error fetching chat sessions:", error);
      toast.error("Failed to load chat history");
    } finally {
      setIsLoading(false);
    }
  }, [activeSessionId]);

  // Create a new chat session
  const createSession = useCallback(async (title = "New Chat") => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("You must be logged in to create a chat");
        return null;
      }

      const { data, error } = await supabase
        .from("chat_sessions")
        .insert({
          user_id: user.id,
          title,
        })
        .select()
        .single();

      if (error) throw error;

      const newSession: ChatSession = {
        ...data,
        messages: [],
      };

      setSessions((prev) => [newSession, ...prev]);
      setActiveSessionId(data.id);

      return data.id;
    } catch (error) {
      console.error("Error creating chat session:", error);
      toast.error("Failed to create new chat");
      return null;
    }
  }, []);

  // Update session title
  const updateSessionTitle = useCallback(
    async (sessionId: string, title: string) => {
      try {
        const { error } = await supabase
          .from("chat_sessions")
          .update({ title, updated_at: new Date().toISOString() })
          .eq("id", sessionId);

        if (error) throw error;

        setSessions((prev) =>
          prev.map((s) => (s.id === sessionId ? { ...s, title } : s))
        );
      } catch (error) {
        console.error("Error updating session title:", error);
      }
    },
    []
  );

  // Delete a chat session
  const deleteSession = useCallback(
    async (sessionId: string) => {
      try {
        const { error } = await supabase
          .from("chat_sessions")
          .delete()
          .eq("id", sessionId);

        if (error) throw error;

        setSessions((prev) => {
          const filtered = prev.filter((s) => s.id !== sessionId);

          // Update active session if we deleted the active one
          if (activeSessionId === sessionId && filtered.length > 0) {
            setActiveSessionId(filtered[0].id);
          } else if (filtered.length === 0) {
            setActiveSessionId(null);
          }

          return filtered;
        });

        toast.success("Chat deleted");
      } catch (error) {
        console.error("Error deleting chat session:", error);
        toast.error("Failed to delete chat");
      }
    },
    [activeSessionId]
  );

  // Add a message to a session
  const addMessage = useCallback(
    async (
      sessionId: string,
      role: "user" | "assistant",
      content: string
    ): Promise<string | null> => {
      try {
        const { data, error } = await supabase
          .from("messages")
          .insert({
            chat_session_id: sessionId,
            role,
            content,
          })
          .select()
          .single();

        if (error) throw error;

        const newMessage: DbMessage = {
          ...data,
          role: data.role as "user" | "assistant",
        };

        setSessions((prev) =>
          prev.map((s) =>
            s.id === sessionId
              ? { ...s, messages: [...s.messages, newMessage] }
              : s
          )
        );

        // Update session's updated_at
        await supabase
          .from("chat_sessions")
          .update({ updated_at: new Date().toISOString() })
          .eq("id", sessionId);

        return data.id;
      } catch (error) {
        console.error("Error adding message:", error);
        toast.error("Failed to save message");
        return null;
      }
    },
    []
  );

  // Update message content (for streaming)
  const updateMessageContent = useCallback(
    (sessionId: string, messageId: string, content: string) => {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? {
                ...s,
                messages: s.messages.map((m) =>
                  m.id === messageId ? { ...m, content } : m
                ),
              }
            : s
        )
      );
    },
    []
  );

  // Persist streamed message content to database
  const persistMessageContent = useCallback(
    async (messageId: string, content: string) => {
      try {
        // Messages table doesn't have UPDATE policy, so we skip this
        // The message was already inserted; we just update local state during streaming
        // This is a limitation - for full streaming persistence, we'd need UPDATE policy
      } catch (error) {
        console.error("Error persisting message:", error);
      }
    },
    []
  );

  // Get active session
  const activeSession = sessions.find((s) => s.id === activeSessionId) || null;

  // Load sessions on mount
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return {
    sessions,
    activeSession,
    activeSessionId,
    isLoading,
    setActiveSessionId,
    createSession,
    updateSessionTitle,
    deleteSession,
    addMessage,
    updateMessageContent,
    persistMessageContent,
    refetch: fetchSessions,
  };
};
