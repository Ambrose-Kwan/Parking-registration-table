import { useMemo, useRef, useState } from 'react'
import {
  cityMenuLabel,
  cityOptions,
  filterEvents,
  type EventCityId,
  type EventDateWindow,
  type EventItem,
} from '../data/events'
import { EventCard } from './EventCard'

interface LocalEventsViewProps {
  events: EventItem[]
  onOpenEvent: (event: EventItem) => void
  onToggleSave: (id: string) => void
}

export function LocalEventsView({
  events,
  onOpenEvent,
  onToggleSave,
}: LocalEventsViewProps) {
  const [cityId, setCityId] = useState<EventCityId>('hong-kong')
  const [dateWindow, setDateWindow] = useState<EventDateWindow>('weekend')
  const [nearbyOnly, setNearbyOnly] = useState(false)
  const [cityMenuOpen, setCityMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const selectedCity =
    cityOptions.find((city) => city.id === cityId) ?? cityOptions[0]

  const visibleEvents = useMemo(
    () => filterEvents(events, cityId, dateWindow, nearbyOnly),
    [events, cityId, dateWindow, nearbyOnly],
  )

  const isOffline = selectedCity.isOffline

  return (
    <div className="local-events">
      <div className="spatial-filters">
        <div className="spatial-filters__row">
          <div className="city-menu" ref={menuRef}>
            <button
              type="button"
              className={`spatial-chip is-city ${cityMenuOpen ? 'is-open' : ''}`}
              aria-haspopup="listbox"
              aria-expanded={cityMenuOpen}
              onClick={() => setCityMenuOpen((open) => !open)}
            >
              📍 {selectedCity.name} ▼
            </button>
            {cityMenuOpen ? (
              <div className="city-menu__panel" role="listbox">
                {cityOptions.map((city) => (
                  <button
                    key={city.id}
                    type="button"
                    role="option"
                    aria-selected={city.id === cityId}
                    className={`city-menu__option ${city.id === cityId ? 'is-active' : ''}`}
                    onClick={() => {
                      setCityId(city.id)
                      setCityMenuOpen(false)
                    }}
                  >
                    {cityMenuLabel(city, events)}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <button
            type="button"
            className={`spatial-chip is-date ${dateWindow === 'weekend' ? 'is-active' : ''}`}
            onClick={() =>
              setDateWindow((current) =>
                current === 'weekend' ? 'upcoming' : 'weekend',
              )
            }
          >
            {dateWindow === 'weekend'
              ? '📅 This Weekend (Nov 7–8)'
              : '📅 Upcoming Week'}
          </button>
        </div>

        <button
          type="button"
          className={`spatial-chip is-nearby ${nearbyOnly ? 'is-active' : ''}`}
          aria-pressed={nearbyOnly}
          onClick={() => setNearbyOnly((value) => !value)}
        >
          Nearby (&lt; 5 km)
        </button>
      </div>

      <div className="local-events__feed">
        {isOffline ? (
          <div className="offline-empty" role="status">
            <p className="offline-empty__badge">Offline mode</p>
            <h2 className="offline-empty__title">No live events in London</h2>
            <p className="offline-empty__body">
              You are offline for this city. Cached Community posts remain
              available — switch to Hong Kong or Tokyo when you reconnect.
            </p>
            <button
              type="button"
              className="offline-empty__cta"
              onClick={() => setCityId('hong-kong')}
            >
              Back to Hong Kong
            </button>
          </div>
        ) : visibleEvents.length === 0 ? (
          <p className="feed-empty">No events match these filters.</p>
        ) : (
          visibleEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onOpen={onOpenEvent}
              onToggleSave={onToggleSave}
            />
          ))
        )}
      </div>
    </div>
  )
}
