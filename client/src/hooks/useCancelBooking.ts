import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/service";

export default function useCancelBooking() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (bookingId: string) => api.cancelBooking(bookingId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['userBookings']})
        }
    })
}