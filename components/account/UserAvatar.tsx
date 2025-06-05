import React, { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/authStore";

const UserAvatar = () => {
  const customer = useAuthStore();
  useEffect(()=>{
    if(customer){
      const fullName = customer.userName;
    }
  });
  return (
    <div className="flex items-center gap-2">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div>
        <h2 className="font-semibold text-lg">Welcome,</h2>
        <p className="-mt-1">{customer.userName}</p>
      </div>
    </div>
  );
};

export default UserAvatar;
