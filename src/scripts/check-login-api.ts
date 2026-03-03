import axios from 'axios';

async function testLogin() {
    const url = 'http://localhost:5000/login';
    const payload = {
        email: 'admin@example.com',
        password: 'Admin@123'
    };

    console.log(`🚀 Testing Login API at ${url}...`);
    console.log(`📧 Email: ${payload.email}`);

    try {
        const response = await axios.post(url, payload);
        console.log('\n✅ Login Successful!');
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(response.data, null, 2));
    } catch (error: any) {
        console.error('\n❌ Login Failed!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error:', error.message);
        }
        process.exit(1);
    }
}

testLogin();
