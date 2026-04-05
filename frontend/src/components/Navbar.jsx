import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Container, Navbar, Nav, NavDropdown, Button } from 'react-bootstrap'
import { AuthContext } from '../context/AuthContext'
import { MapPin, User, LogOut, ChevronDown } from 'lucide-react'

const AppNavbar = () => {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <Navbar bg="white" variant="light" expand="lg" className="sticky-top shadow-sm py-2 d-none d-lg-block border-bottom">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold d-flex align-items-center">
          <div className="p-2 rounded-circle me-2 d-flex align-items-center justify-content-center" style={{ background: 'var(--primary)', color: 'white' }}>
            <MapPin size={22} fill="white" />
          </div>
          <div className="d-flex flex-column" style={{ lineHeight: '1.1' }}>
            <span style={{ color: '#1A1A1A', fontSize: '1.2rem', letterSpacing: '0.05rem' }}>SWANIM LAND</span>
            <span className="text-muted extra-small" style={{ fontSize: '0.6rem' }}>Verified Land Corporation</span>
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center gap-3">
            <Nav.Link as={Link} to="/explore" className="fw-bold text-dark hover-green">Buy Land</Nav.Link>
            <Nav.Link as={Link} to="/explore?category=Rent" className="fw-bold text-dark hover-green">Rent</Nav.Link>
            <Nav.Link as={Link} to="/survey" className="fw-bold text-dark hover-green">Survey</Nav.Link>
            
            {user ? (
              <NavDropdown 
                title={
                  <div className="d-inline-flex align-items-center bg-light px-3 py-1 rounded-pill border">
                    <User size={18} className="me-2 text-primary"/>
                    <span className="text-dark small fw-bold">{user.name}</span>
                    <ChevronDown size={14} className="ms-2 text-muted" />
                  </div>
                } 
                id="user-dropdown"
                className="custom-dropdown"
              >
                <NavDropdown.Item as={Link} to="/dashboard">My Dashboard</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/add-property">Post Land Free</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout} className="text-danger">
                  <LogOut size={16} className="me-2"/> Sign Out
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <div className="d-flex align-items-center ms-lg-3 gap-2">
                <Button as={Link} to="/login" variant="link" className="text-dark text-decoration-none fw-bold px-3">Login</Button>
                <Button as={Link} to="/add-property" className="btn-swanim rounded shadow-sm px-4">Post Land FREE</Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default AppNavbar
