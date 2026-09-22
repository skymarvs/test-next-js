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
    newPassword: z.string().trim().optional().or(z.literal("")),
    confirmPassword: z.string().trim().optional().or(z.literal("")),
  })
  .refine((data) => !data.newPassword || data.newPassword.length >= 8, {
    message: "Password must be at least 8 characters.",
    path: ["newPassword"],
  })
  .refine(
    (data) => !data.newPassword || /^[a-zA-Z0-9]+$/.test(data.newPassword),
    {
      message: "Password must be alphanumeric.",
      path: ["newPassword"],
    }
  )
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

export type ProfileEditSchemaType = z.infer<typeof ProfileEditSchema>;
