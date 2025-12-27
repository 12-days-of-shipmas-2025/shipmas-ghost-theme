const crypto = require('crypto');
const http = require('http');
const fs = require('fs');
const path = require('path');

const GHOST_URL = process.env.GHOST_URL || 'http://localhost:2368';

// Set via: export GHOST_ADMIN_API_KEY="id:secret"
const ADMIN_API_KEY = process.env.GHOST_ADMIN_API_KEY;
if (!ADMIN_API_KEY) {
    console.error('Error: GHOST_ADMIN_API_KEY environment variable not set');
    console.error('Get it from Ghost Admin → Settings → Integrations → Add custom integration');
    process.exit(1);
}
const [keyId, secret] = ADMIN_API_KEY.split(':');

function generateToken() {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT', kid: keyId })).toString('base64url');
    const now = Math.floor(Date.now() / 1000);
    const payload = Buffer.from(JSON.stringify({ iat: now, exp: now + 300, aud: '/admin/' })).toString('base64url');
    const key = Buffer.from(secret, 'hex');
    const signature = crypto.createHmac('sha256', key).update(`${header}.${payload}`).digest('base64url');
    return `${header}.${payload}.${signature}`;
}

async function uploadImage(imagePath) {
    return new Promise((resolve, reject) => {
        const fileName = path.basename(imagePath);
        const fileData = fs.readFileSync(imagePath);
        const boundary = '----FormBoundary' + Math.random().toString(36).substr(2);

        let body = '';
        body += `--${boundary}\r\n`;
        body += `Content-Disposition: form-data; name="file"; filename="${fileName}"\r\n`;
        body += 'Content-Type: image/png\r\n\r\n';

        const bodyStart = Buffer.from(body);
        const bodyEnd = Buffer.from(`\r\n--${boundary}--\r\n`);
        const fullBody = Buffer.concat([bodyStart, fileData, bodyEnd]);

        const token = generateToken();
        const options = {
            hostname: 'localhost',
            port: 2368,
            path: '/ghost/api/admin/images/upload/',
            method: 'POST',
            headers: {
                'Authorization': `Ghost ${token}`,
                'Accept-Version': 'v5.0',
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
                'Content-Length': fullBody.length
            }
        };

        const req = http.request(options, (res) => {
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

async function updatePost(postId, updatedAt, featureImageUrl) {
    return new Promise((resolve, reject) => {
        const token = generateToken();
        const data = JSON.stringify({
            posts: [{
                feature_image: featureImageUrl,
                updated_at: updatedAt
            }]
        });

        const options = {
            hostname: 'localhost',
            port: 2368,
            path: `/ghost/api/admin/posts/${postId}/`,
            method: 'PUT',
            headers: {
                'Authorization': `Ghost ${token}`,
                'Accept-Version': 'v5.0',
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(body);
                    if (res.statusCode >= 400) {
                        reject({ status: res.statusCode, error: json });
                    } else {
                        resolve(json);
                    }
                } catch (e) {
                    reject({ error: 'Failed to parse response', body });
                }
            });
        });
        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

async function getPosts() {
    return new Promise((resolve, reject) => {
        const token = generateToken();
        const options = {
            hostname: 'localhost',
            port: 2368,
            path: '/ghost/api/admin/posts/?limit=all',
            method: 'GET',
            headers: {
                'Authorization': `Ghost ${token}`,
                'Accept-Version': 'v5.0',
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (e) {
                    reject(e);
                }
            });
        });
        req.on('error', reject);
        req.end();
    });
}

// Map post slugs to image files
const imageMapping = {
    'welcome-12-days-shipmas': 'intro-shipmas.png',
    'day-1-shipmas': 'day-1-theme.png',
    'day-2-shipmas': 'day-2-focusflow.png',
    'day-3-shipmas': 'day-3-snaprecipe.png',
    'day-4-shipmas': 'day-4-moodboard.png',
    'day-5-shipmas': 'day-5-linktree.png',
    'day-6-shipmas': 'day-6-quickapi.png',
    'day-7-shipmas': 'day-7-gitstreak.png',
    'day-8-shipmas': 'day-8-colorsnap.png',
    'day-9-shipmas': 'day-9-readinglist.png',
    'day-10-shipmas': 'day-10-meetingcost.png',
    'day-11-shipmas': 'day-11-terminalchat.png',
    'day-12-shipmas': 'day-12-shipmaswrapped.png'
};

const imagesDir = path.join(__dirname, '..', 'generated-images');

async function main() {
    console.log('Fetching posts from Ghost...\n');

    const postsData = await getPosts();
    const posts = postsData.posts;

    console.log(`Found ${posts.length} posts\n`);

    for (const post of posts) {
        const imageFile = imageMapping[post.slug];
        if (!imageFile) {
            console.log(`⏭  Skipping "${post.title}" - no matching image`);
            continue;
        }

        const imagePath = path.join(imagesDir, imageFile);
        if (!fs.existsSync(imagePath)) {
            console.log(`⚠  Image not found for "${post.title}": ${imagePath}`);
            continue;
        }

        console.log(`📤 Uploading image for "${post.title}"...`);

        try {
            // Upload image
            const uploadResult = await uploadImage(imagePath);
            const imageUrl = uploadResult.images[0].url;
            console.log(`   ✓ Uploaded: ${imageUrl}`);

            // Update post with feature image
            await updatePost(post.id, post.updated_at, imageUrl);
            console.log(`   ✓ Updated post with feature image\n`);
        } catch (error) {
            console.log(`   ✗ Error: ${JSON.stringify(error)}\n`);
        }
    }

    console.log('Done!');
}

main().catch(console.error);
