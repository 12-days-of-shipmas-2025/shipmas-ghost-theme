# Shipmas Ghost Theme - Developer Guide

## Overview

A Ghost CMS theme for "12 Days of Shipmas" advent-style content. Based on Ghost's Source theme with custom 12-day countdown grid, dark mode, and festive snowflake animations.

**Live site:** https://shipmas.mymagic.page

## Quick Commands

```bash
# Development
cd source && npm run dev     # Start dev server with live reload
cd source && npm run zip     # Build theme zip for upload

# Deployment (from repo root)
GHOST_ADMIN_API_KEY="key" GHOST_URL="https://site.ghost.io" node deploy.js
```

## Architecture

### Template Hierarchy

```
default.hbs                    # Master layout (includes snowflakes, nav, footer)
├── home.hbs                   # Homepage: intro + 12-day grid + posts feed
├── index.hbs                  # Standalone 12-day grid page (used by custom-12-days.hbs)
├── custom-12-days.hbs         # Dedicated /12-days/ page template
├── custom-blog.hbs            # All posts listing (no shipmas content)
├── post.hbs                   # Single post article
├── page.hbs                   # Static pages
├── author.hbs                 # Author archives
└── tag.hbs                    # Tag archives
```

### Key Partials

| Partial | Purpose |
|---------|---------|
| `partials/snowflakes.hbs` | Festive falling snowflakes animation |
| `partials/shipmas/intro.hbs` | Welcome section with subscribe form |
| `partials/shipmas/grid.hbs` | 12-day card grid (fetches by day-X tags) |
| `partials/shipmas/script.hbs` | JavaScript for locked/coming-soon cards |
| `partials/components/navigation.hbs` | Header with dark mode toggle |
| `partials/post-card.hbs` | Reusable post card component |

## Ghost Handlebars Limitations

### Why grid.hbs Has 12 Duplicate Blocks

Ghost's `{{#get}}` helper requires **literal filter strings** - you cannot dynamically interpolate values:

```handlebars
{{!-- THIS DOES NOT WORK --}}
{{#each (range 1 12)}}
    {{#get "posts" filter="tag:day-{{this}}"}}  {{!-- INVALID --}}
{{/each}}

{{!-- REQUIRED APPROACH: Explicit blocks for each day --}}
{{#get "posts" filter="tag:day-1" limit="1"}}...{{/get}}
{{#get "posts" filter="tag:day-2" limit="1"}}...{{/get}}
{{!-- ... repeated 12 times --}}
```

This is a Ghost platform constraint, not a code quality issue. Each `{{#get}}` block is necessary.

### Tag-Based Ordering

Posts are fetched by explicit `day-X` tags rather than creation order because:
1. Ghost's default ordering is by publish date (newest first)
2. We need Day 1 before Day 2, regardless of when they were published
3. Authors may publish days out of order or backdate posts

## Date Auto-Calculation

The shipmas section and snowflakes automatically hide after January 31st. The end date is **auto-calculated** - no manual updates needed year-over-year:

```javascript
// In home.hbs, index.hbs, and snowflakes.hbs
const now = new Date();
const shipmasYear = now.getMonth() >= 11 ? now.getFullYear() + 1 : now.getFullYear();
const SHIPMAS_END_DATE = new Date(shipmasYear, 0, 31, 23, 59, 59);
```

**Logic:**
- December (month 11): Use next year's Jan 31 (Dec 2025 → Jan 31, 2026)
- Jan-Nov: Use current year's Jan 31
- Works forever without code changes

## Tag Strategy

### Required Tags

| Tag | Slug | Purpose |
|-----|------|---------|
| 12 Days of Shipmas | `12-days-of-shipmas` | Main shipmas posts |
| Shipmas Intro | `shipmas-intro` | Welcome/intro post |
| Day 1-12 | `day-1` through `day-12` | Individual day ordering |

### Year-over-Year Operation

Tags are **reused each year** (not year-specific like `day-1-2025`):

1. After Jan 31, archive previous year's posts:
   - Remove `day-X` tags, OR
   - Add `shipmas-archive` tag
