import { useQuery } from "@tanstack/react-query"
import { api } from "@/api/service"
import type { User } from "@/types/api"

export function useUser() {
    return useQuery<User, Error>({
        queryKey: ['user'],
        queryFn: api.getUser,
        staleTime: 1000 * 60 * 60
    })
}

