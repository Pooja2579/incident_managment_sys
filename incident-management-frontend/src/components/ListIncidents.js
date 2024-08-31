import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import '../css/ListIncidents.css';

function ListIncidents() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    api.get('/incidents/list/', {
      headers: {
        'Authorization': `Token ${token}`
      }
    })
    .then(response => {
      setIncidents(response.data);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching incidents:', error);
      setError('Error fetching incidents');
      setLoading(false);
    });
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredIncidents = incidents.filter(incident =>
    incident.incident_id.toString().includes(searchQuery)
  );

  if (loading) return <p>Loading incidents...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="container">
      <h2>Incident List</h2>
      <input
        type="text"
        placeholder="Search by Incident ID"
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-input"
      />
      <ul className="incident-list">
        {filteredIncidents.length > 0 ? (
          filteredIncidents.map(incident => (
            <li
              key={incident.incident_id}
              className={`incident-item ${incident.status === 'Closed' ? 'closed' : ''}`}
            >
              <h3>Incident ID: {incident.incident_id}</h3>
              <div className="incident-details">
                <p><strong>Reporter:</strong> {incident.reporter_name}</p>
                <p><strong>Details:</strong> {incident.details}</p>
                <p><strong>Reported Date:</strong> {new Date(incident.reported_date).toLocaleString()}</p>
                <p><strong>Priority:</strong> {incident.priority}</p>
                <p><strong>Status:</strong> {incident.status}</p>
                <p><strong>Type:</strong> {incident.incident_type}</p>
                {incident.status === 'Closed' && <span style={{ color: 'red' }}>(Closed)</span>}
              </div>
              {(incident.status === 'Open' || incident.status === 'In progress') && (
                <Link to={`/incidents/edit/${incident.incident_id}`} className="edit-link">
                  Edit
                </Link>
              )}
            </li>
          ))
        ) : (
          <p>No incidents found.</p>
        )}
      </ul>
    </div>
  );
}

export default ListIncidents;
