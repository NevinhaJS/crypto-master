"use client";

import AiMessage from "@/components/AiMessage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import UserMessage from "@/components/UserMessage";
import { cn } from "@/lib/utils";
import clsx from "clsx";
import { useEffect, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const rateLimitExceeded = "Rate limit exceeded";
export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [hasNoLimit, setHasNoLimit] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);

      setMessages([
        {
          role: "assistant",
          content: `Hi buddy, my name is Nevinha. You can ask me anything about crypto and I'll do my best to answer your questions! 
            But please be smart, I CAN JUST ANSWER 5 QUESTIONS PER DAY!"`,
        },
      ]);

      if (window.onNotThinking) window.onNotThinking();
    }, 1400);
  }, []);

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

    if (window.onThinking) window.onThinking();

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

    while (true) {
      const { value, done } = await reader.read();
      content += value;

      if (content.includes(rateLimitExceeded)) {
        setHasNoLimit(true);
        setMessages([
          ...messages,
          {
            role: "assistant",
            content:
              "Sorry, looks like you have already asked more than 5 questions today. Come back tomorrow!",
          },
        ]);
        break;
      }

      if (done) break;

      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content,
        },
      ]);
    }

    setLoading(false);

    if (window.onNotThinking) window.onNotThinking();
  };

  useEffect(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const inputClasses = clsx(
    {
      "opacity-[0.3] cursor-not-allowed": hasNoLimit,
    },
    "w-full h-[max(4vw,4rem)] text-[max(1.2vw,1.2rem)] bg-[#dfd3c0] text-gray-950",
    "placeholder:text-gray-950 p-[max(1vw,1rem)] rounded-[1.5vw] pl-[2vw] pr-[4vw]",
    "border-0 focus:ring-0 focus:outline-none focus:ring-offset-0 focus:border-0 font-sans pr-12"
  );

  const buttonClasses = clsx(
    {
      "opacity-[0.3] cursor-not-allowed": hasNoLimit,
    },
    "absolute right-[1vw] top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-black/5"
  );

  return (
    <>
      <div className="min-h-screen p-[max(1vw,1rem)] relative z-2 flex items-end">
        <h1 className="absolute top-8 left-0 text-[min(6vw,2rem)] text-center w-full text-[#dfd3c0] font-orbitron">
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

          {loading && <AiMessage loading />}

          {/* Message input */}
          <form onSubmit={handleSubmit} className="w-full mx-auto relative">
            <Input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={handleInputChange}
              disabled={hasNoLimit}
              className={inputClasses}
            />
            <button
              type="submit"
              disabled={hasNoLimit}
              className={buttonClasses}
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
