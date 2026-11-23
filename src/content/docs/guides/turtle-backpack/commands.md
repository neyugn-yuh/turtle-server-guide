---
title: "TurtleBackpack: Lệnh"
description: Các lệnh người chơi để mở ba lô, bán đồ và bật tự bán.
sidebar:
  label: Lệnh
  order: 3
---

## Cú pháp

Bạn dùng lệnh khi đang trong game và nếu server cho phép bạn. `/backpack` và `/turtlebackpack` là tên khác của `/bp`.

| Lệnh | Tác dụng | Ví dụ |
| --- | --- | --- |
| `/bp` | Mở Ba lô. | `/bp` |
| `/bp sell` | Bán ngay mọi loại đang được hỗ trợ và có thể bán trong ba lô. | `/bp sell` |
| `/bp sell <danh mục>` | Bán ngay đồ có thể bán thuộc danh mục đó. | `/bp sell farming` |
| `/bp sell <vật phẩm>` | Bán ngay một loại. | `/bp sell minecraft:wheat` |
| `/bp autosell <vật phẩm>` | Bật hoặc tắt tự bán riêng loại đó. | `/bp autosell wheat` |
| `/bp upgrades` | Mở Backpack Upgrades. | `/bp upgrades` |
| `/bp icon` | Bật hoặc tắt biểu tượng ba lô nếu server cho phép. | `/bp icon` |
| `/bp help` | Xem hướng dẫn lệnh ngắn trong chat. | `/bp help` |

:::caution[Lệnh bán không hỏi xác nhận]
`/bp sell` và các biến thể bán ngay. Nếu bạn muốn xem trước, dùng nút **Bán tất cả** trong menu chính.
:::

## Chọn đúng danh mục và vật phẩm

Tên dùng trong lệnh mặc định là `farming` cho Nông sản, `mining` cho Khoáng sản, `fishing` cho Cá và `mobs` cho Đồ rơi từ mob. Đây là từ bạn nhập vào lệnh, không phải tên tiếng Việt hiển thị trong menu. Server có thể đổi danh mục.

Mã vật phẩm là tên dùng trong lệnh, ví dụ `minecraft:wheat`. Với đồ Minecraft thường, `wheat` cũng được hiểu như `minecraft:wheat`. Với đồ đặc biệt, dùng đúng mã được gợi ý khi nhấn Tab; đừng nhập tên hiển thị tùy ý.

```text
/bp sell mining
/bp sell wheat
/bp autosell minecraft:carrot
/bp upgrades
```

Nhấn Tab sau `/bp sell ` để tìm danh mục hoặc vật phẩm. Sau `/bp autosell `, Tab gợi ý vật phẩm. Lệnh tự bán cần một vật phẩm, không nhận cả danh mục; chạy lần nữa để tắt.

## Lỗi thường gặp

| Thông báo | Bạn nên làm gì? |
| --- | --- |
| Bạn không có quyền. | Hỏi quản trị viên xem bạn được dùng ba lô chưa. |
| Ba lô đang tải, thử lại sau giây lát. | Chờ rồi thử lại. |
| Không có danh mục hay vật phẩm tên … | Kiểm tra mã bằng Tab; đồ ngừng hỗ trợ không bán bằng lệnh này. |
| Không có vật phẩm: … | Thêm mã sau lệnh tự bán, hoặc chọn mã được gợi ý. |
| Không có gì để bán. | Kiểm tra còn đồ có giá bán trong ba lô hay không. |
| Bạn không dùng được tự bán. | Hỏi quản trị viên về quyền dùng tính năng. |
| Thanh toán lỗi, chưa bán gì cả. | Đồ đã trừ được hoàn lại; báo quản trị viên nếu lặp lại. |
| Server này đã tắt icon ba lô trên hotbar. | Dùng `/bp` để mở. |
| Server này không cho tắt icon ba lô. | Giữ biểu tượng; bạn vẫn mở bằng `/bp` được. |
| Dọn một ô trống để nhận icon ba lô. | Dọn chỗ trong túi rồi chờ biểu tượng được kiểm tra lại. |
