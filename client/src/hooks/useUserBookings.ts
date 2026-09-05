import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/service";
import type { Booking } from "@/types/api";

export type BookingScope = 'upcoming' | 'past' | 'all'

interface UseUserBookingsOptions {
  scope?: BookingScope;
  officeId?: string;
  enabled?: boolean;
}

export function useUserBookings({scope = 'upcoming', officeId, enabled = true} : UseUserBookingsOptions) {
    return useQuery<Booking[], Error>({
        queryKey: ['userBookings', {scope, officeId: officeId || 'all'}],
        queryFn: () => api.getMyBooking(scope, officeId), 
        enabled,
        staleTime: 1000 * 60 * 5
    })
}
