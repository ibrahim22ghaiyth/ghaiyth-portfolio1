import { z } from "zod/v4";

export const messageInputSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z
    .string()
    .trim()
    .max(254)
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Invalid email address"),
  subject: z.string().trim().min(2).max(200),
  message: z.string().trim().min(5).max(5000),
});

export type MessageInput = z.infer<typeof messageInputSchema>;
