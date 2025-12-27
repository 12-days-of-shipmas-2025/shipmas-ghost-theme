const crypto = require('crypto');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Main site configuration
const GHOST_URL = process.env.GHOST_URL || 'https://humanwritten.ai';
const ADMIN_API_KEY = process.env.GHOST_ADMIN_API_KEY;

if (!ADMIN_API_KEY) {
    console.error('Error: GHOST_ADMIN_API_KEY environment variable not set');
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

async function request(method, endpoint, data = null) {
    return new Promise((resolve, reject) => {
        const token = generateToken();
        const body = data ? JSON.stringify(data) : null;
        const options = {
            hostname: url.hostname,
            port: 443,
            path: `/ghost/api/admin${endpoint}`,
            method,
            headers: {
                'Authorization': `Ghost ${token}`,
                'Accept-Version': 'v5.0',
                'Content-Type': 'application/json',
                ...(body && { 'Content-Length': Buffer.byteLength(body) })
            }
        };

        const req = https.request(options, (res) => {
            let responseBody = '';
            res.on('data', chunk => responseBody += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(responseBody);
                    if (res.statusCode >= 400) {
                        reject({ status: res.statusCode, error: json });
                    } else {
                        resolve(json);
                    }
                } catch (e) {
                    resolve(responseBody);
                }
            });
        });
        req.on('error', reject);
        if (body) req.write(body);
        req.end();
    });
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
    return request('PUT', `/themes/${themeName}/activate/`);
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
            hostname: url.hostname,
            port: 443,
            path: '/ghost/api/admin/images/upload/',
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

// ALL posts as DRAFT for main site
const posts = [
    {
        title: 'Welcome to 12 Days of Shipmas!',
        slug: 'welcome-12-days-shipmas',
        custom_excerpt: 'Join us for 12 days of shipping small, useful projects.',
        html: '<p>Welcome to 12 Days of Shipmas! Each day we release something new - from tools to themes to tiny apps.</p><p>Follow along as we ship one project every day for 12 days.</p>',
        tags: [{ name: 'shipmas-intro' }],
        status: 'draft'
    },
    {
        title: 'Day 1: Shipmas Theme',
        slug: 'day-1-shipmas',
        custom_excerpt: 'A festive Ghost theme featuring a 12 Days countdown grid with dark mode support.',
        html: '<p>Welcome to Day 1 of 12 Days of Shipmas! Today we\'re launching the Shipmas Theme - a beautiful Ghost theme that powers this very site.</p><p>Features include a 12-day countdown grid, dark mode support, and responsive design.</p>',
        tags: [{ name: '12-days-of-shipmas' }, { name: 'day-1' }],
        status: 'draft'
    },
    {
        title: 'Day 2: FocusFlow',
        slug: 'day-2-shipmas',
        custom_excerpt: 'A minimalist Pomodoro timer to boost your productivity.',
        html: '<p>Day 2 brings FocusFlow - a clean, distraction-free Pomodoro timer.</p><p>Features customizable work/break intervals, session tracking, and ambient sounds.</p>',
        tags: [{ name: '12-days-of-shipmas' }, { name: 'day-2' }],
        status: 'draft'
    },
    {
        title: 'Day 3: SnapRecipe',
        slug: 'day-3-shipmas',
        custom_excerpt: 'Scan ingredients with your camera and get instant recipe suggestions.',
        html: '<p>SnapRecipe uses AI to identify ingredients from photos and suggests recipes you can make.</p><p>Perfect for using up what\'s in your fridge!</p>',
        tags: [{ name: '12-days-of-shipmas' }, { name: 'day-3' }],
        status: 'draft'
    },
    {
        title: 'Day 4: MoodBoard',
        slug: 'day-4-shipmas',
        custom_excerpt: 'Create beautiful mood boards with drag-and-drop simplicity.',
        html: '<p>MoodBoard lets you collect and arrange images, colors, and text into stunning visual collections.</p><p>Export as PNG or share with collaborators.</p>',
        tags: [{ name: '12-days-of-shipmas' }, { name: 'day-4' }],
        status: 'draft'
    },
    {
        title: 'Day 5: LinkTree Clone',
        slug: 'day-5-shipmas',
        custom_excerpt: 'Your personal link hub - simple, fast, and customizable.',
        html: '<p>Create your own link-in-bio page in minutes.</p><p>Customize themes, track clicks, and own your data.</p>',
        tags: [{ name: '12-days-of-shipmas' }, { name: 'day-5' }],
        status: 'draft'
    },
    {
        title: 'Day 6: QuickAPI',
        slug: 'day-6-shipmas',
        custom_excerpt: 'Spin up mock APIs instantly for frontend development.',
        html: '<p>QuickAPI generates RESTful endpoints from JSON schemas.</p><p>Perfect for prototyping when your backend isn\'t ready yet.</p>',
        tags: [{ name: '12-days-of-shipmas' }, { name: 'day-6' }],
        status: 'draft'
    },
    {
        title: 'Day 7: GitStreak',
        slug: 'day-7-shipmas',
        custom_excerpt: 'Track your GitHub contribution streak and stay motivated.',
        html: '<p>GitStreak shows your current streak, longest streak, and contribution calendar.</p><p>Get daily reminders to keep your streak alive!</p>',
        tags: [{ name: '12-days-of-shipmas' }, { name: 'day-7' }],
        status: 'draft'
    },
    {
        title: 'Day 8: ColorSnap',
        slug: 'day-8-shipmas',
        custom_excerpt: 'Extract color palettes from any image instantly.',
        html: '<p>Upload an image and ColorSnap extracts the dominant colors.</p><p>Export as CSS variables, Tailwind config, or Figma styles.</p>',
        tags: [{ name: '12-days-of-shipmas' }, { name: 'day-8' }],
        status: 'draft'
    },
    {
        title: 'Day 9: ReadingList',
        slug: 'day-9-shipmas',
        custom_excerpt: 'Save articles and track your reading progress.',
        html: '<p>ReadingList saves articles for later with automatic content extraction.</p><p>Track time spent reading and get weekly digests.</p>',
        tags: [{ name: '12-days-of-shipmas' }, { name: 'day-9' }],
        status: 'draft'
    },
    {
        title: 'Day 10: MeetingCost',
        slug: 'day-10-shipmas',
        custom_excerpt: 'Calculate the real cost of your meetings in real-time.',
        html: '<p>MeetingCost shows a live dollar counter based on attendees\' salaries.</p><p>Make meetings more intentional and efficient.</p>',
        tags: [{ name: '12-days-of-shipmas' }, { name: 'day-10' }],
        status: 'draft'
    },
    {
        title: 'Day 11: TerminalChat',
        slug: 'day-11-shipmas',
        custom_excerpt: 'Chat with AI directly from your terminal.',
        html: '<p>TerminalChat brings AI assistance to your command line.</p><p>Pipe in files, get code suggestions, and never leave your flow.</p>',
        tags: [{ name: '12-days-of-shipmas' }, { name: 'day-11' }],
        status: 'draft'
    },
    {
        title: 'Day 12: ShipmasWrapped',
        slug: 'day-12-shipmas',
        custom_excerpt: 'Your year in shipping - stats, highlights, and celebrations.',
        html: '<p>ShipmasWrapped generates a beautiful summary of everything you shipped this year.</p><p>Share your wins and celebrate your progress!</p>',
        tags: [{ name: '12-days-of-shipmas' }, { name: 'day-12' }],
        status: 'draft'
    }
];

