import type { MouseEvent } from 'react'
import type { EventItem } from '../data/events'
import chevronRight from '../assets/icons/chevron-right.svg'
import bookmarkIcon from '../assets/icons/bookmark.svg'

interface EventCardProps {
  event: EventItem
  onOpen: (event: EventItem) => void
  onToggleSave: (id: string) => void
}

export function EventCard({ event, onOpen, onToggleSave }: EventCardProps) {
  const handleBookmark = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    onToggleSave(event.id)
  }

  return (
    <article
      className="event-card"
      role="button"
      tabIndex={0}
      onClick={() => onOpen(event)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen(event)
        }
      }}
    >
      <div className="event-card__media">
        <img
          className="event-card__image"
          src={event.imageUrl}
          alt=""
          width={329}
          height={185}
        />
        <div className="event-card__media-badges">
          {event.admissionBadge ? (
            <span className="event-card__badge">{event.admissionBadge}</span>
          ) : null}
          {event.environmentBadge ? (
            <span className="event-card__badge is-env">
              {event.environmentBadge}
            </span>
          ) : null}
        </div>
        <button
          type="button"
          className={`event-card__bookmark ${event.isSaved ? 'is-saved' : ''}`}
          aria-label={event.isSaved ? 'Remove bookmark' : 'Save event'}
          aria-pressed={event.isSaved}
          onClick={handleBookmark}
        >
          <img src={bookmarkIcon} alt="" width={18} height={18} />
        </button>
      </div>

      <div className="event-card__meta">
        <span
          className={`event-card__district is-${event.districtTone}`}
        >
          • {event.district}
        </span>
        <span className="event-card__distance">{event.distanceLabel}</span>
        <span className="event-card__category">{event.category}</span>
        {event.heatLabel ? (
          <span className="event-card__heat">{event.heatLabel}</span>
        ) : null}
      </div>

      <div className="event-card__body">
        <h2 className="event-card__title">{event.title}</h2>
        <p className="event-card__schedule">{event.scheduleLabel}</p>
        <p className="event-card__venue">{event.venue}</p>
      </div>

      <footer className="event-card__social">
        {event.friendsAttending.length > 0 ? (
          <span className="event-card__avatars" aria-hidden>
            {event.friendsAttending.slice(0, 2).map((friend) => (
              <img
                key={`${event.id}-${friend.name}`}
                src={friend.avatarUrl}
                alt=""
                width={22}
                height={22}
              />
            ))}
          </span>
        ) : null}
        <p className="event-card__proof">{event.socialProof}</p>
        <img
          className="event-card__chevron"
          src={chevronRight}
          alt=""
          width={18}
          height={18}
        />
      </footer>
    </article>
  )
}
