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
import { Event } from "@/lib/types/models";
import { cn } from "cn";
import { useRouter } from "next/navigation";

export function EventCard(props: Event) {
  const router = useRouter();
  const redirectToShow = () => {
    router.push(`/events/${props.created_by}/show/${props.id}`)
  };

  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <div className={cn(
        "absolute inset-0 z-30 aspect-video",
        !props.image_link && "bg-black/35"
        )} />
      <img
        src={props.image_link ? `${process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_BUCKET_EVENT_COVER}/${props.image_link}` : "https://avatar.vercel.sh/shadcn1"}
        alt="Event cover"
        className={cn(
          "relative z-20 aspect-video w-full object-cover",
          !props.image_link && "brightness-60 grayscale dark:brightness-40"
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
        <Button className="w-full" onClick={redirectToShow}>View Event</Button>
      </CardFooter>
    </Card>
  );
}
