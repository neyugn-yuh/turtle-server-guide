---
title: "TurtleBackpack: Giao diện"
description: Cách mở, đọc và bấm từng giao diện của TurtleBackpack.
sidebar:
  label: Giao diện
  order: 2
---

## Cách đọc hình

Các hình dùng bố cục và tên mặc định; server có thể đổi tên và vật phẩm được nhận. Tên nút giữ nguyên như trong game. Ô được đếm từ 0, trái sang phải, trên xuống; số xanh là số chú thích, không phải số ô. Kính đen chỉ trang trí. Bạn không thể kéo đồ vào menu.

Hình danh mục thể hiện trạng thái chưa có đồ và chưa có vật phẩm tùy chỉnh khả dụng: các ô vật phẩm đặc biệt dùng biểu tượng rào cấm. Trên server có tích hợp tương ứng, chúng hiện hình và tên riêng; cá đã lưu có thể hiện hình của một con đang chứa. Tên đồ Minecraft thường theo ngôn ngữ máy của bạn. Các ô vật phẩm cùng chức năng dùng chung số chú thích.

## Ba lô

Mở bằng `/bp`, hoặc cầm biểu tượng ba lô trên thanh phím tắt rồi nhấn phải. Trong màn hình túi đồ cá nhân, nhấn trái hoặc phải biểu tượng cũng mở được.

![Menu Ba lô](/gui/vi/turtle-backpack-main.svg)

*Hình: Bốn danh mục mặc định và các nút dùng chung.*

| # | Ô | Làm gì |
| --- | --- | --- |
| 1 | 10 | **Nông sản**: nhấn để xem nông sản. |
| 2 | 11 | **Khoáng sản**: nhấn để xem khoáng sản. |
| 3 | 12 | **Cá**: nhấn để xem cá. |
| 4 | 13 | **Đồ rơi từ mob**: nhấn để xem đồ rơi từ sinh vật. |
| 5 | 46 | **Nâng cấp ba lô**: mở ba mục nâng cấp. |
| 6 | 49 | **Bán tất cả**: mở chi tiết và xác nhận bán đồ đang được hỗ trợ, có thể bán. |
| 7 | 52 | **Vật phẩm ngừng hỗ trợ**: rút số còn lưu của loại không còn được nhận. |

Nút số 7 chỉ hiện khi bạn còn vật phẩm ngừng hỗ trợ; hình minh họa trạng thái có nút này. Mô tả danh mục cho biết số loại và tổng đang chứa. Mô tả nâng cấp cho biết cấp ba lô và sức chứa mỗi loại.

## Thao tác chung trong danh mục

Mở bằng cách nhấn danh mục trong Ba lô. Rê chuột lên một vật phẩm để xem số đang chứa, sức chứa, giá trị và **Tự bán: BẬT/TẮT**. Giá trị có thể hiện **không bán được** khi có đồ nhưng không có giá bán.

| Thao tác trên vật phẩm | Kết quả |
| --- | --- |
| Nhấn trái | Rút tối đa một stack, tùy số còn và chỗ trong túi. |
| Shift + trái | Rút tối đa vừa túi. |
| Nhấn phải | Bán ngay loại này, không mở xác nhận. |
| Shift + phải | Bật/tắt tự bán loại này nếu server cho phép bạn. |

## Nông sản

Trong Ba lô, nhấn **Nông sản**.

![Danh mục Nông sản](/gui/vi/turtle-backpack-farming.svg)

*Hình: Trang đầu Nông sản theo danh sách mặc định.*

| # | Ô | Làm gì |
| --- | --- | --- |
| 1 | 0–24 | Vật phẩm trong danh mục: dùng bốn thao tác ở trên; đây là biểu tượng thao tác, không phải ô để đặt đồ. |
| 2 | 45 | **Quay lại**: về Ba lô. |
| 3 | 49 | **Bán cả danh mục**: bán ngay các loại có thể bán trong toàn danh mục, kể cả trang khác; không hỏi xác nhận. |

