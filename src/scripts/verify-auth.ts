import http from 'http';

function makeRequest(path: string, method: string = 'GET', body: any = null, token: string = null): Promise<any> {
    return new Promise((resolve, reject) => {
        const options: any = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve({ status: res.statusCode, body: data });
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

async function verifyAuth() {
    try {
        console.log("1. Testing protected route WITHOUT token...");
        const res1 = await makeRequest('/api/students');
        console.log(`Response Status: ${res1.status}`);
        console.log("Response Body:", res1.body);

        if (res1.status === 200) {
            console.error("FAILED: Protected route accessible without token!");
            process.exit(1);
        }

        console.log("\n2. Logging in...");
        const resLogin = await makeRequest('/login', 'POST', {
            email: "test.student@example.com",
            password: "password"
        });

        console.log(`Login Status: ${resLogin.status}`);
        if (resLogin.status !== 200) {
            console.error(`FAILED: Login failed with status ${resLogin.status}`);
            console.error("Response:", resLogin.body);
            process.exit(1);
        }

        const loginData = JSON.parse(resLogin.body);
        const token = loginData.token;
        console.log("Login Successful! Token received.");

        console.log("\n3. Testing protected route WITH token...");
        const res2 = await makeRequest('/api/students', 'GET', null, token);

        console.log(`Response Status: ${res2.status}`);
        if (res2.status === 200) {
            console.log("SUCCESS: Protected route accessible with token!");
            const data = JSON.parse(res2.body);
            console.log(`Students count: ${data.data ? data.data.length : 'N/A'}`);
        } else {
            console.error("FAILED: Protected route denied even with token");
            console.log("Response:", res2.body);
        }

    } catch (err) {
        console.error("Error running verification:", err);
    }
}

verifyAuth();
