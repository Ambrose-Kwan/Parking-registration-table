import { useEffect, useMemo, useState } from 'react'
import {
  categoryFilters,
  feedSegments,
  filterPosts,
  postsData,
  type FeedSegment,
  type PostCategory,
  type PostItem,
} from '../data/posts'
import {
  collectionLabel,
  type CollectionItem,
} from '../data/collections'
import { PostCard } from '../components/PostCard'
import { QuickSaveDrawer } from '../components/QuickSaveDrawer'
import { TabBar } from '../components/TabBar'
import signalIcon from '../assets/icons/ios-signal.svg'
import wifiIcon from '../assets/icons/ios-wifi.svg'
import batteryIcon from '../assets/icons/ios-battery.svg'
import searchIcon from '../assets/icons/search.svg'
import sendIcon from '../assets/icons/send.svg'

type CategoryKey = 'all' | PostCategory

export function SmartFeed() {
  const [posts, setPosts] = useState<PostItem[]>(() =>
    postsData.map((post) => ({ ...post })),
  )
  const [segment, setSegment] = useState<FeedSegment>('friends')
  const [category, setCategory] = useState<CategoryKey>('recipes')
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [toastVisible, setToastVisible] = useState(false)

  const visiblePosts = useMemo(
    () => filterPosts(posts, segment, category),
    [posts, segment, category],
  )

  useEffect(() => {
    if (!toast) return
    setToastVisible(true)
    const hide = window.setTimeout(() => setToastVisible(false), 1800)
    const clear = window.setTimeout(() => setToast(null), 2200)
    return () => {
      window.clearTimeout(hide)
      window.clearTimeout(clear)
    }
  }, [toast])

  const toggleLike = (id: string) => {
    setPosts((current) =>
      current.map((post) => {
        if (post.id !== id) return post
        const nextLiked = !post.isLiked
        return {
          ...post,
          isLiked: nextLiked,
          likesCount: post.likesCount + (nextLiked ? 1 : -1),
        }
      }),
    )
  }

  const openSaveDrawer = (post: PostItem) => {
    setSelectedPost(post)
    setDrawerOpen(true)
  }

  const closeSaveDrawer = () => {
    setDrawerOpen(false)
    setSelectedPost(null)
  }

  const handleConfirmSave = (postId: string, collection: CollectionItem) => {
    setPosts((current) =>
      current.map((post) =>
        post.id === postId ? { ...post, isSaved: true } : post,
      ),
    )
    setDrawerOpen(false)
    setSelectedPost(null)
    setToast(`Saved to ${collectionLabel(collection)}`)
  }

  return (
    <div className="phone-shell">
      <div className="smart-feed">
        <header className="smart-feed__top">
          <div className="status-bar">
            <span className="status-bar__time">10:20</span>
            <div className="status-bar__device">
              <img src={signalIcon} alt="" width={18} height={18} />
              <img src={wifiIcon} alt="" width={18} height={18} />
              <img src={batteryIcon} alt="" width={26} height={18} />
            </div>
          </div>
          <div className="community-header">
            <h1 className="community-header__title">Community</h1>
            <div className="community-header__actions">
              <button type="button" className="icon-btn" aria-label="Search">
                <img src={searchIcon} alt="" width={22} height={22} />
              </button>
              <button type="button" className="icon-btn" aria-label="Messages">
                <img src={sendIcon} alt="" width={22} height={22} />
              </button>
            </div>
          </div>
        </header>

        <div className="feed-controls">
          <div
            className="segmented"
            role="tablist"
            aria-label="Community segments"
          >
            {feedSegments.map((item) => (
              <button
                key={item.key}
                type="button"
                role="tab"
                aria-selected={segment === item.key}
                className={`segmented__item ${segment === item.key ? 'is-active' : ''}`}
                onClick={() => setSegment(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="filter-chips" role="listbox" aria-label="Categories">
            {categoryFilters.map((chip) => (
              <button
                key={chip.key}
                type="button"
                role="option"
                aria-selected={category === chip.key}
                className={`filter-chip ${category === chip.key ? 'is-active' : ''}`}
                onClick={() => setCategory(chip.key)}
              >
                <span aria-hidden>{chip.emoji}</span> {chip.label}
              </button>
            ))}
          </div>
        </div>

        <main className="feed-list">
          {visiblePosts.length === 0 ? (
            <p className="feed-empty">
              {segment === 'localEvents'
                ? 'Local Events live on F4-3 — switch to Explore or Friends.'
                : 'No posts match this filter.'}
            </p>
          ) : (
            visiblePosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onToggleLike={toggleLike}
                onRequestSave={openSaveDrawer}
              />
            ))
          )}
        </main>

        {toast ? (
          <div
            className={`save-toast ${toastVisible ? 'is-visible' : ''}`}
            role="status"
            aria-live="polite"
          >
            {toast}
          </div>
        ) : null}

        <TabBar />

        {selectedPost ? (
          <QuickSaveDrawer
            selectedPost={selectedPost}
            open={drawerOpen}
            onClose={closeSaveDrawer}
            onConfirmSave={handleConfirmSave}
          />
        ) : null}
      </div>
    </div>
  )
}
