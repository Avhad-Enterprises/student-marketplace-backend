import axios from 'axios';
import { logger } from "@/utils/logger";

async function testLogin() {
    try {
        const url = 'http://localhost:5000/login';
        const payload = {
            email: 'test.user@example.com',
            password: 'password123'
        };

        logger.info(`Testing login at ${url}...`);
        const response = await axios.post(url, payload);

        console.log('Login Successful!');
        console.log('Status:', response.status);
        console.log('Data:', JSON.stringify(response.data, null, 2));

    } catch (error: any) {
        if (error.response) {
            console.error('Login Failed:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error:', error.message);
        }
    }
}

testLogin();
