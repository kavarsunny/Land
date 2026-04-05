import React from 'react'
import { Card, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { MapPin, CheckCircle, IndianRupee, Ruler, ArrowRight } from 'lucide-react'

const PropertyCard = ({ property }) => {
  return (
    <Card as={Link} to={`/property/${property._id}`} className="custom-card mb-4 text-decoration-none border-0 shadow-sm">
      <div className="position-relative overflow-hidden" style={{ borderRadius: '8px 8px 0 0' }}>
        <img 
          src={(property.images && property.images.length > 0) ? property.images[0] : 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400'} 
          className="card-img-top transition-scale" 
          alt={property.title} 
          style={{ height: '180px', objectFit: 'cover' }}
        />
        <div className="position-absolute top-0 start-0 m-2">
          <Badge bg="white" className="text-dark rounded shadow-sm border border-secondary extra-small fw-bold px-2 py-1">
            {property.category.toUpperCase()}
          </Badge>
        </div>
        {property.isVerified && (
          <div className="position-absolute top-0 end-0 m-2">
            <span className="verified-badge shadow-sm">
              <CheckCircle size={12} strokeWidth={3} /> VERIFIED
            </span>
          </div>
        )}
      </div>
      <Card.Body className="p-3 bg-white">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <h6 className="mb-0 text-truncate font-weight-bold" style={{ color: '#1A1A1A', flex: '1', fontSize: '1rem' }}>
            {property.title}
          </h6>
        </div>
        <div className="d-flex align-items-center text-muted mb-3 extra-small">
          <MapPin size={12} className="me-1 text-primary" /> {property.location.city}, {property.location.state}
        </div>
        
        <div className="d-flex justify-content-between align-items-end pt-2 border-top">
          <div>
            <div className="text-muted extra-small mb-0">Total Price</div>
            <div className="h5 mb-0 fw-bold d-flex align-items-center" style={{ color: 'var(--primary)' }}>
              <IndianRupee size={16} strokeWidth={3} /> {property.price.toLocaleString()}
            </div>
          </div>
          <div className="text-end">
            <div className="text-muted extra-small mb-0">Area</div>
            <div className="small fw-bold text-dark">{property.size}</div>
          </div>
        </div>
      </Card.Body>
      <div className="px-3 pb-3 bg-white">
         <div className="d-flex align-items-center justify-content-between text-primary small fw-bold">
            <span>View Details</span>
            <ArrowRight size={14} />
         </div>
      </div>
    </Card>
  )
}

export default PropertyCard
