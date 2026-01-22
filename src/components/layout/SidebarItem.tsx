import React from "react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { ChevronDown } from "lucide-react"
import Link from "next/link"
import type { NavItem } from "./types/nav-item"

export default function SidebarItem({
    item,
    isActive,
}: {
    item: NavItem
    activePath: string
    isActive: (href?: string) => boolean
}) {
    const storageKey = React.useMemo(
        () => `sidebar.open.${item.href ?? item.label}`,
        [item.href, item.label]
    )

    const [open, setOpen] = React.useState<boolean>(false)

    const hasActiveChild = React.useMemo(() => {
        return !!item.children?.some((c) => isActive(c.href))
    }, [item.children, isActive])

    const parentActive = React.useMemo(() => {
        return (item.href ? isActive(item.href) : false) || hasActiveChild
    }, [item.href, isActive, hasActiveChild])

    React.useEffect(() => {
        if (!item.children) return
        try {
            const saved = localStorage.getItem(storageKey)
            if (saved === "1") setOpen(true)
            if (saved === "0") setOpen(false)
        } catch {
            // ignore
        }
    }, [item.children, storageKey])

    React.useEffect(() => {
        if (!item.children) return
        if (hasActiveChild) setOpen(true)
    }, [item.children, hasActiveChild])

    React.useEffect(() => {
        if (!item.children) return
        try {
            localStorage.setItem(storageKey, open ? "1" : "0")
        } catch {
            // ignore
        }
    }, [open, item.children, storageKey])

    const ButtonContent = (
        <Button
            variant={parentActive ? "default" : "ghost"}
            className={
                parentActive
                    ? "w-full text-base justify-start gap-3 bg-primary text-primary-foreground h-auto py-[12px] px-4 rounded-xl"
                    : "w-full text-base justify-start gap-3 hover:bg-primary hover:text-white text-sidebar-foreground h-auto py-[12px] px-4 rounded-xl"
            }
            onClick={item.children ? () => setOpen((v) => !v) : item.onClick}
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
                    className={`ml-auto size-4 transition-transform ${open ? "rotate-180" : ""}`}
                />
            )}
        </Button>
    )

    return (
        <div className="flex flex-col gap-2">
            {item.href ? <Link href={item.href}>{ButtonContent}</Link> : ButtonContent}

            {item.children && open && (
                <div className="flex flex-col gap-2 pl-6">
                    {item.children.map((child) => {
                        const childActive = isActive(child.href)

                        return (
                            <Link key={child.label} href={child.href!}>
                                <Button
                                    variant={childActive ? "default" : "ghost"}
                                    className={
                                        childActive
                                            ? "w-full text-base justify-start gap-3 bg-primary text-primary-foreground h-auto py-[11px] px-4 rounded-xl"
                                            : "w-full text-base justify-start gap-3 hover:bg-primary hover:text-white text-sidebar-foreground h-auto py-[11px] px-4 rounded-xl"
                                    }
                                >
                                    <child.icon className="size-5" />
                                    <span className="font-semibold">{child.label}</span>
                                </Button>
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
