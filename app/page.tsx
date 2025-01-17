"use client";

import AiMessage from "@/components/AiMessage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import UserMessage from "@/components/UserMessage";
import { useEffect, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi buddy, my name is Nevinha. You can ask me anything about crypto and I'll do my best to answer your questions!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInput("");
    setLoading(true);

    const message: Message = { role: "user", content: input };
    const newMessages = [...messages, message];

    setMessages(newMessages);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "text/event-stream",
      },
      body: JSON.stringify({
        messages: newMessages,
      }),
    });

    if (!response.body) return;

    const reader = response.body
      .pipeThrough(new TextDecoderStream())
      .getReader();

    let content = "";
    setLoading(false);

    while (true) {
      const { value, done } = await reader.read();
      content += value;

      if (done) break;

      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content,
        },
      ]);
    }
  };

  useEffect(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <>
      <div className="min-h-screen p-[max(1vw,1rem)] flex items-end">
        <h1 className="absolute top-8 text-4xl text-center w-full text-[#dfd3c0] font-orbitron">
          |-| Crypto Master |-|
        </h1>

        <div className="w-[90vw] pt-[6rem] mx-auto space-y-12">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`}>
              {message.role === "user" ? (
                <UserMessage message={message.content} />
              ) : (
                <AiMessage message={message.content} />
              )}
            </div>
          ))}

          {loading && (
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
          )}

          {/* Message input */}
          <form onSubmit={handleSubmit} className="w-full mx-auto relative">
            <Input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={handleInputChange}
              className="w-full h-[max(4vw,4rem)] text-[max(1.2vw,1.2rem)] p-[max(1vw,1rem)] rounded-[1.5vw] pl-[2vw] pr-[4vw] bg-[#dfd3c0] text-gray-950 placeholder:text-gray-950 border-0 focus:ring-0 focus:outline-none focus:ring-offset-0 focus:border-0 font-sans"
            />
            <button
              type="submit"
              className="absolute right-[1vw] top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-black/5"
            >
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
          </form>
        </div>
      </div>
    </>
  );
}
