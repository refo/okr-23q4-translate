import { z } from "zod";

export const UserPayload = z.object({
  from: z.string().length(2),
  to: z.string().length(2),
  text: z.string().min(1),
});

export type UserPayload = z.infer<typeof UserPayload>;
