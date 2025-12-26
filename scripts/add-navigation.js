const GhostAdminAPI = require('@tryghost/admin-api');

const api = new GhostAdminAPI({
    url: process.env.GHOST_URL || 'http://localhost:2368',
    key: process.env.GHOST_ADMIN_API_KEY || '694e986c2f52c20001abe41e:e66474412b2c79ea6e40d6e1ef02cc724aa1779520e3a1105ae5c9211cc85c79',
    version: 'v5.0'
});

async function addNavigation() {
    console.log('Adding participants page to navigation...\n');

    try {
        // First, publish the participants page if it's still a draft
        const pages = await api.pages.browse({ filter: 'slug:12-days-of-shipmas' });

        if (pages.length > 0) {
            const page = pages[0];
            if (page.status === 'draft') {
                await api.pages.edit({
                    id: page.id,
                    status: 'published',
                    updated_at: page.updated_at
                });
                console.log('✓ Published participants page');
            } else {
                console.log('✓ Participants page already published');
            }
        } else {
            console.log('⚠ Participants page not found - run create-participants-page.js first');
            return;
        }

        // Get current settings
        const settings = await api.settings.browse();
        const navSetting = settings.find(s => s.key === 'navigation');

        if (navSetting) {
            const navigation = JSON.parse(navSetting.value);

            // Check if already exists
            const exists = navigation.some(item => item.url.includes('12-days-of-shipmas'));

            if (!exists) {
                navigation.push({
                    label: 'Participants',
                    url: '/12-days-of-shipmas/'
                });

                await api.settings.edit([{
                    key: 'navigation',
                    value: JSON.stringify(navigation)
                }]);

                console.log('✓ Added "Participants" to navigation');
            } else {
                console.log('✓ Already in navigation');
            }
        }

        console.log('\n✅ Done! Check your site navigation.');

    } catch (error) {
        console.error('Error:', error.message || error);
    }
}

addNavigation();
