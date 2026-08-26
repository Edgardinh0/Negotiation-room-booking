import { Route, Routes, Navigate } from "react-router-dom";
import MainLayout  from '@/components/MainLayout'
import RoomsPage from "@/pages/RoomsPage";
import RoomDetailsPage from "@/pages/RoomDetailsPage";
import BookingsPage from "@/pages/BookingsPage";
import NotFoundPage from "@/pages/NotFoundPage";

export const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                {/* Редирект с корня на /rooms */}
                <Route path='/' element={<Navigate to='/rooms' replace />} />

                {/* Основные роуты */}
                <Route path="/rooms" element={<RoomsPage />} />
                <Route path="/rooms/:roomId" element={<RoomDetailsPage />} />
                <Route path="/bookings" element={<BookingsPage />} />

                {/* Ошибка 404 */}
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    )
}