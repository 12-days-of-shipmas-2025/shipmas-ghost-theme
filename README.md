# Shipmas Ghost Theme

A Ghost theme for running your own **12 Days of Shipmas** - an advent-style challenge to ship 12 projects in 12 days during the holiday season.

![Ghost](https://img.shields.io/badge/Ghost-%3E%3D5.0.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

**[Live Demo](https://humanwritten.ai)** | **[Download Theme](https://github.com/12-days-of-shipmas-2025/day-1-shipmas-ghost-theme/releases/download/v1.0.0/shipmas-theme.zip)** | **[Download Starter Content](https://github.com/12-days-of-shipmas-2025/day-1-shipmas-ghost-theme/releases/download/v1.0.0/ghost-starter-content.json)**

## What is 12 Days of Shipmas?

Inspired by Apple's discontinued 12 Days of Christmas giveaway, 12 Days of Shipmas is a challenge to ship something new every day for 12 days. Document your journey, share what you build, and inspire others to ship.

This theme provides everything you need:
- A beautiful 12-day countdown grid on your homepage
- Pre-configured pages and posts ready to customize
- Automatic date handling (shows Dec-Jan, hides after Jan 31)
- Dark mode with festive snowflake animations

## Quick Start (5 minutes)

### 1. Get Ghost Hosting

Sign up for [Magic Pages](https://www.magicpages.co/?aff=1lbhnAylkQfN) - they offer a **14-day free trial**, enough time to ship all 12 days.

### 2. Import the Theme

1. Download [`shipmas-theme.zip`](https://github.com/12-days-of-shipmas-2025/day-1-shipmas-ghost-theme/releases/download/v1.0.0/shipmas-theme.zip)
2. Go to Ghost Admin → **Settings → Design → Change theme → Upload**
3. Upload and activate the theme

### 3. Import Starter Content

1. Download [`ghost-starter-content.json`](https://github.com/12-days-of-shipmas-2025/day-1-shipmas-ghost-theme/releases/download/v1.0.0/ghost-starter-content.json)
2. Go to Ghost Admin → **Settings → Import/Export → Import**
3. Upload the JSON file

**Let us know you're shipping on <a href="https://x.com/humanwritten_" target="_blank">X</a>!**

That's it! Your site now has:
- Welcome intro post
- 12 Days page template
- About page explaining the project
- 12 draft posts (Day 1-12) ready to edit and publish
- All required tags pre-configured

## Publishing Your Days

Each day, edit and publish the corresponding draft:

1. Go to **Posts** → Find "Day X: [Your Project Title]"
2. Update the title with your project name
3. Add your content (what you built, lessons learned)
4. Add a feature image (**16:9 ratio** recommended, e.g. 1600×900px)
5. **Publish**

The grid automatically updates - published days show your content, unpublished days show "Coming Soon" with a lock icon.

## Features

| Feature | Description |
|---------|-------------|
| **12-Day Grid** | Beautiful card grid showing all 12 days |
| **Auto Date Handling** | Shows Dec-Jan, auto-hides after Jan 31 |
| **Dark Mode** | Toggle with sun/moon button (dark by default) |
| **Snowflakes** | Festive falling animation (seasonal) |
| **Responsive** | Works on all devices |
| **Subscribe Forms** | Built-in email capture |

## Image Sizes

| Location | Recommended Size | Aspect Ratio |
|----------|------------------|--------------|
| Day Cards (Feature Images) | 1600 × 900px | 16:9 |
| Post Headers | 1600 × 900px | 16:9 |
| OG/Social Images | 1200 × 630px | ~16:9 |

## Customization

### Site Branding

In Ghost Admin → **Settings → Design → Brand**:
- Upload your logo
- Set your accent color (used for buttons, links, day badges)
- Configure site title and description

### Navigation

In Ghost Admin → **Settings → Navigation**:
- Add links to 12 Days (`/12-days/`), About (`/about/`)

### Edit Pre-Made Pages

The starter content includes pages you can customize:
- **About** (`/about/`) - Explains 12 Days of Shipmas to visitors
- **12 Days** (`/12-days/`) - Dedicated grid page

## How It Works

The theme uses Ghost tags to organize content:

| Tag | Purpose |
|-----|---------|
| `12-days-of-shipmas` | Main tag for all day posts |
| `shipmas-intro` | Welcome/intro post shown above grid |
| `day-1` through `day-12` | Controls grid ordering |

Posts are fetched by their `day-X` tag to ensure Day 1 always appears first regardless of publish date.

## Year-Over-Year Usage

The theme works every year without changes:
- **December**: Shipmas section appears
- **January**: Still visible through Jan 31
- **February onwards**: Auto-hides until next December

To reuse next year:
1. Archive old posts (remove `day-X` tags or add `shipmas-archive` tag)
2. Create new posts with fresh `day-X` tags
3. The grid automatically shows the new content

## Development

```bash
# Clone and install
git clone https://github.com/12-days-of-shipmas-2025/day-1-shipmas-ghost-theme.git
cd shipmas-ghost-theme/source
npm install

# Development with live reload
npm run dev

# Build for production
npm run zip
```

## Credits

- Based on [Ghost Source Theme](https://github.com/TryGhost/Source) by Ghost Foundation
- Created by [humanwritten](https://humanwritten.ai)

## License

MIT License - see [LICENSE](LICENSE) for details.

---

Happy Shipping!
