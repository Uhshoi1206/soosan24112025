# Sửa Lỗi Sveltia CMS - Object Widget

## Vấn Đề

Khi truy cập `/loivao`, gặp lỗi:

```
There is an error in the CMS configuration. Please solve the issue and try again.

Sản Phẩm collection, specifications field: The Object field must have either the fields or types option defined.
```

## Nguyên Nhân

Sveltia CMS không hỗ trợ widget `object` không có `fields` hoặc `types` được định nghĩa rõ ràng. Trong config ban đầu, field `specifications` được khai báo như sau:

```yaml
- { label: "Thông Số Khác", name: "specifications", widget: "object", required: false }
```

Đây là cách khai báo tự do (free-form object) mà Sveltia CMS không cho phép vì lý do bảo mật và validation.

## Giải Pháp Đã Áp Dụng

### 1. Xóa Field Khỏi CMS Config

File `public/loivao/config.yml` đã được cập nhật:

**Trước:**
```yaml
# Additional Specs (JSON format for flexibility)
- { label: "Thông Số Khác", name: "specifications", widget: "object", required: false }
- { label: "Thứ Tự Sắp Xếp", name: "order", widget: "number", required: false }
```

**Sau:**
```yaml
# Note: specifications field removed from CMS (Sveltia limitation with object widget)
- { label: "Thứ Tự Sắp Xếp", name: "order", widget: "number", required: false }
```

### 2. Schema Vẫn Hỗ Trợ Field Này

File `src/content/config.ts` vẫn giữ field `specifications`:

```typescript
specifications: z.record(z.any()).optional(),
```

Điều này có nghĩa:
- ✅ Data hiện có vẫn hoạt động bình thường
- ✅ Có thể edit trực tiếp trong file JSON
- ❌ Không thể edit qua CMS UI

## Tác Động

### Những Gì Bị Ảnh Hưởng
- Field `specifications` không xuất hiện trong CMS UI
- Không thể thêm/sửa specifications qua CMS

### Những Gì Vẫn Hoạt Động
- ✅ Tất cả products hiện có vẫn hiển thị đầy đủ
- ✅ Có thể edit các field khác qua CMS
- ✅ Có thể thêm sản phẩm mới qua CMS
- ✅ Specifications trong products hiện có vẫn hoạt động

## Giải Pháp Thay Thế

### Option 1: Sử dụng Các Field Riêng Lẻ (Khuyến Nghị)

Thay vì dùng `specifications` tự do, hãy thêm các field cụ thể vào CMS config:

```yaml
# Transmission & Drivetrain
- { label: "Hộp Số", name: "transmission", widget: "string", required: false }
- { label: "Loại Hộp Số", name: "transmissionType", widget: "string", required: false }
- { label: "Loại Ly Hợp", name: "clutchType", widget: "string", required: false }

# Chassis
- { label: "Vật Liệu Khung Gầm", name: "chassisMaterial", widget: "string", required: false }
- { label: "Hệ Thống Treo Trước", name: "frontSuspension", widget: "string", required: false }
- { label: "Hệ Thống Treo Sau", name: "rearSuspension", widget: "string", required: false }

# Performance
- { label: "Tốc Độ Tối Đa", name: "maxSpeed", widget: "string", required: false }
- { label: "Khả Năng Leo Dốc", name: "climbingAbility", widget: "string", required: false }
- { label: "Mức Tiêu Thụ Nhiên Liệu", name: "fuelConsumption", widget: "string", required: false }
```

**Ưu điểm:**
- ✅ Editable qua CMS
- ✅ Type-safe và có validation
- ✅ Giao diện rõ ràng cho người dùng

**Nhược điểm:**
- ❌ Config dài hơn
- ❌ Ít linh hoạt hơn

### Option 2: Edit Trực Tiếp File JSON

Nếu cần thêm specifications phức tạp, có thể edit trực tiếp file trong `src/content/products/`:

```json
{
  "id": "xe-tai-example",
  "name": "Example Truck",
  ...
  "specifications": {
    "customField1": "value1",
    "customField2": "value2",
    "nestedObject": {
      "detail1": "value",
      "detail2": "value"
    }
  }
}
```

**Ưu điểm:**
- ✅ Hoàn toàn linh hoạt
- ✅ Hỗ trợ nested objects

**Nhược điểm:**
- ❌ Phải edit file trực tiếp
- ❌ Không có validation UI
- ❌ Cần kiến thức technical

### Option 3: Sử dụng Markdown Field

Có thể dùng field markdown để lưu specifications dưới dạng văn bản:

```yaml
- { label: "Thông Số Kỹ Thuật Chi Tiết", name: "technicalSpecs", widget: "markdown", required: false }
```

**Ưu điểm:**
- ✅ Editable qua CMS
- ✅ Rich formatting
- ✅ Dễ đọc

**Nhược điểm:**
- ❌ Không có cấu trúc data
- ❌ Khó query/filter

## Kết Luận

Lỗi đã được sửa và CMS có thể truy cập bình thường tại `/loivao`.

Nếu cần thêm fields cho specifications, hãy sử dụng **Option 1** (thêm các field riêng lẻ) để có trải nghiệm CMS tốt nhất.

## Build & Deploy

Build đã hoàn tất thành công:
```bash
npm run build
# 118 page(s) built in 16.37s
```

Có thể deploy ngay lập tức.
