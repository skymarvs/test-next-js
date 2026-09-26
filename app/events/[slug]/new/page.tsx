"use client";

import {
  useState,
  useRef,
  type ChangeEvent,
  type DragEvent as ReactDragEvent,
  useEffect,
} from "react";
import { ImagePlus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useAuthPayload } from "@/contexts/auth-provider";
import { CreateEventSchema, CreateEventSchemaType } from "@/lib/schema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { toast } from "@/components/ui/toast";
import { createEvent } from "@/app/actions/events";
import { unwrapActionResult } from "@/lib/utils";

export default function CreateNewEventPage() {
  const auth = useAuthPayload();
  const router = useRouter();

  useEffect(() => {
    if(!auth?.sub){
      router.back();
    }
  }, [auth, router])

  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createEventForm = useForm<CreateEventSchemaType>({
    resolver: zodResolver(CreateEventSchema),
    defaultValues: {
      image: undefined,
      title: "",
      description: "",
    }
  })

  function handleFile(file: File | undefined) {
    if (!file) return;
    createEventForm.setValue("image", file, { shouldValidate: true})
    setPreview(URL.createObjectURL(file));
  }

  function onDrop(e: ReactDragEvent<HTMLDivElement>) {
    e.preventDefault();
    handleFile(e.dataTransfer.files?.[0]);
  }

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    handleFile(e.target.files?.[0]);
  }

  function clearImage() {
    createEventForm.resetField("image")
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function onCreateEventSubmit(data : CreateEventSchemaType) {
    const formData = new FormData();
    formData.append("image", data.image)
    formData.append("title", data.title)
    formData.append("description", data.description)
    formData.append("slots", String(data.slots))

    toast.promise(createEvent(formData).then(unwrapActionResult), {
      loading: "Creating Event...",
      success: () => {
        router.back();
        return "Event created.";
      },
      error: (err) => `Failed: ${err.message}`,
    });
  }

  const imageError = createEventForm.formState.errors.image;

  return (
    <form onSubmit={createEventForm.handleSubmit(onCreateEventSubmit)} noValidate>
      <h1 className="mb-4">New Event Page</h1>
      <div className="grid lg:flex min-h-[75vh] gap-12">
        {/* Left: image upload */}
        <div className="w-full">
          <div
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className={`relative flex h-full min-h-80 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed bg-muted/30 p-6 text-center transition-colors hover:border-muted-foreground/40 hover:bg-muted/50 ${
              imageError ? "border-destructive" : "border-muted-foreground/25"
            }`}
          >
            {preview ? (
              <>
                <img
                  src={preview}
                  alt="Event preview"
                  className="absolute inset-0 h-full w-full rounded-lg object-cover"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute right-3 top-3 border border-destructive/25"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearImage();
                  }}
                >
                  <X className="h-4 w-4 text-destructive" />
                </Button>
              </>
            ) : (
              <>
                <ImagePlus className="h-8 w-8 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </div>
                <p className="text-xs text-muted-foreground">
                  PNG or JPG, up to 5MB
                </p>
              </>
            )}
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onInputChange}
              className="hidden"
            />
          </div>
          {imageError && (
            <p className="mt-2 text-sm text-destructive">{imageError.message}</p>
          )}
        </div>

        {/* Right: event details */}
        <div className="flex w-full flex-col gap-6">
          <Controller
            name="title"
            control={createEventForm.control}
            render={({field, fieldState}) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="title">Title</FieldLabel>
                <Input
                  {...field}
                  id="title"
                  placeholder="Give your event a name"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]}/>
                )}
              </Field>
            )}/>

          <Controller
            name="description"
            control={createEventForm.control}
            render={({field, fieldState}) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  {...field}
                  id="description"
                  placeholder="What's this event about?"
                  className="min-h-40 resize-none"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]}/>
                )}
              </Field>
            )}/>

          <div className="flex items-end justify-between gap-2">
            <Controller
              name="slots"
              control={createEventForm.control}
              render={({field, fieldState}) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="slots">Available slots</FieldLabel>
                  <Input
                    {...field}
                    id="slots"
                    type="number"
                    placeholder="e.g. 20"
                    className="max-w-40"
                    aria-invalid={fieldState.invalid}
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const v = e.target.valueAsNumber;
                      field.onChange(Number.isNaN(v) ? undefined : v);
                    }}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]}/>
                  )}
                </Field>
              )}/>
            <div className="flex gap-2">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit">Create event</Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

