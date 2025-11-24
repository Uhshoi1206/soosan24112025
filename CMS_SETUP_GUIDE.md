# Hướng Dẫn Cấu Hình Sveltia CMS

## Tổng Quan

Website đã được chuyển đổi hoàn toàn sang sử dụng **Astro Content Collections** và **Sveltia CMS** để quản lý nội dung.

### Những Gì Đã Thay Đổi

1. **Dữ liệu được lưu trữ dưới dạng file**:
   - Sản phẩm: `src/content/products/*.json` (43 sản phẩm)
   - Bài viết: `src/content/blog/*.md` (26 bài viết)
   - Danh mục: `src/content/categories/*.json` (4 danh mục)

2. **Admin Dashboard**:
   - Đường dẫn: `/loivao` (KHÔNG phải `/admin`)
   - Giao diện quản lý: Sveltia CMS

3. **Tính năng ẩn/hiện**:
   - Tất cả collection đều có field `isHidden: boolean`
   - Khi `isHidden = true`, nội dung sẽ không hiển thị trên website
   - Thay thế hoàn toàn `src/config/categoryVisibility.ts`

## Cấu Hình GitHub Backend

### Bước 1: Cập Nhật config.yml

Mở file `public/loivao/config.yml` và cập nhật thông tin GitHub repository:

```yaml
backend:
  name: github
  repo: your-username/your-repo-name  # ← Thay đổi tại đây
  branch: main                         # ← Thay đổi branch nếu cần
  site_domain: ""
  base_url: ""
```

Ví dụ:
```yaml
backend:
  name: github
  repo: johndoe/truck-dealership
  branch: main
  site_domain: ""
  base_url: ""
```

### Bước 2: Tạo OAuth App trên GitHub

1. Truy cập: https://github.com/settings/developers
2. Nhấn "New OAuth App"
3. Điền thông tin:
   - **Application name**: `Sveltia CMS - Soosan Motor`
   - **Homepage URL**: `https://your-domain.com` (hoặc URL Netlify của bạn)
   - **Authorization callback URL**: `https://api.netlify.com/auth/done`
4. Nhấn "Register application"
5. Copy **Client ID**

### Bước 3: Cấu Hình trên Netlify

1. Truy cập Netlify Dashboard của bạn
2. Vào **Site settings** → **Access control** → **OAuth**
3. Nhấn "Install provider"
4. Chọn **GitHub**
5. Nhập **Client ID** và **Client Secret** từ GitHub OAuth App

### Bước 4: Cập Nhật config.yml với Netlify Identity (Tùy chọn)

Nếu bạn muốn sử dụng Netlify Identity thay vì GitHub trực tiếp, cập nhật:

```yaml
backend:
  name: github
  repo: your-username/your-repo-name
  branch: main
  site_domain: "your-site.netlify.app"
  base_url: "https://api.netlify.com"
```

## Truy Cập CMS

1. Sau khi deploy lên Netlify
2. Truy cập: `https://your-domain.com/loivao`
3. Đăng nhập bằng GitHub account của bạn
4. Bắt đầu quản lý nội dung!

## Cấu Trúc Nội Dung

### 1. Danh Mục (Categories)

```json
{
  "id": "xe-tai",
  "name": "Xe Tải",
  "slug": "xe-tai",
  "description": "Các dòng xe tải từ nhẹ đến nặng",
  "keywords": ["xe tải", "truck", "tải trọng"],
  "isHidden": false,
  "order": 1
}
```

**Quản lý hiển thị**: Đặt `isHidden: true` để ẩn toàn bộ danh mục.

### 2. Sản Phẩm (Products)

Sản phẩm được lưu dưới dạng JSON với đầy đủ thông tin:
- Thông tin cơ bản (tên, giá, hãng)
- Kích thước và trọng tải
- Hình ảnh
- Thông số kỹ thuật chi tiết

**Quản lý hiển thị**: Đặt `isHidden: true` để ẩn sản phẩm khỏi website.

