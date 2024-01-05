"use client";

import { Notifications } from "@mantine/notifications";

import "@mantine/notifications/styles.css";

export const MantineNotifications = () => (
  <Notifications limit={3} zIndex={1000} />
);
