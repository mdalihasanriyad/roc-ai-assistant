import { useState, useCallback, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ChatSidebar } from "@/components/dashboard/ChatSidebar";
import { ChatInterface } from "@/components/dashboard/ChatInterface";
import { ImageGenerationPanel } from "@/components/dashboard/ImageGenerationPanel";
import { useAIChat, ChatMessage } from "@/hooks/useAIChat";
import { useChatSessions } from "@/hooks/useChatSessions";
import { Loader2 } from "lucide-react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<"chat" | "image">("chat");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [streamingContent, setStreamingContent] = useState("");

  const {
    sessions,
    activeSession,
    activeSessionId,
    isLoading: sessionsLoading,
    setActiveSessionId,
    createSession,
    updateSessionTitle,
    deleteSession,
    addMessage,
    updateMessageContent,
  } = useChatSessions();

  const { streamChat, isLoading: chatLoading } = useAIChat();

  // Convert sessions to Chat format for sidebar
  const chats: Chat[] = sessions.map((s) => ({
    id: s.id,
    title: s.title,
    messages: s.messages.map((m) => ({
      id: m.id,
      role: m.role,
      content: m.id === streamingMessageId ? streamingContent : m.content,
      timestamp: new Date(m.created_at),
    })),
    createdAt: new Date(s.created_at),
  }));

  const activeChat = chats.find((c) => c.id === activeSessionId);

  // Auto-create first chat session if none exist
  useEffect(() => {
    if (!sessionsLoading && sessions.length === 0) {
      createSession("New Chat");
    }
  }, [sessionsLoading, sessions.length, createSession]);

  const handleNewChat = async () => {
    await createSession("New Chat");
  };

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!activeSession || chatLoading) return;

      // Create session if we don't have one
      let sessionId = activeSession.id;

      // Add user message to database
      const userMsgId = await addMessage(sessionId, "user", content);
      if (!userMsgId) return;

      // Update title if first message
      if (activeSession.messages.length === 0) {
        const title = content.slice(0, 30) + (content.length > 30 ? "..." : "");
        await updateSessionTitle(sessionId, title);
      }

      // Prepare messages for API
      const apiMessages: ChatMessage[] = [
        ...activeSession.messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        { role: "user" as const, content },
      ];

      // Create placeholder for assistant message
      const assistantMsgId = await addMessage(sessionId, "assistant", "");
      if (!assistantMsgId) return;

      setStreamingMessageId(assistantMsgId);
      setStreamingContent("");

      let fullContent = "";

      streamChat({
        messages: apiMessages,
        onDelta: (chunk) => {
          fullContent += chunk;
          setStreamingContent(fullContent);
          updateMessageContent(sessionId, assistantMsgId, fullContent);
        },
        onDone: () => {
          setStreamingMessageId(null);
          setStreamingContent("");
        },
        onError: (error) => {
          console.error("AI Error:", error);
          const errorContent = "I apologize, but I encountered an error. Please try again.";
          updateMessageContent(sessionId, assistantMsgId, errorContent);
          setStreamingMessageId(null);
          setStreamingContent("");
        },
      });
    },
    [activeSession, chatLoading, addMessage, updateSessionTitle, streamChat, updateMessageContent]
  );

  const handleDeleteChat = async (chatId: string) => {
    await deleteSession(chatId);
  };

  if (sessionsLoading) {
    return (
      <DashboardLayout
        activeTab={activeTab}
        onTabChange={setActiveTab}
        sidebarOpen={sidebarOpen}
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
      >
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      sidebarOpen={sidebarOpen}
      onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
    >
      <div className="flex h-full">
        {/* Chat Sidebar */}
        {sidebarOpen && activeTab === "chat" && (
          <ChatSidebar
            chats={chats}
            activeChatId={activeSessionId || ""}
            onSelectChat={setActiveSessionId}
            onNewChat={handleNewChat}
            onDeleteChat={handleDeleteChat}
          />
        )}

        {/* Main Content */}
        <div className="flex-1">
          {activeTab === "chat" ? (
            <ChatInterface
              messages={activeChat?.messages || []}
              onSendMessage={handleSendMessage}
              isStreaming={chatLoading}
            />
          ) : (
            <ImageGenerationPanel />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
