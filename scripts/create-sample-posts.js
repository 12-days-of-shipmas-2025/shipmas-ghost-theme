const crypto = require('crypto');
const http = require('http');

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

async function request(method, endpoint, data = null) {
    return new Promise((resolve, reject) => {
        const token = generateToken();
        const body = data ? JSON.stringify(data) : null;
        const options = {
            hostname: 'localhost',
            port: 2368,
            path: `/ghost/api/admin${endpoint}`,
            method,
            headers: {
                'Authorization': `Ghost ${token}`,
                'Accept-Version': 'v5.0',
                'Content-Type': 'application/json',
                ...(body && { 'Content-Length': Buffer.byteLength(body) })
            }
        };

        const req = http.request(options, (res) => {
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

const posts = [
    {
        title: 'Day 1: Shipmas Theme',
        slug: 'day-1-shipmas',
        custom_excerpt: 'A festive Ghost theme featuring a 12 Days countdown grid with dark mode support.',
        html: '<p>Welcome to Day 1 of 12 Days of Shipmas! Today we\'re launching the Shipmas Theme - a beautiful Ghost theme that powers this very site.</p><p>Features include a 12-day countdown grid, dark mode support, and responsive design.</p>',
        tags: [{ name: '12-days-of-shipmas' }, { name: 'day-1' }],
        status: 'published'
    },
    {
        title: 'Day 2: FocusFlow',
        slug: 'day-2-shipmas',
        custom_excerpt: 'A minimalist Pomodoro timer to boost your productivity.',
        html: '<p>Day 2 brings FocusFlow - a clean, distraction-free Pomodoro timer.</p><p>Features customizable work/break intervals, session tracking, and ambient sounds.</p>',
        tags: [{ name: '12-days-of-shipmas' }, { name: 'day-2' }],
        status: 'published'
    },
    {
        title: 'Day 3: SnapRecipe',
        slug: 'day-3-shipmas',
        custom_excerpt: 'Scan ingredients with your camera and get instant recipe suggestions.',
        html: '<p>SnapRecipe uses AI to identify ingredients from photos and suggests recipes you can make.</p><p>Perfect for using up what\'s in your fridge!</p>',
        tags: [{ name: '12-days-of-shipmas' }, { name: 'day-3' }],
        status: 'published'
    },
    {
        title: 'Day 4: MoodBoard',
        slug: 'day-4-shipmas',
        custom_excerpt: 'Create beautiful mood boards with drag-and-drop simplicity.',
        html: '<p>MoodBoard lets you collect and arrange images, colors, and text into stunning visual collections.</p><p>Export as PNG or share with collaborators.</p>',
        tags: [{ name: '12-days-of-shipmas' }, { name: 'day-4' }],
        status: 'published'
    },
    {
        title: 'Day 5: LinkTree Clone',
        slug: 'day-5-shipmas',
        custom_excerpt: 'Your personal link hub - simple, fast, and customizable.',
        html: '<p>Create your own link-in-bio page in minutes.</p><p>Customize themes, track clicks, and own your data.</p>',
        tags: [{ name: '12-days-of-shipmas' }, { name: 'day-5' }],
        status: 'published'
    },
    {
        title: 'Day 6: QuickAPI',
        slug: 'day-6-shipmas',
        custom_excerpt: 'Spin up mock APIs instantly for frontend development.',
        html: '<p>QuickAPI generates RESTful endpoints from JSON schemas.</p><p>Perfect for prototyping when your backend isn\'t ready yet.</p>',
        tags: [{ name: '12-days-of-shipmas' }, { name: 'day-6' }],
        status: 'published'
    },
    {
        title: 'Day 7: GitStreak',
        slug: 'day-7-shipmas',
        custom_excerpt: 'Track your GitHub contribution streak and stay motivated.',
        html: '<p>GitStreak shows your current streak, longest streak, and contribution calendar.</p><p>Get daily reminders to keep your streak alive!</p>',
        tags: [{ name: '12-days-of-shipmas' }, { name: 'day-7' }],
        status: 'published'
    },
    {
        title: 'Day 8: ColorSnap',
        slug: 'day-8-shipmas',
        custom_excerpt: 'Extract color palettes from any image instantly.',
        html: '<p>Upload an image and ColorSnap extracts the dominant colors.</p><p>Export as CSS variables, Tailwind config, or Figma styles.</p>',
        tags: [{ name: '12-days-of-shipmas' }, { name: 'day-8' }],
        status: 'published'
    },
    {
        title: 'Day 9: ReadingList',
        slug: 'day-9-shipmas',
        custom_excerpt: 'Save articles and track your reading progress.',
        html: '<p>ReadingList saves articles for later with automatic content extraction.</p><p>Track time spent reading and get weekly digests.</p>',
        tags: [{ name: '12-days-of-shipmas' }, { name: 'day-9' }],
        status: 'published'
    },
    {
        title: 'Day 10: MeetingCost',
        slug: 'day-10-shipmas',
        custom_excerpt: 'Calculate the real cost of your meetings in real-time.',
        html: '<p>MeetingCost shows a live dollar counter based on attendees\' salaries.</p><p>Make meetings more intentional and efficient.</p>',
        tags: [{ name: '12-days-of-shipmas' }, { name: 'day-10' }],
        status: 'published'
    },
    {
        title: 'Day 11: TerminalChat',
        slug: 'day-11-shipmas',
        custom_excerpt: 'Chat with AI directly from your terminal.',
        html: '<p>TerminalChat brings AI assistance to your command line.</p><p>Pipe in files, get code suggestions, and never leave your flow.</p>',
        tags: [{ name: '12-days-of-shipmas' }, { name: 'day-11' }],
        status: 'published'
    },
    {
        title: 'Day 12: ShipmasWrapped',
        slug: 'day-12-shipmas',
        custom_excerpt: 'Your year in shipping - stats, highlights, and celebrations.',
        html: '<p>ShipmasWrapped generates a beautiful summary of everything you shipped this year.</p><p>Share your wins and celebrate your progress!</p>',
        tags: [{ name: '12-days-of-shipmas' }, { name: 'day-12' }],
        status: 'published'
    }
];

async function main() {
    console.log('=== Creating 12 Days of Shipmas Posts ===\n');

    // First, create the tags
    console.log('Creating tags...');
    try {
        await request('POST', '/tags/', {
            tags: [{ name: '12-days-of-shipmas', slug: '12-days-of-shipmas' }]
        });
        console.log('  ✓ Created tag: 12-days-of-shipmas');
    } catch (err) {
        console.log('  - Tag 12-days-of-shipmas already exists or error');
    }

    for (let day = 1; day <= 12; day++) {
        try {
            await request('POST', '/tags/', {
                tags: [{ name: `day-${day}`, slug: `day-${day}` }]
            });
            console.log(`  ✓ Created tag: day-${day}`);
        } catch (err) {
            console.log(`  - Tag day-${day} already exists or error`);
        }
    }

    // Create the posts
    console.log('\nCreating posts...');
    for (const post of posts) {
        try {
            await request('POST', '/posts/', { posts: [post] });
            console.log(`  ✓ Created: ${post.title}`);
        } catch (err) {
            if (err.error?.errors?.[0]?.type === 'ValidationError' &&
                err.error?.errors?.[0]?.message?.includes('already')) {
                console.log(`  - ${post.title} already exists`);
            } else {
                console.log(`  ✗ Error creating ${post.title}: ${JSON.stringify(err)}`);
            }
        }
    }

    console.log('\n=== Done! ===');
    console.log('Created 12 posts with day-specific tags.');
}

main().catch(console.error);
