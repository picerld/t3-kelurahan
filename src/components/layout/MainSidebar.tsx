"use client";

import * as React from "react";
import {
  Building2,
  LayoutDashboard,
  Settings,
  LogOut,
  Code,
  ChartAreaIcon,
  Users,
  SquareUserRound,
  UserCheck,
  MapPinCheck,
  House,
} from "lucide-react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGuarded } from "@/components/layout/hooks/useGuarded";
import SidebarItem from "./SidebarItem";
import type { NavItem } from "./types/nav-item";

const MAIN_NAV: NavItem[] = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Penduduk",
    icon: Users,
    children: [
      {
        label: "Data Penduduk",
        href: "/citizens",
        icon: SquareUserRound,
      },
      {
        label: "Grafik Penduduk",
        href: "/citizens/charts",
        icon: ChartAreaIcon,
      },
    ],
  },
  {
    label: "Keluarga",
    icon: UserCheck,
    children: [
      {
        label: "Data Keluarga",
        href: "/families",
        icon: SquareUserRound,
      },
      {
        label: "Grafik Keluarga",
        href: "/families/charts",
        icon: ChartAreaIcon,
      },
    ],
  },
  {
    label: "Alamat",
    icon: MapPinCheck,
    children: [
      {
        label: "Data Alamat",
        href: "/addresses",
        icon: House,
      },
      {
        label: "Grafik Alamat",
        href: "/addresses/charts",
        icon: ChartAreaIcon,
      },
    ],
  },
];

const BOTTOM_NAV: NavItem[] = [{ label: "Settings", href: "/setting", icon: Settings }];

export function MainSidebar() {
  const pathname = usePathname();
  const { logout, logoutLoading } = useGuarded();

  const isActive = (href?: string) =>
    href ? pathname === href || pathname.startsWith(href + "/") : false;

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
            {MAIN_NAV.map((item) => (
              <SidebarItem
                key={item.href ?? item.label}
                item={item}
                activePath={pathname}
                isActive={isActive}
              />
            ))}
          </div>

          <hr className="border-sidebar-border" />

          <div className="flex flex-col gap-4">
            {BOTTOM_NAV.map((item) => (
              <SidebarItem
                key={item.href ?? item.label}
                item={item}
                activePath={pathname}
                isActive={isActive}
              />
            ))}

            <Button
              variant="ghost"
              className="w-full text-base justify-start gap-3 hover:bg-primary hover:text-white text-sidebar-foreground h-auto py-[11px] px-4 rounded-xl"
              onClick={logout}
              disabled={logoutLoading}
            >
              <LogOut className="size-6" />
              <span className="font-semibold">
                {logoutLoading ? "Logging out..." : "Logout"}
              </span>
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
