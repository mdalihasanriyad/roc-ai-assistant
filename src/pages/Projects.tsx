import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Plus,
  FolderKanban,
  MoreVertical,
  Pencil,
  Trash2,
  Calendar,
  MessageSquare,
  Image,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Project {
  id: string;
  name: string;
  description: string;
  chatCount: number;
  imageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const initialProjects: Project[] = [
  {
    id: "1",
    name: "Modern Apartment Redesign",
    description: "Complete interior redesign for a 2-bedroom apartment in downtown.",
    chatCount: 12,
    imageCount: 8,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "2",
    name: "Office Space Planning",
    description: "Open-plan office layout with meeting rooms and collaborative spaces.",
    chatCount: 8,
    imageCount: 5,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    id: "3",
    name: "Kitchen Renovation",
    description: "Modern kitchen design with island and smart storage solutions.",
    chatCount: 5,
    imageCount: 12,
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-16"),
  },
];

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "" });

  const handleCreateProject = () => {
    if (!newProject.name) return;

    const project: Project = {
      id: Date.now().toString(),
      name: newProject.name,
      description: newProject.description,
      chatCount: 0,
      imageCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setProjects([project, ...projects]);
    setNewProject({ name: "", description: "" });
    setIsDialogOpen(false);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  return (
    <DashboardLayout
      activeTab="chat"
      onTabChange={() => {}}
      sidebarOpen={sidebarOpen}
      onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
    >
      <div className="h-full overflow-y-auto p-6">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Projects</h1>
              <p className="text-muted-foreground">
                Manage your design projects and keep everything organized.
              </p>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 btn-glow">
                  <Plus className="h-4 w-4" />
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                  <DialogDescription>
                    Start a new design project to organize your chats and generated images.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Project Name</Label>
                    <Input
                      id="name"
                      value={newProject.name}
                      onChange={(e) =>
                        setNewProject({ ...newProject, name: e.target.value })
                      }
                      placeholder="e.g., Living Room Redesign"
                      className="input-glow"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (optional)</Label>
                    <Textarea
                      id="description"
                      value={newProject.description}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          description: e.target.value,
                        })
                      }
                      placeholder="Brief description of the project..."
                      className="input-glow"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateProject}>Create Project</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Projects Grid */}
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
                <FolderKanban className="h-10 w-10 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">No Projects Yet</h3>
              <p className="mb-6 max-w-sm text-muted-foreground">
                Create your first project to start organizing your design work.
              </p>
              <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Project
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card-hover group"
                >
                  <div className="p-5">
                    <div className="mb-3 flex items-start justify-between">
                      <Link
                        to="/dashboard"
                        className="text-lg font-semibold hover:text-primary transition-colors"
                      >
                        {project.name}
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-secondary transition-all">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteProject(project.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                      {project.description || "No description"}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5" />
                        {project.chatCount} chats
                      </div>
                      <div className="flex items-center gap-1">
                        <Image className="h-3.5 w-3.5" />
                        {project.imageCount} images
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      Updated {project.updatedAt.toLocaleDateString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Projects;
