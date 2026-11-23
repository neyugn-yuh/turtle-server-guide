---
title: "TurtleLands: Lệnh"
description: Các lệnh mở menu, nút lời mời và cách xử lý lỗi thường gặp.
sidebar:
  label: Lệnh
  order: 3
---

## Lệnh bạn có thể gõ

Dùng trong game nếu server cho phép bạn. `/lands` là tên gọi khác của `/land`, dùng cùng các tham số. Lệnh chủ yếu mở menu; tạo, đổi tên, mời người, chiếm đất và giao dịch làm bằng nút trong menu.

| Cú pháp | Làm gì | Ví dụ |
| --- | --- | --- |
| `/land` | Mở land bạn đang đứng nếu bạn thuộc land đó; nếu không, mở land duy nhất của bạn, danh sách khi có nhiều land, hoặc menu tạo khi không có land. | `/land` |
| `/land map` | Mở bản đồ quanh bạn. Ưu tiên land đang đứng mà bạn thuộc về; nếu không có, dùng land đầu danh sách của bạn. Không có land thì chỉ xem. | `/land map` |
| `/land spawn` | Mở danh sách land bạn sở hữu hoặc tham gia; bấm một land để dịch chuyển nếu được phép. | `/land spawn` |
| `/lands` | Tên gọi khác của lệnh chính. | `/lands map` |

```text
/land
/land map
/land spawn
```

:::tip[Chọn đúng land]
Nếu có nhiều land, mở `/land`, chọn land rồi vào **Bản đồ chiếm đất**. `/land map` không mở màn hình chọn land trước.
:::

## Nút trong lời mời

Bạn thường không cần tự gõ các lệnh này. Bấm **[Chấp nhận]** hoặc **[Từ chối]** trong lời mời sẽ chạy lệnh tương ứng và mở hộp xác nhận.

| Cú pháp | Tác dụng |
| --- | --- |
| `/land invite accept <mã>` | Mở xác nhận tham gia land từ lời mời còn hiệu lực của bạn. |
| `/land invite decline <mã>` | Mở xác nhận từ chối lời mời còn hiệu lực của bạn. |

`<mã>` là mã land do nút lời mời cung cấp; không gõ nguyên dấu ngoặc hoặc đoán mã. Xác nhận trong menu mới hoàn tất quyết định. Nếu lời mời đã hết hạn, nhờ người có quyền mời lại.

## Khi lệnh không làm được việc bạn muốn

| Dấu hiệu | Cách xử lý |
| --- | --- |
| Chỉ hiện hướng dẫn `/land`, `/land map`, `/land spawn` | Dùng đúng cú pháp trên. Không có lệnh người chơi riêng để tạo, claim hoặc mời bằng tên. |
| Không dùng được lệnh | Hỏi quản trị viên nếu server chưa cho phép bạn. Lệnh người chơi chỉ dùng trong game. |
| Lời mời hết hạn hoặc không còn | Nhờ gửi lời mời mới; lời mời có thể mất khi land không còn. |
| Chưa có nơi để tới | Hỏi quản trị viên; thế giới điểm đến có thể chưa được nạp. |
| Không có quyền dịch chuyển | Nhờ chủ kiểm tra quyền của vai trò bạn. |
| Dịch chuyển bị hủy | Đứng yên, tránh bị thương rồi chọn lại land. |

## Nội dung nhập chat không phải lệnh

Chỉ gõ tên land, tên người hoặc số tiền sau khi bấm nút yêu cầu. Ví dụ, sau **Nạp số khác**, gõ `10k` để nạp 10.000 đơn vị tiền. Không thêm `/`. `huy`, `hủy`, `cancel` hủy nhập; chờ 45 giây cũng hủy. Muốn thử lại sau lỗi, mở lại menu và bấm lại nút.
