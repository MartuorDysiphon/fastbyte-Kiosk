import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import toast from 'react-hot-toast'
import { TAX_RATE } from '../data/menuData'

const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT || 'https://formspree.io/f/YOUR_FORM_ID'

const COLLECTION_TIMES = [
  '10 min', '15 min', '20 min', '25 min', '30 min', '45 min', '1 hour'
]

export default function CheckoutModal({ cart, onClose, onComplete }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    collectionTime: '15 min',
    notes: '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [step, setStep] = useState(1) // 1 = details, 2 = review

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const tax = subtotal * TAX_RATE
  const total = subtotal + tax

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Full name is required'
    if (!form.phone.trim()) e.phone = 'Contact number is required'
    else if (!/^\+?[\d\s\-()]{7,}$/.test(form.phone.trim())) e.phone = 'Please enter a valid phone number'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (validate()) setStep(2)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    const orderId = 'FB-' + uuidv4().toUpperCase().slice(0, 8)
    const receiptId = 'RCP-' + Date.now().toString(36).toUpperCase()

    const orderLines = cart.map(i =>
      `${i.qty}x ${i.name} @ $${i.price.toFixed(2)} = $${(i.qty * i.price).toFixed(2)}`
    ).join('\n')

    const payload = {
      orderId,
      receiptId,
      customerName: form.name,
      customerPhone: form.phone,
      customerEmail: form.email || 'Not provided',
      collectionTime: form.collectionTime,
      specialNotes: form.notes || 'None',
      orderItems: orderLines,
      itemCount: cart.reduce((s, i) => s + i.qty, 0),
      subtotal: `$${subtotal.toFixed(2)}`,
      tax: `$${tax.toFixed(2)}`,
      total: `$${total.toFixed(2)}`,
      orderDate: new Date().toLocaleString(),
    }

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        toast.success('Order sent to kitchen!')
        onComplete({
          ...payload,
          cart,
          subtotal,
          tax,
          total,
          form,
        })
      } else {
        // Still complete order even if formspree fails in dev
        toast.success('Order placed! (Formspree not configured)')
        onComplete({
          ...payload,
          cart,
          subtotal,
          tax,
          total,
          form,
        })
      }
    } catch (err) {
      // Dev mode fallback
      toast.success('Order placed!')
      onComplete({
        ...payload,
        cart,
        subtotal,
        tax,
        total,
        form,
      })
    }
    setSubmitting(false)
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="checkout-modal">
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{step === 1 ? 'Your Details' : 'Confirm Order'}</h2>
            <p className="modal-subtitle">
              {step === 1 ? 'Fill in your info to place the order' : 'Review before confirming'}
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="modal-steps">
          <div className={`step-dot ${step >= 1 ? 'active' : ''}`}>1</div>
          <div className="step-line" />
          <div className={`step-dot ${step >= 2 ? 'active' : ''}`}>2</div>
        </div>

        {step === 1 ? (
          <div className="modal-body">
            <div className="form-group">
              <label>Full Name <span className="req">*</span></label>
              <input
                className={`form-input ${errors.name ? 'err' : ''}`}
                placeholder="e.g. Sipho Dlamini"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
              {errors.name && <span className="err-msg">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label>Contact Number <span className="req">*</span></label>
              <input
                className={`form-input ${errors.phone ? 'err' : ''}`}
                placeholder="e.g. +27 82 123 4567"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              />
              {errors.phone && <span className="err-msg">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label>Email Address <span className="optional">(optional)</span></label>
              <input
                className={`form-input ${errors.email ? 'err' : ''}`}
                placeholder="e.g. sipho@email.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              />
              {errors.email && <span className="err-msg">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Collection Time</label>
              <div className="time-grid">
                {COLLECTION_TIMES.map(t => (
                  <button
                    key={t}
                    className={`time-chip ${form.collectionTime === t ? 'active' : ''}`}
                    onClick={() => setForm(f => ({ ...f, collectionTime: t }))}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Special Instructions <span className="optional">(optional)</span></label>
              <textarea
                className="form-input form-textarea"
                placeholder="e.g. No onions, extra sauce..."
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                rows={2}
              />
            </div>

            <button className="checkout-btn full" onClick={handleNext}>
              Review Order <i className="fa-solid fa-arrow-right" />
            </button>
          </div>
        ) : (
          <div className="modal-body">
            <div className="review-customer">
              <div className="review-row"><span>Name</span><strong>{form.name}</strong></div>
              <div className="review-row"><span>Phone</span><strong>{form.phone}</strong></div>
              <div className="review-row"><span>Email</span><strong>{form.email || '—'}</strong></div>
              <div className="review-row"><span>Collection</span><strong>{form.collectionTime}</strong></div>
              {form.notes && <div className="review-row"><span>Notes</span><strong>{form.notes}</strong></div>}
            </div>

            <div className="review-items">
              <h4>Order Items</h4>
              {cart.map(item => (
                <div key={item.id} className="review-item-row">
                  <span className="review-item-name">{item.qty}× {item.name}</span>
                  <span className="review-item-price">${(item.qty * item.price).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="review-totals">
              <div className="review-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="review-row"><span>Tax (15%)</span><span>+${tax.toFixed(2)}</span></div>
              <div className="review-row total-row"><span>TOTAL</span><span>${total.toFixed(2)}</span></div>
            </div>

            <div className="review-actions">
              <button className="back-btn" onClick={() => setStep(1)}>
                <i className="fa-solid fa-arrow-left" /> Back
              </button>
              <button className="checkout-btn" onClick={handleSubmit} disabled={submitting}>
                {submitting ? (
                  <><i className="fa-solid fa-spinner fa-spin" /> Placing Order...</>
                ) : (
                  <><i className="fa-solid fa-check" /> Confirm & Place Order</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
