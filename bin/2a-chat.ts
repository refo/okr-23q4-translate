import { openai } from "./client";

const chunks = await openai.chat.completions.create({
  model: "gpt-3.5-turbo",
  messages: [
    {
      role: "system",
      content:
        "You are a helpful assistant and you always address users as friend.",
    },
    {
      role: "user",
      content: "Hello, how are you?",
    },
  ],
  stream: true,
});

for await (const chunk of chunks) {
  const content = chunk.choices[0].delta.content;
  if (content) {
    process.stdout.write(content);
  }
}
