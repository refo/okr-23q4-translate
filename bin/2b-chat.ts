import { Message, openai } from "./client";
import readline from "readline";

// This is our message history.a
// We'll collect messages from the user and the assistant here.
const messages: Message[] = [
  {
    role: "system",
    content:
      "You are a helpful assistant and you always address users as friend and you havily use emojies.",
  },
];

// This helper function will send the messages to the API and stream the response.
const completeAndStream = async (messages: Message[]) => {
  const chunks = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
    stream: true,
  });

  // We are collecting the response from the API so we can return complete message.
  // This is not necessary for the chat to work.
  let response = "";

  // We'll print the response from the API as we receive it.
  for await (const chunk of chunks) {
    const content = chunk.choices[0].delta.content;
    if (content) {
      process.stdout.write(content);
      response += content;
    }
  }
  return response;
};

// Initial prompt for the user.
console.log(`
I'm your helpful assistant. Ask me anything and when you're done, say "bye".
> chat:`);

/**
 * This is the main loop of the chat.
 * We'll read lines from the user and send them to the API.
 * Then, we'll print the response from the API.
 * Finally, we'll print a new prompt for the user.
 */
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on("line", async (line) => {
  messages.push({ role: "user", content: line });

  console.log("< assistant:");
  const response = await completeAndStream(messages);
  messages.push({ role: "assistant", content: response });

  // We'll print a blank line to separate the messages.
  console.log("");
  console.log("");

  // If the user says "bye", we'll exit the program.
  if (line === "bye") {
    process.exit(0);
  }
  console.log("> chat:");
});
