import { z } from "zod";

/**
 * Contact form rules. Used by the form for inline errors and by the API
 * route as the real gatekeeper (the server never trusts the client).
 */
export const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(100, "Keep this under 100 characters."),
  businessName: z
    .string()
    .trim()
    .min(1, "Please enter your business name.")
    .max(150, "Keep this under 150 characters."),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email.")
    .max(254, "That email is too long.")
    .pipe(z.email("Please enter a valid email address.")),
  phone: z.string().trim().max(40, "Keep this under 40 characters.").optional().default(""),
  message: z
    .string()
    .trim()
    .min(10, "Please write at least 10 characters.")
    .max(5000, "Keep your message under 5,000 characters."),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;
export type ContactField = keyof ContactData;

/** Name of the hidden spam trap field. Real visitors never fill it in. */
export const HONEYPOT_FIELD = "company_website";
