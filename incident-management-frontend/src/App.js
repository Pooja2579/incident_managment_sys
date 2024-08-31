import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import ListIncidents from './components/ListIncidents';
import CreateIncident from './components/CreateIncident';
import IncidentForm from './components/IncidentForm';
import Dashboard from './components/Dashboard';
import ForgotPassword from './components/ForgotPassword';
import './css/App.css';  

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/incidents/list" element={<ListIncidents />} />
          <Route path="/incidents/create" element={<CreateIncident />} />
          <Route path="/incidents/edit/:id" element={<IncidentForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/" element={
            <div className="home-container">
              <p><a href="/register" className="home-link">Register</a></p>
              <p><a href="/login" className="home-link">Login</a></p>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
