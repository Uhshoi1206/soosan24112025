# ✅ CMS Setup Checklist

## Trạng Thái Hiện Tại

### ✅ Đã Hoàn Thành
- [x] Content Collections đã được tạo (products, blog, categories)
- [x] 43 products đã migrate sang JSON
- [x] 26 blog posts đã migrate sang Markdown
- [x] 4 categories đã được tạo
- [x] Sveltia CMS đã cài đặt tại `/loivao`
- [x] Config đã được cập nhật với repo GitHub
- [x] Lỗi "object widget" đã được sửa
- [x] Config đã được cập nhật với Netlify OAuth
- [x] Build thành công (118 pages)

### ⏳ Cần Làm Ngay (Setup OAuth)

**Bước 1: Enable Netlify Identity**
```
1. Truy cập: https://app.netlify.com/sites/soosan24112025
2. Settings → Identity
3. Click "Enable Identity"
```

**Bước 2: Tạo GitHub OAuth App**
```
1. Truy cập: https://github.com/settings/developers
2. New OAuth App
3. Điền:
   - Name: Sveltia CMS - Soosan Motor
   - Homepage: https://soosan24112025.netlify.app
   - Callback: https://api.netlify.com/auth/done
4. Copy Client ID và Secret
```

**Bước 3: Cấu Hình OAuth trong Netlify**
```
1. Netlify Identity → External providers
2. Add provider → GitHub
3. Nhập Client ID và Secret
4. Save
```

**Bước 4: Deploy**
```bash
git add .
git commit -m "Configure CMS with Netlify OAuth"
git push
```

**Bước 5: Test CMS**
```
1. Truy cập: https://soosan24112025.netlify.app/loivao
2. Click "Login with GitHub"
3. Authorize
4. Vào dashboard và test thêm/sửa content
```

## Cấu Hình Hiện Tại

**Repository**: `Uhshoi1206/soosan24112025`
**Branch**: `main`
**CMS URL**: `https://soosan24112025.netlify.app/loivao`
**Site Domain**: `soosan24112025.netlify.app`

## Files Quan Trọng

```
public/loivao/
├── index.html          ← CMS entry point
└── config.yml          ← CMS configuration (UPDATED)

src/content/
├── config.ts           ← Content schema
├── categories/         ← 4 categories
├── products/           ← 43 products
└── blog/               ← 26 blog posts
```

## Hướng Dẫn Chi Tiết

Xem file `NETLIFY_OAUTH_SETUP.md` để có hướng dẫn đầy đủ từng bước.

## Kiểm Tra Nhanh

Sau khi setup OAuth xong, test các tính năng:

- [ ] Login được vào CMS
- [ ] Thấy 3 collections (Danh Mục, Sản Phẩm, Bài Viết)
- [ ] Xem được danh sách items
- [ ] Thêm được sản phẩm mới
- [ ] Edit được bài viết
- [ ] Toggle được isHidden
- [ ] Upload được hình ảnh
- [ ] Save tạo commit trên GitHub
- [ ] Netlify auto-deploy sau commit
- [ ] Website cập nhật với nội dung mới

## Troubleshooting

### CMS không load
→ Clear cache và hard reload (Ctrl+Shift+R)

### Login redirect về "Page not found"
→ Check Netlify Identity đã enable chưa
→ Check OAuth App callback URL đúng chưa

### Không thấy content
→ Check GitHub permissions
→ Check repo name đúng trong config.yml

### Save bị lỗi
→ Check user có quyền write vào repo
→ Check branch name đúng chưa

## Links Hữu Ích

- Netlify Dashboard: https://app.netlify.com/sites/soosan24112025
- GitHub Repo: https://github.com/Uhshoi1206/soosan24112025
- GitHub OAuth Apps: https://github.com/settings/developers
- CMS Admin: https://soosan24112025.netlify.app/loivao

## Ước Tính Thời Gian

- Enable Identity: 1 phút
- Create OAuth App: 2 phút
- Configure Netlify: 2 phút
- Deploy: 3-5 phút
- Test: 5 phút

**Tổng**: ~15 phút để CMS hoạt động hoàn chỉnh

## Sau Khi Setup

Khi CMS đã hoạt động:

1. Train người dùng cách sử dụng CMS
2. Xóa files cũ trong `src/data/` (sau 1-2 tuần verify)
3. Setup branch protection rules nếu có nhiều người dùng
4. Backup repository thường xuyên

---

**Status**: ⏳ Chờ OAuth setup để hoàn tất

**Next action**: Follow `NETLIFY_OAUTH_SETUP.md`
