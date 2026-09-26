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
import { useParams, useRouter } from "next/navigation";
import { useAuthPayload } from "@/contexts/auth-provider";
import { UpdateEventSchema, UpdateEventSchemaType } from "@/lib/schema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { toast } from "@/components/ui/toast";
import { updateEvent } from "@/app/actions/events";
import createClient from "@/lib/supabase/client";
import { Event } from "@/lib/types/models";

const getEvent = async (id: number): Promise<Event> => {
  const supabase = createClient();
  const { data, error } = await supabase.from("events").select("*").eq("id", id).single();
  if(error){
    throw new Error(error.message);
  }
  return data;
};

export default function UpdateEventPage() {
  const auth = useAuthPayload();
  const router = useRouter();
  const { slug, event_id } = useParams<{ slug: string; event_id: string }>();

  useEffect(() => {
    if(!auth?.sub){
      router.back();
      return;
    }
    if(auth.sub !== slug){
      router.back();
    }
  }, [auth, slug, router])

  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateEventForm = useForm<UpdateEventSchemaType>({
    resolver: zodResolver(UpdateEventSchema),
    defaultValues: {
      id: Number(event_id),
      image: undefined,
      title: "",
      description: "",
    }
  })

  useEffect(() => {
    const _getEvent = async () => {
      try {
        const event = await getEvent(Number(event_id));
        updateEventForm.reset({
          id: event.id,
          image: undefined,
          title: event.title,
          description: event.description ?? "",
          slots: event.max_slot,
        });
        setPreview(`${process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_BUCKET_EVENT_COVER}/${event.image_link}`);
      } catch (error) {
        if (error instanceof Error) {
          toast.add({
            title: "Failed to fetch event.",
            description: error.message,
            type: "error",
          });
        }
      }
    }
    _getEvent();
  }, [event_id, updateEventForm])

  function handleFile(file: File | undefined) {
    if (!file) return;
    updateEventForm.setValue("image", file, { shouldValidate: true})
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
    updateEventForm.resetField("image")
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function onUpdateEventSubmit(data : UpdateEventSchemaType) {
    const formData = new FormData();
    formData.append("id", String(data.id))
    if (data.image) {
      formData.append("image", data.image)
    }
    formData.append("title", data.title)
    formData.append("description", data.description)
    formData.append("slots", String(data.slots))

    toast.promise(updateEvent(formData), {
      loading: "Updating Event...",
      success: () => {
        router.back();
        return "Event updated.";
      },
      error: (err) => `Failed: ${err.message}`,
    });
  }

  const imageError = updateEventForm.formState.errors.image;

  return (
    <form onSubmit={updateEventForm.handleSubmit(onUpdateEventSubmit)} noValidate>
      <h1 className="mb-4">Update Event Page</h1>
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
            control={updateEventForm.control}
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
            control={updateEventForm.control}
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
              control={updateEventForm.control}
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
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit">Update event</Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
