import { useState } from 'react'
import type { PostItem } from '../data/posts'
import heartIcon from '../assets/icons/heart.svg'
import messageIcon from '../assets/icons/message-circle.svg'
import shareIcon from '../assets/icons/share.svg'
import usersIcon from '../assets/icons/users.svg'

interface PostCardProps {
  post: PostItem
  onToggleLike: (id: string) => void
  onRequestSave: (post: PostItem) => void
}

function starLine(rating: number): string {
  const full = Math.round(Math.min(5, Math.max(0, rating)))
  return '★'.repeat(full) + '☆'.repeat(5 - full)
}

export function PostCard({ post, onToggleLike, onRequestSave }: PostCardProps) {
  const [likePulse, setLikePulse] = useState(false)
  const [savePulse, setSavePulse] = useState(false)

  const authorLine = post.isFriend
    ? `${post.author} (${post.authorRole})`
    : post.author

  const metaLine =
    post.platform === 'Albo Original'
      ? post.timestamp
      : `${post.timestamp} • via ${post.platform}`

  const ratingLabel = post.isFriend
    ? `${post.rating.toFixed(1)} (${post.author.split(' ')[0]}'s Rating)`
    : post.rating.toFixed(1)

  return (
    <article className="post-card">
      <header className="post-card__header">
        <img
          className="post-card__avatar"
          src={post.avatarUrl}
          alt=""
          width={36}
          height={36}
        />
        <div className="post-card__author">
          <p className="post-card__author-name">{authorLine}</p>
          <p className="post-card__meta">{metaLine}</p>
        </div>
        <button
          type="button"
          className={`post-card__save ${post.isSaved ? 'is-saved' : ''} ${savePulse ? 'is-pulsing' : ''}`}
          aria-pressed={post.isSaved}
          onClick={() => {
            setSavePulse(true)
            onRequestSave(post)
            window.setTimeout(() => setSavePulse(false), 280)
          }}
        >
          {post.isSaved ? 'Saved ✓' : '+ Save'}
        </button>
      </header>

      <div className="post-card__body">
        <img
          className="post-card__image"
          src={post.imageUrl}
          alt={post.title}
          width={329}
          height={185}
        />
        <div className="post-card__details">
          <h2 className="post-card__title">{post.title}</h2>
          {post.friendNote ? (
            <blockquote className="post-card__note">
              “{post.friendNote}”
            </blockquote>
          ) : null}
          <div className="post-card__rating-block">
            <p className="post-card__rating">
              <span className="post-card__stars" aria-hidden>
                {starLine(post.rating)}
              </span>{' '}
              {ratingLabel}
            </p>
            <p className="post-card__tags">{post.tags.join(' • ')}</p>
          </div>
        </div>
      </div>

      <div className="post-card__actions">
        <button
          type="button"
          className={`post-card__action ${post.isLiked ? 'is-liked' : ''} ${likePulse ? 'is-pulsing' : ''}`}
          aria-pressed={post.isLiked}
          onClick={() => {
            setLikePulse(true)
            onToggleLike(post.id)
            window.setTimeout(() => setLikePulse(false), 280)
          }}
        >
          <img src={heartIcon} alt="" width={18} height={18} />
          <span>{post.likesCount}</span>
        </button>
        <button type="button" className="post-card__action" aria-label="Comments">
          <img src={messageIcon} alt="" width={18} height={18} />
          <span>{post.commentsCount ?? 0}</span>
        </button>
        <button type="button" className="post-card__action">
          <img src={shareIcon} alt="" width={18} height={18} />
          <span>Share</span>
        </button>
      </div>

      {post.sharedIn ? (
        <footer className="post-card__shared">
          <img src={usersIcon} alt="" width={16} height={16} />
          <span>Shared in '{post.sharedIn}'</span>
        </footer>
      ) : null}
    </article>
  )
}
