export default function MenuPage({ section, sectionKey, activeCategory, onCategoryChange, items, cartItemIds, onAddToCart }) {
  if (!section) return null

  return (
    <div className="menu-page">
      {/* Category tabs */}
      <div className="category-bar">
        {section.categories.map(cat => (
          <button
            key={cat}
            className={`cat-tab ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => onCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="menu-grid">
        {items.length === 0 ? (
          <div className="menu-empty">
            <i className="fa-solid fa-bowl-food" />
            <p>No items found</p>
          </div>
        ) : (
          items.map(item => {
            const inCart = cartItemIds.has(item.id)
            return (
              <div key={item.id} className={`menu-card ${inCart ? 'in-cart' : ''}`}>
                <div className="menu-card-img-wrap">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="menu-card-img"
                    onError={e => { e.target.style.opacity = '0.2' }}
                  />
                  {inCart && (
                    <div className="in-cart-badge">
                      <i className="fa-solid fa-check" />
                    </div>
                  )}
                </div>
                <div className="menu-card-body">
                  <div className="menu-card-top">
                    <h3 className="menu-card-name">{item.name}</h3>
                    <span className="menu-card-price">R{item.price.toFixed(2)}</span>
                  </div>
                  <p className="menu-card-desc">{item.description}</p>
                  <div className="menu-card-meta">
                    <span className="menu-meta-item">
                      <i className="fa-regular fa-clock" /> {item.prepTime}
                    </span>
                    <span className="menu-meta-item">
                      <i className="fa-solid fa-fire-flame-curved" /> {item.calories} cal
                    </span>
                  </div>
                  <button
                    className={`add-btn ${inCart ? 'added' : ''}`}
                    onClick={() => onAddToCart(item)}
                  >
                    {inCart ? (
                      <><i className="fa-solid fa-plus" /> Add Again</>
                    ) : (
                      <><i className="fa-solid fa-plus" /> Add to Order</>
                    )}
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
