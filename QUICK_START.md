# Hướng Dẫn Nhanh: Thêm Danh Mục Mới

## Vấn Đề Bạn Gặp Phải

Khi thêm category "Xe Lu" qua Sveltia CMS (`/loivao`):
- ✅ File `src/content/categories/xe-lu.json` được tạo
- ❌ Nhưng category không hiển thị trên website

## Nguyên Nhân

Khi thêm danh mục mới, cần cập nhật **2 file config** trong code:

1. `src/config/categoryVisibility.ts` - Đăng ký category để hiển thị
2. `public/loivao/config.yml` - Thêm vào dropdown CMS

## Giải Pháp Đã Áp Dụng Cho "Xe Lu"

### 1. ✅ Đã Cập Nhật `categoryVisibility.ts`

```typescript
// Thêm vào mảng categories
{
  key: 'xe-lu',
  name: 'Xe Lu',
  enabled: true,
  keywords: ['xe lu','road roller','lu','compactor','đầm nén','lu rung']
}
```

### 2. ✅ Đã Cập Nhật CMS Config

```yaml
# Trong public/loivao/config.yml
- label: "Loại Xe"
  name: "type"
  widget: "select"
  options:
    - { label: "Xe Tải", value: "xe-tai" }
    - { label: "Xe Cẩu", value: "xe-cau" }
    - { label: "Sơ Mi Rơ Mooc", value: "mooc" }
    - { label: "Xe Đầu Kéo", value: "dau-keo" }
    - { label: "Xe Lu", value: "xe-lu" }  # ← MỚI THÊM
```

### 3. ✅ Đã Có Sẵn Type Name

File `src/models/TruckTypes.ts` đã có hỗ trợ:

```typescript
export function getVehicleTypeName(type: VehicleType): string {
  switch (type) {
    // ...
    case 'xe-lu':
      return 'Xe Lu';
    // ...
  }
}
```

## Quy Trình Thêm Danh Mục Mới

Khi muốn thêm danh mục mới (ví dụ: "Xe Nâng"), làm theo 3 bước:

### Bước 1: Tạo Category qua CMS

1. Vào `/loivao`
2. Chọn "Danh Mục" → "New Danh Mục"
3. Điền thông tin:
   - **ID**: `xe-nang`
   - **Tên**: `Xe Nâng`
   - **Slug**: `xe-nang`
   - **Description**: Mô tả ngắn
   - **Keywords**: `xe-nang, Xe Nâng, forklift`
   - **Ẩn**: `false`
   - **Thứ Tự**: `6`
4. Save

### Bước 2: Cập Nhật Code (categoryVisibility.ts)

Mở file `src/config/categoryVisibility.ts` và thêm:

```typescript
export const categories: CategoryConfig[] = [
  // ... các category hiện có
  {
    key: 'xe-nang',
    name: 'Xe Nâng',
    enabled: true,
    keywords: ['xe nâng','forklift','nâng hàng','pallet']
  }
];
```

### Bước 3: Cập Nhật CMS Config

Mở file `public/loivao/config.yml` và thêm option mới:

```yaml
options:
  # ... các option hiện có
  - { label: "Xe Nâng", value: "xe-nang" }
```

### Bước 4: Build và Deploy

```bash
npm run build
git add .
git commit -m "Add Xe Nang category"
git push
```

## Kết Quả

Sau khi hoàn tất:

- ✅ Category xuất hiện trên trang chủ
- ✅ Có trang riêng: `/danh-muc-xe/xe-nang`
- ✅ Dropdown CMS có option mới
- ✅ Có thể tạo products với type này
- ✅ Filter theo category hoạt động

## Kiểm Tra Nhanh

Để verify category đã hoạt động:

```bash
# Check category file
ls src/content/categories/xe-lu.json

# Check config
grep -A5 "key: 'xe-lu'" src/config/categoryVisibility.ts

# Check CMS config
grep "xe-lu" public/loivao/config.yml

# Build
npm run build

# Kiểm tra số pages (phải tăng 1)
# Nếu có n categories → sẽ có n pages ở /danh-muc-xe/[slug]
```

## Lưu Ý Quan Trọng

### 1. Key Phải Nhất Quán

