
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export type EventDataProps = {
    id?: number,
    title: String,
    description: String,
    availableSeats: number
}

export function EventCard( props : EventDataProps) {
  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
      <img
        src="https://avatar.vercel.sh/shadcn1"
        alt="Event cover"
        className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
      />
      <CardHeader className="min-h-20 max-h-20 content-start">
        <CardAction>
          <Badge variant="secondary">Available</Badge>
        </CardAction>
        <CardTitle className="line-clamp">{props.title}</CardTitle>
        <CardDescription className="line-clamp-3 col-span-2 text-justify">{props.description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full">View Event</Button>
      </CardFooter>
    </Card>
  )
}
