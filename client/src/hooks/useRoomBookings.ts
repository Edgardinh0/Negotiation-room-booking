import { useQuery } from "@tanstack/react-query";
import type { Booking } from "@/types/api";
import type { BookingSlot } from "@/components/RoomSchedule";
import { api } from "@/api/service";

interface RoomBookingParams {
  from: string;
  to: string;
  roomId?: string;
  currentUserId?: string;
}

function formatTimeToHHMM(isoString: string): string {
  const date = new Date(isoString);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function useRoomBookings({
  from,
  to,
  roomId,
  currentUserId,
}: RoomBookingParams) {
  return useQuery<Booking[], Error, BookingSlot[]>({
    queryKey: ["roomBookings", roomId, from, to],
    queryFn: () => {
      if (!roomId) throw new Error("roomId is required");
      return api.getRoomBookings({ roomId, from, to });
    },
    // Включаем запрос только если есть все три параметра
    enabled: Boolean(roomId && from && to),
    staleTime: 0,
    select: (bookings: Booking[]): BookingSlot[] => {
      return bookings.map((item) => ({
        id: item.id,
        title: item.title || item.owner?.displayName || "Занято",
        startTime: formatTimeToHHMM(item.startsAt),
        endTime: formatTimeToHHMM(item.endsAt),
        isMine: Boolean(
          currentUserId &&
            (item.userId === currentUserId || item.owner?.id === currentUserId)
        ),
      }));
    },
  });
}