```
✅ Đúng:
- Category file: xe-lu.json
- ID trong JSON: "xe-lu"
- Key trong config: 'xe-lu'
- Value trong CMS: "xe-lu"

❌ Sai:
- Category file: xe-lu.json
- ID trong JSON: "Xe Lu"  // ← SAI, phải dùng slug
```

### 2. Enabled = true

Nếu set `enabled: false` trong `categoryVisibility.ts`, category sẽ bị ẩn khỏi:
- Trang chủ
- Menu
- Danh sách filter

### 3. Order Field

Field `order` trong category JSON chỉ dùng để sắp xếp trong CMS, không ảnh hưởng đến thứ tự hiển thị trên website.

Thứ tự hiển thị được quyết định bởi thứ tự trong mảng `categories` của `categoryVisibility.ts`.

## Architecture Flow

```
┌─────────────────────────────────────────────────────────┐
│ USER ACTION: Tạo category qua CMS                       │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ CMS tạo file: src/content/categories/xe-lu.json        │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ PROBLEM: Code chưa biết category mới                    │
│ ❌ categoryVisibility.ts không có 'xe-lu'              │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ SOLUTION: Dev cập nhật 2 files                         │
│ 1. categoryVisibility.ts → Thêm config                 │
│ 2. config.yml → Thêm CMS option                        │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ BUILD: Astro generate pages                            │
│ ✅ /danh-muc-xe/xe-lu                                 │
│ ✅ Category hiển thị trên homepage                     │
└─────────────────────────────────────────────────────────┘
```

## Tại Sao Phải Có 2 Bước?

### Tại Sao Không Tự Động?

**Lý do 1: Type Safety**
- TypeScript cần biết trước các category types
- Không thể dynamic import trong build time

**Lý do 2: Control**
- Dev có thể enable/disable category
- Có thể customize keywords cho từng category
- Có thể sắp xếp thứ tự hiển thị

**Lý do 3: CMS Validation**
- CMS cần dropdown options cố định
- Không thể dùng dynamic options trong Sveltia CMS config

### Lợi Ích Của Approach Này

✅ **Type-safe**: TypeScript catch lỗi sớm
✅ **Controllable**: Dev control visibility
✅ **Performant**: Build-time generation
✅ **SEO-friendly**: Static pages cho mỗi category
✅ **Maintainable**: Rõ ràng, dễ debug

## Files Đã Sửa Cho "Xe Lu"

```
✅ src/config/categoryVisibility.ts
   └─ Thêm category config

✅ public/loivao/config.yml
   └─ Thêm CMS option

✅ src/models/TruckTypes.ts
   └─ Đã có sẵn support (getVehicleTypeName)
```

## Next Steps

Sau khi thêm category "Xe Lu", bạn có thể:

1. **Thêm Products**
   - Vào CMS → Sản Phẩm → New
   - Chọn "Loại Xe" = "Xe Lu"
   - Điền thông tin và save

2. **Kiểm Tra Hiển Thị**
   - Trang chủ có category "Xe Lu"
   - Truy cập `/danh-muc-xe/xe-lu`
   - Products với type "xe-lu" xuất hiện

3. **SEO**
   - Cập nhật description trong category JSON
   - Thêm keywords liên quan

## Troubleshooting

### Category không hiển thị?

```bash
# Check enabled status
grep -A3 "'xe-lu'" src/config/categoryVisibility.ts
# Phải có: enabled: true

# Rebuild
rm -rf dist/
npm run build
```

### Products không hiển thị trong category?

```bash
# Check product type field
grep -r '"type".*"xe-lu"' src/content/products/
# Phải match chính xác "xe-lu"
```

### CMS không có option mới?

```bash
# Check config.yml
grep "xe-lu" public/loivao/config.yml
# Phải có dòng: - { label: "Xe Lu", value: "xe-lu" }

# Clear cache và reload CMS
```

---

**Build Status**: ✅ 119 pages built successfully

**Categories Available**:
- xe-tai (Xe Tải)
- xe-cau (Xe Cẩu)
- mooc (Sơ Mi Rơ Mooc)
- dau-keo (Xe Đầu Kéo)
- xe-lu (Xe Lu) ← MỚI
