import OpenAI from "openai";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});
// Create a new ratelimiter, that allows 10 requests per 10 seconds
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});

export async function POST(req: Request) {
  const { messages } = await req.json();
  const ip = (req.headers.get("x-forwarded-for") ?? "127.0.0.1").split(",")[0];

  console.log(req.headers.get("x-forwarded-for"));
  console.log("clientIp", ip);
  const { success } = await ratelimit.limit(ip || "127.0.0.1");

  if (!success) {
    return new Response("Rate limit exceeded", { status: 429 });
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4",
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
