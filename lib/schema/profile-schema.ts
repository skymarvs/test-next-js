import z from "zod";

export const ProfileEditSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, "First name is required.")
      .regex(/^[a-zA-Z]+( [a-zA-Z]+)*$/, "Alphabets only."),
    lastName: z
      .string()
      .trim()
      .min(1, "Last name is required.")
      .regex(/^[a-zA-Z]+( [a-zA-Z]+)*$/, "Alphabets only."),
    email: z.email("Enter a valid email address."),
  });

export type ProfileEditSchemaType = z.infer<typeof ProfileEditSchema>;

export const PasswordEditSchema = z
  .object({
    oldPassword: z.string()
      .trim()
      .min(8, "Password must be at least 8 characters.")
      .regex(/^[a-zA-Z0-9]+$/, "Password must be alphanumeric."),
    newPassword: z.string()
      .trim()
      .min(8, "Password must be at least 8 characters.")
      .regex(/^[a-zA-Z0-9]+$/, "Password must be alphanumeric."),
    confirmPassword: z.string()
      .trim()
      .min(8, "Password must be at least 8 characters.")
      .regex(/^[a-zA-Z0-9]+$/, "Password must be alphanumeric."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

export type PasswordEditSchemaType = z.infer<typeof PasswordEditSchema>;