2. Create new posts with the same generic tags
3. Theme auto-shows new content

This approach works because:
- Ghost Handlebars can't dynamically filter by year
- The date logic auto-hides the section anyway
- Old posts remain in the blog, just not in the grid

## CSS Architecture

Main stylesheet: `source/assets/css/screen.css` (~4,200 lines)

### Key Sections

| Lines | Section |
|-------|---------|
| 1-100 | CSS Variables & Reset |
| 100-1000 | Ghost Core Styles |
| 1000-3000 | Components (cards, buttons, forms) |
| 3351-3600 | Shipmas Grid Styles |
| 4100-4180 | Snowflake Animation |

### Shipmas-Specific Variables

```css
/* Snowflake color */
.snowflake { color: #6bb8d6; }  /* Icy blue */

/* Card locked state */
.shipmas-card.locked { opacity: 0.6; cursor: not-allowed; }
```

## JavaScript Architecture

All JS uses IIFE pattern for encapsulation:

```javascript
(function() {
    // Module code here
})();
```

### Files

| File | Purpose |
|------|---------|
| `main.js` | Page initialization, imports other modules |
| `dropdown.js` | Mobile navigation menu |
| `pagination.js` | Infinite scroll for post feeds |
| `lightbox.js` | Image gallery (uses PhotoSwipe) |

### Theme Toggle

```javascript
// In default.hbs
window.toggleTheme = function() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('shipmas-theme', isDark ? 'dark' : 'light');
};
```

## Deployment

### Using deploy.js

```bash
# Set environment variables
export GHOST_ADMIN_API_KEY="id:secret"
export GHOST_URL="https://yoursite.ghost.io"

# Build and deploy
cd source && npm run zip
cd .. && node deploy.js
```

The script:
1. Generates a JWT token from the API key
2. Uploads the theme zip
3. Activates the theme

### API Key Format

Ghost Admin API keys are in format: `{id}:{secret}`
- Get from Ghost Admin → Settings → Integrations → Add Custom Integration

## Common Tasks

### Adding a New Day Post

1. Create post in Ghost Admin
2. Add tags: `12-days-of-shipmas` + `day-X` (where X is 1-12)
3. Add feature image (800x600 recommended)
4. Publish

### Hiding Shipmas Section Early

Add `?all=true` to URL to hide the 12-day section and show all posts.

### Changing Snowflake Colors

Edit `source/assets/css/screen.css` line ~4145:
```css
.snowflake { color: #6bb8d6; }  /* Change this hex value */
```

### Adding New Snowflake Characters

Edit `source/partials/snowflakes.hbs`:
```javascript
const snowflakeChars = ['❄', '❅', '❆', '✦', '✧', '*', '⁕', '⁑'];
```

## File Locations Reference

| Need to change... | Edit this file |
|-------------------|----------------|
| Header/navigation | `partials/components/navigation.hbs` |
| Footer | `partials/components/footer.hbs` |
| Homepage layout | `home.hbs` |
| 12-day grid cards | `partials/shipmas/grid.hbs` |
| Snowflakes animation | `partials/snowflakes.hbs` |
| Locked card logic | `partials/shipmas/script.hbs` |
| Post card design | `partials/post-card.hbs` |
| All styles | `assets/css/screen.css` |
| Theme metadata | `package.json` |

## Troubleshooting

### Snowflakes Not Showing

1. Check date - hidden after Jan 31
2. Check URL - hidden with `?all=true`
3. Check CSS - `.snowflakes` requires `position: fixed`

### Day Cards Not Appearing

1. Verify post has **both** tags: `12-days-of-shipmas` AND `day-X`
2. Check post is published (not draft)
3. Clear Ghost cache if using CDN

### Dark Mode Not Persisting

Check localStorage: `localStorage.getItem('shipmas-theme')`
Should be `'dark'` or `'light'`

## Credits

- Based on [Ghost Source Theme](https://github.com/TryGhost/Source)
- Created by [Human Written](https://humanwritten.ai)
- MIT License
