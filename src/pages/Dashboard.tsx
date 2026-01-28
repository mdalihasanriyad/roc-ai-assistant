import { useState, useCallback } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ChatSidebar } from "@/components/dashboard/ChatSidebar";
import { ChatInterface } from "@/components/dashboard/ChatInterface";
import { ImageGenerationPanel } from "@/components/dashboard/ImageGenerationPanel";
import { useAIChat, ChatMessage } from "@/hooks/useAIChat";

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
  const [chats, setChats] = useState<Chat[]>([
    {
      id: "1",
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
    },
  ]);
  const [activeChatId, setActiveChatId] = useState("1");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { streamChat, isLoading } = useAIChat();

  const activeChat = chats.find((c) => c.id === activeChatId);

  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
    };
    setChats([newChat, ...chats]);
    setActiveChatId(newChat.id);
  };

  const handleSendMessage = useCallback(
    (content: string) => {
      if (!activeChat || isLoading) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content,
        timestamp: new Date(),
      };

      // Add user message and update title if first message
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChatId
            ? {
                ...chat,
                messages: [...chat.messages, userMessage],
                title:
                  chat.messages.length === 0
                    ? content.slice(0, 30) + (content.length > 30 ? "..." : "")
                    : chat.title,
              }
            : chat
        )
      );

      // Prepare messages for API (convert to ChatMessage format)
      const apiMessages: ChatMessage[] = [
        ...(activeChat.messages.map((m) => ({
          role: m.role,
          content: m.content,
        })) as ChatMessage[]),
        { role: "user" as const, content },
      ];

      let assistantContent = "";
      const assistantId = (Date.now() + 1).toString();

      streamChat({
        messages: apiMessages,
        onDelta: (chunk) => {
          assistantContent += chunk;

          setChats((prev) =>
            prev.map((chat) => {
              if (chat.id !== activeChatId) return chat;

              const existingAssistantIndex = chat.messages.findIndex(
                (m) => m.id === assistantId
              );

              if (existingAssistantIndex >= 0) {
                // Update existing assistant message
                const newMessages = [...chat.messages];
                newMessages[existingAssistantIndex] = {
                  ...newMessages[existingAssistantIndex],
                  content: assistantContent,
                };
                return { ...chat, messages: newMessages };
              } else {
                // Create new assistant message
                return {
                  ...chat,
                  messages: [
                    ...chat.messages,
                    {
                      id: assistantId,
                      role: "assistant" as const,
                      content: assistantContent,
                      timestamp: new Date(),
                    },
                  ],
                };
              }
            })
          );
        },
        onDone: () => {
          // Streaming complete
        },
        onError: (error) => {
          console.error("AI Error:", error);
          // Add error message
          setChats((prev) =>
            prev.map((chat) => {
              if (chat.id !== activeChatId) return chat;
              
              const hasAssistantMsg = chat.messages.some(m => m.id === assistantId);
              if (hasAssistantMsg) return chat;
              
              return {
                ...chat,
                messages: [
                  ...chat.messages,
                  {
                    id: assistantId,
                    role: "assistant" as const,
                    content: "I apologize, but I encountered an error. Please try again.",
                    timestamp: new Date(),
                  },
                ],
              };
            })
          );
        },
      });
    },
    [activeChat, activeChatId, streamChat, isLoading]
  );

  const handleDeleteChat = (chatId: string) => {
    setChats((prev) => prev.filter((c) => c.id !== chatId));
    if (activeChatId === chatId && chats.length > 1) {
      setActiveChatId(chats[0].id === chatId ? chats[1].id : chats[0].id);
    }
  };

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
            activeChatId={activeChatId}
            onSelectChat={setActiveChatId}
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
              isStreaming={isLoading}
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
