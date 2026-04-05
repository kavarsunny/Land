import React, { useState, useContext, useEffect } from 'react'
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { UserPlus, Mail, Lock, User, ShieldCheck } from 'lucide-react'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  
  const { register, user } = useContext(AuthContext)
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
    if (password !== confirmPassword) {
      return setError('Passwords do not match.')
    }
    try {
      await register(name, email, password)
    } catch (err) {
      setError(err.response?.data?.message || 'Technical error during registration.')
    }
  }

  return (
    <div className="register-page bg-light min-vh-100 d-flex align-items-center py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={4}>
            <div className="text-center mb-5">
              <div className="p-3 bg-white rounded-circle d-inline-flex mb-3 shadow-sm border border-primary text-primary">
                 <UserPlus size={32} strokeWidth={2.5} />
              </div>
              <h2 className="fw-bold text-dark mb-1">Create Account</h2>
              <p className="text-muted small uppercase letter-spacing-1">Swanim Land Hub Membership</p>
            </div>
            
            <Card className="border-0 shadow-md p-4 bg-white rounded">
              {error && <Alert variant="danger" className="extra-small py-2 border-0 mb-4">{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="extra-small text-muted fw-bold uppercase">Full Name</Form.Label>
                  <div className="position-relative">
                    <User size={16} className="position-absolute translate-middle-y top-50 ms-3 text-muted" />
                    <Form.Control 
                      type="text" 
                      placeholder="e.g. Rahul Sharma" 
                      className="bg-light border-0 ps-5 py-2 small" 
                      required 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="extra-small text-muted fw-bold uppercase">Work Email</Form.Label>
                  <div className="position-relative">
                    <Mail size={16} className="position-absolute translate-middle-y top-50 ms-3 text-muted" />
                    <Form.Control 
                      type="email" 
                      placeholder="name@example.com" 
                      className="bg-light border-0 ps-5 py-2 small" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="extra-small text-muted fw-bold uppercase">Secret Password</Form.Label>
                  <div className="position-relative">
                    <Lock size={16} className="position-absolute translate-middle-y top-50 ms-3 text-muted" />
                    <Form.Control 
                      type="password" 
                      placeholder="••••••••" 
                      className="bg-light border-0 ps-5 py-2 small" 
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="extra-small text-muted fw-bold uppercase">Confirm Secret</Form.Label>
                  <div className="position-relative">
                    <Lock size={16} className="position-absolute translate-middle-y top-50 ms-3 text-muted" />
                    <Form.Control 
                      type="password" 
                      placeholder="••••••••" 
                      className="bg-light border-0 ps-5 py-2 small" 
                      required 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </Form.Group>

                <Button type="submit" className="btn-swanim w-100 py-2 mb-3 d-flex align-items-center justify-content-center gap-2 text-uppercase fw-bold shadow-sm">
                  <UserPlus size={16} /> Open Hub Account
                </Button>
              </Form>
              
              <div className="text-center mt-3 pt-3 border-top">
                <p className="text-muted extra-small mb-0 uppercase">Already Registered? <Link to="/login" className="text-primary text-decoration-none fw-bold">Sign In</Link></p>
              </div>
            </Card>
            
            <div className="text-center mt-5">
               <p className="extra-small text-muted mb-0">Identity verified by Swanim Core Protocols</p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Register
