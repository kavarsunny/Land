import React, { useState, useContext, useEffect } from 'react'
import { Container, Row, Col, Form, Button, Alert, Card, InputGroup } from 'react-bootstrap'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { PlusCircle, MapPin, IndianRupee, Ruler, Info, Image as ImageIcon, Send, ShieldCheck, ChevronRight } from 'lucide-react'
import axios from 'axios'

const AddProperty = () => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    city: '',
    state: '',
    address: '',
    size: '',
    category: 'Buy',
    propertyType: 'Plot',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=add-property')
    }
  }, [user, navigate])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const propertyData = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        location: {
          city: formData.city,
          state: formData.state,
          address: formData.address,
        },
        size: formData.size,
        category: formData.category,
        propertyType: formData.propertyType,
        images: []
      }
      
      await axios.post('/api/properties', propertyData, {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="add-property-page bg-light min-vh-100 py-5">
      <Container>
        <Row className="justify-content-center">
          <Col lg={9}>
            {/* Professional Breadcrumb */}
            <div className="d-flex align-items-center text-muted extra-small mb-4 uppercase letter-spacing-1">
               <Link to="/dashboard" className="text-decoration-none text-muted">Dashboard</Link>
               <ChevronRight size={12} className="mx-2" />
               <span className="text-dark fw-bold">Post New Land</span>
            </div>

            <div className="d-flex align-items-center mb-5">
              <div className="p-3 bg-white rounded-circle me-4 text-primary shadow-sm border border-primary">
                <PlusCircle size={32} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="fw-bold text-dark mb-1">List Land Property</h2>
                <p className="text-muted small uppercase">Free posting for legal verified land</p>
              </div>
            </div>

            <Form onSubmit={handleSubmit}>
              <Row className="g-4">
                <Col lg={8}>
                  {/* Step 1: Base Details */}
                  <Card className="border-0 shadow-sm bg-white p-4 mb-4 rounded">
                    <h6 className="fw-bold text-dark mb-4 border-bottom pb-2 uppercase letter-spacing-1 small">1. Property Particulars</h6>
                    <Form.Group className="mb-4">
                      <Form.Label className="extra-small text-muted fw-bold uppercase">Public Title</Form.Label>
                      <Form.Control 
                        name="title" 
                        placeholder="e.g. 10 Acre Industrial Land near Thane" 
                        className="bg-light border-0 py-3 small shadow-none" 
                        required 
                        value={formData.title}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group className="mb-4">
                           <Form.Label className="extra-small text-muted fw-bold uppercase">Pricing Valuation (₹)</Form.Label>
                           <InputGroup className="bg-light rounded border-0 overflow-hidden">
                              <InputGroup.Text className="bg-transparent border-0 text-muted"><IndianRupee size={16} /></InputGroup.Text>
                              <Form.Control 
                                type="number"
                                name="price" 
                                placeholder="Total Price" 
                                className="bg-transparent border-0 py-2 small shadow-none" 
                                required 
                                value={formData.price}
                                onChange={handleChange}
                              />
                           </InputGroup>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-4">
                           <Form.Label className="extra-small text-muted fw-bold uppercase">Land Area Spec (Acre/Sqft)</Form.Label>
                           <InputGroup className="bg-light rounded border-0 overflow-hidden">
                              <InputGroup.Text className="bg-transparent border-0 text-muted"><Ruler size={16} /></InputGroup.Text>
                              <Form.Control 
                                name="size" 
                                placeholder="Area measurement" 
                                className="bg-transparent border-0 py-2 small shadow-none" 
                                required 
                                value={formData.size}
                                onChange={handleChange}
                              />
                           </InputGroup>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-2">
                       <Form.Label className="extra-small text-muted fw-bold uppercase">Description & Legal Highlights</Form.Label>
                       <Form.Control 
                         as="textarea"
                         rows={5}
                         name="description" 
                         placeholder="Detail the boundaries, proximity, and legal status..." 
                         className="bg-light border-0 py-3 small shadow-none" 
                         required 
                         value={formData.description}
                         onChange={handleChange}
                       />
                    </Form.Group>
                  </Card>

                  {/* Step 2: Location Details */}
                  <Card className="border-0 shadow-sm bg-white p-4 rounded">
                    <h6 className="fw-bold text-dark mb-4 border-bottom pb-2 uppercase letter-spacing-1 small">2. Location Registry</h6>
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label className="extra-small text-muted fw-bold uppercase">Exact City</Form.Label>
                          <Form.Control 
                            name="city" 
                            placeholder="Enter Municipality" 
                            className="bg-light border-0 py-2 small shadow-none" 
                            required 
                            value={formData.city}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label className="extra-small text-muted fw-bold uppercase">Administrative State</Form.Label>
                          <Form.Control 
                            name="state" 
                            placeholder="Enter State" 
                            className="bg-light border-0 py-2 small shadow-none" 
                            required 
                            value={formData.state}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Form.Group className="mb-2">
                      <Form.Label className="extra-small text-muted fw-bold uppercase">Full Address Details</Form.Label>
                      <Form.Control 
                        name="address" 
                        placeholder="Detailed address and landmarks..." 
                        className="bg-light border-0 py-2 small shadow-none" 
                        required 
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Card>
                </Col>

                <Col lg={4}>
                  {/* Step 3: Meta Attributes */}
                  <Card className="border-0 shadow-sm bg-white p-4 mb-4 rounded sticky-top" style={{ top: '100px' }}>
                    <h6 className="fw-bold text-dark mb-4 border-bottom pb-2 uppercase letter-spacing-1 small">3. Classifications</h6>
                    
                    <Form.Group className="mb-4">
                      <Form.Label className="extra-small text-muted fw-bold uppercase">Category Type</Form.Label>
                      <Form.Select 
                        name="category" 
                        className="bg-light border-0 py-2 small shadow-none" 
                        value={formData.category}
                        onChange={handleChange}
                      >
                        <option value="Buy">Commercial Sale</option>
                        <option value="Rent">Lease/Rent</option>
                        <option value="NA Land">NA Certified</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="extra-small text-muted fw-bold uppercase">Land Use Zone</Form.Label>
                      <Form.Select 
                        name="propertyType" 
                        className="bg-light border-0 py-2 small shadow-none" 
                        value={formData.propertyType}
                        onChange={handleChange}
                      >
                        <option value="Plot">Residential Plot</option>
                        <option value="Agricultural">Agricultural Land</option>
                        <option value="Commercial">Industrial/Commercial</option>
                        <option value="Residential">Gated Residential</option>
                      </Form.Select>
                    </Form.Group>

                    <div className="bg-light p-3 rounded mb-4 text-center border-dashed">
                       <ImageIcon size={32} className="text-muted opacity-50 mb-2" />
                       <p className="extra-small text-muted mb-0">Upload documents and site images (Multiple allowed)</p>
                    </div>

                    {error && <Alert variant="danger" className="extra-small py-2 border-0 mb-4">{error}</Alert>}

                    <Button type="submit" className="btn-swanim w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm uppercase letter-spacing-1" disabled={loading}>
                      {loading ? 'Processing...' : <><Send size={16} /> Submit Property</>}
                    </Button>
                    
                    <div className="text-center mt-3 pt-3 border-top">
                       <ShieldCheck size={16} className="text-primary me-2" />
                       <span className="extra-small text-muted">Legal verification will be initiated.</span>
                    </div>
                  </Card>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default AddProperty
