import { RxPeople } from "react-icons/rx";
import { RiTvLine } from "react-icons/ri";
import { LuPencilLine } from "react-icons/lu";
import { BsCameraVideo } from "react-icons/bs";
import type { Room } from "@/types/api";
import '@/styles/roomdetailcard.css'

export interface RoomEquipment {
    capacity: number,
    hasTv?: boolean,
    hasBoard?: boolean,
    hasVcs?: boolean
}

export interface RoomDetailProps {
    room: Room
}

// Функция подбора иконки по коду удобства
const getFeatureIcon = (code: string) => {
  switch (code) {
    case 'display':
      return <RiTvLine className="amenity-icon" />;
    case 'video':
      return <BsCameraVideo className="amenity-icon" />;
    case 'whiteboard':
      return <LuPencilLine className="amenity-icon" />;
  }
};

export function RoomDetailCard({room} : RoomDetailProps) {
  const officeName = room.office?.name || '';
  const address = room.office?.address || '';

  return (
    <div className="room-detail-card">
      <h1 className="room-detail-title">{room.name}</h1>
      <p className="room-detail-subtitle">
        {officeName}{officeName && address ? ' · ' : ''}{address}
      </p>

      <div className="room-detail-divider" />

      <ul className="room-amenities-list">
        <li className="amenity-item">
          <RxPeople className="amenity-icon" />
          <span>Вместимость: до {room.capacity} человек</span>
        </li>
        {room.features?.map((feature) => (
          <li key={feature.code} className="amenity-item">
            {getFeatureIcon(feature.code)}
            <span>{feature.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RoomDetailCard