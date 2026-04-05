import React, { useState, useEffect, useContext } from 'react'
import { Container, Row, Col, Card, Tabs, Tab, Table, Button, Badge, Alert, Nav, ProgressBar } from 'react-bootstrap'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { 
  User, Layers, MessageSquare, Ruler, Settings, Trash2, ExternalLink, 
  CheckCircle, Clock, ShieldCheck, Mail, Phone, MapPin, AlertCircle, 
  TrendingUp, Users, Activity, BarChart3, Database
} from 'lucide-react'
import axios from 'axios'

const Dashboard = () => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  
  const [myProperties, setMyProperties] = useState([])
  const [pendingProperties, setPendingProperties] = useState([]) // For Admin
  const [myInquiries, setMyInquiries] = useState([])
  const [mySurveys, setMySurveys] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const isAdmin = user && user.role === 'admin'

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=dashboard')
      return
    }

    const fetchData = async () => {
      setLoading(true)
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } }
        
        // Fetch User's own properties
        const resProps = await axios.get('/api/properties?owner=' + user._id, config)
        setMyProperties(resProps.data.properties)
        
        // Fetch Inquiries
        const resInqs = await axios.get('/api/inquiries/myinquiries', config)
        setMyInquiries(resInqs.data)
        
        // Fetch Survey Requests
        const resSurv = await axios.get('/api/surveys/myrequests', config)
        setMySurveys(resSurv.data)

        // If Admin, fetch pending properties for approval
        if (isAdmin) {
          const resPending = await axios.get('/api/properties/admin/pending', config)
          setPendingProperties(resPending.data)
        }
      } catch (err) {
        console.error('Dashboard error:', err)
        setError('Connection failed. Please refresh the dashboard.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user, navigate, isAdmin])

  const handleStatusUpdate = async (id, status) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } }
      await axios.put(`/api/properties/${id}/status`, { status }, config)
      // Refresh pending list
      setPendingProperties(pendingProperties.filter(p => p._id !== id))
      // If the property was also in myProperties (admin listing their own), update it there too
      setMyProperties(myProperties.map(p => p._id === id ? { ...p, status } : p))
    } catch (err) {
      alert('Failed to update property status')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this listing permanently?')) {
      try {
        await axios.delete(`/api/properties/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        })
        setMyProperties(myProperties.filter(p => p._id !== id))
        setPendingProperties(pendingProperties.filter(p => p._id !== id))
      } catch (err) {
        alert('Action failed')
      }
    }
  }

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>

  return (
    <div className="dashboard-page bg-light min-vh-100 py-4 py-lg-5">
      <Container>
        {/* Profile & Performance Header */}
        <Row className="g-4 mb-4">
          <Col lg={8}>
            <Card className="border-0 shadow-sm rounded p-4 bg-white h-100">
              <Row className="align-items-center g-4">
                <Col md={7}>
                  <div className="d-flex align-items-center">
                    <div className="p-4 bg-light rounded-circle me-4 text-primary shadow-sm border border-primary position-relative">
                      {isAdmin ? <ShieldCheck size={36} strokeWidth={2.5} /> : <User size={36} strokeWidth={2.5} />}
                      <span className="position-absolute bottom-0 end-0 p-2 bg-success border border-white rounded-circle"></span>
                    </div>
                    <div>
                       <h3 className="fw-bold mb-1 text-dark">{user.name}</h3>
                       <div className="d-flex flex-wrap gap-2 mt-1">
                          <Badge bg="light" className="text-muted border rounded-pill px-3 py-2 small fw-normal d-flex align-items-center"><Mail size={12} className="me-2" /> {user.email}</Badge>
                          <Badge bg="success" className="text-white rounded-pill px-3 py-2 extra-small uppercase border-0">{user.role}</Badge>
                       </div>
                    </div>
                  </div>
                </Col>
                <Col md={5} className="text-md-end border-start ps-md-4">
                   <div className="small text-muted mb-2 uppercase fw-bold letter-spacing-1">Quick Action</div>
                   <Button as={Link} to="/add-property" className="btn-swanim fw-bold w-100 py-2 rounded text-uppercase shadow-sm">
                      + Post New Listing
                   </Button>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="border-0 shadow-sm rounded p-4 bg-primary text-white h-100 position-relative overflow-hidden">
               <Activity className="position-absolute end-0 bottom-0 opacity-10 mb-n3 me-n3" size={150} />
               <h6 className="uppercase letter-spacing-1 small mb-4 opacity-75">Platform Activity</h6>
               <div className="d-flex justify-content-between align-items-end">
                  <div>
                     <h2 className="display-6 fw-bold mb-0">{myProperties.length}</h2>
                     <p className="small mb-0 opacity-75">Total Listings</p>
                  </div>
                  <div className="text-end">
                     <h2 className="display-6 fw-bold mb-0">{myInquiries.length}</h2>
                     <p className="small mb-0 opacity-75">Inquiries</p>
                  </div>
               </div>
            </Card>
          </Col>
        </Row>

        {error && <Alert variant="danger" className="border-0 shadow-sm mb-4">{error}</Alert>}

        {/* Management Tabs */}
        <Tab.Container id="dashboard-tabs" defaultActiveKey={isAdmin ? "admin" : "listings"}>
          <Row>
             <Col lg={3} className="mb-4">
                <div className="d-lg-none mb-3 overflow-auto no-scrollbar">
                   <Nav variant="pills" className="flex-nowrap gap-2 pb-2">
                      {isAdmin && (
                        <Nav.Item>
                           <Nav.Link eventKey="admin" className="rounded-pill px-4 py-2 border small fw-bold white-space-nowrap">
                              ADMIN
                           </Nav.Link>
                        </Nav.Item>
                      )}
                      <Nav.Item>
                         <Nav.Link eventKey="listings" className="rounded-pill px-4 py-2 border small fw-bold white-space-nowrap">
                            LISTINGS
                         </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                         <Nav.Link eventKey="inquiries" className="rounded-pill px-4 py-2 border small fw-bold white-space-nowrap">
                            INBOX
                         </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                         <Nav.Link eventKey="surveys" className="rounded-pill px-4 py-2 border small fw-bold white-space-nowrap">
                            SURVEYS
                         </Nav.Link>
                      </Nav.Item>
                   </Nav>
                </div>

                <Card className="border-0 shadow-sm bg-white p-2 d-none d-lg-block">
                   <Nav variant="pills" className="flex-column custom-pills">
                      {isAdmin && (
                        <Nav.Item className="mb-1">
                           <Nav.Link eventKey="admin" className="d-flex align-items-center py-3 rounded text-primary">
                              <ShieldCheck size={18} className="me-2" /> 
                              <span className="small uppercase fw-bold">Admin Approval</span>
                              {pendingProperties.length > 0 && <Badge bg="danger" className="ms-auto rounded-pill">{pendingProperties.length}</Badge>}
                           </Nav.Link>
                        </Nav.Item>
                      )}
                      <Nav.Item className="mb-1">
                         <Nav.Link eventKey="listings" className="d-flex align-items-center py-3 rounded">
                            <Layers size={18} className="me-2" /> <span className="small uppercase fw-bold">My Land Deals</span>
                         </Nav.Link>
                      </Nav.Item>
                      <Nav.Item className="mb-1">
                         <Nav.Link eventKey="inquiries" className="d-flex align-items-center py-3 rounded">
                            <MessageSquare size={18} className="me-2" /> <span className="small uppercase fw-bold">Prospect Inbox</span>
                         </Nav.Link>
                      </Nav.Item>
                      <Nav.Item className="mb-1">
                         <Nav.Link eventKey="surveys" className="d-flex align-items-center py-3 rounded">
                            <Ruler size={18} className="me-2" /> <span className="small uppercase fw-bold">Survey Orders</span>
                         </Nav.Link>
                      </Nav.Item>
                   </Nav>
                </Card>

                {isAdmin && (
                  <Card className="border-0 shadow-sm bg-white p-4 mt-4">
                     <h6 className="extra-small uppercase text-muted fw-bold mb-3 d-flex align-items-center">
                        <BarChart3 size={14} className="me-2 text-primary" /> Global Performance
                     </h6>
                     <div className="mb-3">
                        <div className="d-flex justify-content-between extra-small mb-1">
                           <span>Approvals Rate</span>
                           <span className="fw-bold">85%</span>
                        </div>
                        <ProgressBar variant="primary" now={85} style={{ height: '4px' }} />
                     </div>
                     <div>
                        <div className="d-flex justify-content-between extra-small mb-1">
                           <span>Active Users</span>
                           <span className="fw-bold">1,240</span>
                        </div>
                        <ProgressBar variant="success" now={60} style={{ height: '4px' }} />
                     </div>
                  </Card>
                )}
             </Col>

             <Col lg={9}>
                <Tab.Content>
                   {isAdmin && (
                     <Tab.Pane eventKey="admin">
                        <Card className="border-0 shadow-sm bg-white p-4">
                           <div className="d-flex justify-content-between align-items-center mb-4">
                              <h5 className="fw-bold text-dark letter-spacing-1 uppercase small mb-0">Pending Approvals Queue</h5>
                              <Badge bg="warning" className="text-dark extra-small rounded px-2">{pendingProperties.length} Tasks Pending</Badge>
                           </div>
                           {pendingProperties.length === 0 ? (
                              <div className="text-center py-5 bg-light rounded border-dashed">
                                 <CheckCircle className="text-success mb-3 opacity-50" size={48} />
                                 <p className="text-muted small">Great work! The approval queue is crystal clear.</p>
                              </div>
                           ) : (
                              <div className="table-responsive">
                                 <Table borderless hover className="align-middle dashboard-table">
                                    <thead className="bg-light">
                                       <tr className="text-muted extra-small uppercase fw-bold border-bottom">
                                          <th className="py-3 ps-3">Land Particulars</th>
                                          <th className="py-3 text-center">Owner Account</th>
                                          <th className="py-3 text-center">Valuation</th>
                                          <th className="py-3 text-end pe-3">Action Required</th>
                                       </tr>
                                    </thead>
                                    <tbody>
                                       {pendingProperties.map(prop => (
                                          <tr key={prop._id} className="border-bottom">
                                             <td className="py-3 ps-3">
                                                <div className="d-flex align-items-center">
                                                   <img src={prop.images[0] || 'https://images.unsplash.com/photo-1541339905195-4368811d8114?auto=format&fit=crop&q=80&w=120'} alt="land" className="rounded me-3" style={{ width: '50px', height: '40px', objectFit: 'cover' }} />
                                                   <div>
                                                      <div className="fw-bold small text-dark">{prop.title}</div>
                                                      <div className="extra-small text-muted">{prop.location.city}, {prop.location.state}</div>
                                                   </div>
                                                </div>
                                             </td>
                                             <td className="py-3 text-center">
                                                <div className="small fw-bold text-dark">{prop.owner.name}</div>
                                                <div className="extra-small text-muted">{prop.owner.email}</div>
                                             </td>
                                             <td className="py-3 text-center fw-bold text-dark small">₹{prop.price.toLocaleString()}</td>
                                             <td className="py-3 text-end pe-3">
                                                <div className="d-flex justify-content-end gap-2">
                                                   <Button variant="success" size="sm" className="rounded px-3 py-1 extra-small fw-bold text-uppercase" onClick={() => handleStatusUpdate(prop._id, 'active')}>Approve</Button>
                                                   <Button variant="outline-danger" size="sm" className="rounded px-3 py-1 extra-small fw-bold text-uppercase" onClick={() => handleStatusUpdate(prop._id, 'rejected')}>Reject</Button>
                                                </div>
                                             </td>
                                          </tr>
                                       ))}
                                    </tbody>
                                 </Table>
                              </div>
                           )}
                        </Card>
                     </Tab.Pane>
                   )}

                   <Tab.Pane eventKey="listings">
                      <Card className="border-0 shadow-sm bg-white p-4">
                         <h5 className="fw-bold mb-4 text-dark letter-spacing-1 uppercase small">Your Land Inventory</h5>
                         {myProperties.length === 0 ? (
                            <div className="text-center py-5 bg-light rounded">
                               <Layers className="text-muted opacity-50 mb-3" size={48} />
                               <p className="text-muted small">You haven't listed any land deals for the public yet.</p>
                               <Link to="/add-property" className="text-primary fw-bold small text-decoration-none uppercase">Post Your First Land</Link>
                            </div>
                         ) : (
                            <div className="table-responsive">
                               <Table borderless hover className="align-middle dashboard-table">
                                  <thead className="bg-light">
                                     <tr className="text-muted extra-small uppercase fw-bold border-bottom">
                                        <th className="py-3 ps-3">Land Title</th>
                                        <th className="py-3">Status</th>
                                        <th className="py-3">Valuation</th>
                                        <th className="py-3 text-end pe-3">Actions</th>
                                     </tr>
                                  </thead>
                                  <tbody>
                                     {myProperties.map(prop => (
                                        <tr key={prop._id} className="border-bottom">
                                           <td className="py-3 ps-3">
                                              <div className="d-flex align-items-center">
                                                 <MapPin size={14} className="text-primary me-2" />
                                                 <div>
                                                    <div className="fw-bold small text-dark">{prop.title}</div>
                                                    <div className="extra-small text-muted">{prop.location.city} | {prop.size}</div>
                                                 </div>
                                              </div>
                                           </td>
                                           <td className="py-3">
                                              {prop.status === 'active' ? (
                                                 <Badge bg="success" className="rounded-pill px-3 py-1 extra-small uppercase border-0">Visible</Badge>
                                              ) : prop.status === 'pending' ? (
                                                 <Badge bg="warning" className="text-dark rounded-pill px-3 py-1 extra-small uppercase border-0">Reviewing</Badge>
                                              ) : (
                                                 <Badge bg="danger" className="rounded-pill px-3 py-1 extra-small uppercase border-0">Rejected</Badge>
                                              )}
                                           </td>
                                           <td className="py-3 fw-bold text-dark small">₹{prop.price.toLocaleString()}</td>
                                           <td className="py-3 text-end pe-3">
                                              <div className="d-flex justify-content-end gap-1">
                                                 <Button as={Link} to={`/property/${prop._id}`} variant="light" size="sm" className="rounded border shadow-none p-2 lh-1"><ExternalLink size={14}/></Button>
                                                 <Button variant="light" size="sm" className="rounded border shadow-none p-2 lh-1 text-danger" onClick={() => handleDelete(prop._id)}><Trash2 size={14}/></Button>
                                              </div>
                                           </td>
                                        </tr>
                                     ))}
                                  </tbody>
                               </Table>
                            </div>
                         )}
                      </Card>
                   </Tab.Pane>

                   <Tab.Pane eventKey="inquiries">
                      <Card className="border-0 shadow-sm bg-white p-4">
                         <h5 className="fw-bold mb-4 text-dark letter-spacing-1 uppercase small">Communication Center</h5>
                         {myInquiries.length === 0 ? (
                            <div className="text-center py-5 bg-light rounded text-muted small">No new inquiries available in your inbox.</div>
                         ) : (
                            <div className="table-responsive">
                               <Table borderless hover className="align-middle dashboard-table">
                                  <thead className="bg-light">
                                     <tr className="text-muted extra-small uppercase fw-bold border-bottom">
                                        <th className="py-3 ps-3">Prospect</th>
                                        <th className="py-3">Message Snippet</th>
                                        <th className="py-3 text-end pe-3">Contact</th>
                                     </tr>
                                  </thead>
                                  <tbody>
                                     {myInquiries.map(inq => (
                                        <tr key={inq._id} className="border-bottom">
                                           <td className="py-3 ps-3">
                                              <div className="fw-bold small text-dark">{inq.name}</div>
                                              <div className="extra-small text-muted">{inq.email}</div>
                                           </td>
                                           <td className="py-3"><span className="extra-small text-muted d-block text-truncate" style={{ maxWidth: '300px' }}>{inq.message}</span></td>
                                           <td className="py-3 text-end pe-3">
                                              <Button variant="outline-primary" size="sm" className="rounded-pill px-3 extra-small fw-bold text-uppercase d-inline-flex align-items-center border-primary shadow-sm" href={`tel:${inq.phone}`}>
                                                 <Phone size={12} className="me-2" /> CALL NOW
                                              </Button>
                                           </td>
                                        </tr>
                                     ))}
                                  </tbody>
                               </Table>
                            </div>
                         )}
                      </Card>
                   </Tab.Pane>

                   <Tab.Pane eventKey="surveys">
                      <Card className="border-0 shadow-sm bg-white p-4">
                         <h5 className="fw-bold mb-4 text-dark letter-spacing-1 uppercase small">Your Verification Service History</h5>
                         {mySurveys.length === 0 ? (
                            <p className="text-muted text-center py-5">No survey requests found in our database.</p>
                         ) : (
                           <Row className="g-3">
                              {mySurveys.map(surv => (
                                 <Col md={6} key={surv._id}>
                                    <div className="bg-light p-3 rounded border h-100 position-relative hover-shadow">
                                       <div className="d-flex justify-content-between mb-2">
                                          <div className="fw-bold small text-dark">{surv.landDetails.location}</div>
                                          <Badge bg="white" className="border text-primary extra-small px-3 py-2 rounded-pill uppercase fw-bold">{surv.status}</Badge>
                                       </div>
                                       <p className="extra-small text-muted mb-0"><Database size={12} className="me-1" /> {surv.landDetails.size} Survey Order</p>
                                    </div>
                                 </Col>
                              ))}
                           </Row>
                         )}
                      </Card>
                   </Tab.Pane>
                </Tab.Content>
             </Col>
          </Row>
        </Tab.Container>
      </Container>
    </div>
  )
}

export default Dashboard
