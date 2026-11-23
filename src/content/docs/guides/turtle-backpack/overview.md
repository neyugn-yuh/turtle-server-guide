---
title: "TurtleBackpack: Tổng quan"
description: Làm quen với ba lô riêng, thu đồ, rút đồ, bán và nâng cấp.
sidebar:
  label: Tổng quan
  order: 1
---

## Ba lô dùng để làm gì?

TurtleBackpack cho bạn một kho riêng lưu số lượng vật phẩm theo từng loại. Đây là kho ảo: bạn xem số lượng qua menu, rồi rút thành đồ trong túi khi cần. Biểu tượng ba lô trên thanh phím tắt chỉ là nút mở kho, không chứa đồ bên trong.

Ba lô mặc định chia thành **Nông sản**, **Khoáng sản**, **Cá** và **Đồ rơi từ mob**. Ví dụ, lúa mì và cà rốt thuộc Nông sản; đá cuội và than thuộc Khoáng sản. Server có thể thay đổi danh mục và vật phẩm được nhận. Bạn không thể kéo đồ tùy ý vào menu để cất.

## Bắt đầu từng bước

1. Gõ `/bp` để mở **Ba lô**. Nếu có biểu tượng trên thanh phím tắt, cầm nó rồi nhấn chuột phải cũng mở được.
2. Chọn một danh mục để xem từng loại, số đang chứa, sức chứa, giá trị và trạng thái **Tự bán**.
3. Dùng công cụ được server tích hợp để thu đồ vào ba lô. Khi đồ được nhận, thông báo cộng số lượng xuất hiện trên thanh thông báo phía trên thanh phím tắt.
4. Mở lại danh mục. Nhấn trái một vật phẩm để rút tối đa một stack, tức một chồng theo giới hạn xếp chồng của vật phẩm. Giữ Shift rồi nhấn trái để rút nhiều nhất có thể vừa túi đồ.
5. Muốn lấy tiền, nhấn phải loại cần bán hoặc dùng **Bán cả danh mục**. Muốn xem trước khi bán toàn bộ, quay về menu chính và chọn **Bán tất cả**, rồi **Xác nhận**.
6. Mở **Nâng cấp ba lô** để xem giá, loại tiền cần trả và chỉ số cấp kế tiếp. Chọn **Sức chứa** nếu bạn thường hết chỗ.

:::note[Đồ vào ba lô bằng cách nào?]
Nhặt đồ dưới đất để tự cất mặc định bị tắt; server có thể bật. Khi bật, chỉ đồ được hỗ trợ và nguyên chồng còn vừa ba lô mới được chuyển vào. Đồ do người chơi ném ra không được tự cất bằng cách này.
:::

## Sức chứa và nâng cấp

Sức chứa áp dụng riêng cho mỗi loại. Mặc định **Ba lô Gỗ** chứa 50.000 mỗi loại; server có thể đổi. Lúa mì đầy không có nghĩa cà rốt cũng đầy. Cá đặc biệt cùng loại dùng chung sức chứa dù khác kích thước hoặc giá trị.

**Hệ số bán** tăng tiền bán và cơ hội bán may mắn. **Giữ đồ** có cơ hội trả tiền nhưng vẫn để lại loại vật phẩm đó trong kho; mặc định chỉ áp dụng khi bán thủ công. Đọc chỉ số hiện tại và kế tiếp trước khi mua.

## Lặp lại vòng chơi

Thu đồ, kiểm tra kho, rút hoặc bán, rồi nâng cấp. Nếu server cho phép bạn, Shift + nhấn phải một loại để bật **Tự bán**. Hệ thống bán theo đợt khoảng 5 giây khi bạn trực tuyến, không bán ngay từng vật phẩm.

:::caution[Đừng đợi cả kho và túi đều đầy]
Mặc định, đồ dư từ công cụ được đưa vào túi, rồi chờ tự bán nếu có giá và server cho phép bạn. Phần còn lại bị bỏ, không rơi xuống đất. Server có thể đổi cách xử lý. Hãy bán hoặc nâng sức chứa trước khi hết chỗ.
:::
