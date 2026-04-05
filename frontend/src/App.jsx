import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import MobileNav from './components/MobileNav'
import Home from './pages/Home'
import Explore from './pages/Explore'
import PropertyDetails from './pages/PropertyDetails'
import Login from './pages/Login'
import Register from './pages/Register'
import AddProperty from './pages/AddProperty'
import Survey from './pages/Survey'
import Dashboard from './pages/Dashboard'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container" style={{ minHeight: '100vh', paddingBottom: '80px' }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/add-property" element={<AddProperty />} />
            <Route path="/survey" element={<Survey />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
          <MobileNav />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
