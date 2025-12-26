const GhostAdminAPI = require('@tryghost/admin-api');

const api = new GhostAdminAPI({
    url: 'http://localhost:2368',
    key: '694e986c2f52c20001abe41e:e66474412b2c79ea6e40d6e1ef02cc724aa1779520e3a1105ae5c9211cc85c79',
    version: 'v5.0'
});

const shipmasPosts = [
    {
        day: 1,
        title: 'Day 1: Shipmas Theme',
        excerpt: 'A custom Ghost theme with an interactive 12-day countdown grid.',
        html: `<p>For Day 1, we built this very website! A customized Ghost theme featuring an interactive 12-day grid that reveals each project as we ship them.</p>
<h2>Features</h2>
<ul><li>Interactive countdown grid</li><li>Locked/revealed card states</li><li>Clean, modern typography</li><li>Fully responsive design</li></ul>`
    },
    {
        day: 2,
        title: 'Day 2: FocusFlow',
        excerpt: 'A Pomodoro timer app with ambient sounds and productivity tracking.',
        html: `<p>FocusFlow is a beautiful Pomodoro timer that helps you stay focused with ambient sounds and tracks your productivity over time.</p>
<h2>Features</h2>
<ul><li>25/5 minute work/break cycles</li><li>Ambient sounds (rain, cafe, forest)</li><li>Daily/weekly productivity stats</li><li>Desktop notifications</li></ul>`
    },
    {
        day: 3,
        title: 'Day 3: SnapRecipe',
        excerpt: 'Take a photo of ingredients, get instant recipe suggestions powered by AI.',
        html: `<p>SnapRecipe uses computer vision to identify ingredients in your fridge and suggests recipes you can make right now.</p>
<h2>Features</h2>
<ul><li>AI-powered ingredient recognition</li><li>Recipe suggestions based on what you have</li><li>Dietary preference filters</li><li>Save favorite recipes</li></ul>`
    },
    {
        day: 4,
        title: 'Day 4: MoodBoard',
        excerpt: 'A daily mood tracker with beautiful visualizations and journaling.',
        html: `<p>MoodBoard helps you understand your emotional patterns with simple daily check-ins and beautiful data visualizations.</p>
<h2>Features</h2>
<ul><li>Quick emoji-based mood logging</li><li>Optional journal entries</li><li>Weekly/monthly mood trends</li><li>Pattern insights and correlations</li></ul>`
    },
    {
        day: 5,
        title: 'Day 5: LinkTree Clone',
        excerpt: 'A self-hosted, customizable link-in-bio page builder.',
        html: `<p>Your own link-in-bio page that you control. No subscriptions, no limits, fully customizable.</p>
<h2>Features</h2>
<ul><li>Drag-and-drop link ordering</li><li>Custom themes and colors</li><li>Analytics dashboard</li><li>Self-hosted or one-click deploy</li></ul>`
    },
    {
        day: 6,
        title: 'Day 6: QuickAPI',
        excerpt: 'Generate mock REST APIs instantly for prototyping and testing.',
        html: `<p>QuickAPI lets you define a schema and instantly get a working REST API with realistic fake data.</p>
<h2>Features</h2>
<ul><li>JSON schema to API in seconds</li><li>Realistic fake data generation</li><li>CRUD operations out of the box</li><li>Shareable API endpoints</li></ul>`
    },
    {
        day: 7,
        title: 'Day 7: GitStreak',
        excerpt: 'A GitHub contribution streak tracker with notifications and stats.',
        html: `<p>Never break your GitHub streak again! GitStreak sends reminders and shows detailed contribution analytics.</p>
<h2>Features</h2>
<ul><li>Streak tracking and reminders</li><li>Contribution heatmaps</li><li>Language breakdown stats</li><li>Weekly email summaries</li></ul>`
    },
    {
        day: 8,
        title: 'Day 8: ColorSnap',
        excerpt: 'Extract beautiful color palettes from any image instantly.',
        html: `<p>Upload any image and ColorSnap extracts a harmonious color palette with export options for designers and developers.</p>
<h2>Features</h2>
<ul><li>Intelligent palette extraction</li><li>Export as CSS, Tailwind, or Figma</li><li>Color accessibility checker</li><li>Palette history and favorites</li></ul>`
    },
    {
        day: 9,
        title: 'Day 9: ReadingList',
        excerpt: 'A minimal bookmarking app that saves articles for offline reading.',
        html: `<p>Save articles with one click, read them later offline, and never lose an interesting link again.</p>
<h2>Features</h2>
<ul><li>One-click bookmarking</li><li>Offline reading mode</li><li>Reading time estimates</li><li>Tags and search</li></ul>`
    },
    {
        day: 10,
        title: 'Day 10: MeetingCost',
        excerpt: 'A real-time calculator showing how much your meetings actually cost.',
        html: `<p>Enter attendee salaries and watch the meeting cost tick up in real-time. Make meetings more efficient!</p>
<h2>Features</h2>
<ul><li>Real-time cost counter</li><li>Anonymous salary input</li><li>Meeting history and trends</li><li>ROI calculator</li></ul>`
    },
    {
        day: 11,
        title: 'Day 11: TerminalChat',
        excerpt: 'A CLI-based AI chat interface for developers who live in the terminal.',
        html: `<p>Chat with AI without leaving your terminal. Pipe in code, get suggestions, all from the command line.</p>
<h2>Features</h2>
<ul><li>Natural language queries</li><li>Pipe stdin for context</li><li>Code syntax highlighting</li><li>Conversation history</li></ul>`
    },
    {
        day: 12,
        title: 'Day 12: ShipmasWrap',
        excerpt: 'A retrospective of all 12 days with stats and lessons learned.',
        html: `<p>The grand finale! A look back at everything we shipped, what we learned, and what's next.</p>
<h2>The Journey</h2>
<ul><li>12 products in 12 days</li><li>Lines of code written</li><li>Technologies explored</li><li>Lessons learned</li></ul>
<p>Thanks for following along! Here's to shipping more in the new year.</p>`
    }
];

