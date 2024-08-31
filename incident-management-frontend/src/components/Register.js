import React, { useState } from 'react';
import api, { pinCodeApi } from '../api';
import '../css/Register.css';  

const Register = () => {
  const [formData, setFormData] = useState({
    user_type: 'Individual',
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    country: '',
    state: '',
    city: '',
    pincode: '',
    mobile_number: '',
    fax: '',
    phone: '',
    password: '',
    confirm_password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));

    // If the changed field is pincode, fetch city and country
    if (name === 'pincode') {
      fetchLocationData(value);
    }
  };

  const fetchLocationData = async (pinCode) => {
    if (!pinCode || pinCode.length < 6) return; // Ensure pin code is valid
  
    try {
      const response = await pinCodeApi.get(`/pincode/${pinCode}`);
      const data = response.data;
      if (data[0].Status === 'Success') {
        const { District, State } = data[0].PostOffice[0];
        setFormData(prevState => ({
          ...prevState,
          country: 'India',
          state: State,
          city: District
        }));
        setError('');
      } else {
        setError('Invalid pin code. Please try again.');
        setFormData(prevState => ({
          ...prevState,
          country: '',
          state: '',
          city: ''
        }));
      }
    } catch (error) {
      setError('Unable to fetch location details. Please check the pin code.');
      setFormData(prevState => ({
        ...prevState,
        country: '',
        state: '',
        city: ''
      }));
    }
  };
  

  const handleSubmit = (e) => {
  e.preventDefault();

  const passwordPattern = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

  if (!passwordPattern.test(formData.password)) {
    setError('Password must contain at least 8 characters, including at least one number and one uppercase letter.');
    return;
  }

  if (formData.password !== formData.confirm_password) {
    setError('Passwords do not match.');
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    setError('Invalid email address.');
    return;
  }

  if (!/^[0-9]{10}$/.test(formData.mobile_number)) {
    setError('Invalid phone number.');
    return;
  }
    
    

    api.post('register/', formData) // Adjusted endpoint
      .then(response => {
        setSuccess('Registration successful!');
        setError('');
        setFormData({
          user_type: 'Individual',
          first_name: '',
          last_name: '',
          email: '',
          address: '',
          country: '',
          state: '',
          city: '',
          pincode: '',
          mobile_number: '',
          fax: '',
          phone: '',
          password: '',
          confirm_password: '',
        });
      })
      .catch(error => {
        setError(error.response?.data?.detail || 'Registration failed. Please try again.');
      });
  };

  return (
    <div className="register-container">
      <h2>SIGNUP</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group radio-group">
          <label>Individual/Government/Enterprise:</label>
          <label>
            <input
              type="radio"
              name="user_type"
              value="Individual"
              checked={formData.user_type === 'Individual'}
              onChange={handleChange}
            />
            Individual
          </label>
          <label>
            <input
              type="radio"
              name="user_type"
              value="Enterprise"
              checked={formData.user_type === 'Enterprise'}
              onChange={handleChange}
            />
            Enterprise
          </label>
          <label>
            <input
              type="radio"
              name="user_type"
              value="Government"
              checked={formData.user_type === 'Government'}
              onChange={handleChange}
            />
            Government
          </label>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="required-label">First Name</label>
            <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-group">
          <label className="required-label">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label className="required-label">Address</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} required />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="required-label">Country</label>
            <input type="text" name="country" value={formData.country} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="required-label">State</label>
            <input type="text" name="state" value={formData.state} onChange={handleChange} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="required-label">City</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="required-label">Pincode</label>
            <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-group">
          <label className="required-label">Mobile Number</label>
          <input type="text" name="mobile_number" value={formData.mobile_number} onChange={handleChange} required />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Fax</label>
            <input type="text" name="fax" value={formData.fax} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
          </div>
        </div>

        <div className="form-group">
          <label className="required-label">Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label className="required-label">Confirm Password</label>
          <input type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} required />
        </div>

        <button type="submit" className="register-button">Sign Up</button>
      </form>
    </div>
  );
};

export default Register;
