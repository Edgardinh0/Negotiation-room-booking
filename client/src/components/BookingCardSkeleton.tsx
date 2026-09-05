import '@/styles/bookingcardskeleton.css';

interface BookingCardSkeletonProps {
  /** Количество отображаемых скелетонов */
  count?: number;
}

export function BookingCardSkeleton({ count = 3 }: BookingCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="booking-card-skeleton">
          <div className="skeleton-header">
            <div className="skeleton-line skeleton-title" />
            <div className="skeleton-line skeleton-badge" />
          </div>

          <div className="skeleton-body">
            <div className="skeleton-line skeleton-info-1" />
            <div className="skeleton-line skeleton-info-2" />
          </div>

          <div className="skeleton-footer">
            <div className="skeleton-button" />
          </div>
        </div>
      ))}
    </>
  );
}