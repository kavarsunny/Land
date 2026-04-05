import React, { useState, useEffect, useContext } from 'react'
import { Container, Row, Col, Card, Badge, Button, InputGroup, Form } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Search, MapPin, Grid, Layers, Home as HomeIcon, Briefcase, 
  Ruler, CheckCircle2, TrendingUp, IndianRupee, ShieldCheck, 
  ArrowRight, Globe, Zap, Users, BarChart3, Star, Compass
} from 'lucide-react'
import PropertyCard from '../components/PropertyCard'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState('')
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/dashboard')
    }

    const fetchFeatured = async () => {
      try {
        const { data } = await axios.get('/api/properties?pageSize=4')
        setFeaturedProperties(data.properties)
      } catch (error) {
        console.error('Error fetching featured:', error)
      }
      setLoading(false)
    }
    fetchFeatured()
  }, [user, navigate])

  const categories = [
    { title: 'Commercial Sale', icon: <Briefcase size={24} />, color: '#2E7D32', link: '/explore?category=Buy', desc: 'Industrial & Retail space' },
    { title: 'NA Certified', icon: <ShieldCheck size={24} />, color: '#1A237E', link: '/explore?category=NA%20Land', desc: 'Verified non-agri plots' },
    { title: 'Lease/Rent', icon: <Layers size={24} />, color: '#E65100', link: '/explore?category=Rent', desc: 'Long-term land leasing' },
    { title: 'Agri Investment', icon: <Globe size={24} />, color: '#3E2723', link: '/explore?category=Sell', desc: 'High-yield farming land' },
  ]

  return (
    <div className="home-page bg-white">
      {/* AWESOME CINEMATIC HERO SECTION */}
      <section className="hero-section position-relative vh-100 d-flex align-items-center justify-content-center text-center overflow-hidden" style={{ minHeight: '600px' }}>
        {/* Cinematic Background Image - 4K Premium Asset */}
        <div 
          className="position-absolute top-0 start-0 w-100 h-100" 
          style={{ 
            backgroundImage: 'url("/hero-bg.png")', 
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            transform: 'scale(1.05)'
          }}
        ></div>
        {/* Gradient Overlay */}
        <div className="bg-hero-overlay"></div>

        <Container className="hero-content">
          <Row className="justify-content-center">
            <Col lg={10} xl={8}>
              <div className="mb-4">
                <Badge bg="transparent" className="text-white border px-3 py-2 fw-bold extra-small uppercase border-primary rounded shadow-lg bg-glass">
                   <Star size={14} className="me-2 text-warning" /> INDIA'S #1 LAND INVESTOR PORTAL
                </Badge>
              </div>
              <h1 className="display-2 text-white mb-4 text-gradient-white">
                Invest in the Earth's<br />
                <span className="text-primary">Most Liquid</span> Asset.
              </h1>
              <p className="lead text-white opacity-75 mb-5 px-lg-5" style={{ fontSize: '1.25rem', fontWeight: '400' }}>
                Secure, verified, and high-yield land opportunities across India. Swanim makes land ownership as simple as a single click.
              </p>
              
              <div className="mx-auto" style={{ maxWidth: '800px' }}>
                <Card className="glass-search border-0 p-3 shadow-2xl rounded-pill position-relative overflow-hidden" 
                  style={{ 
                    backgroundImage: 'url("/hero-bg.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}>
                   {/* Search Overlay for Legibility */}
                   <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 0 }}></div>
                   
                   <InputGroup className="align-items-center position-relative" style={{ zIndex: 1 }}>
                      <InputGroup.Text className="bg-transparent border-0 text-white ps-4"><Search size={28} strokeWidth={2.5} /></InputGroup.Text>
                      <Form.Control 
                        className="bg-transparent border-0 py-3 shadow-none text-white placeholder-light fw-bold" 
                        placeholder="SEARCH VERIFIED LAND REGISTRY..." 
                        style={{ fontSize: '1.25rem', letterSpacing: '0.05rem' }}
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                      />
                      <Button 
                        variant="primary" 
                        className="btn-swanim rounded-pill px-5 py-3 fw-bold text-uppercase shadow-lg border-0"
                        style={{ background: 'var(--primary)', letterSpacing: '0.1rem' }}
                        onClick={() => navigate(`/explore?keyword=${keyword}`)}
                      >
                        SEARCH 
                      </Button>
                   </InputGroup>
                </Card>
              </div>

              <div className="mt-5 d-flex flex-wrap justify-content-center gap-4 text-white opacity-50 extra-small uppercase fw-bold letter-spacing-1">
                 <div className="d-flex align-items-center gap-2"><CheckCircle2 size={16} /> 100% LEGAL VETTING</div>
                 <div className="d-flex align-items-center gap-2"><Users size={16} /> 45,000+ INVESTORS</div>
                 <div className="d-flex align-items-center gap-2"><Globe size={16} /> 28 STATES MAPPED</div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Modern High-Value Segments */}
      <section className="py-5 bg-white position-relative" style={{ marginTop: '-40px', zIndex: 10 }}>
        <Container>
          <Row className="g-4">
            {categories.map((cat, idx) => (
              <Col key={idx} xs={12} md={6} lg={3}>
                <Card as={Link} to={cat.link} className="custom-card p-4 text-decoration-none h-100 bg-white shadow-lg border-0 hover-shadow transition-all">
                   <div className="mb-4 d-inline-flex p-3 rounded-xl bg-light text-primary">
                      {cat.icon}
                   </div>
                   <h6 className="fw-bold text-dark mb-2 text-uppercase letter-spacing-1">{cat.title}</h6>
                   <p className="extra-small text-muted mb-3">{cat.desc}</p>
                   <div className="text-primary fw-bold extra-small mt-auto d-flex align-items-center gap-2">
                     EXPLORE <ArrowRight size={14} />
                   </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Featured Properties */}
      <section className="py-5 bg-light border-top">
        <Container className="py-lg-5">
          <div className="d-flex justify-content-between align-items-end mb-5">
             <div>
                <h6 className="text-primary fw-bold uppercase extra-small letter-spacing-2 mb-2">Editor's Choice</h6>
                <h2 className="fw-bold text-dark display-6">High-Yield Assets</h2>
             </div>
             <Button as={Link} to="/explore" variant="link" className="text-primary fw-bold text-decoration-none shadow-none">
                VIEW ALL <Compass size={18} className="ms-2" />
             </Button>
          </div>
          
          {loading ? (
             <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>
          ) : (
            <div className="horizontal-scroll-container no-scrollbar pb-3">
              {featuredProperties.map(prop => (
                <div key={prop._id} className="horizontal-scroll-item">
                  <PropertyCard property={prop} />
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Dynamic CTA Section */}
      <section className="py-5 bg-primary text-white overflow-hidden position-relative">
         <Zap className="position-absolute top-50 start-0 translate-middle opacity-10" size={400} />
         <Container className="position-relative py-4 text-center">
            <h2 className="display-5 fw-bold mb-4">Start Your Land Journey Today</h2>
            <p className="lead opacity-75 mb-5 px-lg-5">Join thousands of smart investors secure their future through Swanim.</p>
            <div className="d-flex justify-content-center gap-3">
               <Button as={Link} to="/register" variant="light" className="px-5 py-3 fw-bold rounded-pill text-primary shadow-lg border-0 uppercase">JOIN AS PARTNER</Button>
               <Button as={Link} to="/explore" variant="primary" className="px-5 py-3 fw-bold rounded-pill border-white shadow-lg uppercase">VIEW REGISTRY</Button>
            </div>
         </Container>
      </section>
    </div>
  )
}

export default Home
