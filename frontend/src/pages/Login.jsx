import React, { useState, useContext, useEffect } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { LogIn, Mail, Lock, ShieldCheck, ChevronRight, User } from 'lucide-react'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  
  const { login, user } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  
  const redirect = location.search ? location.search.split('=')[1] : '/'

  useEffect(() => {
    if (user) {
      navigate(redirect)
    }
  }, [user, navigate, redirect])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(email, password)
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials.')
    }
  }

  const handleDemoLogin = async (role) => {
    try {
      if (role === 'admin') {
        await login('admin@swanim.com', 'admin123')
      } else {
        await login('demo@swanim.com', 'demo@123')
      }
    } catch (err) {
      setError('Demo login failed.')
    }
  }

  return (
    <div className="login-page bg-light min-vh-100 d-flex align-items-center py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5} xl={4}>
            <div className="text-center mb-5">
               <div className="p-3 bg-white rounded-circle shadow-sm border border-primary d-inline-flex mb-3 text-primary">
                  <ShieldCheck size={32} strokeWidth={2.5} />
               </div>
               <h3 className="fw-bold text-dark mb-1">Welcome Back</h3>
               <p className="text-muted small uppercase letter-spacing-1">Swanim Land Account Access</p>
            </div>

            <Card className="border-0 shadow-sm rounded-lg overflow-hidden bg-white">
              <Card.Body className="p-4 p-lg-5">
                {error && <Alert variant="danger" className="py-2 extra-small border-0 mb-4">{error}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="extra-small text-muted fw-bold uppercase">Work Email</Form.Label>
                    <InputGroup className="bg-light rounded border-0 overflow-hidden">
                       <InputGroup.Text className="bg-transparent border-0 text-muted"><Mail size={16} /></InputGroup.Text>
                       <Form.Control 
                        type="email" 
                        placeholder="name@company.com" 
                        className="bg-transparent border-0 py-2 small shadow-none" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="extra-small text-muted fw-bold uppercase">Secure Password</Form.Label>
                    <InputGroup className="bg-light rounded border-0 overflow-hidden">
                       <InputGroup.Text className="bg-transparent border-0 text-muted"><Lock size={16} /></InputGroup.Text>
                       <Form.Control 
                        type="password" 
                        placeholder="••••••••" 
                        className="bg-transparent border-0 py-2 small shadow-none" 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </InputGroup>
                  </Form.Group>

                  <Button type="submit" className="btn-swanim w-100 py-3 fw-bold rounded shadow-sm d-flex align-items-center justify-content-center gap-2 mb-4 text-uppercase">
                    <LogIn size={18} /> Auth Account
                  </Button>
                </Form>

                <div className="text-center mb-4">
                   <div className="d-flex align-items-center justify-content-center gap-2 text-muted uppercase extra-small mb-3">
                      <div className="flex-grow-1 border-top"></div>
                      <span>Quick Sandbox Access</span>
                      <div className="flex-grow-1 border-top"></div>
                   </div>
                   <div className="d-flex gap-2">
                      <Button variant="outline-primary" className="flex-grow-1 extra-small fw-bold py-2 border-primary" onClick={() => handleDemoLogin('user')}>
                         DEMO CUSTOMER
                      </Button>
                      <Button variant="outline-dark" className="flex-grow-1 extra-small fw-bold py-2" onClick={() => handleDemoLogin('admin')}>
                         ADMIN ACCESS
                      </Button>
                   </div>
                </div>

                <div className="text-center pt-3 border-top">
                  <p className="text-muted small mb-0">Don't have an account? <Link to="/register" className="text-primary fw-bold text-decoration-none">Register Dealership <ChevronRight size={14} /></Link></p>
                </div>
              </Card.Body>
            </Card>

            <div className="text-center mt-5">
               <p className="extra-small text-muted mb-0">Protected by Swanim Security Protocol</p>
               <p className="extra-small text-muted">Legal Land Marketplace Architecture</p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Login
