import { z } from "zod";

export const contactSchema = z
  .object({
    name: z.string().trim().min(1).max(100),
    email: z.string().trim().email().max(150),
    subject: z.string().trim().min(1).max(150),
    message: z.string().trim().min(1).max(2000),
  })
  .strict();

export type ContactInput = z.infer<typeof contactSchema>;
