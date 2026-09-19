"use client"

import { EventCard, EventDataProps } from "./event-card";
import { Button } from "@/components/ui/button";
import { useUserMetadata } from "@/contexts/role-provider";
import { useRouter } from "next/navigation";

const getData = () : EventDataProps[] => {
    return [
        {
            id: 1, 
            title: "Design systems meetup",
            description: "test description",
            availableSeats: 1
        },
        {
            id: 2,
            title: "Design systems meetup",
            description: "test description",
            availableSeats: 1
        },
        {
            id: 3,
            title: "Test Title asfdafsf asfdfaf fadsf afdfafads",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised thanks to these sheets and more recently with desktop publishing software like Aldus PageMaker and Microsoft Word including versions of Lorem Ipsum.",
            availableSeats: 1
        },
        {
            id: 4,
            title: "Design systems meetup",
            description: "test description",
            availableSeats: 1
        },
        {
            id: 5,
            title: "Design systems meetup",
            description: "test description",
            availableSeats: 1
        },
    ];
}

export default function EventsPage(){
    const userMetadata = useUserMetadata();
    const events = getData();
    const router = useRouter();
    return(<>
        <div className="flex items-end justify-between mb-4">
            <h1>Events</h1>
            {userMetadata && (
                <Button size="lg" onClick={() => router.push(`/events-page/${userMetadata?.sub}`)}>Manage Events</Button>
            )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 sm:gap-4 md:gap-8 lg:gap-12">
            {
                events.map((item : EventDataProps) => (
                    <EventCard key={item.id} title={item.title} description={item.description} availableSeats={0}/>
                ))
            }
        </div>
    </>);
}