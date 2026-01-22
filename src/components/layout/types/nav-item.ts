export type NavItem = {
    label: string
    href?: string
    icon: React.ElementType
    badge?: number
    children?: NavItem[]
    onClick?: () => void
}
