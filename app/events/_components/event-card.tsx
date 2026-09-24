import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import createClient from "@/lib/supabase/client";
import { Event } from "@/lib/types/models";
import { cn } from "cn";

export function EventCard(props: Event) {
  const supabase = createClient();
  let imagePath = null;
  if(props.image_link){
    imagePath = supabase.storage.from('event-cover').getPublicUrl(props.image_link);
  }
  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <div className={cn(
        "absolute inset-0 z-30 aspect-video",
        !imagePath && "bg-black/35"
        )} />
      <img
        src={imagePath?.data.publicUrl ?? "https://avatar.vercel.sh/shadcn1"}
        alt="Event cover"
        className={cn(
          "relative z-20 aspect-video w-full object-cover",
          !imagePath && "brightness-60 grayscale dark:brightness-40"
        )}
      />
      <CardHeader className="min-h-20 max-h-20 content-start">
        <CardAction>
          <Badge variant="secondary">Slot left: {props.max_slot}</Badge>
        </CardAction>
        <CardTitle className="line-clamp-1">{props.title}</CardTitle>
        <CardDescription className="line-clamp-3 col-span-2 text-justify">
          {props.description}
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full">View Event</Button>
      </CardFooter>
    </Card>
  );
}
