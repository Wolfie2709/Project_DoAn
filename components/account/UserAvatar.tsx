import React, { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/authStore";

const UserAvatar = () => {
  const { customer, employee} = useAuthStore();

  const getDisplayName = (name: string) => {
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2 ? parts.slice(-2).join(" ") : name;
  };

  const rawName =
    customer?.fullName ||
    employee?.fullName ||
    "Guest";

  const displayName = getDisplayName(rawName)
;
  return (
    <div className="flex items-center gap-2">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-semibold text-lg">
        Welcome, <span className="font-normal">{displayName}</span>
      </p>
      </div>
    </div>
  );
};

export default UserAvatar;
