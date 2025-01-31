import OpenAI from "openai";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { auth, User } from "@clerk/nextjs/server";
import { clerkClient } from "../models/clerk";

export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getRateLimit = (user: User | null) => {
  const subscriptionId = user?.publicMetadata.subscriptionId;
  const isPro = subscriptionId === "pro";

  const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(isPro ? 50 : 5, "1 d"),
  });

  return ratelimit;
};

export async function POST(req: Request) {
  const { messages } = await req.json();
  const ip = (req.headers.get("x-forwarded-for") ?? "127.0.0.1").split(",")[0];
  const { userId } = await auth();

  const user = userId
    ? await clerkClient.users.getUser(userId as string)
    : null;

  const ratelimit = getRateLimit(user);
  const { success } = await ratelimit.limit(ip || "127.0.0.1");

  if (!success) {
    return new Response("Rate limit exceeded", { status: 429 });
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are CryptoGuru, an expert in cryptocurrency and blockchain technology. Your knowledge covers everything from the basics of cryptocurrencies like Bitcoin and Ethereum to advanced topics like DeFi (Decentralized Finance), smart contracts, tokenomics, and crypto regulations. You stay updated on the latest trends, news, and market insights. When asked about implementing smart contracts or other technical blockchain solutions, provide a detailed tutorial with step-by-step instructions, including code examples where applicable. Explain complex topics in simple terms and provide actionable advice, but avoid giving financial advice unless explicitly requested. Be professional, engaging, and precise in your responses.",
      },
      ...messages,
    ],
    stream: true,
    max_tokens: 1024,
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of response) {
        const text = chunk.choices[0]?.delta?.content || "";

        controller.enqueue(encoder.encode(text));
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
