"use client";

import * as React from "react";
import { Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/ModeToggle";
import { useGuarded } from "@/components/layout/hooks/useGuarded";

type MainNavbarProps = {
  withHeader: boolean;
  headerTitle: string;
  headerSubtitle: string;
}

export function MainNavbar({ withHeader, headerTitle, headerSubtitle }: MainNavbarProps) {
  const { user, displayName, displayEmail, avatarFallback } = useGuarded();

  return (
    <div className="flex items-center justify-between">
      {withHeader ? (
        <div className="flex flex-col gap-0.5">
          <h1 className="font-bold text-[32px] text-foreground">{headerTitle}</h1>
          <p className="text-lg text-muted-foreground">{headerSubtitle}</p>
        </div>
      ): (
        <div className="flex flex-col gap-0.5"></div>
      )}

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-[14px]">
          <Button variant="outline" size="icon" className="h-[50px] w-[50px] rounded-full border-border hover:bg-accent">
            <Search className="h-4! w-4!" />
          </Button>
          <Button variant="outline" size="icon" className="h-[50px] w-[50px] rounded-full border-border hover:bg-accent">
            <Bell className="h-4! w-4!" />
          </Button>
          <ModeToggle variant="outline" />
        </div>

        <div className="h-[60px] border-l border-border"></div>

        <div className="flex items-center gap-[14px]">
          <div className="flex flex-col text-right">
            <p className="font-semibold text-foreground">{displayName}</p>
            <p className="text-sm text-muted-foreground">{displayEmail}</p>
          </div>
          <Avatar className="h-[60px] w-[60px] border border-border p-[6px]">
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}
