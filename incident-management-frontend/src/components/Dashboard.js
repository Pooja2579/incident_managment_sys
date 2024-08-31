import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div style={{ display: 'flex', textAlign: 'center', padding: '20px', alignItems: 'center',  justifyContent: 'center'}}>
      <Link to="/incidents/create">
        <button
          style={{
            margin: '10px',
            padding: '6px 12px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            width: '120px'
          }}
        >
          Create Incident
        </button>
      </Link>
      <Link to="/incidents/list">
        <button
          style={{
            margin: '10px',
            padding: '6px 12px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            width: '120px'
          }}
        >
          View Incidents
        </button>
      </Link>
    </div>
  );
}

export default Dashboard;
