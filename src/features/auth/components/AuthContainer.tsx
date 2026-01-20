import React from "react";
import { Sparkles } from "lucide-react";
import { ModeToggle } from "@/components/ModeToggle";
import { Card, CardContent } from "@/components/ui/card";

type AuthContainerProps = {
  mode: "signin" | "signup";
  children: React.ReactNode;
};

export const AuthContainer: React.FC<AuthContainerProps> = ({ mode, children }) => {
  const isSignUp = mode === "signup";

  const leftHeading = isSignUp ? "Start Your Journey" : "Welcome Back!";
  const leftDesc = isSignUp
    ? "Join thousands of creators who trust Kreatop to grow their business and reach."
    : "Track your growth, manage clients, and optimize your content performance with powerful analytics.";

  const rightHeading = isSignUp ? "Create Account" : "Sign In";
  const rightDesc = isSignUp
    ? "Fill in your details to get started"
    : "Enter your credentials to access your dashboard";

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#07041B] flex items-center justify-center p-6">
      <Card className="w-full max-w-[1000px] bg-[#FFFFFF] dark:bg-[#110E24] dark:border-[#23203A] border-none rounded-[32px] overflow-hidden shadow-2xl py-0">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2 min-h-[600px]">
            <div className="bg-primary p-12 flex flex-col justify-between overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-white">KREATOP</h1>
                </div>

                <div className="space-y-4">
                  <h2 className="text-4xl font-bold text-white leading-tight">{leftHeading}</h2>
                  <p className="text-lg text-white/80">{leftDesc}</p>
                </div>
              </div>

              <div className="relative z-10 grid grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <p className="text-2xl font-bold text-white">50K+</p>
                  <p className="text-sm text-white/70">Creators</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <p className="text-2xl font-bold text-white">1M+</p>
                  <p className="text-sm text-white/70">Analytics</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <p className="text-2xl font-bold text-white">99%</p>
                  <p className="text-sm text-white/70">Uptime</p>
                </div>
              </div>
            </div>

            <div className="p-12 flex flex-col justify-center bg-[#110E24]">
              <div className="w-full max-w-md mx-auto">
                <div className="mb-8 flex items-start justify-between">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-4xl font-bold text-white mb-2">{rightHeading}</h3>
                    <p className="text-[#89869A]">{rightDesc}</p>
                  </div>
                  <ModeToggle />
                </div>

                {children}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
