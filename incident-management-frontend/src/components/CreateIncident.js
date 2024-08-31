import React, { useState } from 'react';
import api from '../api';  // Ensure this points to your main API instance
import '../css/CreateIncident.css'; 

function CreateIncident() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [incidentType, setIncidentType] = useState('Individual');
  const [reporterName, setReporterName] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [reporterAddress, setReporterAddress] = useState('');
  const [isExistingReporter, setIsExistingReporter] = useState(false);

  // Fetch reporter details if they exist
  const handleCheckReporter = (email) => {
    if (!email) return; // Prevent API call if no email is provided

    api.get(`reporter/${email}/`)  // Make sure this matches your Django URL pattern
      .then(response => {
        if (response.data) {
          setIsExistingReporter(true);
          setReporterName(response.data.first_name + ' ' + response.data.last_name);
          setReporterPhone(response.data.mobile_number);   // Adjust these fields as needed
          setReporterAddress(response.data.address);
          // Optionally alert user or handle UI feedback
          alert('Reporter exists. Auto-filling details.');
        }
      })
      .catch(error => {
        setIsExistingReporter(false);
        console.log('No existing reporter found.');
      });
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setReporterEmail(email);
    handleCheckReporter(email);  // Check reporter details on email change
  };

  const handleCreateIncident = () => {
    const token = localStorage.getItem('authToken');
    api.post('incidents/create/', { 
      title, 
      details: description, 
      priority, 
      incident_type: incidentType,
      reporter_name: reporterName,
      reporter_email: reporterEmail,
      reporter_phone: reporterPhone,  // Include phone if necessary
      reporter_address: reporterAddress  // Include address if necessary
    }, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        alert('Incident created successfully!');
        // Optionally redirect or clear form
      })
      .catch(error => {
        console.error('Error creating incident:', error.response ? error.response.data : error.message);
      });
  };

  return (
    <div className="container">
      <h2 className="heading">Create Incident</h2>
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Incident Title"
        className="input"
      />
      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Incident Description"
        className="textarea"
      />
      <select
        value={priority}
        onChange={e => setPriority(e.target.value)}
        className="select"
      >
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <select
        value={incidentType}
        onChange={e => setIncidentType(e.target.value)}
        className="select"
      >
        <option value="Individual">Individual</option>
        <option value="Enterprise">Enterprise</option>
        <option value="Government">Government</option>
      </select>
      <input
        type="text"
        value={reporterName}
        onChange={e => setReporterName(e.target.value)}
        placeholder="Reporter Name"
        className="input"
        disabled={isExistingReporter}  // Disable field if reporter already exists
      />
      <input
        type="email"
        value={reporterEmail}
        onChange={handleEmailChange}  // Use handleEmailChange to trigger API call
        placeholder="Reporter Email"
        className="input"
      />
      <input
        type="text"
        value={reporterPhone}
        onChange={e => setReporterPhone(e.target.value)}
        placeholder="Reporter Phone"
        className="input"
        disabled={isExistingReporter}  // Disable field if reporter already exists
      />
      <input
        type="text"
        value={reporterAddress}
        onChange={e => setReporterAddress(e.target.value)}
        placeholder="Reporter Address"
        className="input"
        disabled={isExistingReporter}  // Disable field if reporter already exists
      />
      <button
        onClick={handleCreateIncident}
        className="button"
      >
        Create Incident
      </button>
    </div>
  );
}

export default CreateIncident;
