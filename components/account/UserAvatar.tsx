import React, { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/authStore";

const UserAvatar = () => {
<<<<<<< HEAD
  const customer = useAuthStore();
  useEffect(()=>{
    if(customer){
      const fullName = customer.userName;
    }
  });
=======
  const customer = useAuthStore((state) => state.customer);
>>>>>>> lamanh_dev
  return (
    <div className="flex items-center gap-2">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div>
        <h2 className="font-semibold text-lg">Welcome,</h2>
<<<<<<< HEAD
        <p className="-mt-1">{customer.userName}</p>
=======
        <p className="-mt-1">{customer?.fullName}</p>
>>>>>>> lamanh_dev
      </div>
    </div>
  );
};

export default UserAvatar;
