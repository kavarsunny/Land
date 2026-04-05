import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Search, PlusCircle, User, Briefcase } from 'lucide-react'

const MobileNav = () => {
  return (
    <div className="mobile-nav d-lg-none bg-white border-top shadow-sm px-3 py-1">
      <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        {({ isActive }) => (
          <>
            <Home size={22} strokeWidth={isActive ? 2.5 : 2} />
            <span>Home</span>
          </>
        )}
      </NavLink>
      <NavLink to="/explore" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        {({ isActive }) => (
          <>
            <Search size={22} strokeWidth={isActive ? 2.5 : 2} />
            <span>Explore</span>
          </>
        )}
      </NavLink>
      <NavLink to="/add-property" className="d-flex flex-column align-items-center justify-content-center text-decoration-none">
        <div className="p-3 rounded-circle shadow-lg position-absolute mb-5" style={{ background: 'var(--primary)', color: 'white', marginTop: '-30px', border: '5px solid white' }}>
          <PlusCircle size={30} />
        </div>
        <span style={{ color: 'var(--primary)', marginTop: '22px', fontWeight: 'bold' }}>SELL</span>
      </NavLink>
      <NavLink to="/survey" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        {({ isActive }) => (
          <>
            <Briefcase size={22} strokeWidth={isActive ? 2.5 : 2} />
            <span>Survey</span>
          </>
        )}
      </NavLink>
      <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        {({ isActive }) => (
          <>
            <User size={22} strokeWidth={isActive ? 2.5 : 2} />
            <span>Profile</span>
          </>
        )}
      </NavLink>
    </div>
  )
}

export default MobileNav
