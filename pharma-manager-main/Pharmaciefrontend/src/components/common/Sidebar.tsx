"use client";

import { NavLink } from "react-router-dom";
import { LayoutDashboard, LogOut, Package, ShoppingCart, Tag, Users } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { NavUser } from "./nav-user";



export function Sidebar() {
    const { isDoctorAdmin, user, logout } = useAuth();
    
    console.log("USER:", user);
console.log("isDoctorAdmin:", isDoctorAdmin);
const mappedUser = user
  ? {
      name: user.username,
      email: user.email || "",
      avatar: "", // no avatar
    }
  : null;
  const navItems = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
      show: true,
    },
    {
      to: "/medicaments",
      label: "Médicaments",
      icon: <Package className="h-4 w-4" />,
      show: true, // both roles can see it (Caissier read-only)
    },
    {
      to: "/ventes",
      label: "Ventes",
      icon: <ShoppingCart className="h-4 w-4" />,
      show: true,
    },
    {
      to: "/categories",
      label: "Catégories",
      icon: <Tag className="h-4 w-4" />,
      show: isDoctorAdmin, // hidden for Caissier
    },
    {
      to: "/caissiers",
      label: "Utilisateurs",
      icon: <Users className="h-4 w-4" />,
      show: isDoctorAdmin, // hidden for Caissier
    },
  ];
  return (
    <aside className="flex bg-gray-200 h-screen w-64 flex-col border-r bg-background">
      
      {/* HEADER */}
      <div className="flex items-center gap-2 px-6 py-5">
        <span className="text-2xl">💊</span>
        <p className="font-semibold text-sm">PharmaManager</p>
      </div>

      <Separator />

      {/* NAV */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navItems.filter((item) => item.show !== false)
          .map((item) => {
            // const Icon = item.icon;

            return (
              <NavLink key={item.to} to={item.to} end={item.to === "/"}>
                {({ isActive }) => (
                <Button
  variant="ghost"
  className={cn(
    "w-full justify-start gap-3",
    isActive
      ? "bg-[#BFC9D1]  hover:bg-[#BFC9D1]"
      : "text-muted-foreground hover:bg-accent"
  )}
>
                    {item.icon}
                    {item.label}
                  </Button>
                )}
              </NavLink>
            );
          })}
        </nav>
      </ScrollArea>

      <Separator />

      {/* FOOTER */}
        <div className="px-4 py-4 space-y-3">
         {mappedUser && <NavUser user={mappedUser} />}
      </div>
    </aside>
  );
}