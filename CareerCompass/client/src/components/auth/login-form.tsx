import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";

export function LoginForm() {
  const { loginSchema, loginMutation, forgotPasswordMutation } = useAuth();
  const [, setLocation] = useLocation();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotUsername, setForgotUsername] = useState("");

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(values, {
      onSuccess: () => {
        setLocation("/dashboard");
      },
    });
  };

  const handleForgotPassword = () => {
    if (!forgotUsername.trim()) {
      return;
    }
    
    forgotPasswordMutation.mutate(
      { username: forgotUsername },
      {
        onSuccess: () => {
          setShowForgotPassword(false);
          setForgotUsername("");
        },
      }
    );
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Checkbox id="remember" />
              <label
                htmlFor="remember"
                className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
              >
                Remember me
              </label>
            </div>
            <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="link"
                  className="text-sm text-primary hover:text-primary-600 p-0 h-auto"
                >
                  Forgot your password?
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reset Password</DialogTitle>
                  <DialogDescription>
                    Enter your username below and we'll send you a password reset link.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <FormLabel htmlFor="forgot-username">Username</FormLabel>
                  <Input
                    id="forgot-username"
                    value={forgotUsername}
                    onChange={(e) => setForgotUsername(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowForgotPassword(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={forgotPasswordMutation.isPending}
                  >
                    {forgotPasswordMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Log in"
            )}
          </Button>
        </form>
      </Form>
    </>
  );
}
