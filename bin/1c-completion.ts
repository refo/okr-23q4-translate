import { openai } from "./client";

const prompt = `Fill in the blanks.
Today is Dec 1, 2023.
My name is Robert Downey Jr. and I'm a __ years old actor.
My top grossing movie is __ and I played __ in it.`;

const chunks = await openai.completions.create({
  model: "gpt-3.5-turbo-instruct",
  prompt,
  stream: true,
  max_tokens: 1024,
});

// We'll print the response from the API as we receive it.
for await (const chunk of chunks) {
  const content = chunk.choices[0].text;
  if (content) {
    process.stdout.write(content);
  }
}
