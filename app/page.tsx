import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  return (
    <>
      <div className="min-h-screen p-[max(1vw,1rem)] flex items-end">
        <h1 className="absolute top-8 text-4xl text-center w-full text-[#dfd3c0] font-orbitron">
          |-| Crypto Master |-|
        </h1>

        <div className="w-[90vw] mx-auto space-y-12">
          {/* Master's message */}
          <div className="flex items-start gap-[max(1vw,1rem)]">
            <div className="w-[max(4vw,4rem)] h-[max(4vw,4rem)] rounded-full">
              <Avatar className="w-[max(4vw,4rem)] h-[max(4vw,4rem)] rounded-full bg-blue-200">
                <AvatarImage src="/avatars/robot.jpg" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div className="bg-[#dfd3c0] rounded-2xl p-[max(1vw,1rem)] max-w-[60%]">
              <p className="font-medium text-gray-950 text-[max(1.2vw,1.2rem)] font-sans">
                Hi buddy, my name is Nevinha. You can ask me anything about
                crypto and I'll do my best to answer your questions!
              </p>
            </div>
          </div>

          {/* User's message */}
          <div className="flex items-start gap-[max(1vw,1rem)] justify-end">
            <div className="bg-[#651a66] rounded-2xl p-[max(1vw,1rem)] max-w-[40%]">
              <p className="font-medium text-white text-[max(1.2vw,1.2rem)] font-sans">
                Hey master, can you please explain me how to send a transaction
                using my safe account?
              </p>
            </div>
            <Avatar className="w-[max(4vw,4rem)] h-[max(4vw,4rem)] rounded-ful">
              <AvatarImage src="/avatars/user.jpg" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex items-start gap-[max(1vw,1rem)] ">
            <Avatar className="w-[max(4vw,4rem)] h-[max(4vw,4rem)] rounded-full bg-blue-200">
              <AvatarImage src="/avatars/robot.jpg" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div className="w-full max-w-[40%] gap-[max(1vw,1rem)] flex flex-col">
              <Skeleton className="w-full p-[max(1vw,1rem)]" />
              <Skeleton className="w-[70%] p-[max(1vw,1rem)]" />
            </div>
          </div>

          {/* Message input */}
          <div className="w-full mx-auto relative">
            <Input
              type="text"
              placeholder="Type your message..."
              className="w-full h-[max(4vw,4rem)] text-[max(1.2vw,1.2rem)] p-[max(1vw,1rem)] rounded-[1.5vw] pl-[2vw] pr-[4vw] bg-[#dfd3c0] text-gray-950 placeholder:text-gray-950 border-0 focus:ring-0 focus:outline-none focus:ring-offset-0 focus:border-0 font-sans"
            />
            <button className="absolute right-[1vw] top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-black/5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-[max(2vw,2rem)] h-[max(2vw,2rem)] hover:stroke-amber-600 transition-all duration-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
