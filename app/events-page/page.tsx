import { EventCard, EventDataProps } from "./event-card";

const getData = async () : Promise<EventDataProps[]> => {
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
            title: "Test Title",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised thanks to these sheets and more recently with desktop publishing software like Aldus PageMaker and Microsoft Word including versions of Lorem Ipsum.",
            availableSeats: 1
        }
    ];
}

export default async function EventsPage(){
    const events = await getData();
    return(<>
        <h1 className="mb-4">Events</h1>
        <div className="grid grid-cols-3 gap-16">
            {
                events.map((item : EventDataProps) => (
                    <EventCard key={item.id} title={item.title} description={item.description} availableSeats={0}/>
                ))
            }
        </div>
    </>);
}