'use client'

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
    username: z.string()
        .min(8, "Username must be at least 8 characters."),
    password: z.string()
        .min(8, "Password must be at least 8 characters.")
        .regex(/^[a-zA-Z0-9]+$/, "Password must be alphanumeric.")
})

type formSchemaType = z.infer<typeof formSchema>;

export default function ManualLogin(){
    const form = useForm<formSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: ""
        }
    });

    function onSubmit(data: formSchemaType){
        console.log("submit succesfull")
    }

    return (<>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldSet>
                <FieldLegend>Sign In</FieldLegend>
                <FieldDescription>Welcome back, Sign in to your account</FieldDescription>
                <FieldGroup>
                    <Controller 
                        name="username"
                        control={form.control}
                        render={({field, fieldState}) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="username">Username</FieldLabel>
                                <Input
                                    {...field}
                                    aria-invalid={fieldState.invalid}
                                    id="name"
                                    autoComplete="off" 
                                    placeholder="Type your username here"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        name="password"
                        control={form.control}
                        render={({field, fieldState}) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="password">Password</FieldLabel>
                                <Input 
                                    {...field}
                                    aria-invalid={fieldState.invalid}
                                    id="password" 
                                    autoComplete="off" 
                                    type="password" 
                                    placeholder="Type your password here" 
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Field>
                        <Button type="submit">Login</Button>
                    </Field>
                </FieldGroup>
            </FieldSet>
        </form>  
    </>)
}
