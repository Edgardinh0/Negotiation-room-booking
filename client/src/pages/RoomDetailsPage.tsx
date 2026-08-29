import { useParams } from "react-router-dom"
import { useRoomDetails } from "@/hooks/userRoomDetails"
import { RoomSchedule } from "@/components/RoomSchedule"
import RoomDetailCard from "@/components/RoomDetailCard"
import { useState } from "react"
import { RoomDetailSkeleton } from "@/components/RoomDetailSkeleton"
import type { BookingSlot } from "@/components/RoomSchedule"
import '@/styles/roomdetail.css'

function RoomDetailsPage () {
    const {roomId} = useParams<{ roomId: string}>()
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())

    const { data: room, isLoading, isError } = useRoomDetails(roomId!)

    const handleBookClick = () => {
        console.log("Открыть модалку бронирования");
    };

    const MOCK_BOOKINGS: BookingSlot[] = [
    {
        id: "1",
        title: "Daily Sync / Команда разработки",
        startTime: "11:00",
        endTime: "12:00",
        isMine: true,
    },
    {
        id: "2",
        startTime: "15:00",
        endTime: "16:00",
        isMine: false,
    },
    ];

    console.log(room)

    if (isLoading) {
        return <RoomDetailSkeleton />
    }

    if (room) {
        return (    
            <div className="room-detail-page">
                <nav className="breadcrumbs">
                    <span>Переговорные</span>
                    <span className="separator"></span>
                    <span>{room!.office!.name}</span>
                    <span className="separator"></span>
                    <span className="active">Комната {room.name}</span>
                </nav>

                <div className="room-detail-content">
                    <aside className="room-sidebar">
                        <RoomDetailCard room={room}/>
                    </aside>

                    <main className="room-main">
                        <RoomSchedule
                            selectedDate={selectedDate}
                            onDateChange={(date) => date && setSelectedDate(date)}
                            bookings={MOCK_BOOKINGS}
                            onBookClick={handleBookClick}
                        />
                    </main>
                </div>
                
            </div>
        )
    }
}

export default RoomDetailsPage