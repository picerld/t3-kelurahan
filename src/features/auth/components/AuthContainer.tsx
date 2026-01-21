import React from "react";
import { Building2 } from "lucide-react";
import { ModeToggle } from "@/components/ModeToggle";
import { Card, CardContent } from "@/components/ui/card";

type AuthContainerProps = {
  mode: "signin" | "signup";
  children: React.ReactNode;
};

export const AuthContainer: React.FC<AuthContainerProps> = ({ mode, children }) => {
  const isSignUp = mode === "signup";

  const leftHeading = isSignUp ? "Start Your Journey" : "Kelurahan Lorem";
  const leftDesc = isSignUp
    ? "Join thousands of creators who trust Kelurahan to grow their business and reach."
    : "Track your growth, manage clients, and optimize your content performance with powerful analytics.";

  const rightHeading = isSignUp ? "Create Account" : "Sign In";
  const rightDesc = isSignUp
    ? "Fill in your details to get started"
    : "Enter your credentials to access your dashboard";

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-6">
      <Card className="w-full max-w-[1000px] rounded-[32px] overflow-hidden shadow-2xl border-none py-0">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2 min-h-[600px]">
            <div className="bg-primary/90 p-12 flex flex-col justify-between overflow-hidden relative">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-primary-foreground backdrop-blur-sm flex items-center justify-center">
                    <Building2 className="size-7 text-primary" strokeWidth={2.5} />
                  </div>
                  <h1 className="text-3xl font-bold text-primary-foreground">Kelurahan</h1>
                </div>

                <div className="space-y-4">
                  <h2 className="text-4xl font-bold text-primary-foreground leading-tight">{leftHeading}</h2>
                  <p className="text-base text-primary-foreground/90 leading-relaxed">{leftDesc}</p>
                </div>
              </div>

              <div className="relative z-10 grid grid-cols-3 gap-4">
                <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-4 border border-primary-foreground/20 hover:bg-primary-foreground/15 transition-colors">
                  <p className="text-2xl font-bold text-primary-foreground">50K+</p>
                  <p className="text-sm text-primary-foreground/80">Creators</p>
                </div>
                <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-4 border border-primary-foreground/20 hover:bg-primary-foreground/15 transition-colors">
                  <p className="text-2xl font-bold text-primary-foreground">1M+</p>
                  <p className="text-sm text-primary-foreground/80">Analytics</p>
                </div>
                <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-4 border border-primary-foreground/20 hover:bg-primary-foreground/15 transition-colors">
                  <p className="text-2xl font-bold text-primary-foreground">99%</p>
                  <p className="text-sm text-primary-foreground/80">Uptime</p>
                </div>
              </div>
            </div>

            <div className="p-12 flex flex-col justify-center bg-card">
              <div className="w-full max-w-md mx-auto">
                <div className="mb-8 flex items-start justify-between">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-5xl font-bold text-card-foreground mb-2">{rightHeading} 👋</h3>
                    <p className="text-muted-foreground">{rightDesc}</p>
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