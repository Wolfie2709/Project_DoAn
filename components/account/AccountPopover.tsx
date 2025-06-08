"use client";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Heart, HelpCircle, ListOrdered, LogOut, User, LogIn, UserPlus} from "lucide-react";
import Link from "next/link";
import { Separator } from "../ui/separator";
import UserAvatar from "./UserAvatar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

const AccountPopover = () => {
  const pathname = usePathname();
  const isLoggedIn = !!useAuthStore((state) => state.accessToken);
  const logout = useAuthStore((state) => state.logout);
  const customer = useAuthStore((state) => state.customer);
  const employee = useAuthStore((state) => state.employee);
  const role = employee ? "employee" : "customer";

   const guestLinks = [
    {
      link: "/sign-in",
      label: "Sign In",
      icon: <LogIn />,
      isActive: pathname.includes("/sign-in"),
    },
    {
      link: "/sign-up",
      label: "Sign Up",
      icon: <UserPlus />,
      isActive: pathname.includes("/sign-up"),
    },
    {
      link: "/help",
      label: "Help",
      icon: <HelpCircle />,
      isActive: pathname.includes("/help"),
    },
  ];

  const customerLinks = [
    {
      link: "/my-account",
      label: "My Account",
      icon: <User />,
      isActive: pathname.includes("/my-account"),
    },
    {
      link: "/wishlist",
      label: "Wishlist",
      icon: <Heart />,
      isActive: pathname.includes("/wishlist"),
    },
    {
      link: "/my-orders",
      label: "My Orders",
      icon: <ListOrdered />,
      isActive: pathname.includes("/my-orders"),
    },
    {
      link: "/help",
      label: "Help",
      icon: <HelpCircle />,
      isActive: pathname.includes("/help"),
    },
  ];

  const employeeLinks = [
    {
      link: "/my-account",
      label: "My Account",
      icon: <User />,
      isActive: pathname.includes("/my-account"),
    },
    {
      link: "/dashboard",
      label: "Dashboard",
      icon: <ListOrdered />,
      isActive: pathname.includes("/dashboard"),
    },
  ];

  const router = useRouter();

const handleLogout = () => {
  logout();
  router.push("/sign-in");
};

 const resolvedLinks = isLoggedIn
    ? role === "employee"
      ? employeeLinks
      : customerLinks
    : guestLinks;
  return (
    <div className="hidden lg:block">
      <Popover>
        <PopoverTrigger className="flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-800 duration-200 p-2 rounded-md">
          <User size={25}  />
        </PopoverTrigger>
        <PopoverContent
          className="rounded-2xl ">
          <ul className="space-y-1 text-center ">
            {isLoggedIn ? (
              <UserAvatar />
            ) : (
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>G</AvatarFallback>
                </Avatar>
                <p className="font-semibold text-lg">
                  Welcome, <span className="font-normal">Guest</span>
                </p>
              </div>
            )}
            <Separator className="!my-2" />
            {resolvedLinks.map((link) => (
              <Link
                key={link.link}
                href={link.link}
                className={cn(
                  "flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded-md",
                  link.isActive && "bg-gray-200  dark:bg-gray-800"
                )}
              >
                {link.icon} {link.label}
              </Link>
            ))}
            {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="flex items-star justify-start gap-2 p-2 bg-transparent hover:opacity-50">
              <LogOut />
              Logout
            </button>
            )}
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AccountPopover;
