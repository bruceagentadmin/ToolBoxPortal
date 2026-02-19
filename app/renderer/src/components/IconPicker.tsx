import { useState, useMemo } from 'react'
import { ICON_REGISTRY, ICON_CATEGORIES, type IconCategory, type IconEntry } from './icon-registry'

interface IconPickerProps {
  currentIcon?: string
  onSelect: (iconKey: string) => void
  onClose: () => void
}

export function IconPicker({ currentIcon, onSelect, onClose }: IconPickerProps) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<IconCategory | 'All'>('All')

  const filtered = useMemo(() => {
    let results = ICON_REGISTRY

    // Filter by category
    if (activeCategory !== 'All') {
      results = results.filter((e) => e.category === activeCategory)
    }

    // Filter by search
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      results = results.filter(
        (e) =>
          e.label.toLowerCase().includes(q) ||
          e.key.toLowerCase().includes(q) ||
          e.keywords.some((kw) => kw.includes(q))
      )
    }

    return results
  }, [search, activeCategory])

  const handleSelect = (entry: IconEntry) => {
    onSelect(entry.key)
    onClose()
  }

  return (
    <div className="modal-overlay" style={{ zIndex: 200 }}>
      <div className="modal icon-picker" onClick={(e) => e.stopPropagation()}>
        <div className="icon-picker__header">
          <h2 className="modal__title">Choose Icon</h2>
          <button
            type="button"
            className="icon-picker__close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Search */}
        <div className="icon-picker__search">
          <input
            type="text"
            placeholder="Search icons... (e.g. dotnet, server, database)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>

        {/* Category tabs */}
        <div className="icon-picker__tabs">
          <button
            type="button"
            className={`icon-picker__tab ${activeCategory === 'All' ? 'icon-picker__tab--active' : ''}`}
            onClick={() => setActiveCategory('All')}
          >
            All
          </button>
          {ICON_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`icon-picker__tab ${activeCategory === cat ? 'icon-picker__tab--active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Icon grid */}
        <div className="icon-picker__grid">
          {filtered.length === 0 ? (
            <div className="icon-picker__empty">No icons match your search</div>
          ) : (
            filtered.map((entry) => (
              <button
                key={entry.key}
                type="button"
                className={`icon-picker__item ${currentIcon === entry.key ? 'icon-picker__item--selected' : ''}`}
                onClick={() => handleSelect(entry)}
                title={entry.label}
              >
                <entry.component size={24} />
                <span className="icon-picker__label">{entry.label}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
