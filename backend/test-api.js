const axios = require('axios');

async function testIssueCreation() {
  try {
    console.log('Testing issue creation with valid token...');
    
    // First, let's try to login to get a valid token
    const loginResponse = await axios.post('http://localhost:3001/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Login successful:', loginResponse.data);
    const token = loginResponse.data.token;
    
    // Now create an issue with the valid token
    const response = await axios.post('http://localhost:3001/issues', {
      title: 'Test Issue from Script',
      description: 'This is a test issue created from the API test script'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Issue creation success:', response.data);
  } catch (error) {
    console.log('Error response:', error.response?.data);
    console.log('Error status:', error.response?.status);
    console.log('Full error:', error.message);
    if (error.response?.data) {
      console.log('Error details:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testIssueCreation();