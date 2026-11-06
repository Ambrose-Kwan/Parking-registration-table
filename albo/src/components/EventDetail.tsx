import { useEffect, useMemo, useState } from 'react'
import {
  formatInviteNames,
  inviteFriendsPool,
  type EventItem,
} from '../data/events'
import arrowLeft from '../assets/icons/arrow-left.svg'
import bookmarkIcon from '../assets/icons/bookmark.svg'
import shareIcon from '../assets/icons/share.svg'
import calendarIcon from '../assets/icons/calendar-days.svg'
import mapPinIcon from '../assets/icons/map-pin.svg'

interface EventDetailProps {
  event: EventItem
  open: boolean
  onClose: () => void
  onToggleSave: (id: string) => void
}

type ToastTone = 'neutral' | 'success'

interface DetailToast {
  id: number
  message: string
  tone: ToastTone
  undo?: boolean
}

export function EventDetail({
  event,
  open,
  onClose,
  onToggleSave,
}: EventDetailProps) {
  const [visible, setVisible] = useState(false)
  const [addedToCalendar, setAddedToCalendar] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteVisible, setInviteVisible] = useState(false)
  const [selectedInviteIds, setSelectedInviteIds] = useState<string[]>(() =>
    inviteFriendsPool.filter((f) => f.defaultSelected).map((f) => f.id),
  )
  const [invitedCount, setInvitedCount] = useState(0)
  const [toast, setToast] = useState<DetailToast | null>(null)
  const [toastVisible, setToastVisible] = useState(false)

  useEffect(() => {
    if (!open) {
      setVisible(false)
      setInviteOpen(false)
      setInviteVisible(false)
      return
    }
    setAddedToCalendar(false)
    setInvitedCount(0)
    setSelectedInviteIds(
      inviteFriendsPool.filter((f) => f.defaultSelected).map((f) => f.id),
    )
    setToast(null)
    const frame = window.requestAnimationFrame(() => setVisible(true))
    return () => window.cancelAnimationFrame(frame)
  }, [open, event.id])

  useEffect(() => {
    if (!inviteOpen) {
      setInviteVisible(false)
      return
    }
    const frame = window.requestAnimationFrame(() => setInviteVisible(true))
    return () => window.cancelAnimationFrame(frame)
  }, [inviteOpen])

  useEffect(() => {
    if (!toast) return
    setToastVisible(true)
    const duration = toast.undo ? 3000 : 2000
    const hide = window.setTimeout(() => setToastVisible(false), duration - 280)
    const clear = window.setTimeout(() => setToast(null), duration)
    return () => {
      window.clearTimeout(hide)
      window.clearTimeout(clear)
    }
  }, [toast])

  const selectedInviteNames = useMemo(
    () =>
      inviteFriendsPool
        .filter((friend) => selectedInviteIds.includes(friend.id))
        .map((friend) => friend.name),
    [selectedInviteIds],
  )

  const showToast = (
    message: string,
    tone: ToastTone = 'neutral',
    undo = false,
  ) => {
    setToast({ id: Date.now(), message, tone, undo })
  }

  const handleClose = () => {
    setVisible(false)
    setInviteOpen(false)
    window.setTimeout(onClose, 250)
  }

  const handleShare = async () => {
    const link = `https://albo.app/events/${event.id}`
    try {
      await navigator.clipboard.writeText(link)
    } catch {
      // Prototype fallback — still show confirmation copy.
    }
    showToast('Event link copied')
  }

  const handleRoute = () => {
    showToast('Opening walking route in Maps...')
  }

  const openInvite = () => {
    setSelectedInviteIds(
      inviteFriendsPool.filter((f) => f.defaultSelected).map((f) => f.id),
    )
    setInviteOpen(true)
  }

  const closeInvite = () => {
    setInviteVisible(false)
    window.setTimeout(() => setInviteOpen(false), 220)
  }

  const toggleInviteFriend = (id: string) => {
    setSelectedInviteIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    )
  }

  const sendInvites = () => {
    if (selectedInviteNames.length === 0) return
    const count = selectedInviteNames.length
    const label = formatInviteNames(
      selectedInviteNames.map((name) => name.split(' ')[0]),
    )
    setInvitedCount(count)
    closeInvite()
    showToast(`Invites sent to ${label}!`, 'success')
  }

  const handleCalendarToggle = () => {
    if (addedToCalendar) {
      setAddedToCalendar(false)
      setToast(null)
      return
    }
    setAddedToCalendar(true)
    showToast(
      `✓ Event synced to Calendar (${event.calendarStamp})`,
      'success',
      true,
    )
  }

  const handleUndoCalendar = () => {
    setAddedToCalendar(false)
    setToast(null)
  }

  if (!open) return null

  const inviteButtonLabel =
    invitedCount > 0 ? `👥 Invited (${invitedCount})` : '👥 Invite'

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
              className="event-detail__circle is-back"
              aria-label="Back to Local Events"
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
              <button
                type="button"
                className="event-detail__circle"
                aria-label="Share event"
                onClick={handleShare}
              >
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
              <span
                className={`event-detail__chip ${
                  event.admissionBadge === 'Free Admission' ? 'is-admit' : ''
                }`}
              >
                {event.admissionBadge}
              </span>
            ) : null}
          </div>

          <h1 className="event-detail__title">{event.title}</h1>
          <p className="event-detail__host">{event.hostLine}</p>

          <div className="event-detail__card">
            <img src={calendarIcon} alt="" width={24} height={24} />
            <div>
              <p className="event-detail__card-title">
                {event.scheduleDateLong} • {event.scheduleTimeShort}
              </p>
            </div>
          </div>

          <div className="event-detail__card is-venue">
            <div className="event-detail__venue-row">
              <img src={mapPinIcon} alt="" width={24} height={24} />
              <div>
                <p className="event-detail__card-title">{event.venue}</p>
                <p className="event-detail__card-sub">
                  {event.distanceLabel} · {event.transitHint}
                </p>
              </div>
            </div>
            <div className="event-detail__map" aria-hidden>
              <span className="event-detail__map-pin is-glow">
                📍 {event.mapLabel}
              </span>
              <span className="event-detail__map-caption">
                Dark map preview
              </span>
            </div>
          </div>

          <section className="event-detail__about">
            <h2 className="event-detail__about-title">About this event</h2>
            <p className="event-detail__about-body">{event.about}</p>
          </section>
        </div>
      </div>

      {toast ? (
        <div
          className={`event-detail__toast ${toastVisible ? 'is-visible' : ''} is-${toast.tone}`}
          role="status"
          aria-live="polite"
        >
          <span>{toast.message}</span>
          {toast.undo ? (
            <button
              type="button"
              className="event-detail__toast-undo"
              onClick={handleUndoCalendar}
            >
              Undo
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="event-detail__footer">
        <button
          type="button"
          className="event-detail__action is-route"
          onClick={handleRoute}
        >
          🗺️ Route
        </button>
        <button
          type="button"
          className={`event-detail__action is-invite ${invitedCount > 0 ? 'is-done' : ''}`}
          onClick={openInvite}
        >
          {inviteButtonLabel}
        </button>
        <button
          type="button"
          className={`event-detail__action is-calendar ${addedToCalendar ? 'is-synced' : ''}`}
          onClick={handleCalendarToggle}
        >
          {addedToCalendar ? '✓ Added to Calendar' : '📅 Add to Calendar'}
        </button>
      </div>

      {inviteOpen ? (
        <div
          className={`invite-sheet ${inviteVisible ? 'is-visible' : ''}`}
          role="presentation"
        >
          <button
            type="button"
            className="invite-sheet__scrim"
            aria-label="Dismiss invite drawer"
            onClick={closeInvite}
          />
          <div
            className="invite-sheet__panel"
            role="dialog"
            aria-modal="true"
            aria-label="Who's joining you?"
          >
            <div className="invite-sheet__grabber" aria-hidden>
              <span />
            </div>
            <h2 className="invite-sheet__title">Who&apos;s joining you?</h2>
            <div className="invite-sheet__list">
              {inviteFriendsPool.map((friend) => {
                const checked = selectedInviteIds.includes(friend.id)
                return (
                  <button
                    key={friend.id}
                    type="button"
                    className={`invite-sheet__row ${checked ? 'is-checked' : ''}`}
                    aria-pressed={checked}
                    onClick={() => toggleInviteFriend(friend.id)}
                  >
                    <img
                      src={friend.avatarUrl}
                      alt=""
                      width={36}
                      height={36}
                      className="invite-sheet__avatar"
                    />
                    <span className="invite-sheet__name">{friend.name}</span>
                    <span
                      className={`invite-sheet__check ${checked ? 'is-on' : ''}`}
                      aria-hidden
                    >
                      {checked ? '✓' : ''}
                    </span>
                  </button>
                )
              })}
            </div>
            <button
              type="button"
              className="invite-sheet__send"
              disabled={selectedInviteNames.length === 0}
              onClick={sendInvites}
            >
              Send {selectedInviteNames.length}{' '}
              {selectedInviteNames.length === 1 ? 'Invite' : 'Invites'}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