Mặc định danh mục này vừa một trang. Khi server thêm hơn 45 loại, mỗi trang chứa tối đa 45 loại ở ô 0–44. **Trang trước** ở ô 48 chỉ hiện khi có trang trước; **Trang sau** ở ô 50 chỉ hiện khi có trang sau. Số trong tên nút là trang sẽ chuyển tới và tổng số trang. Ô chưa dùng là kính đen. Biểu tượng vật phẩm phát sáng khi bật tự bán.

## Khoáng sản

Trong Ba lô, nhấn **Khoáng sản**.

![Danh mục Khoáng sản](/gui/vi/turtle-backpack-mining.svg)

*Hình: Trang đầu Khoáng sản theo danh sách mặc định.*

| # | Ô | Làm gì |
| --- | --- | --- |
| 1 | 0–24 | Vật phẩm trong danh mục: dùng bốn thao tác ở trên; đây là biểu tượng thao tác, không phải ô để đặt đồ. |
| 2 | 45 | **Quay lại**: về Ba lô. |
| 3 | 49 | **Bán cả danh mục**: bán ngay các loại có thể bán trong toàn danh mục, kể cả trang khác; không hỏi xác nhận. |

Mặc định danh mục này vừa một trang. Khi server thêm hơn 45 loại, mỗi trang chứa tối đa 45 loại ở ô 0–44. **Trang trước** ở ô 48 chỉ hiện khi có trang trước; **Trang sau** ở ô 50 chỉ hiện khi có trang sau. Số trong tên nút là trang sẽ chuyển tới và tổng số trang. Ô chưa dùng là kính đen. Biểu tượng vật phẩm phát sáng khi bật tự bán.

## Cá

Trong Ba lô, nhấn **Cá**.

![Danh mục Cá](/gui/vi/turtle-backpack-fishing.svg)

*Hình: Trang đầu Cá theo danh sách mặc định.*

| # | Ô | Làm gì |
| --- | --- | --- |
| 1 | 0–13 | Vật phẩm trong danh mục: dùng bốn thao tác ở trên; đây là biểu tượng thao tác, không phải ô để đặt đồ. |
| 2 | 45 | **Quay lại**: về Ba lô. |
| 3 | 49 | **Bán cả danh mục**: bán ngay các loại có thể bán trong toàn danh mục, kể cả trang khác; không hỏi xác nhận. |

Mặc định danh mục này vừa một trang. Khi server thêm hơn 45 loại, mỗi trang chứa tối đa 45 loại ở ô 0–44. **Trang trước** ở ô 48 chỉ hiện khi có trang trước; **Trang sau** ở ô 50 chỉ hiện khi có trang sau. Số trong tên nút là trang sẽ chuyển tới và tổng số trang. Ô chưa dùng là kính đen. Biểu tượng vật phẩm phát sáng khi bật tự bán.

## Đồ rơi từ mob

Trong Ba lô, nhấn **Đồ rơi từ mob**.

![Danh mục Đồ rơi từ mob](/gui/vi/turtle-backpack-mobs.svg)

*Hình: Trang đầu Đồ rơi từ mob theo danh sách mặc định.*

| # | Ô | Làm gì |
| --- | --- | --- |
| 1 | 0–6 | Vật phẩm trong danh mục: dùng bốn thao tác ở trên; đây là biểu tượng thao tác, không phải ô để đặt đồ. |
| 2 | 45 | **Quay lại**: về Ba lô. |
| 3 | 49 | **Bán cả danh mục**: bán ngay các loại có thể bán trong toàn danh mục, kể cả trang khác; không hỏi xác nhận. |

Mặc định danh mục này vừa một trang. Khi server thêm hơn 45 loại, mỗi trang chứa tối đa 45 loại ở ô 0–44. **Trang trước** ở ô 48 chỉ hiện khi có trang trước; **Trang sau** ở ô 50 chỉ hiện khi có trang sau. Số trong tên nút là trang sẽ chuyển tới và tổng số trang. Ô chưa dùng là kính đen. Biểu tượng vật phẩm phát sáng khi bật tự bán.

