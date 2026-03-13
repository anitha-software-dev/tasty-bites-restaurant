import axios from 'axios';

async function checkConnection() {
    try {
        const response = await axios.get('http://localhost:5000/api/health');
        console.log('Server Health:', response.data);
    } catch (error) {
        console.error('Connection Error:', error.message);
    }
}

checkConnection();
