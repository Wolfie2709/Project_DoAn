'use client'
import Logo from "@/components/logo/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Bell, LogOut } from "lucide-react";
import React from "react";
import Notification from "../notificaton/Notification";
import DashboardMobileHeader from "./DashboardMobileHeader";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

const DashboardHeader = () => {

const router = useRouter();
const logout = useAuthStore((state) => state.logout);

const handleLogout = () => {
  logout();
  router.push("/sign-in");
};

  return (
    <header className="bg-white dark:bg-gray-900 shadow sticky top-0 left-0 right-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Notification />
          <Button
            size="sm"
            variant="destructive"
            className="flex items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut /> Exit
          </Button>
          <DashboardMobileHeader />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
