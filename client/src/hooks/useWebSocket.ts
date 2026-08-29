import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export const useWebSocket = () => {
    const queryClient = useQueryClient()
    
    useEffect(() => {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host;
        const wsUrl = `${protocol}//${host}/api/v1/ws`;
        
        const socket = new WebSocket(wsUrl)

        socket.onopen = () => {
            console.log('WebSocket connected')
        }

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data)
                console.log('WS: ', data)

                queryClient.invalidateQueries()
            } catch (err) {
                console.log('Error: ', err)
            }
        }

        socket.onerror = (error) => {
            console.log('WebSOcket error: ', error)
        }

        socket.onclose = () => {
            console.log('WebSocket close its connection')
        }

        
        return () => {
            socket.onopen = null
            socket.onmessage = null
            socket.onerror = null
            socket.onclose = null

            if (socket.readyState === WebSocket.CONNECTING || socket.readyState === WebSocket.OPEN) {
                socket.close()
            }
        }
       
    }, [queryClient])
}