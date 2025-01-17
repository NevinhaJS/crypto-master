import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";

function AiMessage({
  message,
  loading,
}: {
  message?: string;
  loading?: boolean;
}) {
  return (
    <div className="flex items-start gap-[max(1vw,1rem)]">
      <div className="w-[max(4vw,4rem)] h-[max(4vw,4rem)] rounded-full">
        <Avatar className="w-[max(4vw,4rem)] h-[max(4vw,4rem)] rounded-full bg-blue-200">
          <AvatarImage src="/avatars/robot.jpg" />
          <AvatarFallback>Crypto Master AI</AvatarFallback>
        </Avatar>
      </div>

      {loading ? (
        <div className="w-full max-w-[40%] gap-[max(1vw,1rem)] flex flex-col">
          <Skeleton className="w-full p-[max(1vw,1rem)]" />
          <Skeleton className="w-[70%] p-[max(1vw,1rem)]" />
        </div>
      ) : (
        <div className="bg-[#dfd3c0] rounded-2xl p-[max(1vw,1rem)] sm:max-w-[60%] max-w-full">
          <p
            className="font-medium text-gray-950 text-[max(1.2vw,1.2rem)] font-sans"
            dangerouslySetInnerHTML={{
              __html: message?.replace(/\n/g, "<br />") || "",
            }}
          />
        </div>
      )}
    </div>
  );
}

export default AiMessage;
