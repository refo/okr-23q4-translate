"use client";
import {
  Box,
  Button,
  Container,
  Divider,
  FocusTrap,
  ScrollArea,
  Stack,
  Textarea,
  Title,
} from "@mantine/core";
import { getHotkeyHandler } from "@mantine/hooks";
import { useChat } from "ai/react";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { LanguageChooser } from "@/components/LanguageChooser";
import { UserMessage, BotMessage } from "@/components/Message";
import { notifications } from "@mantine/notifications";
import { UserButton } from "@clerk/nextjs";

export default function TranslatePage() {
  const { messages, append, isLoading } = useChat({
    api: "/api/translate",
    initialMessages: [
      {
        id: "initial",
        role: "assistant",
        content: "Choose language pair and send your text to translate",
      },
    ],
    onError: (error) => {
      notifications.show({ message: error.message, color: "red" });
    },
  });

  const viewport = useRef<HTMLDivElement>(null);
  const textArea = useRef<HTMLTextAreaElement>(null);

  const [text, setText] = useState("");

  const [selectedLanguages, setSelectedLanguages] = useState<{
    from: string;
    to: string;
  }>();

  const handleSend = useCallback(() => {
    if (selectedLanguages) {
      append({
        role: "user",
        content: JSON.stringify({ ...selectedLanguages, text }),
      });
      setText("");
    }
  }, [append, selectedLanguages, text]);

  const handleNewLine = useCallback(() => {
    const cursorPosition = textArea.current?.selectionStart;
    console.log(cursorPosition);
    setText((current) => {
      if (cursorPosition !== undefined) {
        const copy = current.split("");
        copy.splice(cursorPosition, 0, "\n");

        setTimeout(() => {
          textArea.current?.setSelectionRange(
            cursorPosition + 1,
            cursorPosition + 1
          );
        }, 0);

        return copy.join("");
      }
      return current + "\n";
    });
  }, []);

  const scrollToBottom = useCallback(() => {
    viewport.current!.scrollTo({
      top: viewport.current!.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  return (
    <Container className="h-full flex flex-col py-5">
      <div className="flex flex-row justify-between py-1">
        <Title order={1} fz="xl">
          Translate
        </Title>
        <UserButton showName />
      </div>
      <Divider />
      <ScrollArea className="flex-grow" viewportRef={viewport}>
        <Stack className="mb-10" gap="xs">
          {messages.map((message) => {
            switch (message.role) {
              case "user":
                return (
                  <UserMessage key={message.id} message={message.content} />
                );
              case "assistant":
                return (
                  <BotMessage key={message.id} message={message.content} />
                );
              default:
                return null;
            }
          })}
        </Stack>
      </ScrollArea>
      <FocusTrap>
        <Box className="border-t border-t-slate-300 pt-5 flex flex-wrap gap-3 sm:flex-nowrap">
          <LanguageChooser
            onChange={setSelectedLanguages}
            className="flex-1 sm:flex-initial"
          />
          <Textarea
            ref={textArea}
            description="Press Alt + Enter or Option + Enter to add a new line"
            autosize
            minRows={1}
            maxRows={4}
            className="flex-grow w-full order-first sm:order-none sm:flex-1"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={getHotkeyHandler([
              ["enter", handleSend],
              ["alt+enter", handleNewLine],
            ])}
            disabled={isLoading || !selectedLanguages}
          />
          <Button
            variant="filled"
            className="self-end flex-1 sm:flex-initial"
            disabled={!text.length || !selectedLanguages}
            loading={isLoading}
            onClick={handleSend}
          >
            Send
          </Button>
        </Box>
      </FocusTrap>
    </Container>
  );
}
function append(arg0: { role: string; content: string }) {
  throw new Error("Function not implemented.");
}
