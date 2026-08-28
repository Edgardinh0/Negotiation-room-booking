import { useState } from "react";
import OfficeSelector from "@/components/OfficeSelector";
import RoomsFilters from "@/components/RoomsFilters";
import NoOfficeSelected from "@/components/NoOfficeSelected";
import { RoomCard } from "@/components/RoomCard";
import RoomSkeleton from "@/components/RoomSkeleton";
import { EmptyRoomsState } from "@/components/EmptyRoomsState";
import { ErrorState } from "@/components/ErrorState";
import { useOffices } from "@/hooks/useOffices";
import { useRooms } from "@/hooks/useRooms";
import type { FilterState } from "@/components/RoomsFilters";
import '@/styles/roomspage.css';

function RoomsPage() {
  const [selectedOfficeId, setSelectedOfficeId] = useState<string>('');
  const [minCapacity, setMinCapacity] = useState<number | undefined>(4);
  const [from, setFrom] = useState<string | undefined>();
  const [to, setTo] = useState<string | undefined>();

  const isOfficeSelected = Boolean(selectedOfficeId);

  // 1. Загрузка офисов
  const { data: offices = [], isLoading: isOfficesLoading } = useOffices();

  // 2. Загрузка комнат (выполняется только при наличии selectedOfficeId)
  const {
    data: roomsData,
    isLoading: isRoomsLoading,
    isError: isRoomsError,
    refetch: refetchRooms,
  } = useRooms({
    officeId: selectedOfficeId,
    minCapacity,
    from,
    to,
  });

  const rooms = Array.isArray(roomsData) ? roomsData : []

  // Преобразование значений из компонента фильтра в ISO строки от и до
  const handleFilterChange = (filters: FilterState) => {
    setMinCapacity(filters.capacity);

    if (
      filters.date &&
      filters.startTime.length === 5 &&
      filters.isValidTime !== false
    ) {
      const [hours, minutes] = filters.startTime.split(':').map(Number);

      const startDate = new Date(filters.date);
      startDate.setHours(hours, minutes, 0, 0);

      const endDate = new Date(startDate.getTime() + filters.duration * 60 * 1000);

      setFrom(startDate.toISOString());
      setTo(endDate.toISOString());
    } else {
      setFrom(undefined);
      setTo(undefined);
    }
  };

  return (
    <div className="rooms-page">
      <OfficeSelector
        offices={offices}
        selectedOfficeId={selectedOfficeId}
        onSelectOffice={setSelectedOfficeId}
      />

      <RoomsFilters
        isDisabled={!isOfficeSelected}
        onFilterChange={handleFilterChange}
      />

      <div className="main-content">
        {/* 1. Офис не выбран */}
        {!isOfficeSelected && <NoOfficeSelected />}

        {/* 2. Ошибка API */}
        {isOfficeSelected && isRoomsError && (
          <ErrorState onRetry={() => refetchRooms()} />
        )}

        {/* 3. Идет загрузка списка комнат */}
        {isOfficeSelected && !isRoomsError && isRoomsLoading && (
          <div className="room-cards-grid">
            {Array.from({ length: 4 }).map((_, index) => (
              <RoomSkeleton key={index} />
            ))}
          </div>
        )}

        {/* 4. Пустой результат */}
        {isOfficeSelected && !isRoomsError && !isRoomsLoading && rooms.length === 0 && (
          <EmptyRoomsState />
        )}

        {/* 5. Загруженный список переговорных */}
        {isOfficeSelected && !isRoomsError && !isRoomsLoading && rooms.length > 0 && (
          <div className="loaded-rooms">
            <h2 className="section-title">Доступные переговорные в этом офисе</h2>
            <div className="room-cards-grid">
              {rooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  onBookClick={(id) => console.log('Book room:', id)}
                  onDetailClick={(id) => console.log('Details for:', id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RoomsPage;