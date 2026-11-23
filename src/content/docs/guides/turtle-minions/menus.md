---
title: "TurtleMinions: Giao diện"
description: Cách mở và sử dụng giao diện minion, kho phụ và nâng cấp bậc.
sidebar:
  label: Giao diện
  order: 2
---

## Đọc sơ đồ

Số huy hiệu khớp cột `#`; cột Ô dùng số ô bắt đầu từ 0, từ trái sang phải rồi xuống hàng. Hình dùng bố cục mặc định, bỏ màu chữ. Tên tiếng Anh được giữ đúng như trong game. Server có thể đổi bố cục và nội dung. Các menu này không có phân trang.

## Menu minion

Bấm phải vào minion của bạn. Hình minh họa `Cobblestone Minion I` đã có sản phẩm, chưa lắp nhiên liệu, vật phẩm hỗ trợ hay hopper.

![Menu Cobblestone Minion I](/gui/vi/turtle-minions-minion.svg)

*Hình: Minion bậc I với một ô kho mở và các ô hỗ trợ còn trống.*

| # | Ô | Làm gì |
| --- | --- | --- |
| 1 | 4 | `Cobblestone Minion I`: di chuột xem bậc, tốc độ thực tế, sức chứa, sản phẩm và thống kê; không có thao tác bấm. |
| 2 | 21 | Bấm chồng `Cobblestone` để lấy vào túi; không phải ô gửi đồ. |
| 3 | 22–25, 30–34, 39–43 | `Locked storage slot`: ô khóa, cần tăng bậc để mở thêm. |
| 4 | 19 | `Fuel`: cầm nhiên liệu trên con trỏ rồi bấm trái để thêm cả chồng, bấm phải để thêm một món; con trỏ trống chỉ tháo được nhiên liệu vĩnh viễn. |
| 5 | 28, 37 | `Upgrade slot`: đặt vật phẩm hỗ trợ hợp lệ; bấm với con trỏ trống để tháo. |
| 6 | 46 | `Automated Shipping`: đặt hopper chuyên dụng; con trỏ trống bấm trái thu tiền, bấm phải tháo hopper và thử thu tiền. |
| 7 | 48 | `Collect all`: lấy sản phẩm từ cả kho chính lẫn kho phụ; đồ không vừa túi vẫn ở kho. |
| 8 | 50 | `Upgrade minion`: yêu cầu nâng lên bậc kế tiếp; mở menu nâng cấp khi server đã cung cấp chi phí. |
| 9 | 53 | `Pickup minion`: thu hồi ngay, không có hộp xác nhận; đồ trả lại không vừa túi rơi xuống đất. |

Khi tăng bậc, các ô kho mở theo thứ tự 21, 22, 23, 24, 25, 30, 31, 32, 33, 34, 39, 40, 41, 42, 43. Số ô mở tùy loại và bậc. Ô đã mở có thể trống hoặc hiện sản phẩm. Tiêu đề, đầu thống kê và sản phẩm đổi theo minion. Ô hỗ trợ hiện vật phẩm đã lắp; nhiên liệu có thời gian còn lại, hopper có tiền đang giữ.

Bạn cũng có thể bấm vật phẩm hợp lệ trong túi khi menu đang mở: nhiên liệu dùng một món, Shift-bấm dùng cả chồng nếu có thời hạn; vật phẩm hỗ trợ và hopper dùng một món. Không thể kéo rê để chuyển đồ như rương thường. Chỉ `Collect all` lấy sản phẩm, không thu tiền hopper.

## Minion Storage

Đặt vật phẩm Minion Storage cạnh minion, rồi bấm phải vào khối kho đã gắn để mở. Hình dùng Small Storage mặc định thêm 3 ô, có một chồng sản phẩm minh họa.

![Menu Minion Storage](/gui/vi/turtle-minions-storage.svg)

*Hình: Kho phụ 3 ô với các ô còn lại được chặn bằng kính đen.*

| # | Ô | Làm gì |
| --- | --- | --- |
| 1 | 0–2 | Bấm một ô sản phẩm để lấy cả chồng vào túi; phần không vừa vẫn nằm trong kho. Không thể gửi đồ vào đây. |

Số ô phụ mặc định có thể là 3, 9, 15, 21 hoặc 27 tùy vật phẩm; server có thể đổi. Tiêu đề hiển thị số ô thực tế. Menu làm tròn lên đủ hàng 9 ô, chặn phần dư bằng kính đen. Ô trống là chỗ nhận sản phẩm tự động, không phải ô nhập đồ. Không có nút quay lại: đóng menu rồi bấm phải minion. Nếu đang cúi và cầm đồ ở tay chính, bấm phải khối kho có thể dùng để đặt đồ thay vì mở menu.

## Upgrade Minion

Bấm `Upgrade minion` ở menu minion. Menu chỉ mở nếu còn bậc kế tiếp và server cung cấp chi phí hoặc cho nâng miễn phí. Mặc định chưa có chi phí và không cho nâng miễn phí: bạn nhận thông báo thay vì thấy menu.

![Bố cục Upgrade Minion](/gui/vi/turtle-minions-upgrade.svg)

*Hình: Bố cục mặc định cho bậc 1 lên 2, bỏ trống phần nguyên liệu vì chưa có yêu cầu mặc định.*

| # | Ô | Làm gì |
| --- | --- | --- |
| 1 | 16 | `Upgrade minion`: bấm để kiểm tra, tiêu thụ đủ nguyên liệu và tăng một bậc; thành công thì menu đóng. |
| 2 | 22 | `Back`: quay về menu minion. |

Đây là sơ đồ bố cục khi nâng cấp được server cho phép, không phải nâng miễn phí có sẵn. Tiêu đề đổi theo bậc hiện tại và bậc đích. Yêu cầu nguyên liệu, nếu có, xuất hiện ở các ô 10–14 theo thứ tự; những ô này chỉ để xem, không để đặt đồ. Các ô không dùng vẫn là kính đen. Bạn giữ nguyên liệu trong túi hoặc tay phụ; bấm món trong túi không chuyển nó vào menu. Kiểm tra danh sách và tổng yêu cầu trên nút trước khi xác nhận. Thiếu nguyên liệu thì không tăng bậc và không trừ nguyên liệu. Chỉ chủ minion được xác nhận theo cách chơi thông thường.
