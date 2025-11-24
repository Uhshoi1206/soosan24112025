# Quick CMS Reference

## Truy Cập CMS

- **Local**: `http://localhost:4321/loivao`
- **Production**: `https://soosan24112025.netlify.app/loivao`

## 3 Collections

### 1. Danh Mục (Categories)
- File location: `src/content/categories/`
- Format: JSON
- Slug: `{{slug}}.json`

**Sau khi tạo category mới**, cần update 2 files:
1. `src/config/categoryVisibility.ts`
2. `public/loivao/config.yml`

→ Xem chi tiết: `QUICK_START.md`

### 2. Sản Phẩm (Products)
- File location: `src/content/products/`
- Format: JSON
- Slug: `{{id}}.json`
- Current: 43 products

**Loại xe available**:
- xe-tai (Xe Tải)
- xe-cau (Xe Cẩu)
- mooc (Sơ Mi Rơ Mooc)
- dau-keo (Xe Đầu Kéo)
- xe-lu (Xe Lu)

### 3. Bài Viết (Blog)
- File location: `src/content/blog/`
- Format: Markdown with frontmatter
- Slug: `{{slug}}.md`
- Current: 26 posts

**Categories available**:
- industry-news (Tin Tức Ngành)
- product-review (Đánh Giá Xe)
- driver-tips (Kinh Nghiệm Lái Xe)
- maintenance (Bảo Dưỡng)
- buying-guide (Tư Vấn Mua Xe)
- technology (Công Nghệ & Đổi Mới)

## Workflow

```
1. CMS Edit → 2. Git Commit → 3. Netlify Build → 4. Live Update
```

## Important Fields

### Products
- `id`: Unique identifier (slug format)
- `type`: MUST match categories
- `isHidden`: Toggle visibility
- `isNew`: Show "Mới" badge
- `isHot`: Show "Hot" badge

### Blog Posts
- `slug`: URL path
- `publishDate`: Unix timestamp
- `isHidden`: Toggle visibility

### Categories
- `id`: MUST match `slug`
- `isHidden`: Toggle visibility
- `order`: CMS sorting only (not website)

## Common Tasks

### Add New Product
1. CMS → Sản Phẩm → New
2. Fill required fields
3. Save → Auto commit

### Edit Product
1. CMS → Sản Phẩm → Select item
2. Edit fields
3. Save → Auto commit

### Hide Product
1. Select product
2. Toggle "Ẩn" = true
3. Save

### Add Blog Post
1. CMS → Bài Viết → New
2. Write in markdown editor
3. Add images
4. Save

## Tips

### Images
- Auto upload to: `public/assets/uploads/`
- Use relative URLs: `/assets/uploads/filename.jpg`

### Markdown Syntax
```markdown
# Heading 1
## Heading 2
**bold** *italic*
[link](url)
![image](/assets/uploads/img.jpg)
```

### Product Images
- Add multiple images via "Ảnh Sản Phẩm" list
- First image = thumbnail if no thumbnailUrl

## Troubleshooting

### Can't Login
→ Check `NETLIFY_OAUTH_SETUP.md`

### Changes Not Showing
→ Wait 2-3 mins for Netlify build

### Error After Save
→ Check Git commit log
→ Verify file format

## Files Modified by CMS

```
src/content/
├── categories/*.json    ← Category edits
├── products/*.json      ← Product edits
└── blog/*.md           ← Blog post edits

public/assets/uploads/  ← Image uploads
```

## Notes

- All changes create Git commits
- Commits include user email
- Full audit trail in Git history
- Can rollback via Git
- No database needed
- All content in GitHub
