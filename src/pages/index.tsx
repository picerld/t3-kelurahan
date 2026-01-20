"use client";

import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "@/server/better-auth/client";
import { AuthContainer, SignInWithGoogleButton } from "@/features/auth/components";
import { HeadMetaData } from "@/components/meta/HeadMetaData";

type FormData = {
  name: string;
  email: string;
  password: string;
  rememberMe: boolean;
};

const KreatopAuthForms = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<null | "email" | "github" | "google">(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEmailPasswordSignIn = async () => {
    if (!formData.email || !formData.password) {
      toast.error("Oops!", { description: "Please fill in all fields" });
      return;
    }

    try {
      setLoading("email");

      // Common Better Auth API shape:
      // authClient.signIn.email({ email, password, ... })
      const res = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,

        // Some versions support "rememberMe" or session options.
        // If yours doesn't, remove this line.
        rememberMe: formData.rememberMe,
      });

      // Depending on version, you may get { data, error } or a thrown error.
      if (res?.error) {
        toast.error("Login failed", { description: res.error.message ?? "Invalid credentials" });
        return;
      }

      toast.success("Yeay!", { description: "You are now logged in" });
      window.location.assign("/dashboard");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong while signing in.";
      toast.error("Login failed", { description: message });
    } finally {
      setLoading(null);
    }
  };

  const handleGithubSignIn = async () => {
    try {
      setLoading("github");

      // Common Better Auth API shape:
      // authClient.signIn.social({ provider: "github", callbackURL })
      const res = await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
      });

      // Many auth libs redirect automatically. If it returns a URL, follow it.
      const url = res?.data?.url ?? res?.url;
      if (typeof url === "string") {
        window.location.href = url;
        return;
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "GitHub sign-in failed.";
      toast.error("GitHub sign-in failed", { description: message });
      setLoading(null);
    }
  };

  return (
    <AuthContainer mode="signin">
      <HeadMetaData title="Sign In" pathName="/" />

      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white font-semibold">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#89869A]" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              className="pl-12 h-12 bg-[#07041B] border-[#23203A] text-white placeholder:text-[#89869A] rounded-xl focus:border-[#312ECB] focus:ring-[#312ECB]"
              disabled={loading !== null}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-white font-semibold">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#89869A]" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              className="pl-12 pr-12 h-12 bg-[#07041B] border-[#23203A] text-white placeholder:text-[#89869A] rounded-xl focus:border-[#312ECB] focus:ring-[#312ECB]"
              disabled={loading !== null}
              onKeyDown={(e) => {
                if (e.key === "Enter") void handleEmailPasswordSignIn();
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#89869A] hover:text-white transition-colors"
              disabled={loading !== null}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={formData.rememberMe}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, rememberMe: checked === true }))
              }
              className="border-[#23203A] data-[state=checked]:bg-[#312ECB] data-[state=checked]:border-[#312ECB]"
              disabled={loading !== null}
            />
            <Label htmlFor="remember" className="text-sm text-[#89869A] cursor-pointer">
              Remember me
            </Label>
          </div>

          <Button
            type="button"
            variant="link"
            className="text-sm text-primary hover:text-primary/80 p-0 h-auto"
            disabled={loading !== null}
            onClick={() => toast.info("TODO", { description: "Implement forgot password flow with Better Auth." })}
          >
            Forgot Password?
          </Button>
        </div>

        <Button
          onClick={handleEmailPasswordSignIn}
          className="w-full h-12 bg-primary hover:bg-primary/80 text-white font-semibold rounded-xl transition-all duration-300 group"
          disabled={loading !== null}
        >
          <span>{loading === "email" ? "Signing in..." : "Sign In"}</span>
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#23203A]" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-[#110E24] text-[#89869A]">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <SignInWithGoogleButton />

          <Button
            type="button"
            variant="outline"
            className="h-12 border-[#23203A] bg-[#07041B] hover:bg-[#23203A] text-white rounded-xl"
            disabled={loading !== null}
            onClick={handleGithubSignIn}
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            {loading === "github" ? "Redirecting..." : "GitHub"}
          </Button>
        </div>

        <div className="text-center">
          <p className="text-[#89869A]">
            Don&apos;t have an account?
            <Link href={"/register"}>
              <Button
                type="button"
                variant="link"
                className="text-[#312ECB] hover:text-[#732ECB] ml-1 p-0 h-auto font-semibold"
                disabled={loading !== null}
              >
                Sign Up
              </Button>
            </Link>
          </p>
        </div>
      </div>
    </AuthContainer>
  );
};

export default KreatopAuthForms;
