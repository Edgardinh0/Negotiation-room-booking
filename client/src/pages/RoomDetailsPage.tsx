import { useParams } from "react-router-dom"

function RoomDetailsPage () {
    const {roomId} = useParams<{ roomId: string}>()
    
    return (
        <>
            <div><h1>Room ID: {roomId}</h1></div>
        </>
    )
}

export default RoomDetailsPage