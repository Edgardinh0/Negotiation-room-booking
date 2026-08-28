import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/service";
import type { Room } from "@/types/api";

export interface UseRoomsParams {
    officeId: string;
    minCapacity?: number;
    from?: string;
    to?: string;
}

export function useRooms(params: UseRoomsParams) {
    return useQuery<Room[] | Error>({
        queryKey: ['rooms', params],
        queryFn: () => api.getRooms(params),
        enabled: Boolean(params.officeId),
        staleTime: 1000 * 60 * 2,
    })
}