### 3. Bài Viết (Blog)

Bài viết sử dụng Markdown với frontmatter:

```markdown
---
id: "my-blog-post"
title: "Tiêu đề bài viết"
slug: "tieu-de-bai-viet"
description: "Mô tả ngắn"
category: "industry-news"
images: ["url-to-image.jpg"]
publishDate: 1763473302201
readTime: 8
author: "Tác giả"
tags: ["tag1", "tag2"]
isHidden: false
---

Nội dung bài viết ở đây...
```

**Quản lý hiển thị**: Đặt `isHidden: true` để ẩn bài viết.

## Các Tính Năng CMS

### 1. Thêm Mới
- Nhấn "New [Collection Name]"
- Điền thông tin
- Nhấn "Save"

### 2. Chỉnh Sửa
- Chọn item từ danh sách
- Chỉnh sửa thông tin
- Nhấn "Save"

### 3. Xóa
- Chọn item
- Nhấn "Delete"
- Xác nhận

### 4. Sao Chép (Clone)
- Chọn item
- Nhấn "Duplicate"
- Chỉnh sửa và lưu

### 5. Ẩn/Hiện
- Mở item
- Toggle switch "Ẩn"
- Lưu lại

## Làm Việc Với Hình Ảnh

### Upload Hình Ảnh

Hình ảnh được lưu tại: `public/assets/uploads/`

Trong CMS:
1. Chọn field hình ảnh
2. Nhấn "Choose image"
3. Upload hoặc chọn từ Media Library

### Sử Dụng URL Trực Tiếp

Bạn cũng có thể nhập URL hình ảnh trực tiếp (từ CDN, Unsplash, v.v.):
```
https://images.unsplash.com/photo-xxxxx
```

## Workflow Phát Triển

### Local Development

```bash
# Chạy dev server
npm run dev

# Truy cập CMS tại:
http://localhost:4321/loivao
```

**Lưu ý**: CMS sẽ không hoạt động đúng ở local vì cần GitHub OAuth. Để test local:
1. Chỉnh sửa file trực tiếp trong `src/content/`
2. Astro sẽ tự động reload

### Production Workflow

1. Người dùng đăng nhập vào `/loivao` trên production
2. Thêm/sửa/xóa nội dung
3. Sveltia CMS tạo commit và push lên GitHub
4. Netlify tự động build và deploy
5. Website cập nhật với nội dung mới

## Migration Hoàn Tất

### Files Đã Chuyển Đổi
- ✅ 43 sản phẩm từ TypeScript → JSON
- ✅ 26 bài viết từ TypeScript → Markdown
- ✅ 4 danh mục từ TypeScript → JSON

### Files Cũ (Có thể xóa sau khi verify)
- `src/data/products/` - Dữ liệu sản phẩm cũ
- `src/data/blog-posts/` - Dữ liệu blog cũ
- `src/config/categoryVisibility.ts` - Logic ẩn/hiện cũ

**Lưu ý**: Đừng xóa ngay! Hãy verify website hoạt động đúng trên production trước.

## Khắc Phục Sự Cố

### CMS không load
1. Kiểm tra config GitHub repo trong `config.yml`
2. Kiểm tra OAuth App đã setup đúng chưa
3. Kiểm tra Netlify OAuth provider

### Nội dung không hiển thị
1. Kiểm tra `isHidden` có đang là `true` không
2. Kiểm tra danh mục cha có bị ẩn không
3. Rebuild website

### Build thất bại
1. Kiểm tra schema trong `src/content/config.ts`
2. Kiểm tra các field bắt buộc đã điền đầy đủ chưa
3. Xem log chi tiết: `npm run build`

## Hỗ Trợ

Nếu cần hỗ trợ:
1. Kiểm tra log trong Netlify Dashboard
2. Xem documentation: https://github.com/sveltia/sveltia-cms
3. Kiểm tra Astro Content Collections: https://docs.astro.build/en/guides/content-collections/
