import { menuData } from '../data/menuData'

const sections = Object.entries(menuData).map(([key, val]) => ({
  key,
  label: val.label,
  icon: val.icon,
}))

export default function SideNav({ activeSection, onSelect, onStaffClick }) {
  return (
    <nav className="side-nav">
      <div className="side-nav-brand">
        <span className="brand-dot" />
      </div>

      <ul className="side-nav-links">
        {sections.map(({ key, label, icon }) => (
          <li key={key}>
            <button
              className={`side-nav-item ${activeSection === key ? 'active' : ''}`}
              onClick={() => onSelect(key)}
              title={label}
            >
              <i className={`fa-solid ${icon}`} />
              <span>{label}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="side-nav-footer">
        <button className="side-nav-item staff-btn" onClick={onStaffClick} title="Staff Login">
          <i className="fa-solid fa-shield-halved" />
          <span>Staff</span>
        </button>
      </div>
    </nav>
  )
}
