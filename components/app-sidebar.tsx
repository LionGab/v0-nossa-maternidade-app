"use client"

import { Home, Sparkles, Video, ChefHat, Newspaper, Calendar, Heart, User, Trophy } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Início",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "NathIA",
    url: "/nathai",
    icon: Sparkles,
    badge: "IA",
  },
  {
    title: "Mundo Nath",
    url: "/mundo-nath",
    icon: Video,
    badge: "Novo",
  },
  {
    title: "Receitas do Coração",
    url: "/receitas",
    icon: ChefHat,
  },
  {
    title: "Maternidade Hoje",
    url: "/maternidade-hoje",
    icon: Newspaper,
  },
  {
    title: "Minha Rotina",
    url: "/routine",
    icon: Calendar,
  },
  {
    title: "Autocuidado",
    url: "/selfcare",
    icon: Heart,
  },
  {
    title: "Conquistas",
    url: "/achievements",
    icon: Trophy,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border/50 pb-4">
        <Link href="/dashboard" className="flex items-center gap-3 px-2">
          <Image src="/logo.png" alt="Nossa Maternidade" width={48} height={48} className="rounded-full" />
          <div>
            <h2 className="font-serif font-semibold text-lg">Nossa Maternidade</h2>
            <p className="text-xs text-muted-foreground">Sua jornada maternal</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 pt-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/profile" className="flex items-center gap-3">
                <User className="h-5 w-5" />
                <span>Meu Perfil</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
