import { useWebSocket } from "@/hooks/useWebSocket";
import { NavLink, Outlet } from "react-router-dom";
import '@/styles/mainlayout.css'

function MainLayout() {
    useWebSocket()
    
    return(
        <div style={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
            <header>
                <div className="app-brand">
                    <img style={{height: '36px', width: '36px'}} src="/logo-icon.jpg" alt='app-icon'></img>
                    <h2 style={{fontSize: '1.3rem', fontWeight: '800'}}>BookRoom</h2>
                </div>
                <div className="nav-links">
                    <NavLink className="nav-link" to='/rooms'>Переговорные</NavLink>
                    <NavLink className='nav-link' to='/bookings'>Мои бронирования</NavLink>
                </div>
                <div className="profile">
                    <span >placeholder name</span>
                    <img style={{height: '40px', width: '40px', borderRadius: '20px'}} alt="avatar"></img>
                </div>
            </header>

            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default MainLayout