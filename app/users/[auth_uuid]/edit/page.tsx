"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { ProfileEditSchema, type ProfileEditSchemaType } from "@/lib/schema";

type FieldErrors = Partial<Record<keyof ProfileEditSchemaType, string>>;

export default function EditProfilePage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  function clearError(field: keyof ProfileEditSchemaType) {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const result = ProfileEditSchema.safeParse({
      firstName,
      lastName,
      email,
      newPassword,
      confirmPassword,
    });

    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof ProfileEditSchemaType;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    // result.data is a fully validated ProfileEditSchemaType — send it to your API here.
    console.log(result.data);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h1 className="mb-4">Edit Profile</h1>
      <Card className="mx-auto w-full max-w-xl">
        <CardHeader>
          <CardTitle>Profile details</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="firstName">First name</FieldLabel>
              <FieldContent>
                <Input
                  id="firstName"
                  placeholder="Jane"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    clearError("firstName");
                  }}
                  aria-invalid={!!errors.firstName}
                />
                <FieldError>{errors.firstName}</FieldError>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="lastName">Last name</FieldLabel>
              <FieldContent>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    clearError("lastName");
                  }}
                  aria-invalid={!!errors.lastName}
                />
                <FieldError>{errors.lastName}</FieldError>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <FieldContent>
                <Input
                  id="email"
                  type="email"
                  placeholder="jane@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError("email");
                  }}
                  aria-invalid={!!errors.email}
                />
                <FieldError>{errors.email}</FieldError>
              </FieldContent>
            </Field>

            <FieldSeparator>Password</FieldSeparator>

            <Field>
              <FieldLabel htmlFor="newPassword">New password</FieldLabel>
              <FieldContent>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Leave blank to keep current password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    clearError("newPassword");
                  }}
                  aria-invalid={!!errors.newPassword}
                />
                <FieldError>{errors.newPassword}</FieldError>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="confirmPassword">
                Confirm new password
              </FieldLabel>
              <FieldContent>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    clearError("confirmPassword");
                  }}
                  aria-invalid={!!errors.confirmPassword}
                />
                <FieldError>{errors.confirmPassword}</FieldError>
              </FieldContent>
            </Field>
          </FieldGroup>

          <div className="mt-6 flex justify-end gap-2">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit">Save changes</Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
