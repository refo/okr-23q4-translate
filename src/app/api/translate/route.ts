import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextRequest } from "next/server";
import { openai } from "@/app/api/openai-client";
import { UserPayload } from "@/app/api/types";

export const runtime = "edge";

const instructions = `You will be provided a json object with "from", "to" and "text" properties.
You should return the translated text only.
Response should be text/plain.`;

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  UserPayload.parse(JSON.parse(messages[messages.length - 1].content));

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: [
      { role: "assistant", content: instructions },
      ...(messages || []),
    ],
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
