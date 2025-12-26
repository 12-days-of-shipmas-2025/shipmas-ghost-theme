const GhostAdminAPI = require('@tryghost/admin-api');

const api = new GhostAdminAPI({
    url: 'http://localhost:2368',
    key: '694e986c2f52c20001abe41e:e66474412b2c79ea6e40d6e1ef02cc724aa1779520e3a1105ae5c9211cc85c79',
    version: 'v5.0'
});

async function createParticipantsPage() {
    console.log('🎄 Creating 12 Days of Shipmas participants page...\n');

    try {
        const page = await api.pages.add({
            title: '12 Days of Shipmas',
            slug: '12-days-of-shipmas',
            status: 'draft', // Hidden for now - backlog item
            html: `
<h2>About 12 Days of Shipmas</h2>
<p>From December 26th to January 5th, we're shipping one new product every single day. It's a challenge to build, create, and ship—celebrating the spirit of making things!</p>

<h2>Other Participants</h2>
<p>We're not alone in this journey! Here are other amazing makers also participating in 12 Days of Shipmas:</p>

<ul>
<li><strong>Coming soon...</strong> - Add your fellow participants here</li>
</ul>

<h2>Want to Join?</h2>
<p>If you're participating in 12 Days of Shipmas too, let us know! We'd love to feature you here.</p>

<h2>Follow Our Journey</h2>
<p>Check out the <a href="/">homepage</a> to see all our daily projects as they're revealed!</p>
            `,
            custom_excerpt: 'Meet the makers participating in 12 Days of Shipmas - shipping one product every day from December 26 to January 5.'
        }, { source: 'html' });

        console.log('✓ Created participants page (draft)');
        console.log(`  URL: ${page.url}`);
        console.log(`  Status: ${page.status}`);
        console.log('\nTo publish: Go to Ghost Admin > Pages > "12 Days of Shipmas"');

    } catch (error) {
        if (error.message && error.message.includes('already exists')) {
            console.log('Page already exists');
        } else {
            console.error('Error:', error);
        }
    }
}

createParticipantsPage();
