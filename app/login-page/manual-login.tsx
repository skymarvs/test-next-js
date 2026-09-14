import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function ManualLogin(){
    return (<>
        <form>
            <FieldSet>
                <FieldLegend>Sign In</FieldLegend>
                <FieldDescription>Welcome back, Sign in to your account</FieldDescription>
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="username">Username</FieldLabel>
                        <Input id="name" autoComplete="off" placeholder="Type your username here" required/>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <Input id="username" autoComplete="off" type="password" placeholder="Type your password here" required />
                    </Field>
                    <Field>
                        <Button type="submit">Login</Button>
                    </Field>
                </FieldGroup>
            </FieldSet>
        </form>  
    </>)
}