import { useQuery } from "@tanstack/react-query";
import type { Room } from "@/types/api";
import { api } from "@/api/service";

export function useRoomDetails(roomId: string) {
    return useQuery<Room, Error>({
        queryKey: ['room', roomId],
        queryFn: () => api.getRoomById(roomId),
        enabled: Boolean(roomId),
        staleTime: 1000 * 60 * 60
    })
}