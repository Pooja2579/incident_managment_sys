import axios from 'axios';

// Create an instance for the PIN Code API
const pincodeApi = axios.create({
  baseURL: 'https://api.postalpincode.in/',  // Ensure this is correct
  timeout: 10000,  // Optional: set timeout for requests
});

export default pincodeApi;
