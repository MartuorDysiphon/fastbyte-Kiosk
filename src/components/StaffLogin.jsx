export default function StaffLogin({ onClose }) {
  const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="staff-modal">
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Staff Portal</h2>
            <p className="modal-subtitle">Employee access only</p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="staff-body">
          {clerkKey ? (
            <ClerkStaffPanel onClose={onClose} />
          ) : (
            <div className="staff-no-clerk">
              <i className="fa-solid fa-shield-halved" style={{ fontSize: '2.5rem', color: 'var(--accent-gold)', marginBottom: '12px' }} />
              <h3>Clerk Not Configured</h3>
              <p>
                Add your <code>VITE_CLERK_PUBLISHABLE_KEY</code> to the <code>.env</code> file to enable
                staff authentication.
              </p>
              <a
                href="https://clerk.com"
                target="_blank"
                rel="noopener noreferrer"
                className="clerk-setup-link"
              >
                Set up Clerk →
              </a>
              <div style={{ marginTop: '16px', width: '100%' }}>
                <div className="staff-links">
                  <div className="staff-card">
                    <i className="fa-solid fa-chart-bar" />
                    <span>Order Dashboard</span>
                    <p>View all orders submitted via Formspree</p>
                    <a href="https://formspree.io/forms" target="_blank" rel="noopener noreferrer">
                      Open Formspree →
                    </a>
                  </div>
                </div>
              </div>
              <button className="checkout-btn full" onClick={onClose} style={{ marginTop: '16px' }}>
                Return to Kiosk
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Only imported/used when Clerk key is present
function ClerkStaffPanel({ onClose }) {
  // Lazy-load Clerk components only when key is available
  try {
    const { SignIn, SignedIn, SignedOut, UserButton, useUser } = require('@clerk/clerk-react')

    return (
      <>
        <SignedOut>
          <div className="clerk-wrap">
            <SignIn />
          </div>
        </SignedOut>
        <SignedIn>
          <StaffDashboard onClose={onClose} />
        </SignedIn>
      </>
    )
  } catch {
    return (
      <div className="staff-no-clerk">
        <p>Clerk failed to load. Check your publishable key.</p>
        <button className="checkout-btn full" onClick={onClose}>Return to Kiosk</button>
      </div>
    )
  }
}

function StaffDashboard({ onClose }) {
  try {
    const { useUser, UserButton } = require('@clerk/clerk-react')
    const { user } = useUser()

    return (
      <div className="staff-dashboard">
        <div className="staff-welcome">
          <UserButton afterSignOutUrl="/" />
          <div>
            <h3>Welcome, {user?.firstName || 'Staff Member'}</h3>
            <p>{user?.primaryEmailAddress?.emailAddress}</p>
          </div>
        </div>
        <div className="staff-links">
          <div className="staff-card">
            <i className="fa-solid fa-chart-bar" />
            <span>Today's Orders</span>
            <p>View all orders placed today via your Formspree dashboard</p>
            <a href="https://formspree.io/forms" target="_blank" rel="noopener noreferrer">
              Open Dashboard →
            </a>
          </div>
          <div className="staff-card">
            <i className="fa-solid fa-gear" />
            <span>Manage Staff</span>
            <p>Add or remove staff accounts and permissions</p>
            <a href="https://dashboard.clerk.com" target="_blank" rel="noopener noreferrer">
              Open Clerk →
            </a>
          </div>
        </div>
        <button className="checkout-btn full" onClick={onClose} style={{ marginTop: '12px' }}>
          Return to Kiosk
        </button>
      </div>
    )
  } catch {
    return <button className="checkout-btn full" onClick={onClose}>Return to Kiosk</button>
  }
}