import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate, useParams } from 'react-router-dom';
import '../css/IncidentForm.css';

function IncidentForm() {
  const [incident, setIncident] = useState({
    details: '',
    priority: 'Medium',
    status: 'Open',
    incident_type: 'Individual',
    reporter_name: '', // Add this field
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      api.get(`/incidents/${id}/`, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('authToken')}`
        }
      })
      .then(response => {
        console.log('Fetched incident data:', response.data); // Debugging
        setIncident(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching incident:', error);
        setError('Error fetching incident');
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Ensure 'status' cannot be changed to 'Closed' if incident is already closed
    if (name === 'status' && incident.status === 'Closed') {
      setError('Closed incidents cannot be edited.');
      return;
    }
    setIncident({ ...incident, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');

    const method = isEditing ? 'put' : 'post';
    const url = isEditing ? `/incidents/${id}/` : '/incidents/create/';

    api[method](url, incident, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(() => {
      navigate('/incidents');
    })
    .catch(error => {
      console.error('Error saving incident:', error);
      setError('Error saving incident');
    });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>{isEditing ? 'Edit Incident' : 'Create Incident'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Details:</label>
          <textarea
            name="details"
            value={incident.details}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Priority:</label>
          <select
            name="priority"
            value={incident.priority}
            onChange={handleChange}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div>
          <label>Status:</label>
          <select
            name="status"
            value={incident.status}
            onChange={handleChange}
          >
            <option value="Open">Open</option>
            <option value="In progress">In progress</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
        <div>
          <label>Type:</label>
          <select
            name="incident_type"
            value={incident.incident_type}
            onChange={handleChange}
          >
            <option value="Individual">Individual</option>
            <option value="Enterprise">Enterprise</option>
            <option value="Government">Government</option>
          </select>
        </div>
        <div>
          <label>Reporter:</label>
          <input
            type="text"
            value={incident.reporter_name}
            readOnly
          />
        </div>
        <button type="submit">{isEditing ? 'Update Incident' : 'Create Incident'}</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}

export default IncidentForm;
