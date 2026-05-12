import { useState, useMemo } from 'react'
import SideNav from './SideNav'
import Header from './Header'
import MenuPage from './MenuPage'
import OrderSummary from './OrderSummary'
import CheckoutModal from './CheckoutModal'
import ReceiptModal from './ReceiptModal'
import StaffLogin from './StaffLogin'
import { menuData } from '../data/menuData'
import '../styles/Kiosk.css'

export default function Kiosk() {
  const [activeSection, setActiveSection] = useState('burger')
  const [activeCategory, setActiveCategory] = useState('All')
  const [cart, setCart] = useState([])
  const [search, setSearch] = useState('')
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [receiptOpen, setReceiptOpen] = useState(false)
  const [completedOrder, setCompletedOrder] = useState(null)
  const [staffOpen, setStaffOpen] = useState(false)

  const handleSectionChange = (section) => {
    setActiveSection(section)
    setActiveCategory('All')
    setSearch('')
  }

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...prev, { ...item, qty: 1, cartId: item.id }]
    })
  }

  const updateQty = (id, delta) => {
    setCart(prev => {
      return prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
    })
  }

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i.id !== id))
  }

  const clearCart = () => setCart([])

  const cartItemIds = useMemo(() => new Set(cart.map(i => i.id)), [cart])

  const filteredItems = useMemo(() => {
    const section = menuData[activeSection]
    if (!section) return []
    return section.items.filter(item => {
      const catMatch = activeCategory === 'All' || item.category === activeCategory
      const searchMatch = !search || item.name.toLowerCase().includes(search.toLowerCase())
      return catMatch && searchMatch
    })
  }, [activeSection, activeCategory, search])

  const handleOrderComplete = (orderData) => {
    setCompletedOrder(orderData)
    setCheckoutOpen(false)
    setReceiptOpen(true)
    clearCart()
  }

  return (
    <div className="kiosk-root">
      <SideNav
        activeSection={activeSection}
        onSelect={handleSectionChange}
        onStaffClick={() => setStaffOpen(true)}
      />

      <div className="kiosk-main">
        <Header
          search={search}
          onSearch={setSearch}
          cartCount={cart.reduce((s, i) => s + i.qty, 0)}
        />

        <div className="kiosk-body">
          <MenuPage
            section={menuData[activeSection]}
            sectionKey={activeSection}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            items={filteredItems}
            cartItemIds={cartItemIds}
            onAddToCart={addToCart}
          />

          <OrderSummary
            cart={cart}
            onUpdateQty={updateQty}
            onRemove={removeFromCart}
            onCheckout={() => setCheckoutOpen(true)}
            onClearCart={clearCart}
          />
        </div>
      </div>

      {checkoutOpen && (
        <CheckoutModal
          cart={cart}
          onClose={() => setCheckoutOpen(false)}
          onComplete={handleOrderComplete}
        />
      )}

      {receiptOpen && completedOrder && (
        <ReceiptModal
          order={completedOrder}
          onClose={() => setReceiptOpen(false)}
        />
      )}

      {staffOpen && (
        <StaffLogin onClose={() => setStaffOpen(false)} />
      )}
    </div>
  )
}
