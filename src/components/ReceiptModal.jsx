import { useRef } from 'react'
import { jokes } from '../data/menuData'

export default function ReceiptModal({ order, onClose }) {
  const receiptRef = useRef(null)

  const joke = jokes[Math.floor(Math.random() * jokes.length)]

  const now = new Date()
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const dateStr = now.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  const handlePrint = () => {
    const el = receiptRef.current
    if (!el) return
    const w = window.open('', '_blank', 'width=420,height=700')
    w.document.write(`
      <html>
        <head>
          <title>FastByte Receipt ${order.receiptId}</title>
          <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@400;600;700&display=swap" rel="stylesheet" />
          <style>
            * { margin:0; padding:0; box-sizing:border-box; }
            body { font-family: 'DM Sans', sans-serif; background: #fff; color: #111; padding: 24px; width: 380px; }
            .receipt-brand { text-align: center; margin-bottom: 16px; }
            .receipt-brand h1 { font-family: 'Space Mono', monospace; font-size: 28px; letter-spacing: 4px; }
            .receipt-brand p { font-size: 11px; color: #666; margin-top: 2px; }
            .divider { border: none; border-top: 1px dashed #ccc; margin: 12px 0; }
            .divider-solid { border: none; border-top: 2px solid #111; margin: 12px 0; }
            .receipt-id { text-align: center; font-family: 'Space Mono', monospace; font-size: 11px; color: #888; margin-bottom: 4px; }
            .receipt-date { text-align: center; font-size: 11px; color: #666; margin-bottom: 12px; }
            .section-label { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #999; margin-bottom: 6px; }
            .customer-block { background: #f8f8f8; border-radius: 6px; padding: 10px 12px; margin-bottom: 12px; }
            .customer-row { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px; }
            .customer-row span:first-child { color: #888; }
            .customer-row strong { text-align: right; max-width: 55%; }
            .item-row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 5px; }
            .item-qty { font-family: 'Space Mono', monospace; font-size: 11px; color: #888; min-width: 28px; }
            .item-name { flex: 1; padding: 0 6px; }
            .item-price { font-family: 'Space Mono', monospace; font-size: 12px; }
            .totals-row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px; color: #555; }
            .total-final { display: flex; justify-content: space-between; font-size: 18px; font-weight: 700; margin-top: 8px; }
            .collection-box { background: #111; color: #fff; border-radius: 8px; padding: 10px 14px; margin: 14px 0; text-align: center; }
            .collection-box span { font-size: 11px; opacity: 0.6; display: block; }
            .collection-box strong { font-size: 22px; letter-spacing: 1px; }
            .joke-box { background: #fff8e7; border: 1px dashed #f0a500; border-radius: 8px; padding: 12px; margin: 14px 0; text-align: center; }
            .joke-box p { font-size: 12px; color: #555; line-height: 1.5; font-style: italic; }
            .barcode { text-align: center; font-family: 'Space Mono', monospace; font-size: 9px; letter-spacing: 3px; color: #bbb; margin-top: 4px; }
            .footer-note { text-align: center; font-size: 10px; color: #aaa; margin-top: 8px; line-height: 1.5; }
          </style>
        </head>
        <body>
          <div class="receipt-brand">
            <h1>FASTBYTE</h1>
            <p>Fast. Fresh. Flavourful.</p>
          </div>
          <hr class="divider-solid" />
          <div class="receipt-id">ORDER: ${order.orderId}</div>
          <div class="receipt-date">${dateStr} · ${timeStr}</div>
          <hr class="divider" />
          <div class="section-label">Customer</div>
          <div class="customer-block">
            <div class="customer-row"><span>Name</span><strong>${order.customerName}</strong></div>
            <div class="customer-row"><span>Phone</span><strong>${order.customerPhone}</strong></div>
            ${order.customerEmail !== 'Not provided' ? `<div class="customer-row"><span>Email</span><strong>${order.customerEmail}</strong></div>` : ''}
            ${order.specialNotes !== 'None' ? `<div class="customer-row"><span>Notes</span><strong>${order.specialNotes}</strong></div>` : ''}
          </div>
          <hr class="divider" />
          <div class="section-label">Items Ordered</div>
          ${order.cart.map(item => `
            <div class="item-row">
              <span class="item-qty">${item.qty}×</span>
              <span class="item-name">${item.name}</span>
              <span class="item-price">$${(item.qty * item.price).toFixed(2)}</span>
            </div>
          `).join('')}
          <hr class="divider" />
          <div class="totals-row"><span>Subtotal</span><span>$${order.subtotal.toFixed(2)}</span></div>
          <div class="totals-row"><span>Tax (15%)</span><span>+$${order.tax.toFixed(2)}</span></div>
          <div class="total-final"><span>TOTAL</span><span>$${order.total.toFixed(2)}</span></div>
          <div class="collection-box">
            <span>Collect your order in</span>
            <strong>${order.collectionTime}</strong>
            <span>Receipt: ${order.receiptId}</span>
          </div>
          <div class="joke-box">
            <p>"${joke}"</p>
          </div>
          <hr class="divider" />
          <div class="barcode">||| ${order.orderId} |||</div>
          <div class="footer-note">
            Thank you for choosing FastByte!<br/>
            Keep this slip to collect your order.<br/>
            We'll see you again soon 🙂
          </div>
        </body>
      </html>
    `)
    w.document.close()
    setTimeout(() => w.print(), 500)
  }

  return (
    <div className="modal-overlay">
      <div className="receipt-modal" ref={receiptRef}>
        {/* Header */}
        <div className="receipt-header">
          <div className="receipt-check">
            <i className="fa-solid fa-circle-check" />
          </div>
          <h2>Order Confirmed!</h2>
          <p>Your food is being prepared</p>
        </div>

        {/* Receipt body */}
        <div className="receipt-body">
          {/* Brand */}
          <div className="receipt-brand-block">
            <h1 className="receipt-brand-name">FASTBYTE</h1>
            <p className="receipt-brand-tag">Fast. Fresh. Flavourful.</p>
          </div>

          <div className="receipt-divider dashed" />

          <div className="receipt-ids">
            <div className="receipt-id-row">
              <span>Order ID</span>
              <strong>{order.orderId}</strong>
            </div>
            <div className="receipt-id-row">
              <span>Receipt</span>
              <strong>{order.receiptId}</strong>
            </div>
            <div className="receipt-id-row">
              <span>Date</span>
              <strong>{dateStr}</strong>
            </div>
            <div className="receipt-id-row">
              <span>Time</span>
              <strong>{timeStr}</strong>
            </div>
          </div>

          <div className="receipt-divider dashed" />

          {/* Customer */}
          <div className="receipt-section-label">Customer Details</div>
          <div className="receipt-customer">
            <div className="receipt-customer-row">
              <i className="fa-solid fa-user" />
              <span>{order.customerName}</span>
            </div>
            <div className="receipt-customer-row">
              <i className="fa-solid fa-phone" />
              <span>{order.customerPhone}</span>
            </div>
            {order.customerEmail !== 'Not provided' && (
              <div className="receipt-customer-row">
                <i className="fa-solid fa-envelope" />
                <span>{order.customerEmail}</span>
              </div>
            )}
            {order.specialNotes !== 'None' && (
              <div className="receipt-customer-row notes">
                <i className="fa-solid fa-note-sticky" />
                <span>{order.specialNotes}</span>
              </div>
            )}
          </div>

          <div className="receipt-divider dashed" />

          {/* Items */}
          <div className="receipt-section-label">Order Items</div>
          <div className="receipt-items">
            {order.cart.map(item => (
              <div key={item.id} className="receipt-item-row">
                <span className="receipt-item-qty">{item.qty}×</span>
                <span className="receipt-item-name">{item.name}</span>
                <span className="receipt-item-price">${(item.qty * item.price).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="receipt-divider" />

          {/* Totals */}
          <div className="receipt-totals">
            <div className="receipt-total-row">
              <span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="receipt-total-row muted">
              <span>Tax (15%)</span><span>+${order.tax.toFixed(2)}</span>
            </div>
            <div className="receipt-total-row grand">
              <span>TOTAL</span><span>${order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Collection time */}
          <div className="receipt-collection-box">
            <span className="collection-label">Collect your order in</span>
            <span className="collection-time">{order.collectionTime}</span>
            <span className="collection-note">Show this slip at the counter</span>
          </div>

          {/* Joke */}
          <div className="receipt-joke">
            <i className="fa-solid fa-face-laugh-squint joke-icon" />
            <p>"{joke}"</p>
          </div>

          <div className="receipt-divider dashed" />

          <div className="receipt-barcode">
            <div className="barcode-lines">
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className="barcode-line" style={{ height: i % 3 === 0 ? '32px' : '24px' }} />
              ))}
            </div>
            <p className="barcode-text">{order.orderId}</p>
          </div>

          <p className="receipt-thanks">Thank you for choosing FastByte! 🍔</p>
        </div>

        {/* Actions */}
        <div className="receipt-actions">
          <button className="receipt-print-btn" onClick={handlePrint}>
            <i className="fa-solid fa-print" /> Print Receipt
          </button>
          <button className="receipt-close-btn" onClick={onClose}>
            <i className="fa-solid fa-check" /> Done
          </button>
        </div>
      </div>
    </div>
  )
}
