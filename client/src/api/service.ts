import { request } from "./client";
import type { Office, Room, Booking, CreateBookingPayload, User } from "@/types/api";

export const api = {
    
    //Получиь пользователя
    getUser: async() => await request<User>('/me'),

    //Получить офисы
    getOffices: async() => {
        const res = await request<{items: Office[]}>('/offices')
        return res.items
    },

    // Комнаты по офису с фильтрами
    getRooms: async (params: { officeId: string; minCapacity?: number; from?: string; to?: string;}) => {
        const query = new URLSearchParams({officeId: params.officeId})
        if (params.minCapacity) query.append('minCapacity', params.minCapacity.toString())
        if (params.from) query.append('from', params.from)
        if (params.to) query.append('to', params.to)

        const res = await request<{items: Room[]}>(`/rooms?${query.toString()}`)
        return res.items
    },

    //Информация о комнате
    getRoomById: (roomId: string) => request<Room>(`/rooms/${roomId}`),

    //РАсписание комнаты
    getRoomBookings: async (params: {roomId: string, from: string, to: string}) => {
        const res = await request<{items: Booking[]}>(`/rooms/${params.roomId}/bookings?from=${encodeURIComponent(params.from)}&to=${encodeURIComponent(params.to)}`)
        return res.items
    },

    // Бронирование пользователя
    getMyBooking: async (scope: 'upcoming' | 'past' | 'all' = 'upcoming', officeId?: string) => {
        const query = new URLSearchParams({scope})
        if (officeId) query.append('officeId', officeId)
        const res = await request<{items: Booking[]}>(`/bookings?${query.toString()}`)
        return res.items
    },

    createBooking: (data: CreateBookingPayload) =>
        request<Booking>('/bookings', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    
    cancelBooking: (bookingId: string) => 
        request<void>(`/bookings/${bookingId}`,{
            method: 'DELETE'
        }),
}