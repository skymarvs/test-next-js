import z from "zod";

export const SignupSchema = z.object({
    firstName: z.string()
        .min(3, "First name must be at least 3 characters.")
        .regex(/^[a-zA-Z]+( [a-zA-Z]+)*$/, "Must contain words separated by a single space only"),
    lastName: z.string()
        .min(3, "Last name must be at least 3 characters.")
        .regex(/^[a-zA-Z]+( [a-zA-Z]+)*$/, "Must contain words separated by a single space only"),
    email: z.email()
        .min(8, "Username must be at least 8 characters."),
    password: z.string()
        .min(8, "Password must be at least 8 characters.")
        .regex(/^[a-zA-Z0-9]+$/, "Password must be alphanumeric."),
    passwordConfirmation: z.string()
        .min(8, "Password must be at least 8 characters.")
        .regex(/^[a-zA-Z0-9]+$/, "Password must be alphanumeric.")
})
.refine((data) => data.password === data.passwordConfirmation, {
    message : "Password don't match",
    path: ['passwordConfirmation']
})

export const LoginSchema = z.object({
    email: z.email()
        .min(8, "Username must be at least 8 characters."),
    password: z.string()
        .min(8, "Password must be at least 8 characters.")
        .regex(/^[a-zA-Z0-9]+$/, "Password must be alphanumeric.")
})

export type SignupSchemaType = z.infer<typeof SignupSchema>;
export type LoginSchemaType = z.infer<typeof LoginSchema>;