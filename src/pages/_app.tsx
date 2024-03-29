import type { AppProps } from "next/app";
import { createTheme, MantineProvider } from "@mantine/core";

import "./globals.css";
import "@mantine/core/styles.css";
import { MantineNotifications } from "@/components/MantineNotifications";
import { ClerkProvider } from "@clerk/nextjs";

const theme = createTheme({
  primaryColor: "blue",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider>
      <MantineProvider theme={theme}>
        <Component {...pageProps} />
        <MantineNotifications />
      </MantineProvider>
    </ClerkProvider>
  );
}
