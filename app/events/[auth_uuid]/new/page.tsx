"use client";

import {
  useState,
  useRef,
  type ChangeEvent,
  type DragEvent as ReactDragEvent,
  type FormEvent,
} from "react";
import { ImagePlus, X } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useAuthPayload } from "@/contexts/auth-provider";

const eventSchema = z.object({
  image: z
    .instanceof(File, { message: "Please upload an image" })
    .refine((file) => file.type.startsWith("image/"), "File must be an image"),
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  slots: z
    .number({ message: "Available slots is required" })
    .int("Available slots must be a whole number")
    .positive("Available slots must be at least 1"),
});

type EventFormValues = z.infer<typeof eventSchema>;
type FieldErrors = Partial<Record<keyof EventFormValues, string>>;

export default function CreateNewEventPage() {
  const auth = useAuthPayload();
  const router = useRouter();
  if(!auth?.sub){
    router.back();
  }

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slots, setSlots] = useState<number | "">("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: undefined }));
  }

  function onDrop(e: ReactDragEvent<HTMLDivElement>) {
    e.preventDefault();
    handleFile(e.dataTransfer.files?.[0]);
  }

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    handleFile(e.target.files?.[0]);
  }

  function clearImage() {
    setImageFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const result = eventSchema.safeParse({
      image: imageFile,
      title,
      description,
      slots: slots === "" ? undefined : slots,
    });

    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof EventFormValues;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    // result.data is a fully validated EventFormValues — send it to your API here.
    console.log(result.data);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h1 className="mb-4">New Event Page</h1>
      <div className="grid lg:flex min-h-[75vh] gap-12">
        {/* Left: image upload */}
        <div className="w-full">
          <div
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className={`relative flex h-full min-h-80 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed bg-muted/30 p-6 text-center transition-colors hover:border-muted-foreground/40 hover:bg-muted/50 ${
              errors.image ? "border-destructive" : "border-muted-foreground/25"
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
                  className="absolute right-3 top-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearImage();
                  }}
                >
                  <X className="h-4 w-4" />
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
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onInputChange}
              className="hidden"
            />
          </div>
          {errors.image && (
            <p className="mt-2 text-sm text-destructive">{errors.image}</p>
          )}
        </div>

        {/* Right: event details */}
        <div className="flex w-full flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Give your event a name"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              aria-invalid={!!errors.title}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="What's this event about?"
              className="min-h-40 resize-none"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setErrors((prev) => ({ ...prev, description: undefined }));
              }}
              aria-invalid={!!errors.description}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          <div className="flex items-end justify-between gap-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="slots">Available slots</Label>
              <Input
                id="slots"
                type="number"
                min={1}
                placeholder="e.g. 20"
                value={slots}
                onChange={(e) => {
                  setSlots(e.target.value === "" ? "" : Number(e.target.value));
                  setErrors((prev) => ({ ...prev, slots: undefined }));
                }}
                className="max-w-40"
                aria-invalid={!!errors.slots}
              />
              {errors.slots && (
                <p className="text-sm text-destructive">{errors.slots}</p>
              )}
            </div>
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