// Use fresh Day 1 image, others from generated-images
const imageMapping = {
    'welcome-12-days-shipmas': 'intro-shipmas.png',
    'day-1-shipmas': 'day-1-theme-fresh.png',  // Fresh icon!
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
            hostname: url.hostname,
            port: 443,
            path: `/ghost/api/admin/posts/${postId}/?source=html`,
            method: 'PUT',
            headers: {
                'Authorization': `Ghost ${token}`,
                'Accept-Version': 'v5.0',
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        const req = https.request(options, (res) => {
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

async function main() {
    const imagesDir = path.join(__dirname, '..', 'generated-images');

    console.log(`\n🚀 Deploying to MAIN SITE: ${GHOST_URL}\n`);
    console.log('⚠️  All posts will be created as DRAFTS\n');

    // Step 1: Upload and activate theme
    console.log('📦 Uploading theme...');
    const themePath = path.join(__dirname, '..', 'shipmas-theme.zip');
    try {
        const result = await uploadTheme(themePath);
        const themeName = result.themes[0].name;
        console.log(`   ✓ Uploaded: ${themeName}`);

        console.log('🎨 Activating theme...');
        await activateTheme(themeName);
        console.log(`   ✓ Activated: ${themeName}\n`);
    } catch (error) {
        console.log(`   ✗ Error: ${JSON.stringify(error)}\n`);
    }

    // Step 2: Create posts as DRAFTS
    console.log('📝 Creating posts (as DRAFTS)...');
    for (const post of posts) {
        try {
            await request('POST', '/posts/', { posts: [post] });
            console.log(`   ✓ Created: ${post.title} [DRAFT]`);
        } catch (err) {
            if (err.error?.errors?.[0]?.message?.includes('already')) {
                console.log(`   - ${post.title} already exists`);
            } else {
                console.log(`   ✗ Error: ${JSON.stringify(err)}`);
            }
        }
    }
    console.log('');

    // Step 3: Upload images and update posts
    console.log('🖼  Uploading images...');
    const postsData = await request('GET', '/posts/?limit=all&status=all');

    for (const post of postsData.posts) {
        const imageFile = imageMapping[post.slug];
        if (!imageFile) continue;

        const imagePath = path.join(imagesDir, imageFile);
        if (!fs.existsSync(imagePath)) {
            console.log(`   ⚠ Image not found: ${imageFile}`);
            continue;
        }

        try {
            const uploadResult = await uploadImage(imagePath);
            const imageUrl = uploadResult.images[0].url;
            console.log(`   ✓ Uploaded: ${imageFile}`);

            await updatePost(post.id, post.updated_at, imageUrl);
            console.log(`   ✓ Updated: ${post.title}`);
        } catch (error) {
            console.log(`   ✗ Error: ${JSON.stringify(error)}`);
        }
    }
    console.log('');

    console.log('✅ Done!');
    console.log('\n📋 Next steps:');
    console.log('   1. Go to Ghost Admin → Posts');
    console.log('   2. Publish Day 1 when ready');
    console.log('   3. Publish each day as you ship!\n');
}

main().catch(console.error);
