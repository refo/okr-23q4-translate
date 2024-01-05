import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Container } from "@mantine/core";
import Link, { LinkProps } from "next/link";
import { PropsWithChildren } from "react";

const repoSlug = "okr-23q4-translate";
const repoUrl = "https://github.com/refo/okr-23q4-translate";

export default function IndexPage() {
  return (
    <Container className="h-full flex flex-col items-center justify-center gap-5 ">
      <h1 className="text-4xl font-bold">
        Welcome to &quot;
        <a href={repoUrl} target="_blank">
          {repoSlug}
        </a>
        &quot; repository showcase
      </h1>
      <div className="text-xl">
        Use one of the following links to navigate to the example pages:
      </div>
      <SignedOut>
        <SignInButton>Please sign in to comtinue</SignInButton>
      </SignedOut>
      <SignedIn>
        <div className="flex flex-row gap-8">
          <LinkButton href="/translate">Translate</LinkButton>
          <LinkButton href="/chat">Chat</LinkButton>
        </div>
      </SignedIn>
      <SignedIn>
        <div className="flex items-center gap-3 mt-5">
          You are signed in as
          <UserButton showName afterSignOutUrl="/" />
        </div>
      </SignedIn>
    </Container>
  );
}

const LinkButton = (props: PropsWithChildren<LinkProps>) => (
  <Link
    {...props}
    className="flex px-10 py-5 rounded-xl border bg-white hover:border-slate-500 shadow hover:shadow-lg transition-all"
  />
);
