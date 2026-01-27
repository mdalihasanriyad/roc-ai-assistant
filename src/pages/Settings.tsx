import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Key,
  Palette,
  Bell,
  Shield,
  Trash2,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showOpenAIKey, setShowOpenAIKey] = useState(false);
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const { toast } = useToast();

  const [settings, setSettings] = useState({
    name: "John Doe",
    email: "john@example.com",
    openaiKey: "",
    geminiKey: "",
    defaultModel: "gpt-4",
    aiPersonality: "designer",
    notifications: true,
    emailUpdates: false,
  });

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handleClearHistory = () => {
    toast({
      title: "History cleared",
      description: "All your chat history has been deleted.",
    });
  };

  return (
    <DashboardLayout
      activeTab="chat"
      onTabChange={() => {}}
      sidebarOpen={sidebarOpen}
      onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
    >
      <div className="h-full overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="mb-2 text-2xl font-bold">Settings</h1>
            <p className="mb-8 text-muted-foreground">
              Manage your account settings and preferences.
            </p>

            {/* Profile Section */}
            <div className="glass-card mb-6 p-6">
              <div className="mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Profile</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={settings.name}
                    onChange={(e) =>
                      setSettings({ ...settings, name: e.target.value })
                    }
                    className="input-glow"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) =>
                      setSettings({ ...settings, email: e.target.value })
                    }
                    className="input-glow"
                  />
                </div>
              </div>
            </div>

            {/* API Keys Section */}
            <div className="glass-card mb-6 p-6">
              <div className="mb-4 flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">API Keys</h2>
              </div>
              <p className="mb-4 text-sm text-muted-foreground">
                Optionally use your own API keys for ChatGPT and Gemini. Leave
                blank to use our default keys.
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="openai">OpenAI API Key</Label>
                  <div className="relative">
                    <Input
                      id="openai"
                      type={showOpenAIKey ? "text" : "password"}
                      value={settings.openaiKey}
                      onChange={(e) =>
                        setSettings({ ...settings, openaiKey: e.target.value })
                      }
                      placeholder="sk-..."
                      className="pr-10 input-glow"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOpenAIKey(!showOpenAIKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showOpenAIKey ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gemini">Google Gemini API Key</Label>
                  <div className="relative">
                    <Input
                      id="gemini"
                      type={showGeminiKey ? "text" : "password"}
                      value={settings.geminiKey}
                      onChange={(e) =>
                        setSettings({ ...settings, geminiKey: e.target.value })
                      }
                      placeholder="AIza..."
                      className="pr-10 input-glow"
                    />
                    <button
                      type="button"
                      onClick={() => setShowGeminiKey(!showGeminiKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showGeminiKey ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Settings Section */}
            <div className="glass-card mb-6 p-6">
              <div className="mb-4 flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">AI Settings</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Default Model</Label>
                  <Select
                    value={settings.defaultModel}
                    onValueChange={(value) =>
                      setSettings({ ...settings, defaultModel: value })
                    }
                  >
                    <SelectTrigger className="input-glow">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4">GPT-4 (Recommended)</SelectItem>
                      <SelectItem value="gpt-3.5">GPT-3.5 Turbo</SelectItem>
                      <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>AI Personality</Label>
                  <Select
                    value={settings.aiPersonality}
                    onValueChange={(value) =>
                      setSettings({ ...settings, aiPersonality: value })
                    }
                  >
                    <SelectTrigger className="input-glow">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="designer">
                        Designer - Creative and visual
                      </SelectItem>
                      <SelectItem value="architect">
                        Architect - Technical and precise
                      </SelectItem>
                      <SelectItem value="advisor">
                        Advisor - Practical recommendations
                      </SelectItem>
                      <SelectItem value="teacher">
                        Teacher - Educational and detailed
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Notifications Section */}
            <div className="glass-card mb-6 p-6">
              <div className="mb-4 flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Notifications</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about your projects
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, notifications: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates and tips via email
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailUpdates}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, emailUpdates: checked })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="glass-card mb-6 border-destructive/30 p-6">
              <div className="mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-destructive" />
                <h2 className="text-lg font-semibold">Danger Zone</h2>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Clear Chat History</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete all your chat messages
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="border-destructive/50 text-destructive hover:bg-destructive/10"
                  onClick={handleClearHistory}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear History
                </Button>
              </div>
            </div>

            {/* Save Button */}
            <Button onClick={handleSave} className="w-full btn-glow gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
