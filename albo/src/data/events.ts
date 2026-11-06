import eventTaikwun from '../assets/images/event-taikwun.png'
import eventHarbour from '../assets/images/event-harbour.png'
import avatarSarah from '../assets/images/avatar-sarah.png'
import avatarAlex from '../assets/images/avatar-alex.svg'
import avatarViviano from '../assets/images/avatar-viviano.svg'

export type EventCityId = 'hong-kong' | 'tokyo' | 'london'

export type EventDateWindow = 'weekend' | 'upcoming'

export interface EventFriendAttendee {
  name: string
  avatarUrl: string
}

export interface EventItem {
  id: string
  title: string
  imageUrl: string
  cityId: EventCityId
  district: string
  districtTone: 'blue' | 'orange'
  distanceKm: number
  distanceLabel: string
  category: string
  admissionBadge?: string
  environmentBadge?: string
  heatLabel?: string
  scheduleLabel: string
  scheduleDateLong: string
  scheduleTimeShort: string
  /** Compact stamp for calendar toast, e.g. Nov 7, 19:30 */
  calendarStamp: string
  venue: string
  transitHint: string
  mapLabel: string
  about: string
  dateWindow: EventDateWindow
  isSaved: boolean
  savesCount: number
  attendingCount: number
  friendsAttending: EventFriendAttendee[]
  socialProof: string
  hostLine: string
  isLive: boolean
}

export interface CityOption {
  id: EventCityId
  name: string
  isOffline: boolean
}

export interface InviteFriend {
  id: string
  name: string
  avatarUrl: string
  defaultSelected: boolean
}

export const inviteFriendsPool: InviteFriend[] = [
  {
    id: 'sarah',
    name: 'Sarah Chan',
    avatarUrl: avatarSarah,
    defaultSelected: true,
  },
  {
    id: 'alex',
    name: 'Alex Wong',
    avatarUrl: avatarAlex,
    defaultSelected: true,
  },
  {
    id: 'vinci',
    name: 'VinciShu',
    avatarUrl: avatarViviano,
    defaultSelected: false,
  },
]

export const cityOptions: CityOption[] = [
  { id: 'hong-kong', name: 'Hong Kong', isOffline: false },
  { id: 'tokyo', name: 'Tokyo', isOffline: false },
  { id: 'london', name: 'London', isOffline: true },
]

