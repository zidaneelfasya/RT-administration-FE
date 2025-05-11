"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/auth";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { register } = useAuth({
    middleware: "guest",
    redirectIfAuthenticated: "/dashboard",
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]> | string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const submitForm = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors([]);
    setIsLoading(true);

    try {
      await register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        setErrors,
      });
    } catch (error) {
      console.error("Registration error:", error);
      if (!error) {
        setErrors(["Network error - please check your connection"]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 relative", className)} {...props}>
      {/* Overlay loading */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 rounded-lg">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      )}

      <Card className="relative">
        <CardHeader>
          <CardTitle className="flex justify-center text-2xl">
            CREATE ACCOUNT
          </CardTitle>
          <CardTitle className="flex justify-center text-xl">
            RT-Administration Registration
          </CardTitle>
          <CardDescription className="text-center">
            Fill in the form below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitForm}>
            {errors && (
              <div className="text-destructive text-center text-sm mb-4">
                {Array.isArray(errors)
                  ? errors.map((error, index) => <div key={index}>{error}</div>)
                  : Object.entries(errors).map(([key, messages]) =>
                      messages.map((message, index) => (
                        <div key={`${key}-${index}`}>{message}</div>
                      ))
                    )}
              </div>
            )}
            <div className="flex flex-col gap-6">
              {/* Name Field */}
              <div className="grid gap-3">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Test User"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* Email Field */}
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* Password Field */}
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* Password Confirmation Field */}
              <div className="grid gap-3">
                <Label htmlFor="passwordConfirmation">Confirm Password</Label>
                <Input
                  id="passwordConfirmation"
                  type="password"
                  required
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Register
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline underline-offset-4">
                Login here
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}