import { updatePassword } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { PasswordEditSchema, PasswordEditSchemaType } from "@/lib/schema/profile-schema";
import { unwrapActionResult } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

export default function UpdatePasswordForm(){
  const router = useRouter();

  const passwordForm = useForm<PasswordEditSchemaType>({
      resolver: zodResolver(PasswordEditSchema),
      defaultValues: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      } 
  })

  const handlePasswordEditBtnClick = (formData : PasswordEditSchemaType) => {
      toast.promise(updatePassword(formData).then(unwrapActionResult), {
        loading: "Password updating ...",
        success: () => {
            router.refresh()
            return "Password update successful.";
        },
        error: (err) => `Failed: ${err.message}`,
      });
  }

  return (<>
    <form onSubmit={passwordForm.handleSubmit(handlePasswordEditBtnClick)} className="lg:w-1/2">
      <Card>
        <CardHeader>
          <CardTitle>Update Password</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
                <Controller
                    name="oldPassword"
                    control={passwordForm.control}
                    render={({field, fieldState}) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="oldPassword">Old password</FieldLabel>
                        <FieldContent>
                        <Input
                            {...field}
                            id="oldPassword"
                            type="password"
                            placeholder="Enter current password"
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
                    name="newPassword"
                    control={passwordForm.control}
                    render={({field, fieldState}) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="oldPassword">new password</FieldLabel>
                        <FieldContent>
                        <Input
                            {...field}
                            id="newPassword"
                            type="password"
                            placeholder="Enter new password"
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
                    name="confirmPassword"
                    control={passwordForm.control}
                    render={({field, fieldState}) => (
                    <Field>
                        <FieldLabel htmlFor="confirmPassword">
                        Confirm new password
                        </FieldLabel>
                        <FieldContent>
                        <Input
                            {...field}
                            id="confirmPassword"
                            type="password"
                            placeholder="Re-enter new password"
                            aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]}/>
                        )}
                        </FieldContent>
                    </Field>
                    )}
                />
          </FieldGroup>
          <div className="mt-6 flex justify-end gap-2">
            <Button type="submit">Save changes</Button>
          </div>
        </CardContent>
      </Card>
    </form>
  </>);
}