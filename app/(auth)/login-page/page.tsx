'use client'

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authSchema, authSchemaType } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

export default function SignInPage(){
    const router = useRouter();
    const form = useForm<authSchemaType>({
        resolver: zodResolver(authSchema),
        defaultValues: {
            username: "",
            password: ""
        }
    });

    function onSubmit(data: authSchemaType){
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
        <div className="text-xs text-center">
            Don't have an account?
            <Button variant="link" className="px-1" onClick={() => router.push("/signup-page")}>Sign-up</Button>
        </div>
    </>)
}
