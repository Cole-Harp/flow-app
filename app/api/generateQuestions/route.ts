import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
// import { kv } from "@vercel/kv";
// import { Ratelimit } from "@upstash/ratelimit";

const config = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(config);

export const runtime = "edge";

export async function POST(req: Request): Promise<Response> {
  // if (
  //   process.env.NODE_ENV != "development" &&
  //   process.env.KV_REST_API_URL &&
  //   process.env.KV_REST_API_TOKEN
  // ) {
  //   const ip = req.headers.get("x-forwarded-for");
  //   const ratelimit = new Ratelimit({
  //     redis: kv,
  //     limiter: Ratelimit.slidingWindow(50, "1 d"),
  //   });

  //   const { success, limit, reset, remaining } = await ratelimit.limit(
  //     `novel_ratelimit_${ip}`,
  //   );

  //   if (!success) {
  //     return new Response("You have reached your request limit for the day.", {
  //       status: 429,
  //       headers: {
  //         "X-RateLimit-Limit": "100000",
  //         "X-RateLimit-Remaining": remaining.toString(),
  //         "X-RateLimit-Reset": reset.toString(),
  //       },
  //     });
  //   }
  // }

  let { prompt } = await req.json();

  const response = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "You are an AI writing assistant that helps people learn as effeciently as possible" +
          "Create questions that will help the user learn the content provded most efficiently" + "Provide a holistic answer key",
        // we're disabling markdown for now until we can figure out a way to stream markdown text with proper formatting: https://github.com/steven-tey/novel/discussions/7
        // "Use Markdown formatting when appropriate.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    n: 1,
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}