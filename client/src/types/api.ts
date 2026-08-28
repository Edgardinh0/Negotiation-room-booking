export interface User {
    id: string,
    login: string,
    displayName: string,
    email: string,
    avatarUrl: string,
    initials: string
}

export interface Office {
    id: string,
    name: string,
    address: string,
    timezone: string
}

export interface Room {
    id: string,
    officeId: string,
    name: string,
    floor: number,
    capacity: number,
    features: Array<{code: string, name: string}>
    office?: Office,
    available?: boolean,
    statusText?: string
}

export interface CreateBookingPayload {
    roomId: string,
    title: string,
    comment: string,
    startsAt: string,
    endsAt: string
}

export interface APIErrorResponse {
    error: {
        code: string,
        message: string,
        details?: Record<string, unknown>
    }
}

export interface Booking {
    id: string,
    roomId: string,
    userId: string,
    title: string,
    comment: string,
    startsAt: string,
    endsAt: string,
    createdAt: string,
    room: Room,
    office: Office,
    owner: User
}