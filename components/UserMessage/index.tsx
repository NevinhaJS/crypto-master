import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

function UserMessage({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-[max(1vw,1rem)] justify-end">
      <div className="bg-[#651a66] rounded-2xl p-[max(1vw,1rem)] max-w-[40%]">
        <p className="font-medium text-white text-[max(1.2vw,1.2rem)] font-sans">
          {message}
        </p>
      </div>
      <Avatar className="w-[max(4vw,4rem)] h-[max(4vw,4rem)] rounded-ful">
        <AvatarImage src="/avatars/user.jpg" />
        <AvatarFallback>User image</AvatarFallback>
      </Avatar>
    </div>
  );
}

export default UserMessage;
