interface TagFilterProps {
  tags: string[]
  selectedTag: string | null
  onSelectTag: (tag: string | null) => void
}

export function TagFilter({ tags, selectedTag, onSelectTag }: TagFilterProps) {
  if (tags.length === 0) return null

  return (
    <div className="tag-filter">
      <button
        className={`tag-filter__pill ${selectedTag === null ? 'tag-filter__pill--active' : ''}`}
        onClick={() => onSelectTag(null)}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          className={`tag-filter__pill ${selectedTag === tag ? 'tag-filter__pill--active' : ''}`}
          onClick={() => onSelectTag(selectedTag === tag ? null : tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  )
}