async function setup() {
    console.log('🎄 Setting up 12 Days of Shipmas...\n');

    // Create tags
    console.log('Creating tags...');
    try {
        await api.tags.add({ name: 'shipmas-intro', slug: 'shipmas-intro' });
        console.log('  ✓ shipmas-intro');
    } catch (e) { console.log('  - shipmas-intro exists'); }

    try {
        await api.tags.add({ name: '12-days-of-shipmas', slug: '12-days-of-shipmas' });
        console.log('  ✓ 12-days-of-shipmas');
    } catch (e) { console.log('  - 12-days-of-shipmas exists'); }

    // Create intro post
    console.log('\nCreating intro post...');
    try {
        await api.posts.add({
            title: 'Welcome to 12 Days of Shipmas!',
            slug: 'welcome-12-days-shipmas',
            status: 'published',
            tags: ['shipmas-intro'],
            custom_excerpt: "From December 26th to January 6th, we're shipping one new product every single day!",
            html: `<p>Welcome to the 12 Days of Shipmas! We're shipping 12 products in 12 days.</p>
<h2>What is Shipmas?</h2>
<p>Our challenge to build and launch something new every day from December 26th to January 6th.</p>
<h2>Follow Along</h2>
<p>Check back daily to see what we've shipped. Each card on the homepage unlocks as we reveal new projects!</p>`
        }, { source: 'html' });
        console.log('  ✓ Intro post created');
    } catch (e) { console.log('  - Intro:', e.message); }

    // Create all 12 days
    console.log('\nCreating daily posts...');
    for (const post of shipmasPosts) {
        try {
            await api.posts.add({
                title: post.title,
                slug: `day-${post.day}-shipmas`,
                status: 'published',
                tags: ['12-days-of-shipmas'],
                custom_excerpt: post.excerpt,
                html: post.html
            }, { source: 'html' });
            console.log(`  ✓ Day ${post.day}: ${post.title.split(': ')[1]}`);
        } catch (e) {
            console.log(`  - Day ${post.day}: ${e.message}`);
        }
    }

    console.log('\n🎉 Done! Visit http://localhost:2368 to see your homepage.');
}

setup().catch(console.error);
