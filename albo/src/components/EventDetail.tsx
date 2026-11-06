import { useEffect, useState } from 'react'
import type { EventItem } from '../data/events'
import arrowLeft from '../assets/icons/arrow-left.svg'
import bookmarkIcon from '../assets/icons/bookmark.svg'
import shareIcon from '../assets/icons/share.svg'
import calendarIcon from '../assets/icons/calendar-days.svg'
import mapPinIcon from '../assets/icons/map-pin.svg'
import mapIcon from '../assets/icons/map.svg'

interface EventDetailProps {
  event: EventItem
  open: boolean
  onClose: () => void
  onToggleSave: (id: string) => void
}

export function EventDetail({
  event,
  open,
  onClose,
  onToggleSave,
}: EventDetailProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!open) {
      setVisible(false)
      return
    }
    const frame = window.requestAnimationFrame(() => setVisible(true))
    return () => window.cancelAnimationFrame(frame)
  }, [open, event.id])

  const handleClose = () => {
    setVisible(false)
    window.setTimeout(onClose, 250)
  }

  if (!open) return null

  return (
    <div
      className={`event-detail ${visible ? 'is-visible' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={event.title}
    >
      <div className="event-detail__scroll">
        <div className="event-detail__hero">
          <img src={event.imageUrl} alt="" className="event-detail__hero-img" />
          <div className="event-detail__hero-gradient" />
          <div className="event-detail__hero-controls">
            <button
              type="button"
              className="event-detail__circle"
              aria-label="Back"
              onClick={handleClose}
            >
              <img src={arrowLeft} alt="" width={22} height={22} />
            </button>
            <div className="event-detail__hero-actions">
              <button
                type="button"
                className={`event-detail__circle ${event.isSaved ? 'is-saved' : ''}`}
                aria-label={event.isSaved ? 'Remove bookmark' : 'Save event'}
                aria-pressed={event.isSaved}
                onClick={() => onToggleSave(event.id)}
              >
                <img src={bookmarkIcon} alt="" width={22} height={22} />
              </button>
              <button type="button" className="event-detail__circle" aria-label="Share">
                <img src={shareIcon} alt="" width={22} height={22} />
              </button>
            </div>
          </div>
        </div>

        <div className="event-detail__content">
          <div className="event-detail__badges">
            <span className={`event-card__district is-${event.districtTone}`}>
              • {event.district}
            </span>
            <span className="event-detail__chip">{event.category}</span>
            {event.admissionBadge ? (
              <span className="event-detail__chip is-admit">
                {event.admissionBadge}
              </span>
            ) : null}
          </div>

          <h1 className="event-detail__title">{event.title}</h1>
          <p className="event-detail__host">{event.hostLine}</p>

          <div className="event-detail__card">
            <img src={calendarIcon} alt="" width={24} height={24} />
            <div>
              <p className="event-detail__card-title">{event.scheduleDateLong}</p>
              <p className="event-detail__card-sub">{event.scheduleTimeShort}</p>
            </div>
          </div>

          <div className="event-detail__card is-venue">
            <div className="event-detail__venue-row">
              <img src={mapPinIcon} alt="" width={24} height={24} />
              <div>
                <p className="event-detail__card-title">{event.venue}</p>
                <p className="event-detail__card-sub">
                  {event.distanceKm.toFixed(1)} km from your current location
                </p>
              </div>
            </div>
            <div className="event-detail__map" aria-hidden>
              <span className="event-detail__map-pin">{event.district}</span>
              <span className="event-detail__map-caption">
                Schematic map preview
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="event-detail__footer">
        <button type="button" className="event-detail__route">
          <img src={mapIcon} alt="" width={18} height={18} />
          Route
        </button>
        <button type="button" className="event-detail__calendar">
          Add to Calendar
        </button>
      </div>
    </div>
  )
}
