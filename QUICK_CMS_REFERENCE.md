# Quick CMS Reference

## ⚡ Quick Start

### 1. Update GitHub Repo Info
Edit `public/loivao/config.yml`:
```yaml
backend:
  name: github
  repo: YOUR-USERNAME/YOUR-REPO-NAME  # ← Change this
  branch: main
```

### 2. Setup GitHub OAuth
1. Go to: https://github.com/settings/developers
2. Create New OAuth App
3. Set callback URL: `https://api.netlify.com/auth/done`
4. Copy Client ID & Secret

### 3. Configure Netlify
1. Netlify Dashboard → Site settings → Access control → OAuth
2. Install GitHub provider
3. Enter Client ID & Secret

### 4. Access CMS
URL: `https://your-domain.com/loivao` (NOT `/admin`)

## 📊 Content Structure

### Content Collections
- **Products**: `src/content/products/*.json` (43 files)
- **Blog Posts**: `src/content/blog/*.md` (26 files)
- **Categories**: `src/content/categories/*.json` (4 files)

### Visibility Control
All collections have `isHidden: boolean` field:
- `isHidden: false` → Content visible on website
- `isHidden: true` → Content hidden from website

## 🔧 Common Tasks

### Hide/Show Content
1. Open item in CMS
2. Toggle "Ẩn" switch
3. Save

### Add New Product
1. Click "New Sản Phẩm"
2. Fill required fields:
   - ID, name, slug, brand
   - Weight, dimensions
   - Images (upload or URL)
3. Set `isHidden: false`
4. Save

### Add New Blog Post
1. Click "New Bài Viết"
2. Fill frontmatter fields
3. Write content in Markdown
4. Set `isHidden: false`
5. Save

## 📁 File Locations

```
project/
├── public/
│   └── loivao/              # CMS Admin
│       ├── index.html       # CMS entry point
│       └── config.yml       # CMS configuration
├── src/
│   ├── content/             # All content here
│   │   ├── config.ts        # Schema definitions
│   │   ├── categories/      # Category data
│   │   ├── products/        # Product data
│   │   └── blog/            # Blog posts
│   └── utils/
│       └── contentCollections.ts  # Helper functions
└── CMS_SETUP_GUIDE.md       # Full documentation
```

## 🚨 Important Notes

1. **CMS Path**: Use `/loivao`, NOT `/admin`
2. **Local Development**: CMS won't work locally (needs GitHub OAuth)
3. **Direct File Edit**: For local changes, edit files in `src/content/` directly
4. **Migration Files**: Don't delete old data files yet - verify production first
5. **Build Command**: Always run `npm run build` after major changes

## 🔗 Useful Commands

```bash
# Development
npm run dev

# Build (always do this before deploy)
npm run build

# Preview build
npm run preview
```

## ✅ Migration Summary

**Completed:**
- ✅ 43 products migrated to JSON
- ✅ 26 blog posts migrated to Markdown
- ✅ 4 categories created
- ✅ Sveltia CMS configured at `/loivao`
- ✅ Content Collections schema defined
- ✅ Frontend refactored to use `getCollection()`
- ✅ Visibility logic integrated with `isHidden` field
- ✅ Build successful (9.6MB output)

**Next Steps:**
1. Update `config.yml` with your GitHub repo
2. Setup GitHub OAuth App
3. Configure Netlify OAuth
4. Deploy to Netlify
5. Access CMS at `/loivao`
6. Test adding/editing content
7. After verification, clean up old data files

## 📖 Full Documentation

See `CMS_SETUP_GUIDE.md` for complete setup instructions and troubleshooting.
