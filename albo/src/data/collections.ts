import type { PostCategory, PostItem } from './posts'
import avatarSarah from '../assets/images/avatar-sarah.png'
import avatarPeer from '../assets/images/avatar-shared-peer.png'

export interface CollectionItem {
  id: string
  /** Display name without leading emoji */
  name: string
  emoji: string
  isShared: boolean
  privacyLabel: string
  /** Overlapping avatars for shared lists */
  sharedAvatars?: string[]
}

export const defaultCollections: CollectionItem[] = [
  {
    id: 'col-recipe',
    name: 'Recipe Collection',
    emoji: '📁',
    isShared: false,
    privacyLabel: 'Private',
  },
  {
    id: 'col-weekend-sarah',
    name: 'Weekend Cooking with Sarah',
    emoji: '👥',
    isShared: true,
    privacyLabel: 'Shared with Sarah',
    sharedAvatars: [avatarSarah, avatarPeer],
  },
  {
    id: 'col-fitness',
    name: 'Healthy & Fitness Routine',
    emoji: '📁',
    isShared: false,
    privacyLabel: 'Private',
  },
]

export function collectionLabel(collection: CollectionItem): string {
  return `${collection.emoji} ${collection.name}`
}

/** Smart default destination based on the post being saved. */
export function defaultCollectionIdForPost(
  post: PostItem,
  collections: CollectionItem[],
): string {
  const byId = (id: string) =>
    collections.find((c) => c.id === id)?.id ?? collections[0]?.id ?? ''

  if (post.category === 'workouts') {
    return byId('col-fitness')
  }

  if (post.category === 'recipes') {
    // Friend recipe posts default to the shared Sarah list; otherwise private recipes.
    return post.isFriend ? byId('col-weekend-sarah') : byId('col-recipe')
  }

  return collections[0]?.id ?? ''
}

export function capitalizeCategory(category: PostCategory): string {
  return category.charAt(0).toUpperCase() + category.slice(1)
}
