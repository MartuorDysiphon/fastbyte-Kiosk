import { TAX_RATE } from '../data/menuData'

export default function OrderSummary({ cart, onUpdateQty, onRemove, onCheckout, onClearCart }) {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const tax = subtotal * TAX_RATE
  const total = subtotal + tax
  const itemCount = cart.reduce((s, i) => s + i.qty, 0)

  return (
    <aside className="order-panel">
      <div className="order-panel-header">
        <h2 className="order-title">Your Order</h2>
        {cart.length > 0 && (
          <button className="clear-btn" onClick={onClearCart} title="Clear all">
            <i className="fa-solid fa-trash-can" />
          </button>
        )}
      </div>

      <div className="order-items">
        {cart.length === 0 ? (
          <div className="order-empty">
            <i className="fa-solid fa-clipboard-list" />
            <p>No items yet</p>
            <span>Browse the menu to add items</span>
          </div>
        ) : (
          cart.map(item => (
            <div key={item.cartId} className="order-item-row">
              <div className="order-item-img-wrap">
                <img
                  src={item.img}
                  alt={item.name}
                  className="order-item-img"
                  onError={e => { e.target.style.opacity = '0.2' }}
                />
              </div>
              <div className="order-item-info">
                <h4 className="order-item-name">{item.name}</h4>
                <span className="order-item-unit">R{item.price.toFixed(2)} each</span>
                <div className="order-item-controls">
                  <button className="qty-btn" onClick={() => onUpdateQty(item.id, -1)}>
                    <i className="fa-solid fa-minus" />
                  </button>
                  <span className="qty-val">{item.qty}</span>
                  <button className="qty-btn" onClick={() => onUpdateQty(item.id, 1)}>
                    <i className="fa-solid fa-plus" />
                  </button>
                  <button className="remove-btn" onClick={() => onRemove(item.id)}>
                    <i className="fa-solid fa-xmark" />
                  </button>
                </div>
              </div>
              <span className="order-item-total">${(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <div className="order-summary-foot">
          <div className="summary-line">
            <span>{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
            <span>Subtotal: R{subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-line muted">
            <span>Tax (15%)</span>
            <span>+R{tax.toFixed(2)}</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>R{total.toFixed(2)}</span>
          </div>
          <button className="checkout-btn" onClick={onCheckout}>
            <i className="fa-solid fa-arrow-right" />
            Proceed to Checkout
          </button>
        </div>
      )}

      {cart.length === 0 && (
        <div className="order-footer-empty">
          <div className="summary-total disabled">
            <span>Total</span>
            <span>R0.00</span>
          </div>
          <button className="checkout-btn disabled" disabled>
            Proceed to Checkout
          </button>
        </div>
      )}
    </aside>
  )
}
