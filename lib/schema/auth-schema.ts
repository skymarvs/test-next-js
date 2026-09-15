import z from "zod";

export const authSchema = z.object({
    username: z.string()
        .min(8, "Username must be at least 8 characters."),
    password: z.string()
        .min(8, "Password must be at least 8 characters.")
        .regex(/^[a-zA-Z0-9]+$/, "Password must be alphanumeric.")
})

export type authSchemaType = z.infer<typeof authSchema>;