"use client";
import {
  Avatar,
  Box,
  Button,
  Container,
  FocusTrap,
  Group,
  ScrollArea,
  Stack,
  Text,
  Textarea,
} from "@mantine/core";
import { getHotkeyHandler } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useChat } from "ai/react";
import { Bot, User } from "lucide-react";
import { FC, ReactNode, useCallback, useEffect, useRef } from "react";

export default function ChatPage() {
  const { messages, input, handleInputChange, setInput, append, isLoading } =
    useChat({
      api: "/api/chat",
      initialMessages: [
        {
          id: "initial",
          role: "assistant",
          content:
            "Hello, I'm your OpenAI assistant. How can I help you today?",
        },
      ],
      onError: (error) => {
        notifications.show({ message: error.message, color: "red" });
      },
    });

  const viewport = useRef<HTMLDivElement>(null);

  const handleSend = useCallback(() => {
    append({ role: "user", content: input });
    setInput("");
  }, [append, input, setInput]);

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
      <ScrollArea className="flex-grow" viewportRef={viewport}>
        <Stack className="mb-10">
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
        <Group>
          <Textarea
            autosize
            minRows={1}
            maxRows={4}
            className="flex-grow"
            value={input}
            onChange={handleInputChange}
            onKeyDown={getHotkeyHandler([["enter", handleSend]])}
            disabled={isLoading}
          />
          <Button
            variant="filled"
            h="auto"
            className="self-stretch"
            disabled={!input.length}
            loading={isLoading}
            onClick={handleSend}
          >
            Send
          </Button>
        </Group>
      </FocusTrap>
    </Container>
  );
}
const UserMessage: FC<{ message: string }> = (props) => {
  return (
    <Message
      {...props}
      avatar={
        <Avatar color="blue">
          <User />
        </Avatar>
      }
    />
  );
};

const BotMessage: FC<{ message: string }> = (props) => {
  return (
    <Message
      {...props}
      avatar={
        <Avatar color="green">
          <Bot />
        </Avatar>
      }
    />
  );
};

const Message: FC<{ message: string; avatar: ReactNode }> = (props) => {
  const messageLines = props.message.split("\n");

  return (
    <Group wrap="nowrap" align="start">
      {props.avatar}
      <Box mt={8}>
        {messageLines.map((line, index) =>
          line === "" ? (
            <Text key={index}>&nbsp;</Text>
          ) : (
            <Text key={index}>{line}</Text>
          )
        )}
      </Box>
    </Group>
  );
};
