const crypto = require('crypto');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const GHOST_URL = process.env.GHOST_URL || 'https://shipmas.mymagic.page';
const ADMIN_API_KEY = process.env.GHOST_ADMIN_API_KEY;

if (!ADMIN_API_KEY) {
    console.error('Error: GHOST_ADMIN_API_KEY environment variable not set');
    console.error('Usage: GHOST_ADMIN_API_KEY=your-key node deploy.js');
    process.exit(1);
}

const [keyId, secret] = ADMIN_API_KEY.split(':');
const url = new URL(GHOST_URL);

function generateToken() {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT', kid: keyId })).toString('base64url');
    const now = Math.floor(Date.now() / 1000);
    const payload = Buffer.from(JSON.stringify({ iat: now, exp: now + 300, aud: '/admin/' })).toString('base64url');
    const key = Buffer.from(secret, 'hex');
    const signature = crypto.createHmac('sha256', key).update(`${header}.${payload}`).digest('base64url');
    return `${header}.${payload}.${signature}`;
}

async function uploadTheme(zipPath) {
    return new Promise((resolve, reject) => {
        const fileName = path.basename(zipPath);
        const fileData = fs.readFileSync(zipPath);
        const boundary = '----FormBoundary' + Math.random().toString(36).substr(2);

        let body = '';
        body += `--${boundary}\r\n`;
        body += `Content-Disposition: form-data; name="file"; filename="${fileName}"\r\n`;
        body += 'Content-Type: application/zip\r\n\r\n';

        const bodyStart = Buffer.from(body);
        const bodyEnd = Buffer.from(`\r\n--${boundary}--\r\n`);
        const fullBody = Buffer.concat([bodyStart, fileData, bodyEnd]);

        const token = generateToken();
        const options = {
            hostname: url.hostname,
            port: 443,
            path: '/ghost/api/admin/themes/upload/',
            method: 'POST',
            headers: {
                'Authorization': `Ghost ${token}`,
                'Accept-Version': 'v5.0',
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
                'Content-Length': fullBody.length
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (res.statusCode >= 400) {
                        reject({ status: res.statusCode, error: json });
                    } else {
                        resolve(json);
                    }
                } catch (e) {
                    reject({ error: 'Failed to parse response', data });
                }
            });
        });
        req.on('error', reject);
        req.write(fullBody);
        req.end();
    });
}

async function activateTheme(themeName) {
    return new Promise((resolve, reject) => {
        const token = generateToken();
        const options = {
            hostname: url.hostname,
            port: 443,
            path: `/ghost/api/admin/themes/${themeName}/activate/`,
            method: 'PUT',
            headers: {
                'Authorization': `Ghost ${token}`,
                'Accept-Version': 'v5.0',
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (res.statusCode >= 400) {
                        reject({ status: res.statusCode, error: json });
                    } else {
                        resolve(json);
                    }
                } catch (e) {
                    reject({ error: 'Failed to parse response', data });
                }
            });
        });
        req.on('error', reject);
        req.end();
    });
}

async function main() {
    const themePath = path.join(__dirname, 'source', 'dist', 'shipmas.zip');

    if (!fs.existsSync(themePath)) {
        console.error('Theme zip not found at:', themePath);
        console.error('Run "npm run zip" in the source directory first');
        process.exit(1);
    }

    console.log(`\n🚀 Deploying to ${GHOST_URL}\n`);

    console.log('📦 Uploading theme...');
    try {
        const result = await uploadTheme(themePath);
        const themeName = result.themes[0].name;
        console.log(`   ✓ Uploaded: ${themeName}`);

        console.log('🎨 Activating theme...');
        await activateTheme(themeName);
        console.log(`   ✓ Activated: ${themeName}\n`);
        console.log('✅ Done!\n');
    } catch (error) {
        console.log(`   ✗ Error: ${JSON.stringify(error)}\n`);
        process.exit(1);
    }
}

main().catch(console.error);
