import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const prompt = `Fill in the blanks.
Today is Dec 1, 2023.
My name is Robert Downey Jr. and I'm a __ years old actor.
My top grossing movie is __ and I played __ in it.`;

const response = await openai.completions.create({
  model: "gpt-3.5-turbo-instruct",
  prompt,
});

console.log(response.choices[0].text);
