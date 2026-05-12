export default function Header({ search, onSearch, cartCount }) {
  const now = new Date()
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const dateStr = now.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })

  return (
    <header className="kiosk-header">
      <div className="header-brand">
        <h1 className="brand-name">FASTBYTE</h1>
        <span className="brand-tag">Kiosk System</span>
      </div>

      <div className="header-search">
        <i className="fa-solid fa-magnifying-glass search-icon" />
        <input
          type="text"
          placeholder="Search menu..."
          value={search}
          onChange={e => onSearch(e.target.value)}
          className="search-input"
        />
        {search && (
          <button className="search-clear" onClick={() => onSearch('')}>
            <i className="fa-solid fa-xmark" />
          </button>
        )}
      </div>

      <div className="header-meta">
        <div className="header-time">
          <span className="time-val">{timeStr}</span>
          <span className="time-date">{dateStr}</span>
        </div>
        {cartCount > 0 && (
          <div className="header-cart-badge">
            <i className="fa-solid fa-bag-shopping" />
            <span>{cartCount}</span>
          </div>
        )}
      </div>
    </header>
  )
}
