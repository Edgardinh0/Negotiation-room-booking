import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/service";
import { useRoomDetails } from "@/hooks/useRoomDetails";
import { useRoomBookings } from "@/hooks/useRoomBookings";

import RoomDetailCard from "@/components/RoomDetailCard";
import { RoomSchedule } from "@/components/RoomSchedule";
import { RoomDetailSkeleton } from "@/components/RoomDetailSkeleton";
import { CreateBookingModal } from "@/components/CreateBookingModal";
import { ErrorState } from "@/components/ErrorState";

import "@/styles/roomdetail.css";


function RoomDetailsPage() {

  const { roomId } = useParams<{ roomId: string }>();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false)

  const navigate = useNavigate()

  // 1. Данные о комнате
  const {
    data: room,
    isLoading: isRoomLoading,
    isError: isRoomError,
    refetch: refetchRoom,
  } = useRoomDetails(roomId!);

  // 2. Текущий пользователь
  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => api.getUser(),
  });

  // 3. Вычисление границ суток в UTC / ISO
  const startOfDay = new Date(selectedDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(selectedDate);
  endOfDay.setHours(23, 59, 59, 999);

  // 4. Запрос бронирований
  const {
    data: bookings = [],
    isLoading: isBookingsLoading,
    isError: isBookingsError,
    refetch: refetchBookings,
  } = useRoomBookings({
    roomId,
    from: startOfDay.toISOString(),
    to: endOfDay.toISOString(),
    currentUserId: currentUser?.id,
  });

  // 5. Загрузка данных комнаты
  if (isRoomLoading) {
    return <RoomDetailSkeleton />;
  }

  // 6. Ошибка загрузки самой комнаты
  if (isRoomError || !room) {
    return (
      <div className="room-detail-page">
        <div className="room-detail-container">
          <ErrorState
            title="Не удалось загрузить данные о комнате"
            description="Произошла ошибка при загрузке информации о переговорной"
            onRetry={() => refetchRoom()}
          />
        </div>
      </div>
    );
  }

  // 7. Полноценный рендер
  return (
    <div className="room-detail-page">
      <nav className="breadcrumbs">
        <span onClick={() => navigate('/')} style={{cursor: 'pointer'}}>Переговорные</span>
        <span className="separator">›</span>
        <span onClick={() => navigate('/')} style={{cursor: 'pointer'}}>{room.office?.name || "Офис"}</span>
        <span className="separator">›</span>
        <span className="active">Комната {room.name}</span>
      </nav>

      <div className="room-detail-content">
        <aside className="room-sidebar">
          <RoomDetailCard room={room} />
        </aside>

        <main className="room-main">
          {isBookingsError ? (
            <ErrorState
              title="Не удалось загрузить расписание"
              description="Произошла ошибка при загрузке расписания переговорной"
              onRetry={() => refetchBookings()}
            />
          ) : (
            <RoomSchedule
              selectedDate={selectedDate}
              onDateChange={(date) => date && setSelectedDate(date)}
              bookings={bookings}
              isLoading={isBookingsLoading}
              onBookClick={() => setIsModalOpen(true)}
            />
          )}
        </main>

        {isModalOpen && room && (
            <CreateBookingModal
                room={room}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                defaultDate={selectedDate}
            />
        )}
      </div>
    </div>
  );
}

export default RoomDetailsPage;