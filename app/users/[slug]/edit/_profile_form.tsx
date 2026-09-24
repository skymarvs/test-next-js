import { updateProfile } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { useAuthPayload } from "@/contexts/auth-provider";
import { ProfileEditSchema, ProfileEditSchemaType } from "@/lib/schema/profile-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

export default function UpdateProfileForm() {
    const auth = useAuthPayload();
    const router = useRouter();
    const profileForm = useForm<ProfileEditSchemaType>({
        resolver: zodResolver(ProfileEditSchema),
        defaultValues: {
        firstName: auth?.user_metadata?.first_name,
        lastName: auth?.user_metadata?.last_name,
        email: auth?.user_metadata?.email,
        } 
    })

    const handleProfileEditBtnClick = (formData : ProfileEditSchemaType) => {
        toast.promise(updateProfile(formData), {
        loading: "Profile updating ...",
        success: () => {
            router.refresh()
            return "Profile update successful.";
        },
        error: (err) => `Failed: ${err.message}`,
        });
    }

    return (<>
        <form onSubmit={profileForm.handleSubmit(handleProfileEditBtnClick)} className="lg:w-1/2">
            <Card>
                <CardHeader>
                    <CardTitle>Profile details</CardTitle>
                </CardHeader>
                <CardContent>
                    <FieldGroup>
                        <Controller 
                        name="firstName"
                        control={profileForm.control} 
                        render={({field, fieldState}) => (
                            <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="firstName">First name</FieldLabel>
                            <FieldContent>
                                <Input
                                {...field}
                                id="firstName"
                                placeholder="Jane"
                                aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]}/>
                                )}
                            </FieldContent>
                            </Field>
                        )}/>
                        <Controller
                        name="lastName"
                        control={profileForm.control}
                        render={({field, fieldState}) => (
                            <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="lastName">Last name</FieldLabel>
                            <FieldContent>
                                <Input
                                {...field}
                                id="lastName"
                                placeholder="Doe"
                                aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]}/>
                                )}
                            </FieldContent>
                            </Field>
                        )}
                        />
                        <Controller
                        name="email"
                        control={profileForm.control}
                        render={({field, fieldState}) => (
                            <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <FieldContent>
                                <Input
                                {...field}
                                id="email"
                                type="email"
                                placeholder="jane@example.com"
                                readOnly={auth?.app_metadata?.provider !== 'email'}
                                className={auth?.app_metadata?.provider !== 'email' ? "bg-muted text-muted-foreground" : ""}
                                aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]}/>
                                )}
                            </FieldContent>
                            </Field>
                        )}/>
                    </FieldGroup>
                    <div className="mt-6 flex justify-end gap-2">
                        <Button type="submit">Save changes</Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    </>);
}