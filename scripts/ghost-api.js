const crypto = require('crypto');
const https = require('https');
const http = require('http');

class GhostAdminAPI {
    constructor(url, adminApiKey) {
        this.url = url.replace(/\/$/, '');
        const [id, secret] = adminApiKey.split(':');
        this.keyId = id;
        this.secret = secret;
    }

    generateToken() {
        // Ghost uses a specific JWT format
        const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT', kid: this.keyId })).toString('base64url');
        const now = Math.floor(Date.now() / 1000);
        const payload = Buffer.from(JSON.stringify({ iat: now, exp: now + 300, aud: '/admin/' })).toString('base64url');

        // Secret must be decoded from hex
        const key = Buffer.from(this.secret, 'hex');
        const signature = crypto
            .createHmac('sha256', key)
            .update(`${header}.${payload}`)
            .digest('base64url');

        return `${header}.${payload}.${signature}`;
    }

    async request(method, endpoint, data = null) {
        const token = this.generateToken();
        const urlObj = new URL(`${this.url}/ghost/api/admin${endpoint}`);
        const isHttps = urlObj.protocol === 'https:';
        const lib = isHttps ? https : http;

        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port || (isHttps ? 443 : 80),
            path: urlObj.pathname + urlObj.search,
            method,
            headers: {
                'Authorization': `Ghost ${token}`,
                'Content-Type': 'application/json',
                'Accept-Version': 'v5.0'
            }
        };

        return new Promise((resolve, reject) => {
            const req = lib.request(options, (res) => {
                let body = '';
                res.on('data', chunk => body += chunk);
                res.on('end', () => {
                    try {
                        const json = JSON.parse(body);
                        if (res.statusCode >= 400) {
                            reject({ status: res.statusCode, errors: json.errors || json });
                        } else {
                            resolve(json);
                        }
                    } catch (e) {
                        resolve(body);
                    }
                });
            });
            req.on('error', reject);
            if (data) req.write(JSON.stringify(data));
            req.end();
        });
    }

    async createTag(tag) {
        return this.request('POST', '/tags/', { tags: [tag] });
    }

    async createPost(post) {
        return this.request('POST', '/posts/', { posts: [post] });
    }

    async getPosts() {
        return this.request('GET', '/posts/?limit=all');
    }

    async getTags() {
        return this.request('GET', '/tags/?limit=all');
    }
}

module.exports = GhostAdminAPI;

// CLI usage
if (require.main === module) {
    const args = process.argv.slice(2);
    if (args[0] === 'setup-shipmas') {
        setupShipmas();
    }
}

async function setupShipmas() {
    const api = new GhostAdminAPI(
        'http://localhost:2368',
        '694e986c2f52c20001abe41e:e66474412b2c79ea6e40d6e1ef02cc724aa17795'
    );

    console.log('Creating tags...');

    // Create tags
    try {
        await api.createTag({ name: 'shipmas-intro', slug: 'shipmas-intro', description: 'Introduction to 12 Days of Shipmas' });
        console.log('  ✓ Created shipmas-intro tag');
    } catch (e) {
        console.log('  - shipmas-intro tag may already exist');
    }

    try {
        await api.createTag({ name: '12-days-of-shipmas', slug: '12-days-of-shipmas', description: '12 Days of Shipmas posts' });
        console.log('  ✓ Created 12-days-of-shipmas tag');
    } catch (e) {
        console.log('  - 12-days-of-shipmas tag may already exist');
    }

    console.log('\nCreating intro post...');

    // Create intro post
    try {
        await api.createPost({
            title: 'Welcome to 12 Days of Shipmas!',
            slug: 'welcome-12-days-shipmas',
            status: 'published',
            tags: [{ name: 'shipmas-intro' }],
            custom_excerpt: 'From December 26th to January 6th, we\'re shipping one new product every single day. Follow along as we reveal each project!',
            html: `<p>Welcome to the 12 Days of Shipmas! Starting December 26th and running through January 6th, we're embarking on an ambitious journey to ship 12 products in 12 days.</p>
<h2>What is Shipmas?</h2>
<p>Shipmas is our challenge to build and launch something new every single day for 12 consecutive days. Each day at midnight, we'll reveal what we've built and shipped.</p>
<h2>Why 12 Days?</h2>
<p>The 12 days between Christmas and Epiphany have historically been a time of celebration. We're turning it into a celebration of creation and shipping!</p>
<h2>Follow Along</h2>
<p>Check back daily to see what we've shipped. Each product card below will unlock as we reveal new projects.</p>`
        });
        console.log('  ✓ Created intro post');
    } catch (e) {
        console.log('  - Error creating intro post:', e.errors?.[0]?.message || e);
    }

    console.log('\nCreating Day 1 post...');

    // Create Day 1 post
    try {
        await api.createPost({
            title: 'Day 1: Ghost Theme Customization',
            slug: 'day-1-ghost-theme',
            status: 'published',
            tags: [{ name: '12-days-of-shipmas' }],
            custom_excerpt: 'A custom Ghost theme with a 12 Days of Shipmas homepage featuring an interactive grid.',
            html: `<p>For Day 1 of Shipmas, we built this very website you're looking at!</p>
<h2>What We Built</h2>
<p>A customized Ghost theme featuring:</p>
<ul>
<li>Interactive 12-day grid on the homepage</li>
<li>Locked/revealed card states for each day</li>
<li>Clean, modern typography</li>
<li>Responsive design that works on all devices</li>
</ul>
<h2>Technical Details</h2>
<p>Built with Ghost's Handlebars templating, custom CSS, and vanilla JavaScript for the interactive elements.</p>`
        });
        console.log('  ✓ Created Day 1 post');
    } catch (e) {
        console.log('  - Error creating Day 1 post:', e.errors?.[0]?.message || e);
    }

    console.log('\nCreating Day 2 placeholder...');

    // Create Day 2 post (placeholder)
    try {
        await api.createPost({
            title: 'Day 2: Coming Soon',
            slug: 'day-2-coming-soon',
            status: 'published',
            tags: [{ name: '12-days-of-shipmas' }],
            custom_excerpt: 'Something exciting is coming on Day 2...',
            html: `<p>Day 2 will be revealed on December 27th. Stay tuned!</p>`
        });
        console.log('  ✓ Created Day 2 post');
    } catch (e) {
        console.log('  - Error creating Day 2 post:', e.errors?.[0]?.message || e);
    }

    console.log('\n✅ Setup complete! Visit http://localhost:2368 to see your homepage.');
}
