const GhostAdminAPI = require('@tryghost/admin-api');

const api = new GhostAdminAPI({
    url: 'http://localhost:2368',
    key: '694e986c2f52c20001abe41e:e66474412b2c79ea6e40d6e1ef02cc724aa1779520e3a1105ae5c9211cc85c79',
    version: 'v5.0'
});

async function fixIntro() {
    console.log('🎄 Fixing intro post...\n');

    try {
        // Get all posts
        const posts = await api.posts.browse({ limit: 'all' });

        for (const post of posts) {
            // Fix the intro post date
            if (post.slug === 'welcome-12-days-shipmas') {
                console.log('Updating intro post...');
                await api.posts.edit({
                    id: post.id,
                    custom_excerpt: "From December 26th to January 5th, we're shipping one new product every single day!",
                    updated_at: post.updated_at
                });
                console.log('  ✓ Fixed intro excerpt');
            }

            // Unpublish the default "Coming soon" post
            if (post.slug === 'coming-soon' && post.status === 'published') {
                console.log('Unpublishing default "Coming soon" post...');
                await api.posts.edit({
                    id: post.id,
                    status: 'draft',
                    updated_at: post.updated_at
                });
                console.log('  ✓ Unpublished default post');
            }
        }

        console.log('\n✅ Done!');
    } catch (error) {
        console.error('Error:', error);
    }
}

fixIntro();
