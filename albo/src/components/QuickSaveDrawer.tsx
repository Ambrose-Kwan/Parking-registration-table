import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { PostItem } from '../data/posts'
import {
  capitalizeCategory,
  defaultCollectionIdForPost,
  defaultCollections,
  type CollectionItem,
} from '../data/collections'

interface QuickSaveDrawerProps {
  selectedPost: PostItem
  open: boolean
  onClose: () => void
  onConfirmSave: (postId: string, collection: CollectionItem) => void
}

export function QuickSaveDrawer({
  selectedPost,
  open,
  onClose,
  onConfirmSave,
}: QuickSaveDrawerProps) {
  const titleId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [collections, setCollections] = useState<CollectionItem[]>(() =>
    defaultCollections.map((item) => ({ ...item })),
  )
  const [selectedCollectionId, setSelectedCollectionId] = useState(() =>
    defaultCollectionIdForPost(selectedPost, defaultCollections),
  )
  const [isCreating, setIsCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [confirming, setConfirming] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!open) {
      setVisible(false)
      setConfirming(false)
      setIsCreating(false)
      setNewName('')
      return
    }

    setCollections(defaultCollections.map((item) => ({ ...item })))
    setSelectedCollectionId(
      defaultCollectionIdForPost(selectedPost, defaultCollections),
    )
    setIsCreating(false)
    setNewName('')
    setConfirming(false)

    const frame = window.requestAnimationFrame(() => setVisible(true))
    return () => window.cancelAnimationFrame(frame)
  }, [open, selectedPost])

  useEffect(() => {
    if (isCreating) {
      inputRef.current?.focus()
    }
  }, [isCreating])

  const selectedCollection = useMemo(
    () => collections.find((c) => c.id === selectedCollectionId) ?? null,
    [collections, selectedCollectionId],
  )

  const canAdd = newName.trim().length > 0
  const confirmLabel = selectedCollection?.isShared
    ? 'Confirm & Save to Shared List'
    : 'Confirm & Save'

  const handleClose = () => {
    if (confirming) return
    setVisible(false)
    window.setTimeout(onClose, 220)
  }

  const handleAddCollection = () => {
    const trimmed = newName.trim()
    if (!trimmed) return
    const created: CollectionItem = {
      id: `col-custom-${Date.now()}`,
      name: trimmed,
      emoji: '📁',
      isShared: false,
      privacyLabel: 'Private',
    }
    setCollections((current) => [...current, created])
    setSelectedCollectionId(created.id)
    setIsCreating(false)
    setNewName('')
  }

  const handleConfirm = () => {
    if (!selectedCollection || confirming) return
    setConfirming(true)
    window.setTimeout(() => {
      setVisible(false)
      window.setTimeout(() => {
        onConfirmSave(selectedPost.id, selectedCollection)
      }, 220)
    }, 250)
  }

  if (!open) return null

  return (
    <div
      className={`quick-save ${visible ? 'is-visible' : ''} ${confirming ? 'is-confirming' : ''}`}
      role="presentation"
    >
      <button
        type="button"
        className="quick-save__scrim"
        aria-label="Dismiss save drawer"
        onClick={handleClose}
      />

      <div
        className="quick-save__sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="quick-save__grabber" aria-hidden>
          <span />
        </div>

        <header className="quick-save__header">
          <h2 id={titleId} className="quick-save__title">
            Save to Collection
          </h2>
          <button
            type="button"
            className="quick-save__close"
            aria-label="Close"
            onClick={handleClose}
          >
            ✕
          </button>
        </header>

        <div className="quick-save__preview">
          <img
            className="quick-save__thumb"
            src={selectedPost.imageUrl}
            alt=""
            width={48}
            height={48}
          />
          <div className="quick-save__preview-text">
            <p className="quick-save__preview-title">{selectedPost.title}</p>
            <p className="quick-save__preview-sub">
              By {selectedPost.author} •{' '}
              {capitalizeCategory(selectedPost.category)}
            </p>
          </div>
          <span className="quick-save__platform">{selectedPost.platform}</span>
        </div>

        <div className="quick-save__list" role="listbox" aria-label="Collections">
          {collections.map((collection) => {
            const selected = collection.id === selectedCollectionId
            return (
              <button
                key={collection.id}
                type="button"
                role="option"
                aria-selected={selected}
                className={`quick-save__row ${selected ? 'is-selected' : ''}`}
                onClick={() => setSelectedCollectionId(collection.id)}
              >
                <span className="quick-save__row-emoji" aria-hidden>
                  {collection.emoji}
                </span>
                <span className="quick-save__row-body">
                  <span className="quick-save__row-name">
                    {collection.name}
                  </span>
                  <span className="quick-save__row-meta">
                    {collection.privacyLabel}
                    {collection.isShared && collection.sharedAvatars ? (
                      <span className="quick-save__avatars" aria-hidden>
                        {collection.sharedAvatars.map((src, index) => (
                          <img
                            key={`${collection.id}-av-${index}`}
                            src={src}
                            alt=""
                            width={18}
                            height={18}
                          />
                        ))}
                      </span>
                    ) : null}
                  </span>
                </span>
                <span
                  className={`quick-save__check ${selected ? 'is-on' : ''}`}
                  aria-hidden
                >
                  {selected ? '✓' : ''}
                </span>
              </button>
            )
          })}

          {isCreating ? (
            <div className="quick-save__create-form">
              <input
                ref={inputRef}
                className="quick-save__input"
                type="text"
                value={newName}
                placeholder="New collection name"
                aria-label="New collection name"
                onChange={(event) => setNewName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    handleAddCollection()
                  }
                  if (event.key === 'Escape') {
                    setIsCreating(false)
                    setNewName('')
                  }
                }}
              />
              <div className="quick-save__create-actions">
                <button
                  type="button"
                  className="quick-save__create-btn is-cancel"
                  onClick={() => {
                    setIsCreating(false)
                    setNewName('')
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="quick-save__create-btn is-add"
                  disabled={!canAdd}
                  onClick={handleAddCollection}
                >
                  Add
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="quick-save__create"
              onClick={() => setIsCreating(true)}
            >
              ➕ Create New Collection...
            </button>
          )}
        </div>

        <div className="quick-save__footer">
          <button
            type="button"
            className="quick-save__confirm"
            disabled={!selectedCollection}
            onClick={handleConfirm}
          >
            {confirming ? '✓ Saved' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export type { CollectionItem }
