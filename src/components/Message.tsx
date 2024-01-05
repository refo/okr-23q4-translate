"use client";
import { Avatar, Badge, Box, Group, Text, Tooltip } from "@mantine/core";
import { Bot, User } from "lucide-react";
import { FC, ReactNode, useMemo } from "react";
import { UserPayload } from "@/app/api/types";
import { findLanguageName, languages } from "@/app/api/languages";

export const UserMessage: FC<{ message: string }> = (props) => {
  const userMessage = UserPayload.parse(JSON.parse(props.message));

  const badge = useMemo(() => {
    const names = `${findLanguageName(userMessage.from)} - ${findLanguageName(
      userMessage.to
    )}`;
    const codes = `${userMessage.from} - ${userMessage.to}`;
    return (
      <Tooltip label={names}>
        <Badge size="xs">{codes}</Badge>
      </Tooltip>
    );
  }, [userMessage.from, userMessage.to]);

  return (
    <Message
      message={userMessage.text}
      badge={badge}
      avatar={
        <Avatar color="blue">
          <User />
        </Avatar>
      }
    />
  );
};
export const BotMessage: FC<{ message: string }> = (props) => {
  return (
    <Message
      {...props}
      avatar={
        <Avatar color="green">
          <Bot />
        </Avatar>
      }
      className="mb-8"
    />
  );
};
const Message: FC<{
  message: string;
  avatar?: ReactNode;
  badge?: ReactNode;
  className?: string;
}> = (props) => {
  const messageLines = props.message.split("\n");

  return (
    <Group wrap="nowrap" align="start" className={props.className}>
      {props.avatar}
      <Box mt={props.badge ? 0 : 8}>
        {props.badge}
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
