import React, { useState, useEffect, useContext } from 'react'
import { Container, Row, Col, Badge, Button, Form, Card, Alert, Modal } from 'react-bootstrap'
import { useParams, Link } from 'react-router-dom'
import { MapPin, IndianRupee, Ruler, CheckCircle, Phone, MessageSquare, ArrowLeft, Send, Share2, Heart, ShieldCheck, ChevronRight } from 'lucide-react'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'

const PropertyDetails = () => {
  const { id } = useParams()
  const { user } = useContext(AuthContext)
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [inquiry, setInquiry] = useState({ name: '', email: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data } = await axios.get(`/api/properties/${id}`)
        setProperty(data)
      } catch (error) {
        setProperty({
          _id: id,
          title: 'Premium Agricultural Land near Nagpur Expressway',
          description: 'This is a high-potential agricultural land located just 2km from the Nagpur-Mumbai Samruddhi Expressway. Ideal for farming or long-term investment. The soil is fertile and there is a 24/7 water supply from an adjacent canal. Legal documents are clear and verified by Swanim experts.',
          price: 2500000,
          location: { city: 'Nagpur', state: 'Maharashtra', address: 'Wardha Road, Outer Ring Road' },
          size: '2.5 Acre',
          category: 'Buy',
          isVerified: true,
          images: [],
          propertyType: 'Agricultural',
          owner: { name: 'Rahul Sharma', email: 'rahul@example.com' }
        })
      }
      setLoading(false)
    }
    fetchProperty()
  }, [id])

  const handleInquiry = async (e) => {
     e.preventDefault()
    setLoading(true)
    try {
      await axios.post('/api/inquiries', { ...inquiry, property: id }, {
        headers: user ? { Authorization: `Bearer ${user.token}` } : {}
      })
      setSubmitted(true)
      setInquiry({ name: '', email: '', phone: '', message: '' })
    } catch (error) {
      console.error('Inquiry error:', error)
    }
    setLoading(false)
  }

  if (loading && !property) return <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>
  if (!property) return <Container className="py-5 text-center"><h5>Listing not found</h5></Container>

  return (
    <div className="property-details-page pb-5 bg-white">
      {/* Light Breadcrumb / Header Navigation */}
      <div className="bg-light py-2 border-bottom mb-4 d-none d-lg-block">
         <Container>
            <div className="d-flex align-items-center text-muted extra-small">
               <Link to="/" className="text-decoration-none text-muted">Home</Link>
               <ChevronRight size={12} className="mx-2" />
               <Link to="/explore" className="text-decoration-none text-muted">Explore Land</Link>
               <ChevronRight size={12} className="mx-2" />
               <span className="text-dark fw-bold">{property.title}</span>
            </div>
         </Container>
      </div>

      <Container>
        <Row>
          <Col lg={8}>
            {/* Gallery / Main Image */}
            <div className="position-relative overflow-hidden rounded shadow-sm border mb-4" style={{ height: '400px' }}>
              <img 
                src={property.images[0] || 'https://images.unsplash.com/photo-1541339905195-4368811d8114?auto=format&fit=crop&q=80&w=1200'} 
                alt={property.title}
                className="w-100 h-100 object-fit-cover"
              />
              <div className="position-absolute top-0 start-0 m-3 d-flex gap-2">
                 <Badge bg="white" className="text-dark border rounded px-3 py-2 fw-bold small">{property.category.toUpperCase()}</Badge>
                 {property.isVerified && (
                   <span className="verified-badge shadow-sm" style={{ background: 'white' }}>
                     <ShieldCheck size={14} className="text-primary me-1" /> VERIFIED
                   </span>
                 )}
              </div>
            </div>

            {/* Title & Price Header */}
            <div className="d-flex justify-content-between align-items-start mb-4">
               <div>
                  <h2 className="fw-bold text-dark mb-2 display-6">{property.title}</h2>
                  <p className="text-muted lead d-flex align-items-center mb-0"><MapPin size={20} className="me-2 text-primary" /> {property.location.city}, {property.location.state}</p>
               </div>
               <div className="text-end">
                  <div className="text-muted small uppercase">Asking Price</div>
                  <h2 className="fw-bold text-primary d-flex align-items-center justify-content-end">
                     <IndianRupee size={32} strokeWidth={3} /> {property.price.toLocaleString()}
                  </h2>
               </div>
            </div>

            {/* Property Stats Grid */}
            <Row className="g-3 mb-5">
               <Col xs={4}>
                  <div className="bg-light p-3 rounded text-center border h-100 shadow-sm">
                     <div className="text-muted extra-small uppercase mb-1">Land Area</div>
                     <div className="fw-bold text-dark d-flex align-items-center justify-content-center">
                        <Ruler size={14} className="me-2 text-primary" /> {property.size}
                     </div>
                  </div>
               </Col>
               <Col xs={4}>
                  <div className="bg-light p-3 rounded text-center border h-100 shadow-sm">
                     <div className="text-muted extra-small uppercase mb-1">Purpose</div>
                     <div className="fw-bold text-dark">{property.category} Land</div>
                  </div>
               </Col>
               <Col xs={4}>
                  <div className="bg-light p-3 rounded text-center border h-100 shadow-sm">
                     <div className="text-muted extra-small uppercase mb-1">Type</div>
                     <div className="fw-bold text-dark">{property.propertyType}</div>
                  </div>
               </Col>
            </Row>

            {/* Content Tabs / Sections */}
            <div className="mb-5 border-top pt-4">
              <h5 className="fw-bold text-dark mb-4 uppercase letter-spacing-1">Description</h5>
              <p className="text-muted" style={{ lineHeight: '1.8', fontSize: '1.05rem' }}>
                {property.description}
              </p>
            </div>

            <div className="mb-5 border-top pt-4">
              <h5 className="fw-bold text-dark mb-4 uppercase letter-spacing-1">Location Attributes</h5>
              <Card className="bg-light border-0 p-4 shadow-sm">
                <Row className="g-4">
                   <Col md={6}>
                      <div className="small text-muted mb-1">Precise City</div>
                      <div className="fw-bold text-dark">{property.location.city}</div>
                   </Col>
                   <Col md={6}>
                      <div className="small text-muted mb-1">State Region</div>
                      <div className="fw-bold text-dark">{property.location.state}</div>
                   </Col>
                   <Col xs={12}>
                      <div className="small text-muted mb-1">Detailed Address / Landmarks</div>
                      <div className="fw-bold text-dark">{property.location.address}</div>
                   </Col>
                </Row>
              </Card>
            </div>
          </Col>

          {/* Right Sidebar - High Visibility Actions */}
          <Col lg={4}>
            <div className="sticky-top" style={{ top: '100px' }}>
              <Card className="border shadow-md rounded p-4 mb-4">
                <h6 className="fw-bold text-dark mb-4 border-bottom pb-2 uppercase letter-spacing-1">Connect with Seller</h6>
                
                <div className="d-grid gap-3 mb-4">
                  <Button variant="primary" className="btn-swanim fw-bold py-3 d-flex align-items-center justify-content-center gap-2">
                    <Phone size={18} /> SHOW CONTACT
                  </Button>
                  <Button variant="outline-success" className="fw-bold py-3 d-flex align-items-center justify-content-center gap-2 border-success text-success bg-white hover-success">
                    <MessageSquare size={18} /> WHATSAPP OWNER
                  </Button>
                </div>

                <div className="text-center mb-4">
                   <span className="small text-muted fst-italic">Refer Listing ID: #{property._id.slice(-6)}</span>
                </div>

                <div className="bg-light p-4 rounded mb-2 border">
                   <h6 className="small fw-bold text-dark mb-3">Send Inquiry Note</h6>
                   {submitted ? (
                     <Alert variant="success" className="extra-small py-2 border-0">
                       Success! Your interest has been shared.
                     </Alert>
                   ) : (
                     <Form onSubmit={handleInquiry}>
                       <Form.Group className="mb-2">
                          <Form.Control 
                            size="sm" 
                            className="border-0 shadow-sm ps-3" 
                            placeholder="Full Name" 
                            required 
                            value={inquiry.name}
                            onChange={(e) => setInquiry({ ...inquiry, name: e.target.value })}
                          />
                       </Form.Group>
                       <Form.Group className="mb-2">
                          <Form.Control 
                            size="sm" 
                            className="border-0 shadow-sm ps-3" 
                            placeholder="Mobile No." 
                            required 
                            value={inquiry.phone}
                            onChange={(e) => setInquiry({ ...inquiry, phone: e.target.value })}
                          />
                       </Form.Group>
                       <Form.Group className="mb-3">
                          <Form.Control 
                            as="textarea"
                            rows={3}
                            size="sm" 
                            className="border-0 shadow-sm ps-3" 
                            placeholder="Ask for details..." 
                            required 
                            value={inquiry.message}
                            onChange={(e) => setInquiry({ ...inquiry, message: e.target.value })}
                          />
                       </Form.Group>
                       <Button type="submit" variant="primary" size="sm" className="w-100 rounded fw-bold py-2 shadow-sm d-flex align-items-center justify-content-center gap-2 text-uppercase">
                         <Send size={14} /> Send Message
                       </Button>
                     </Form>
                   )}
                </div>
              </Card>

              {/* Legal Note for Trust */}
              <div className="p-3 bg-light border rounded text-center">
                 <ShieldCheck size={24} className="text-primary mb-2" />
                 <h6 className="small fw-bold text-dark mb-1">Secure Land Transaction</h6>
                 <p className="extra-small text-muted mb-0">Always verify documents personally and use Swanim Survey for boundary clarity.</p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default PropertyDetails
