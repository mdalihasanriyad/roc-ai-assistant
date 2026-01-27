import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ChatSidebar } from "@/components/dashboard/ChatSidebar";
import { ChatInterface } from "@/components/dashboard/ChatInterface";
import { ImageGenerationPanel } from "@/components/dashboard/ImageGenerationPanel";

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
      title: "Living Room Design",
      messages: [],
      createdAt: new Date(),
    },
  ]);
  const [activeChatId, setActiveChatId] = useState("1");
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  const handleSendMessage = (content: string) => {
    if (!activeChat) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    // Add user message
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              messages: [...chat.messages, userMessage],
              title:
                chat.messages.length === 0
                  ? content.slice(0, 30) + "..."
                  : chat.title,
            }
          : chat
      )
    );

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I'd be happy to help you with "${content}". As your AI design assistant, I can provide suggestions for:

• **Interior layouts** and furniture placement
• **Color schemes** that complement your space
• **Style recommendations** based on your preferences
• **Space optimization** tips

What specific aspect would you like me to focus on? I can also generate visual concepts using the Image Generation tab.`,
        timestamp: new Date(),
      };

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChatId
            ? { ...chat, messages: [...chat.messages, aiMessage] }
            : chat
        )
      );
    }, 1500);
  };

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
