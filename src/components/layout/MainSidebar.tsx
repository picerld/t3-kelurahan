"use client";

import * as React from "react";
import { Building2, LayoutDashboard, MessageCircle, Settings, LogOut, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useGuarded } from "@/components/layout/hooks/useGuarded";

export function MainSidebar() {
  const { logout, logoutLoading } = useGuarded();

  return (
    <div className="h-full flex flex-col gap-[50px]">
      <div className="flex justify-center items-center gap-2">
        <div className="w-12 h-12 rounded-2xl bg-primary backdrop-blur-sm flex items-center justify-center">
          <Building2 className="size-6 text-primary-foreground" />
        </div>
        <div className="text-2xl font-bold text-sidebar-foreground">Kelurahan</div>
      </div>

      <nav className="flex-1 flex flex-col justify-between overflow-y-auto hide-scrollbar">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <Link href={"/dashboard"}>
              <Button
                variant="ghost"
                className="w-full text-base justify-start gap-3 bg-primary text-primary-foreground h-auto py-[11px] px-4 rounded-xl"
              >
                <LayoutDashboard className="size-5" />
                <span className="font-semibold">Overview</span>
              </Button>
            </Link>

            <Button
              variant="ghost"
              className="w-full text-base justify-start gap-3 hover:bg-sidebar-accent text-sidebar-foreground h-auto py-[11px] px-4 rounded-xl"
            >
              <MessageCircle className="size-5" />
              <span className="font-semibold">Messages</span>
              <Badge className="ml-auto bg-kreatop-blue hover:bg-kreatop-blue-active text-white text-[10px] h-6 w-6 rounded-full p-0 flex items-center justify-center">
                19
              </Badge>
            </Button>
          </div>

          <hr className="border-sidebar-border" />

          <div className="flex flex-col gap-4">
            <Link href={"/setting"}>
              <Button
                variant="ghost"
                className="w-full text-base justify-start gap-3 hover:bg-sidebar-accent text-sidebar-foreground h-auto py-[11px] px-4 rounded-xl"
              >
                <Settings className="size-6" />
                <span className="font-semibold">Settings</span>
              </Button>
            </Link>

            <Button
              variant="ghost"
              className="w-full text-base justify-start gap-3 hover:bg-sidebar-accent text-sidebar-foreground h-auto py-[11px] px-4 rounded-xl"
              onClick={logout}
              disabled={logoutLoading}
            >
              <LogOut className="size-6" />
              <span className="font-semibold">{logoutLoading ? "Logging out..." : "Logout"}</span>
            </Button>
          </div>
        </div>

        <Card className="bg-card border-border rounded-[20px] mt-6">
          <CardContent className="p-5 flex flex-col gap-5">
            <div className="flex h-[60px] w-[60px] rounded-full bg-primary items-center justify-center">
              <Code className="h-7 w-7 text-primary-foreground" />
            </div>
            <p className="font-bold text-lg text-card-foreground">
              Kreto AI Ready to Help You Grow.
            </p>
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full">
              <span className="font-bold text-sm">Upgrade Now</span>
            </Button>
          </CardContent>
        </Card>
      </nav>
    </div>
  );
}
