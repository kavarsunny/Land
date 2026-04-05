import React, { useState, useEffect, useContext } from 'react'
import { Container, Row, Col, Form, Badge, Button, InputGroup, Dropdown } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import { Search, Sliders, Filter, MapPin, IndianRupee, Grid, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react'
import PropertyCard from '../components/PropertyCard'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'

const Explore = () => {
  const { user } = useContext(AuthContext)
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    // If admin, redirect to dashboard as requested ("no need to show home page")
    if (user && user.role === 'admin') {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const queryParams = new URLSearchParams(location.search)
  
  const keyword = queryParams.get('keyword') || ''
  const category = queryParams.get('category') || 'All'
  const minPrice = queryParams.get('minPrice') || ''
  const maxPrice = queryParams.get('maxPrice') || ''

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true)
      try {
        const { data } = await axios.get(`/api/properties${location.search || '?'}`)
        setProperties(data.properties)
        setPage(data.page)
        setPages(data.pages)
      } catch (error) {
        setProperties([
          { _id: '1', title: 'Premium NA Plot Pune', price: 2500000, location: { city: 'Pune', state: 'Maharashtra' }, size: '2000 Sqft', category: 'Buy', isVerified: true, images: [], propertyType: 'NA Plot' },
          { _id: '2', title: 'Agri Land Nagpur', price: 1500000, location: { city: 'Nagpur', state: 'Maharashtra' }, size: '2 Acre', category: 'Buy', isVerified: true, images: [], propertyType: 'Agricultural' },
          { _id: '3', title: 'Commercial Mumbai', price: 5000000, location: { city: 'Mumbai', state: 'Maharashtra' }, size: '1000 Sqft', category: 'Rent', isVerified: false, images: [], propertyType: 'Commercial' },
        ])
        setPages(1)
      }
      setLoading(false)
    }
    fetchProperties()
  }, [location.search])

  const handleFilter = (key, value) => {
    queryParams.set(key, value)
    if (value === 'All' || value === '') queryParams.delete(key)
    navigate(`/explore?${queryParams.toString()}`)
  }

  const handlePage = (num) => {
    queryParams.set('pageNumber', num)
    navigate(`/explore?${queryParams.toString()}`)
  }

  return (
    <div className="explore-page pb-5 bg-white">
      {/* Light Subheader */}
      <div className="bg-light py-4 mb-4 border-bottom">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h4 className="fw-bold text-dark mb-1">Land Listings in India</h4>
              <p className="text-muted small mb-0 d-flex align-items-center"><CheckCircle2 size={14} className="text-primary me-1" /> Legal verification in progress for new listings</p>
            </Col>
            <Col md={6}>
              <Form onSubmit={(e) => { e.preventDefault(); navigate(`/explore?keyword=${keyword}`) }}>
                <InputGroup className="bg-white rounded border overflow-hidden p-1 shadow-sm">
                  <InputGroup.Text className="bg-transparent border-0 text-muted"><Search size={18} /></InputGroup.Text>
                  <Form.Control 
                    className="bg-transparent border-0 text-dark small" 
                    placeholder="Search by city, title, state..." 
                    defaultValue={keyword}
                    onBlur={(e) => handleFilter('keyword', e.target.value)}
                  />
                  <Button type="submit" variant="primary" className="btn-swanim rounded px-4 small">SEARCH</Button>
                </InputGroup>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        <Row>
          {/* Professional Sidebar Filter */}
          <Col lg={3} className="d-none d-lg-block">
            <div className="bg-white p-4 sticky-top border-end h-100" style={{ top: '80px' }}>
              <div className="d-flex align-items-center mb-4 pb-2 border-bottom">
                <Sliders size={20} className="text-primary me-2" />
                <h6 className="mb-0 fw-bold text-dark uppercase letter-spacing-1">FILTERS</h6>
              </div>
              
              <Form.Group className="mb-4">
                <Form.Label className="text-muted small fw-bold mb-3 uppercase">Property Category</Form.Label>
                {['All', 'Buy', 'Sell', 'Rent', 'NA Land'].map(cat => (
                  <Form.Check 
                    key={cat}
                    type="radio"
                    name="category"
                    label={<span className="ms-1 small">{cat}</span>}
                    className="mb-2 professional-check"
                    checked={category === cat}
                    onChange={() => handleFilter('category', cat)}
                  />
                ))}
              </Form.Group>

              <Form.Group className="mb-4 pt-3 border-top">
                <Form.Label className="text-muted small fw-bold mb-3 uppercase">Investment Range</Form.Label>
                <div className="d-flex gap-2">
                  <Form.Control 
                    size="sm" 
                    className="bg-light border-0 py-2" 
                    placeholder="Min" 
                    defaultValue={minPrice}
                    onBlur={(e) => handleFilter('minPrice', e.target.value)}
                  />
                  <Form.Control 
                    size="sm" 
                    className="bg-light border-0 py-2" 
                    placeholder="Max" 
                    defaultValue={maxPrice}
                    onBlur={(e) => handleFilter('maxPrice', e.target.value)}
                  />
                </div>
              </Form.Group>

              <Button 
                variant="outline-primary" 
                className="w-100 rounded-pill btn-sm text-primary fw-bold py-2 mt-4" 
                onClick={() => navigate('/explore')}
              >
                Reset All Filters
              </Button>
            </div>
          </Col>

          {/* Search Result Grid */}
          <Col lg={9}>
            {/* Mobile Category Toggle */}
            <div className="d-lg-none mb-4 d-flex gap-2 overflow-auto no-scrollbar pb-2">
               {['All', 'Buy', 'Sell', 'Rent', 'NA Land'].map(cat => (
                  <Button 
                    key={cat} 
                    variant={category === cat ? 'primary' : 'outline-secondary'} 
                    className={`rounded-pill px-4 small border-0 shadow-sm ${category === cat ? 'bg-primary text-white' : 'bg-white text-dark'}`}
                    onClick={() => handleFilter('category', cat)}
                  >
                    {cat}
                  </Button>
               ))}
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="text-muted mt-3 small">Loading verified listings...</p>
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-5 p-5 border rounded bg-light">
                <MapPin size={48} className="text-muted mb-3 opacity-50" />
                <h5 className="fw-bold">No exact matches found</h5>
                <p className="text-muted small">Try removing filters or using a broader location name.</p>
                <Button variant="link" className="text-primary p-0 fw-bold" onClick={() => navigate('/explore')}>Clear Filters</Button>
              </div>
            ) : (
              <Row className="g-4">
                {properties.map(prop => (
                  <Col key={prop._id} md={6} xl={4}>
                    <PropertyCard property={prop} />
                  </Col>
                ))}
              </Row>
            )}

            {/* Pagination Controls */}
            {pages > 1 && (
              <div className="d-flex justify-content-center mt-5 gap-2 border-top pt-4">
                <Button 
                  variant="outline-secondary" 
                  className="rounded px-3 py-2 border-0 bg-light text-dark" 
                  disabled={page === 1}
                  onClick={() => handlePage(page - 1)}
                >
                  <ChevronLeft size={18} />
                </Button>
                {[...Array(pages).keys()].map(x => (
                  <Button 
                    key={x + 1} 
                    variant={page === x + 1 ? 'primary' : 'outline-secondary'} 
                    className={`rounded border-0 fw-bold px-3 py-2 ${page === x + 1 ? 'bg-primary text-white' : 'bg-light text-dark'}`}
                    onClick={() => handlePage(x + 1)}
                  >
                    {x + 1}
                  </Button>
                ))}
                <Button 
                  variant="outline-secondary" 
                  className="rounded px-3 py-2 border-0 bg-light text-dark" 
                  disabled={page === pages}
                  onClick={() => handlePage(page + 1)}
                >
                  <ChevronRight size={18} />
                </Button>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Explore
