import avatarSarah from '../assets/images/avatar-sarah.png'
import avatarViviano from '../assets/images/avatar-viviano.svg'
import avatarAlex from '../assets/images/avatar-alex.svg'
import postKimchi from '../assets/images/post-kimchi.png'
import postWorkout from '../assets/images/post-workout.png'
import postPlace from '../assets/images/post-place.svg'

/** Canonical post categories — keep filter chip keys in sync with these values. */
export type PostCategory = 'recipes' | 'workouts' | 'places'

export type PostPlatform = 'Instagram' | 'TikTok' | 'Albo Original'

export interface PostItem {
  id: string
  title: string
  author: string
  authorRole: string
  timestamp: string
  platform: PostPlatform
  avatarUrl: string
  imageUrl: string
  category: PostCategory
  isFriend: boolean
  friendNote?: string
  rating: number
  ratingCount: number
  tags: string[]
  likesCount: number
  isLiked: boolean
  isSaved: boolean
  /** UI-only extras that still hang off the same source row */
  commentsCount?: number
  sharedIn?: string
}

/**
 * Single source of truth for Community feed cards (F4-1+).
 * Screens must map over this array — never hardcode duplicate post fields.
 */
export const postsData: PostItem[] = [
  {
    id: 'post-kimchi',
    title: 'Homemade Kimchi',
    author: 'Sarah Chan',
    authorRole: 'Friend',
    timestamp: '2h ago',
    platform: 'Instagram',
    avatarUrl: avatarSarah,
    imageUrl: postKimchi,
    category: 'recipes',
    isFriend: true,
    friendNote:
      'Tried this recipe yesterday for our dinner prep, super easy to make!',
    rating: 5.0,
    ratingCount: 1,
    tags: ['3h 20m', 'Korean Side Dish'],
    likesCount: 128,
    isLiked: false,
    isSaved: false,
    commentsCount: 24,
    sharedIn: 'Weekend Cooking',
  },
  {
    id: 'post-core-workout',
    title: '20-Minute Weekend Core Workout',
    author: 'viviano',
    authorRole: 'Community Trainer',
    timestamp: 'Just now',
    platform: 'TikTok',
    avatarUrl: avatarViviano,
    imageUrl: postWorkout,
    category: 'workouts',
    isFriend: false,
    rating: 4.8,
    ratingCount: 86,
    tags: ['Intermediate', 'Fat loss'],
    likesCount: 86,
    isLiked: false,
    isSaved: false,
    commentsCount: 12,
  },
  {
    id: 'post-kamakura-trail',
    title: 'Kamakura Coast Trail',
    author: 'Alex Kong',
    authorRole: 'Friend',
    timestamp: '5h ago',
    platform: 'Albo Original',
    avatarUrl: avatarAlex,
    imageUrl: postPlace,
    category: 'places',
    isFriend: true,
    friendNote: 'Quiet sunrise path — pack water and go early.',
    rating: 4.7,
    ratingCount: 32,
    tags: ['Outdoor', 'Kamakura', 'Easy hike'],
    likesCount: 64,
    isLiked: false,
    isSaved: false,
    commentsCount: 9,
    sharedIn: 'Tokyo Weekends',
  },
]

/** Filter chip catalog — labels/emojis live here so UI never invents category strings. */
export const categoryFilters: Array<{
  key: 'all' | PostCategory
  label: string
  emoji: string
}> = [
  { key: 'all', label: 'For You', emoji: '🔥' },
  { key: 'recipes', label: 'Recipes', emoji: '🍳' },
  { key: 'workouts', label: 'Workouts', emoji: '🏃' },
  { key: 'places', label: 'Places', emoji: '📍' },
]

export type FeedSegment = 'explore' | 'friends' | 'localEvents'

export const feedSegments: Array<{ key: FeedSegment; label: string }> = [
  { key: 'explore', label: 'Explore' },
  { key: 'friends', label: 'Friends' },
  { key: 'localEvents', label: 'Local Events' },
]

export function filterPosts(
  posts: PostItem[],
  segment: FeedSegment,
  category: 'all' | PostCategory,
): PostItem[] {
  return posts.filter((post) => {
    if (segment === 'friends' && !post.isFriend) return false
    // Local Events is a separate Community flow (F4-3); keep feed empty here.
    if (segment === 'localEvents') return false
    if (category !== 'all' && post.category !== category) return false
    return true
  })
}
