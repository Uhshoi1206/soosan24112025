# Soosan Motor - Truck Dealership Website

## 🚀 CMS-First Architecture

Website hoàn toàn driven bởi Sveltia CMS - **không cần sửa code** khi thêm categories, products, hoặc blog posts.

### Quick Start

```bash
# Install dependencies
npm install

# Sync categories from CMS (auto-runs before build)
npm run cms:sync

# Build
npm run build

# Dev server
npm run dev
```

## 📁 Content Management

### CMS Access

- **Local**: `http://localhost:4321/loivao`
- **Production**: `https://soosan24112025.netlify.app/loivao`
- **Auth**: GitHub OAuth (setup required)

### 3 Collections

1. **Danh Mục** (Categories) - Loại xe
2. **Sản Phẩm** (Products) - Chi tiết xe
3. **Bài Viết** (Blog) - Nội dung blog

### Adding New Category

1. Vào CMS → Danh Mục → New
2. Điền thông tin:
   - ID: `xe-nang`
   - Tên: `Xe Nâng`
   - Slug: `xe-nang`
   - Description, Keywords, Order
3. Save → Commit → Push
4. Netlify auto-build
5. Done! Category xuất hiện tự động

**NO CODE CHANGES NEEDED!**

## 🏗️ Architecture

### Data Flow

```
CMS (Sveltia) → GitHub (JSON/MD files) → Build Scripts → Generated Data → Website
```

### Build Process

```bash
npm run build
  ↓
prebuild: npm run cms:sync
  ↓
scripts/sync-cms-categories.mjs    # Update CMS config
scripts/generate-categories-data.mjs  # Generate static data
  ↓
astro build                        # Build website
```

### Key Files

**Source of Truth:**
- `src/content/categories/*.json` - Categories
- `src/content/products/*.json` - Products  
- `src/content/blog/*.md` - Blog posts

**Auto-Generated:**
- `src/data/generated/categories.ts` - **DO NOT EDIT**

**Scripts:**
- `scripts/sync-cms-categories.mjs`
- `scripts/generate-categories-data.mjs`

**Helpers:**
- `src/config/categoryHelpers.ts` - Server-side
- `src/utils/contentCollections.ts` - Astro content

## 📚 Documentation

- `CMS_FIX_APPLIED.md` - How CMS auto-sync works
- `QUICK_START.md` - Adding new categories guide
- `QUICK_CMS_REFERENCE.md` - CMS operations
- `NETLIFY_OAUTH_SETUP.md` - OAuth configuration
- `CMS_READY_CHECKLIST.md` - Setup checklist

## 🛠️ Tech Stack

- **Framework**: Astro 5.x + React
- **CMS**: Sveltia CMS (file-based)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Deploy**: Netlify
- **Content**: Git-based (no database)

## 📊 Current Status

- ✅ 119 pages built
- ✅ 5 categories: xe-tai, xe-cau, mooc, dau-keo, xe-lu
- ✅ 43 products
- ✅ 26 blog posts
- ✅ 100% CMS-driven
- ✅ Auto-sync on build

## 🔐 Setup OAuth (One-time)

1. Enable Netlify Identity
2. Create GitHub OAuth App
3. Configure in Netlify
4. See `NETLIFY_OAUTH_SETUP.md` for details

## 💡 Key Features

- ✅ No database - all content in Git
- ✅ Full Git history and audit trail
- ✅ Type-safe TypeScript
- ✅ Auto-generated categories
- ✅ CMS dropdown always in sync
- ✅ Easy rollback via Git
- ✅ Fast static builds

## 🎯 Workflow

```
Edit in CMS → Save → Git Commit → Push → Netlify Build → Live!
```

**Average deploy time**: 3-5 minutes

---

**Build**: ✅ Passing  
**Last Updated**: 2025-11-24  
**CMS**: Fully Functional
