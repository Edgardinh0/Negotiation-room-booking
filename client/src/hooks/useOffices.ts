import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/service";
import type { Office } from "@/types/api";

export function useOffices() {
    return useQuery<Office[], Error>({
        queryKey: ['offices'],
        queryFn: api.getOffices,
        staleTime: 1000 * 60 * 60
    })
}