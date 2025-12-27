# Shipmas Ghost Theme

A Ghost theme featuring a **12 Days of Shipmas** countdown grid with dark mode support. Based on Ghost's Source theme.

![Ghost](https://img.shields.io/badge/Ghost-%3E%3D5.0.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

## Features

- **12 Days Grid** - Beautiful countdown grid for advent-style content series
- **Dark Mode** - Toggle between dark and light modes (dark by default)
- **Festive Snowflakes** - Gentle falling snowflake animation (auto-hides after Jan 31)
- **Auto Date Handling** - 12 Days section automatically hides after January 31st each year
- **Custom Page Templates** - Blog (all posts) and 12 Days dedicated pages
- **Responsive Design** - Mobile-first, works on all devices
- **Subscribe Integration** - Built-in email subscription forms

## Try It Free with Magic Pages

Want to run your own 12 Days of Shipmas? **[Magic Pages](https://www.magicpages.co/?ref=humanwritten.ai)** offers a **14-day free trial** for Ghost hosting - enough time to ship all 12 days!

1. Sign up at [magicpages.co](https://www.magicpages.co/?ref=humanwritten.ai) (no credit card required)
2. Fork this repo and upload the theme
3. Start shipping!

Magic Pages handles all the Ghost infrastructure so you can focus on building and writing.

## Installation

1. Download or clone this repository
2. Zip the `source` folder (or use `npm run zip`)
3. Upload to Ghost Admin: **Settings → Design → Change theme → Upload**

## Ghost Admin Setup

After installing the theme, complete these steps in Ghost Admin:

### 1. Create Required Tags

| Tag Name | Slug | Purpose |
|----------|------|---------|
| 12 Days of Shipmas | `12-days-of-shipmas` | Tag for each day's post |
| Shipmas Intro | `shipmas-intro` | Tag for the intro/welcome post |

### 2. Create the Intro Post

1. Go to **Posts → New Post**
2. Write your welcome/intro content
3. Add the tag `shipmas-intro`
4. Publish

### 3. Create Day Posts

For each day (1-12):
1. Create a new post
2. Add the tag `12-days-of-shipmas`
3. Add a feature image (recommended: **800 × 600px** or 4:3 ratio)
4. Publish in order (Day 1 first, Day 2 second, etc.)

Posts will automatically appear in the grid. Unpublished days show as "Coming Soon" with a lock icon.

### 4. Create Custom Pages (Optional)

#### Blog Page (All Posts)
1. Go to **Pages → New Page**
2. Title: "Blog" (slug will be `blog`)
3. Click gear icon → **Template** → Select "Blog - All Posts"
4. Publish

#### 12 Days Page (Dedicated Grid)
1. Go to **Pages → New Page**
2. Title: "12 Days of Shipmas" (slug: `12-days`)
3. Click gear icon → **Template** → Select "12 Days of Shipmas"
4. Publish

### 5. Update Navigation

Go to **Settings → Navigation** and add:

| Label | URL |
|-------|-----|
| Blog | `/blog/` |
| 12 Days | `/12-days/` |

## Configuration

### Date Handling (Automatic)

The 12 Days section and snowflakes automatically hide after January 31st each year. **No manual configuration needed** - the end date is auto-calculated:

- In December: Shows until January 31st of the following year
- In January: Shows until January 31st of the current year
- February onwards: Hidden until next December

This logic is in `home.hbs`, `index.hbs`, and `partials/snowflakes.hbs`:

```javascript
// Auto-calculate: Dec uses next year, otherwise current year
const shipmasYear = now.getMonth() >= 11 ? now.getFullYear() + 1 : now.getFullYear();
const SHIPMAS_END_DATE = new Date(shipmasYear, 0, 31, 23, 59, 59);
```

### Manual Override

To hide the 12 Days section early, add `?all=true` to any URL.

### Feature Image Sizes

| Location | Recommended Size | Aspect Ratio |
|----------|------------------|--------------|
| Day Cards | 800 × 600px | 4:3 |
| Post Headers | 1600 × 900px | 16:9 |

### Dark Mode

Dark mode is enabled by default. Users can toggle using the sun/moon button in the header. The preference is saved to localStorage.

## File Structure

```
source/
├── assets/
│   ├── css/
│   │   └── screen.css          # Main stylesheet
│   └── built/
│       └── screen.css          # Compiled CSS
├── partials/
│   ├── components/
│   │   ├── navigation.hbs      # Header with theme toggle
│   │   └── footer.hbs          # Footer
│   ├── shipmas/
│   │   ├── grid.hbs            # 12 Days card grid
│   │   ├── intro.hbs           # Welcome section
│   │   └── script.hbs          # Locked cards JS
│   └── snowflakes.hbs          # Festive animation
├── home.hbs                    # Homepage with 12 Days grid
├── custom-blog.hbs             # All posts template
├── custom-12-days.hbs          # Dedicated 12 Days template
├── default.hbs                 # Base layout
├── index.hbs                   # Default post listing
├── post.hbs                    # Single post template
├── page.hbs                    # Single page template
└── package.json                # Theme configuration
```

## Customization

### Theme Settings

Access via **Ghost Admin → Settings → Design → Site design**:

- Navigation layout (Logo position)
- Site background color
- Title font
- Body font
- Post feed style (List/Grid)

### CSS Variables

Key variables in `screen.css`:

```css
/* Colors */
--background-color: #0d0d0d;
--color-primary-text: #ffffff;
--color-secondary-text: rgba(255, 255, 255, 0.65);
--ghost-accent-color: /* Set in Ghost Admin */

/* Typography */
--font-sans: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
```

## Development

```bash
# Install dependencies
npm install

# Start development server with live reload
npm run dev

# Build for production
npm run zip
```

## Quick Start: Demo Content

To quickly test the theme, create this minimal content in Ghost Admin:

### Minimum Required Content

1. **Intro Post** (1 post)
   - Title: "Welcome to 12 Days of Shipmas"
   - Tag: `shipmas-intro`
   - Add some welcome text and publish

2. **Day Posts** (at least 1-2 for testing)
   - Title: "Day 1: Your First Ship"
   - Tag: `12-days-of-shipmas`
   - Feature image: Any 800×600px image
   - Publish

3. **Blog Page** (optional)
   - Create Page with slug `blog`
   - Select template "Blog - All Posts"

### Sample Post Content

```markdown
# Day 1: Project Name

Brief description of what you shipped today.

## What We Built
- Feature 1
- Feature 2

## Lessons Learned
Share your insights here.
```

## Image Generation (Future)

This theme is designed to work with automated image generation tools.

### Recommended Image Specs

| Use Case | Size | Format | Notes |
|----------|------|--------|-------|
| Day Cards | 800 × 600px | PNG/WebP | 4:3 ratio, works with `background-size: contain` |
| Post Headers | 1600 × 900px | PNG/WebP | 16:9 ratio |
| OG Images | 1200 × 630px | PNG | For social sharing |

### MCP Server Integration (Planned)

Future versions will support an MCP (Model Context Protocol) server for:
- Automated feature image generation based on post title/content
- Consistent visual style across all day cards
- AI-generated illustrations matching the "shipmas" theme

See the [12-days-of-shipmas-2025](https://github.com/12-days-of-shipmas-2025) organization for related tools.

## Credits

- Based on [Ghost Source Theme](https://github.com/TryGhost/Source) by Ghost Foundation
- Created by [Human Written](https://humanwritten.ai)

## License

MIT License - see [LICENSE](LICENSE) file for details.

Copyright (c) 2013-2025 Ghost Foundation (original Source theme)
Copyright (c) 2025 Human Written (Shipmas modifications)

---

Made with coffee and shipping spirit.
