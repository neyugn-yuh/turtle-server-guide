---
title: "TurtleFarmPets: Lệnh"
description: Cú pháp lệnh trại pet, tên gọi khác và cách xử lý lỗi thường gặp.
sidebar:
  label: Lệnh
  order: 3
---

## Lệnh người chơi

Dùng các lệnh này trong game. Khi server không cho phép bạn mở trại hoặc thăm trại, hãy hỏi quản trị viên.

| Lệnh | Công dụng | Ví dụ |
| --- | --- | --- |
| `/traithu` | Mở menu trại của bạn. | `/traithu` |
| `/traithu xem <tên>` | Bắt đầu xem trại người chơi được phép thăm. Thay `<tên>` bằng tên tài khoản trong game. | Gõ `/traithu xem ` rồi nhấn Tab chọn người đang online. |
| `/traithu thoat` | Hủy chờ thăm hoặc kết thúc xem trại, trở lại hiển thị trại của bạn. | `/traithu thoat` |
| `/ranch`, `/farmpets`, `/trai` | Tên gọi khác của `/traithu`, nhận cùng lệnh con. | `/ranch thoat` |

## Ví dụ thao tác

1. Gõ lệnh dưới đây để mở trại.
2. Bấm **Xem trại người khác**, rồi chọn người bạn muốn thăm. Bạn cũng có thể dùng lệnh `xem` nếu biết tên tài khoản.
3. Nếu có thông báo chờ dịch chuyển, đứng yên đến hết giờ. Mặc định chờ 3 giây (server có thể đổi). Khi đã ở khu trại, việc đổi trại xem không cần bước dịch chuyển này.
4. Gõ lệnh thoát để xem lại trại của mình.

```text
/traithu
/traithu thoat
```

:::note[Thoát xem không dịch chuyển về chỗ cũ]
Lệnh thoát đổi trại đang hiển thị về trại của bạn. Nó không đưa bạn trở lại vị trí trước khi đi thăm. Muốn tới lối vào trại, dùng nút Tới trại trong menu chính.
:::

## Lỗi thường gặp

| Thông báo hoặc tình huống | Cách xử lý |
| --- | --- |
| Bạn không có quyền. | Hỏi quản trị viên xem server có cho bạn dùng tính năng này không. |
| Dùng: /traithu xem (tên) | Bạn thiếu tên sau `xem`; nhập tên tài khoản, không nhập dấu ngoặc. |
| Không tìm thấy người chơi | Kiểm tra tên. Người offline phải là người server đã biết và còn nhận diện được tên. |
| Không cho bạn xem trại | Chủ trại đang giới hạn người xem. Nhờ họ đổi quyền xem nếu muốn mời bạn. |
| Bạn đã di chuyển, hủy dịch chuyển. | Chạy lại lệnh thăm và đứng yên trong thời gian chờ. |
| Không tìm thấy trại hoặc không nạp được dữ liệu trại | Thử lại sau; nếu vẫn lỗi, hỏi quản trị viên. |
| Thế giới đặt trại chưa sẵn sàng hoặc không tìm thấy thế giới của trại | Hỏi quản trị viên; bạn không sửa được qua menu. |
| Bạn chỉ được xem trại này, không sửa được. | Khách chỉ xem thông tin; quay về trại mình để quản lý pet. Nếu chính trại mình vẫn bị khóa sửa, hỏi quản trị viên. |

Ấp trứng, nạp máng, cho ăn, mở chuồng, đổi tên và thả pet đều làm trong giao diện; không cần lệnh riêng.