## Vật phẩm ngừng hỗ trợ

Trong Ba lô, nhấn **Vật phẩm ngừng hỗ trợ** khi nút xuất hiện.

![Danh mục vật phẩm ngừng hỗ trợ](/gui/vi/turtle-backpack-discontinued.svg)

*Hình: Ví dụ còn một loại lúa mì sau khi server ngừng nhận loại đó.*

| # | Ô | Làm gì |
| --- | --- | --- |
| 1 | 0 | Vật phẩm còn lưu: trái rút tối đa một stack; Shift + trái rút tối đa vừa túi. |
| 2 | 45 | **Quay lại**: về Ba lô. |

Danh sách phụ thuộc đồ bạn còn giữ, không có loại ngừng hỗ trợ sẵn trong danh sách mặc định. Nếu có nhiều loại, chúng lần lượt chiếm ô 0–44 rồi phân trang với nút ở ô 48 và 50 như trên. Không có **Bán cả danh mục**; nhấn phải và Shift + phải không bán hay bật tự bán. Rào cấm thay biểu tượng khi hiện chưa tạo được đồ; hỏi quản trị viên nếu bạn không rút được.

## Backpack Upgrades

Mở bằng `/bp upgrades` hoặc **Nâng cấp ba lô** trong menu chính.

![Menu nâng cấp ba lô](/gui/vi/turtle-backpack-upgrades.svg)

*Hình: Ba hướng nâng cấp và nút quay lại.*

| # | Ô | Làm gì |
| --- | --- | --- |
| 1 | 11 | **Sức chứa**: tăng giới hạn mỗi loại; mô tả có tên ba lô hiện tại và kế tiếp. |
| 2 | 13 | **Hệ số bán**: tăng tiền bán và cơ hội bán may mắn. |
| 3 | 15 | **Giữ đồ**: tăng cơ hội bán được tiền mà vẫn giữ loại vật phẩm đó. |
| 4 | 22 | **Quay lại**: về menu trước; nếu mở bằng lệnh thì đóng menu. |

Mô tả thay đổi theo cấp, số tiền bạn có và giá cấp tiếp theo. **Thiếu …** báo phần tiền còn thiếu; **ĐÃ ĐẠT CẤP TỐI ĐA** thay lời nhắc nâng cấp khi không còn cấp để mua. Nhấn một mục sẽ mua cấp tiếp theo, hoặc mở xác nhận nếu giá vượt mức server yêu cầu. Đọc giá và loại tiền trước khi nhấn.

## Hai hộp xác nhận

**Xác nhận bán** mở từ **Bán tất cả** khi có đồ bán được. Hộp có 3 hàng: **Xác nhận** ở ô 11, **Chi tiết** (giấy) ở ô 13, **Hủy** ở ô 15. Rê giấy để xem tối đa 14 dòng loại đồ và số lượng; nếu còn, có dòng báo số loại khác. Rê **Xác nhận** để xem tổng ước tính. Nhấn để đóng hộp rồi bán; **Hủy** về Ba lô. Nếu không có gì bán được, chỉ có thông báo, không mở hộp.

**Xác nhận nâng cấp** dùng cùng bố cục, nhưng ô 13 là biểu tượng mục bạn sắp nâng cấp. Số tiền trên nút **Xác nhận** trong hộp này là **chi phí bạn trả**, dù dòng mặc định vẫn ghi “Bạn nhận”. **Hủy** về Backpack Upgrades. Nâng cấp rẻ hơn có thể mua ngay, không hiện hộp; server có thể thay đổi mức cần xác nhận.

:::note[Giá xem trước]
Xác nhận bán cho bạn xem ước tính, không khóa giá cửa hàng. Khi bấm xác nhận, hệ thống tính lại đồ và giá lúc bán. Bán may mắn không nằm trong ước tính.
:::
