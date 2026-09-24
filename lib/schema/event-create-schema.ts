import z from "zod";

export const CreateEventSchema = z.object({
  image: z
    .instanceof(File, { message: "Please upload an image" })
    .refine((file) => file.type.startsWith("image/"), "File must be an image"),
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  slots: z
    .number({ message: "Available slots is required" })
    .int("Available slots must be a whole number")
    .min(10, "Minimum of 10 slots")
    .max(999, "Maximum of 999 slots")
    .positive("Available slots must be at least 1"),
});

export type CreateEventSchemaType = z.infer<typeof CreateEventSchema>;