export const eventsData: EventItem[] = [
  {
    id: 'event-1',
    title: 'Tai Kwun Open-Air Jazz & Wine Night',
    imageUrl: eventTaikwun,
    cityId: 'hong-kong',
    district: 'Central',
    districtTone: 'blue',
    distanceKm: 1.2,
    distanceLabel: '1.2 km away',
    category: 'Live Music',
    admissionBadge: 'Free Admission',
    environmentBadge: '🌤️ Outdoor • 23°C',
    heatLabel: '🔥 85% Booked',
    scheduleLabel: 'Saturday, Nov 7 • 19:30 – 21:30',
    scheduleDateLong: 'Saturday, November 7, 2026',
    scheduleTimeShort: '19:30 – 21:30 (Evening)',
    calendarStamp: 'Nov 7, 19:30',
    venue: 'Parade Ground, Tai Kwun, 10 Hollywood Rd',
    transitHint: '🚇 MTR Central Station Exit D2 (8-min walk)',
    mapLabel: 'Tai Kwun',
    about:
      'An evening of live jazz under the courtyard lights at Tai Kwun. Catch the house trio with guest saxophonist Mei Ling, then linger for open-air wine tasting from local importers. Bring a light jacket — seating is unassigned on the Parade Ground lawn.',
    dateWindow: 'weekend',
    isSaved: false,
    savesCount: 142,
    attendingCount: 34,
    friendsAttending: [
      { name: 'Sarah', avatarUrl: avatarSarah },
      { name: 'Alex', avatarUrl: avatarAlex },
    ],
    socialProof: '2 friends attending: Sarah and Alex • 142 saves',
    hostLine: 'Hosted by Official Venue Partner • Verified Event',
    isLive: true,
  },
  {
    id: 'event-2',
    title: 'Victoria Harbour Winter Illumination Preview',
    imageUrl: eventHarbour,
    cityId: 'hong-kong',
    district: 'Tsim Sha Tsui',
    districtTone: 'orange',
    distanceKm: 3.5,
    distanceLabel: '3.5 km away',
    category: 'Light Art',
    admissionBadge: 'Public Event',
    environmentBadge: '🌤️ Waterfront • 21°C',
    scheduleLabel: 'Sunday, Nov 8 • 20:00 – 22:00',
    scheduleDateLong: 'Sunday, November 8, 2026',
    scheduleTimeShort: '20:00 – 22:00 (Evening)',
    calendarStamp: 'Nov 8, 20:00',
    venue: 'Tsim Sha Tsui Promenade (Near Star Ferry)',
    transitHint: '🚇 MTR East Tsim Sha Tsui Exit J',
    mapLabel: 'TST Promenade',
    about:
      'A soft-launch walk along the harbourfront as winter light installations flicker on. Expect mirrored sculptures, synchronized building washes, and a short curator talk near Star Ferry. Best viewed from the waterfront rail — arrive early for an unobstructed skyline frame.',
    dateWindow: 'weekend',
    isSaved: false,
    savesCount: 88,
    attendingCount: 88,
    friendsAttending: [{ name: 'Alex Wong', avatarUrl: avatarAlex }],
    socialProof: 'Saved by Alex Wong • 88 attending',
    hostLine: 'Hosted by Official Venue Partner • Verified Event',
    isLive: true,
  },
  {
    id: 'event-tokyo-1',
    title: 'Shimokitazawa Vinyl Listening Night',
    imageUrl: eventHarbour,
    cityId: 'tokyo',
    district: 'Setagaya',
    districtTone: 'blue',
    distanceKm: 2.4,
    distanceLabel: '2.4 km away',
    category: 'Live Music',
    admissionBadge: 'Ticketed',
    environmentBadge: '🌤️ Indoor • 18°C',
    scheduleLabel: 'Saturday, Nov 7 • 18:00 – 21:00',
    scheduleDateLong: 'Saturday, November 7, 2026',
    scheduleTimeShort: '18:00 – 21:00 (Evening)',
    calendarStamp: 'Nov 7, 18:00',
    venue: 'Shimokitazawa Shelter, Tokyo',
    transitHint: '🚇 Shimokitazawa Station South Exit (4-min walk)',
    mapLabel: 'Shelter',
    about:
      'A seated vinyl listening session with warm analog gear and rotating guest selectors. Quiet phones, deep cuts, and a short Q&A with the night’s resident DJ.',
    dateWindow: 'weekend',
    isSaved: false,
    savesCount: 56,
    attendingCount: 21,
    friendsAttending: [],
    socialProof: '21 attending • 56 saves',
    hostLine: 'Hosted by Official Venue Partner • Verified Event',
    isLive: true,
  },
]

export function liveEventCount(cityId: EventCityId, events: EventItem[]): number {
  return events.filter((event) => event.cityId === cityId && event.isLive).length
}

export function cityMenuLabel(city: CityOption, events: EventItem[]): string {
  if (city.isOffline) return `${city.name} (Offline / 0 live events)`
  const count = liveEventCount(city.id, events)
  const noun = count === 1 ? 'live event' : 'live events'
  return `${city.name} (${count} ${noun})`
}

export function filterEvents(
  events: EventItem[],
  cityId: EventCityId,
  dateWindow: EventDateWindow,
  nearbyOnly: boolean,
): EventItem[] {
  let next = events.filter((event) => event.cityId === cityId)

  if (dateWindow === 'weekend') {
    next = next.filter((event) => event.dateWindow === 'weekend')
  } else {
    next = next.filter(
      (event) =>
        event.dateWindow === 'weekend' || event.dateWindow === 'upcoming',
    )
  }

  if (nearbyOnly) {
    next = next
      .filter((event) => event.distanceKm < 5)
      .slice()
      .sort((a, b) => a.distanceKm - b.distanceKm)
  }

  return next
}

export function formatInviteNames(names: string[]): string {
  if (names.length === 0) return ''
  if (names.length === 1) return names[0]
  if (names.length === 2) return `${names[0]} & ${names[1]}`
  return `${names.slice(0, -1).join(', ')} & ${names[names.length - 1]}`
}
