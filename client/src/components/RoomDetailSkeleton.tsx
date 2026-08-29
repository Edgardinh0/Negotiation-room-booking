import "@/styles/roomdetailskeleton.css";

export function RoomDetailSkeleton() {
  return (
    <div className="room-detail-skeleton-page">
      {/* Хлебные крошки скелетон */}
      <div className="skeleton-breadcrumbs">
        <div className="skeleton-box skeleton-crumb" />
        <span className="skeleton-sep">›</span>
        <div className="skeleton-box skeleton-crumb" />
        <span className="skeleton-sep">›</span>
        <div className="skeleton-box skeleton-crumb-long" />
      </div>

      <div className="room-detail-content">
        {/* Левая карточка скелетон */}
        <aside className="room-sidebar">
          <div className="skeleton-card">
            <div className="skeleton-box skeleton-title" />
            <div className="skeleton-box skeleton-subtitle" />
            <div className="skeleton-divider" />
            <div className="skeleton-amenities">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton-amenity-row">
                  <div className="skeleton-box skeleton-icon" />
                  <div className="skeleton-box skeleton-text" />
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Расписание скелетон */}
        <main className="room-main">
          <div className="skeleton-schedule-card">
            <div className="skeleton-schedule-header">
              <div>
                <div className="skeleton-box skeleton-sch-title" />
                <div className="skeleton-box skeleton-sch-subtitle" />
              </div>
              <div className="skeleton-box skeleton-date-btn" />
            </div>

            {/* Сетка часов */}
            <div className="skeleton-timeline">
              {Array.from({ length: 11 }).map((_, i) => (
                <div key={i} className="skeleton-timeline-row">
                  <div className="skeleton-box skeleton-hour" />
                  <div className="skeleton-line" />
                </div>
              ))}
            </div>

            <div className="skeleton-schedule-footer">
              <div className="skeleton-box skeleton-submit-btn" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}