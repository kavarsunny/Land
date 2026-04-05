import React, { useState, useContext, useEffect } from 'react'
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { Ruler, MapPin, User, Info, Send, CheckCircle, ShieldCheck, ChevronRight, Phone } from 'lucide-react'
import axios from 'axios'

const Survey = () => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    location: '',
    size: '',
    address: '',
    ownerName: '',
    ownerPhone: '',
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=survey')
    } else {
      setFormData(prev => ({ ...prev, ownerName: user.name }))
    }
  }, [user, navigate])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post('/api/surveys', {
        landDetails: {
          location: formData.location,
          size: formData.size,
          address: formData.address,
        },
        ownerName: formData.ownerName,
        ownerPhone: formData.ownerPhone,
        notes: formData.notes,
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      setSubmitted(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="survey-page bg-light min-vh-100 py-5">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            {/* Professional Breadcrumb */}
            <div className="d-flex align-items-center text-muted extra-small mb-4 uppercase letter-spacing-1">
               <Link to="/" className="text-decoration-none text-muted">Home</Link>
               <ChevronRight size={12} className="mx-2" />
               <span className="text-dark fw-bold">Request Land Survey</span>
            </div>

            <div className="text-center mb-5">
              <div className="p-4 bg-white rounded-circle d-inline-flex mb-3 shadow-sm border border-primary text-primary">
                 <Ruler size={48} strokeWidth={2.5} />
              </div>
              <h1 className="fw-bold text-dark mb-1">Land Hub Survey Order</h1>
              <p className="text-muted small uppercase letter-spacing-1">Expert DGPS & Total Station Verification</p>
            </div>

            {submitted ? (
              <Card className="border-0 shadow-md p-5 text-center bg-white rounded">
                <CheckCircle size={64} className="text-primary mb-4" />
                <h3 className="fw-bold text-dark mb-3">Order Requested Successfully</h3>
                <p className="text-muted small mb-4">Our Survey Division will contact you within 24 hours to schedule a site visit and boundary verification.</p>
                <div className="d-flex justify-content-center gap-3">
                   <Button as={Link} to="/dashboard" variant="primary" className="btn-swanim px-5 py-2 rounded shadow-sm fw-bold">ORDER STATUS</Button>
                   <Button as={Link} to="/" variant="outline-secondary" className="px-5 py-2 rounded shadow-sm fw-bold border">HOME HUB</Button>
                </div>
              </Card>
            ) : (
              <Form onSubmit={handleSubmit}>
                <Row className="g-4">
                  <Col md={7}>
                    <Card className="border-0 shadow-sm bg-white p-4 h-100 rounded">
                      <h6 className="fw-bold text-dark mb-4 border-bottom pb-2 uppercase letter-spacing-1 small">1. Land Coordinates</h6>
                      <Form.Group className="mb-4">
                        <Form.Label className="extra-small text-muted fw-bold uppercase">Land Location / Municipality</Form.Label>
                        <Form.Control 
                          name="location" 
                          placeholder="e.g. Pune City Region" 
                          className="bg-light border-0 py-3 small shadow-none" 
                          required 
                          value={formData.location}
                          onChange={handleChange}
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-4">
                        <Form.Label className="extra-small text-muted fw-bold uppercase">Approximate Area (Acre/Sqft)</Form.Label>
                        <Form.Control 
                          name="size" 
                          placeholder="Total area for measurement" 
                          className="bg-light border-0 py-3 small shadow-none" 
                          required 
                          value={formData.size}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-0">
                        <Form.Label className="extra-small text-muted fw-bold uppercase">Registry / Physical Address</Form.Label>
                        <Form.Control 
                          as="textarea"
                          rows={3}
                          name="address" 
                          placeholder="Detailed coordinates and landmarks..." 
                          className="bg-light border-0 py-3 small shadow-none" 
                          required 
                          value={formData.address}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Card>
                  </Col>

                  <Col md={5}>
                    <Card className="border-0 shadow-sm bg-white p-4 h-100 rounded">
                      <h6 className="fw-bold text-dark mb-4 border-bottom pb-2 uppercase letter-spacing-1 small">2. Owner Identity</h6>
                      <Form.Group className="mb-4">
                        <Form.Label className="extra-small text-muted fw-bold uppercase">Legal Point of Contact</Form.Label>
                        <Form.Control 
                          name="ownerName" 
                          placeholder="Contact person" 
                          className="bg-light border-0 py-3 small shadow-none" 
                          required 
                          value={formData.ownerName}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label className="extra-small text-muted fw-bold uppercase">Primary Contact Number</Form.Label>
                        <Form.Control 
                          name="ownerPhone" 
                          placeholder="Direct mobile" 
                          className="bg-light border-0 py-3 small shadow-none" 
                          required 
                          value={formData.ownerPhone}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <div className="bg-light p-3 rounded text-center border-dashed mb-0">
                         <ShieldCheck size={24} className="text-primary mb-2 opacity-50" />
                         <p className="extra-small text-muted mb-0">Verified professional survey order.</p>
                      </div>
                    </Card>
                  </Col>

                  <Col xs={12}>
                    <Card className="border-0 shadow-sm bg-white p-4 rounded mb-5">
                      <h6 className="fw-bold text-dark mb-4 border-bottom pb-2 uppercase letter-spacing-1 small">3. Additional Technical Notes</h6>
                      <Form.Group className="mb-4">
                        <Form.Control 
                          as="textarea"
                          rows={4}
                          name="notes" 
                          placeholder="Specify boundary markers, legal concerns, or specific measurement requests..." 
                          className="bg-light border-0 py-3 small shadow-none" 
                          value={formData.notes}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      {error && <Alert variant="danger" className="extra-small py-2 border-0 mb-4">{error}</Alert>}

                      <div className="d-grid">
                        <Button type="submit" className="btn-swanim py-3 d-flex align-items-center justify-content-center gap-2 shadow-sm uppercase fw-bold letter-spacing-1" disabled={loading}>
                          {loading ? 'Processing Order...' : <><Send size={16} /> Order Site Survey</>}
                        </Button>
                      </div>
                    </Card>
                  </Col>
                </Row>
              </Form>
            )}

            {/* Professional Process Sidebar */}
            <div className="bg-white p-4 rounded border shadow-sm mt-5">
                <h6 className="fw-bold text-dark mb-4 border-bottom pb-2 uppercase small letter-spacing-1">Industrial Survey Standard:</h6>
                <Row className="g-4">
                   <Col md={4} className="text-center">
                      <div className="fw-bold text-primary mb-2">PHASE 1</div>
                      <p className="extra-small text-muted mb-0">DGPS-based high-accuracy site initialization and coordinate fixing.</p>
                   </Col>
                   <Col md={4} className="text-center">
                      <div className="fw-bold text-primary mb-2">PHASE 2</div>
                      <p className="extra-small text-muted mb-0">Total Station measurement of all boundaries and topographical data.</p>
                   </Col>
                   <Col md={4} className="text-center">
                      <div className="fw-bold text-primary mb-2">PHASE 3</div>
                      <p className="extra-small text-muted mb-0">Digital report generation with verified maps and boundary certifications.</p>
                   </Col>
                </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Survey
