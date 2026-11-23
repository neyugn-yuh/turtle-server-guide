---
title: "TurtleHoes: Lệnh"
description: Các lệnh người chơi, ví dụ và cách xử lý lỗi.
sidebar:
  label: Lệnh
  order: 3
---

## Cú pháp

`<...>` là tham số bắt buộc, `[...]` là tùy chọn. Dùng tên người chơi thực thay cho `<player>`; số tiền không có dấu phân cách.

| Lệnh | Công dụng |
| --- | --- |
| `/hoe` | Mở Harvester Hoe của cuốc tay chính. |
| `/hoe stats` | Xem Essence, prestige và số cây của bạn. |
| `/hoe levelup` | Mua cấp cuốc tiếp theo; cần cầm cuốc và đủ điều kiện. |
| `/hoe autosell` | Mở nâng cấp AutoSell; server dùng PlayerPoints sẽ mở menu mua/bật/tắt. |
| `/hoe prestige` | Mở Prestige; cần cầm cuốc. |
| `/hoe ability list` | Liệt kê mã và tên kỹ năng server cung cấp. |
| `/hoe ability select <id>` | Chọn kỹ năng cuốc đã sở hữu; ví dụ mã frenzy. |
| `/hoe ability fire` | Dùng kỹ năng đã chọn trên cuốc; chịu hồi chiêu. |
| `/hoe history` | Xem lịch sử của bạn, không cần cầm cuốc. |
| `/hoe history <player>` | Xem lịch sử người khác nếu server cho phép bạn. |
| `/hoe boss [status]` | Xem tiến độ gọi boss; khi boss đang có, xem máu, top sát thương và sát thương của bạn. |
| `/essence [balance]` | Xem số Essence của bạn. |
| `/essence pay <player> <amount>` | Chuyển số Essence nguyên dương cho người khác nếu server cho phép bạn; không gửi cho chính mình. |
| `/essence withdraw <amount>` | Rút số Essence nguyên dương thành Essence Note nếu server cho phép bạn; bấm phải vật phẩm để nhận lại Essence. |
| `/essence top` | Xem top 10 số dư Essence trong chat. |
| `/crops [balance]` | Xem thống kê từng loại cây của bạn. |
| `/crops balance <player> [crop]` | Xem thống kê người chơi; thêm mã cây để chỉ xem một loại. |
| `/crops top [crop\|all] [day\|week\|month]` | Xem top 10 cây; bỏ thời gian để xem toàn thời gian. |
| `/harvesterevent` | Xem thời gian còn lại, vị trí của bạn và top 5 cuộc thi đang chạy. |

## Ví dụ

```text
/hoe
/hoe ability select frenzy
/hoe ability fire
/essence withdraw 100
/crops top wheat week
/harvesterevent
```

`/hoe` có bí danh `/hoes`, `/turtlehoes`, `/harvesterhoe`; `/crops` có `/crop`; `/harvesterevent` có `/harvesterevents`, `/hevent`, `/he`.

Mã cây: `wheat`, `carrot`, `potato`, `beetroot`, `nether_wart`, `cocoa_bean`, `melon`, `pumpkin`, `sugar_cane`, `bamboo`, `pitcher`. Với `/crops balance`, tên người chơi đứng trước mã cây. Thống kê cây là số đã thu hoạch, không phải số vật phẩm còn trong túi.

## Lỗi thường gặp

| Thông báo hoặc tình huống | Cách xử lý |
| --- | --- |
| Hold a harvester hoe in your main hand. | Cầm đúng Harvester Hoe ở tay chính. Cuốc Minecraft thường không thay thế được. |
| You do not have permission. | Server chưa cho phép thao tác này; hỏi quản trị viên. |
| Unknown player | Kiểm tra tên người nhận hoặc người cần xem thống kê. |
| Usage | Kiểm tra thứ tự tham số. Số Essence phải là số nguyên dương khi chuyển/rút. |
| Không đủ tài nguyên / Insufficient resources | Đọc giá hiện tại; kiểm tra đúng loại tiền và điều kiện cấp cuốc/prestige. |
| Coming soon! | Tính năng hiện không được server bật. |
| Không có sự kiện / No event | Chưa có cuộc thi đang chạy; thử lại khi có thông báo. |

:::note[Chu kỳ bảng xếp hạng]
Ngày, tuần và tháng theo múi giờ server; mặc định UTC, tuần bắt đầu thứ Hai (server có thể đổi). Kết quả lệnh hiện trong chat.
:::
