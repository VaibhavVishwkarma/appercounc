import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Loader2, UserX, Users, Activity, Database, Menu } from "lucide-react";
import { User } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

type AdminSidebarProps = {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isOpen: boolean;
  onClose: () => void;
};

function AdminSidebar({ activeSection, setActiveSection, isOpen, onClose }: AdminSidebarProps) {
  const { logoutMutation } = useAuth();

  return (
    <div
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-md transition-transform transform ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      } ease-in-out duration-300`}
    >
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-primary">Admin Dashboard</h2>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onClose}
        >
          <UserX className="h-5 w-5" />
        </Button>
      </div>
      <div className="p-4">
        <nav className="space-y-1">
          <Button
            variant={activeSection === "users" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => {
              setActiveSection("users");
              onClose();
            }}
          >
            <Users className="h-5 w-5 mr-3" />
            <span>User Management</span>
          </Button>
          <Button
            variant={activeSection === "activity" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => {
              setActiveSection("activity");
              onClose();
            }}
          >
            <Activity className="h-5 w-5 mr-3" />
            <span>Activity Logs</span>
          </Button>
          <Button
            variant={activeSection === "data" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => {
              setActiveSection("data");
              onClose();
            }}
          >
            <Database className="h-5 w-5 mr-3" />
            <span>Data Management</span>
          </Button>
        </nav>
      </div>
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={() => logoutMutation.mutate()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span>Log out</span>
        </Button>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState("users");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  // Redirect if not admin
  useEffect(() => {
    if (user && !user.isAdmin) {
      setLocation("/dashboard");
      toast({
        title: "Access Denied",
        description: "You do not have permission to access the admin panel.",
        variant: "destructive",
      });
    }
  }, [user, setLocation, toast]);

  // Fetch users data
  const { data: users, isLoading: isLoadingUsers } = useQuery<
    Omit<User, "password">[]
  >({
    queryKey: ["/api/admin/users"],
    enabled: activeSection === "users" && !!user?.isAdmin,
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/users/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "User deleted",
        description: `User ID ${id} has been deleted successfully.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete user",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const renderContent = () => {
    switch (activeSection) {
      case "users":
        return (
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                View and manage all user accounts in the system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingUsers ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Admin</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users && users.length > 0 ? (
                      users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.id}</TableCell>
                          <TableCell>{user.username}</TableCell>
                          <TableCell>{user.name || "-"}</TableCell>
                          <TableCell>{user.email || "-"}</TableCell>
                          <TableCell>{user.isAdmin ? "Yes" : "No"}</TableCell>
                          <TableCell>
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString()
                              : "-"}
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  disabled={user.id === currentUser?.id}
                                >
                                  Delete
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Confirm Deletion</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to delete user "{user.username}"? This action cannot be undone.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      const element = document.querySelector('[role="dialog"]');
                                      if (element) {
                                        element.setAttribute("data-state", "closed");
                                      }
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={() => {
                                      deleteUserMutation.mutate(user.id);
                                      const element = document.querySelector('[role="dialog"]');
                                      if (element) {
                                        element.setAttribute("data-state", "closed");
                                      }
                                    }}
                                  >
                                    Delete
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          No users found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        );
      case "activity":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Activity Logs</CardTitle>
              <CardDescription>
                Track all user interactions across the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Activity className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Activity Tracking</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                  This feature will track quiz results, chatbot usage, and other user activities.
                  Currently in development.
                </p>
              </div>
            </CardContent>
          </Card>
        );
      case "data":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Manage and export platform data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Database className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Data Management Tools</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                  Tools for managing and exporting PostgreSQL data will be available here.
                  Currently in development.
                </p>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  // Get current user for comparison
  const { user: currentUser } = useAuth();

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <AdminSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col">
        {/* Top Navigation */}
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10 flex items-center justify-between h-16 px-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden mr-2"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-medium text-gray-900 dark:text-white hidden md:block">
              Admin Dashboard
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <ModeToggle />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation("/dashboard")}
            >
              Back to Dashboard
            </Button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
