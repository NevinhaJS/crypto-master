import OpenAI from "openai";

export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

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
