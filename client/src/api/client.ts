const BASE_URL = '/api/v1'

export async function request<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${BASE_URL}${url}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
        ...options,
    })

    if (!response.ok) {
        let errorData
        try {
            errorData = await response.json()
        } catch {
            // Если не пришел JSON игнорируем ошибку парсинга
        }

        const message = errorData?.error?.message || 'Ошибка при запросе'
        const code = errorData?.error?.code || 'UNKNOWN_ERROR'

        throw new Error(message, code)

    }

    if (response.status === 204) {
        return {} as T
    }

    return response.json()
}