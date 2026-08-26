import { useWebSocket } from "@/hooks/useWebSocket";
import { NavLink, Outlet } from "react-router-dom";

function MainLayout() {
    useWebSocket()
    
    return(
        <div>
            <header>
                <h2>BookRoom</h2>
                <div>
                    <NavLink to='/rooms'>Переговорные</NavLink>
                    <NavLink to='/bookings'>Мои бронирования</NavLink>
                </div>
            </header>

            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default MainLayout