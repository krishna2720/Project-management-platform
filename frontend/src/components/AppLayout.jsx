import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FolderKanban, LayoutDashboard, LogOut, Menu, Plus, X } from 'lucide-react'
import { useAuth } from '../context/useAuth'

export default function AppLayout({ children }) {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  const initials = (user?.fullname || user?.username || 'U').slice(0, 2).toUpperCase()

  return (
    <div className="app-shell">
      {menuOpen && <button className="mobile-backdrop" aria-label="Close menu" onClick={() => setMenuOpen(false)} />}
      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <div className="brand-row">
          <Link to="/" className="brand">
            <span className="brand-mark"><FolderKanban size={20} /></span>
            <span>work<span className="brand-accent">space</span></span>
          </Link>
          <button className="icon-button mobile-close" onClick={() => setMenuOpen(false)} aria-label="Close navigation"><X size={19} /></button>
        </div>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="side-nav">
          <NavLink to="/" end onClick={() => setMenuOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'nav-active' : ''}`}>
            <LayoutDashboard size={18} /> Overview
          </NavLink>
        </nav>
        <div className="sidebar-bottom">
          <div className="user-card">
            <div className="avatar">{initials}</div>
            <div className="user-card-info">
              <strong>{user?.fullname || user?.username}</strong>
              <span>{user?.email}</span>
            </div>
            <button className="icon-button logout-button" title="Sign out" onClick={handleLogout}><LogOut size={17} /></button>
          </div>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><Menu size={21} /></button>
          <div className="breadcrumb"><span>Workspace</span><span className="breadcrumb-divider">/</span><strong>Overview</strong></div>
          <Link to="/" className="topbar-action"><Plus size={16} /> <span>New project</span></Link>
        </header>
        <div className="main-content">{children}</div>
      </main>
    </div>
  )
}
