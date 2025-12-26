const GhostAdminAPI = require('@tryghost/admin-api');

const api = new GhostAdminAPI({
    url: 'http://localhost:2368',
    key: '694e986c2f52c20001abe41e:e66474412b2c79ea6e40d6e1ef02cc724aa1779520e3a1105ae5c9211cc85c79',
    version: 'v5.0'
});

async function updatePosts() {
    console.log('🎄 Updating 12 Days of Shipmas posts...\n');

    try {
        // Get all posts
        const posts = await api.posts.browse({ limit: 'all', filter: 'tag:12-days-of-shipmas' });
        console.log(`Found ${posts.length} Shipmas posts\n`);

        for (const post of posts) {
            const dayMatch = post.slug.match(/day-(\d+)/);
            if (!dayMatch) continue;

            const dayNum = parseInt(dayMatch[1]);
            console.log(`Processing: ${post.title} (Day ${dayNum})`);

            if (dayNum === 1) {
                // Keep Day 1 published
                console.log(`  ✓ Day 1 stays published`);
            } else {
                // Unpublish Days 2-12
                try {
                    await api.posts.edit({
                        id: post.id,
                        status: 'draft',
                        updated_at: post.updated_at
                    });
                    console.log(`  ✓ Unpublished Day ${dayNum}`);
                } catch (e) {
                    console.log(`  - Error unpublishing Day ${dayNum}: ${e.message}`);
                }
            }
        }

        console.log('\n✅ Done! Refresh the homepage to see the changes.');
    } catch (error) {
        console.error('Error:', error);
    }
}

updatePosts();
