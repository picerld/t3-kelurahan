"use client"

import * as React from "react"
import {
  Building2,
  LayoutDashboard,
  MessageCircle,
  Settings,
  LogOut,
  Code,
  ChevronDown,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useGuarded } from "@/components/layout/hooks/useGuarded"

/* -------------------------------------------------------------------------- */
/*                               Nav Config                                   */
/* -------------------------------------------------------------------------- */

type NavItem = {
  label: string
  href?: string
  icon: React.ElementType
  badge?: number
  children?: NavItem[]
  onClick?: () => void
}

const MAIN_NAV: NavItem[] = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Messages",
    href: "/messages",
    icon: MessageCircle,
    badge: 19,
  },
  {
    label: "Dropdown",
    icon: Settings,
    children: [
      {
        label: "Child One",
        href: "/dropdown/one",
        icon: Settings,
      },
      {
        label: "Child Two",
        href: "/dropdown/two",
        icon: Settings,
      },
    ],
  },
]

const BOTTOM_NAV: NavItem[] = [
  {
    label: "Settings",
    href: "/setting",
    icon: Settings,
  },
]

/* -------------------------------------------------------------------------- */
/*                              Main Sidebar                                  */
/* -------------------------------------------------------------------------- */

export function MainSidebar() {
  const pathname = usePathname()
  const { logout, logoutLoading } = useGuarded()

  const isActive = (href?: string) =>
    href ? pathname === href || pathname.startsWith(href + "/") : false

  return (
    <div className="h-full flex flex-col gap-[50px]">
      {/* Logo */}
      <div className="flex justify-center items-center gap-2">
        <div className="w-12 h-12 rounded-2xl bg-primary backdrop-blur-sm flex items-center justify-center">
          <Building2 className="size-6 text-primary-foreground" />
        </div>
        <div className="text-2xl font-bold text-sidebar-foreground">
          Kelurahan
        </div>
      </div>

      <nav className="flex-1 flex flex-col justify-between overflow-y-auto hide-scrollbar">
        <div className="flex flex-col gap-4">
          {/* MAIN NAV */}
          <div className="flex flex-col gap-4">
            {MAIN_NAV.map((item) => (
              <SidebarItem
                key={item.label}
                item={item}
                activePath={pathname}
                isActive={isActive}
              />
            ))}
          </div>

          <hr className="border-sidebar-border" />

          {/* BOTTOM NAV */}
          <div className="flex flex-col gap-4">
            {BOTTOM_NAV.map((item) => (
              <SidebarItem
                key={item.label}
                item={item}
                activePath={pathname}
                isActive={isActive}
              />
            ))}

            {/* Logout */}
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

        {/* Promo Card */}
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
  )
}

/* -------------------------------------------------------------------------- */
/*                            Sidebar Item                                    */
/* -------------------------------------------------------------------------- */

function SidebarItem({
  item,
  isActive,
}: {
  item: NavItem
  activePath: string
  isActive: (href?: string) => boolean
}) {
  const [open, setOpen] = React.useState(false)

  // Auto-open dropdown if child route is active
  React.useEffect(() => {
    if (item.children?.some((c) => isActive(c.href))) {
      setOpen(true)
    }
  }, [item.children, isActive])

  const ButtonContent = (
    <Button
      variant={item.href && isActive(item.href) ? "default" : "ghost"}
      className={
        item.href && isActive(item.href)
          ? "w-full text-base justify-start gap-3 bg-primary text-primary-foreground h-auto py-[14px] px-4 rounded-xl"
          : "w-full text-base justify-start gap-3 hover:bg-primary hover:text-white text-sidebar-foreground h-auto py-[14px] px-4 rounded-xl"
      }
      onClick={item.children ? () => setOpen(!open) : item.onClick}
    >
      <item.icon className="size-5" />
      <span className="font-semibold">{item.label}</span>

      {item.badge && (
        <Badge className="ml-auto bg-kreatop-blue hover:bg-kreatop-blue-active text-white text-[10px] h-6 w-6 rounded-full p-0 flex items-center justify-center">
          {item.badge}
        </Badge>
      )}

      {item.children && (
        <ChevronDown
          className={`ml-auto size-4 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      )}
    </Button>
  )

  return (
    <div className="flex flex-col gap-2">
      {item.href ? <Link href={item.href}>{ButtonContent}</Link> : ButtonContent}

      {/* Dropdown children */}
      {item.children && open && (
        <div className="flex flex-col gap-2 pl-6">
          {item.children.map((child) => (
            <Link key={child.label} href={child.href!}>
              <Button
                variant="ghost"
                className="w-full text-base justify-start gap-3 hover:bg-primary hover:text-white text-sidebar-foreground h-auto py-[11px] px-4 rounded-xl"
              >
                <child.icon className="size-5" />
                <span className="font-semibold">{child.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
