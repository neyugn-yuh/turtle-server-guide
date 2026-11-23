---
title: "TurtleLands: Giao diện"
description: Cách mở và dùng mọi menu dành cho người chơi.
sidebar:
  label: Giao diện
  order: 2
---

## Cách đọc giao diện

Các hình dùng bố cục mặc định. `{land}` và `{player}` là chỗ hiển thị tên land hoặc người chơi thực tế. Số trong huy hiệu khớp cột **#**; cột **Ô** dùng chỉ số từ 0, từ trái sang phải rồi xuống hàng. Tên vai trò và số tiền hiển thị có thể đổi theo server; tiền dùng cách định dạng của server.

Bạn chỉ cần bấm nút; không kéo đồ vào menu. Khi menu yêu cầu nhập chat, gõ nội dung không có dấu `/`. Bạn có 45 giây; gõ `huy`, `hủy` hoặc `cancel` để hủy. Phím đóng túi đồ đóng menu.

## Land của bạn

Gõ `/land` khi bạn chưa sở hữu hoặc tham gia land nào.

![Land của bạn](/gui/vi/turtle-lands-hub-none.svg)

*Hình: Bố cục minh họa Land của bạn.*

| # | Ô | Làm gì |
| --- | --- | --- |
| 1 | 22 | Bấm, rồi nhập tên vào chat. Chunk tại vị trí bạn đứng khi gửi tên trở thành chunk đầu tiên; xem giá trước khi tạo. |
| 2 | 24 | Mở bản đồ để xem đất quanh bạn; chưa thể chiếm thêm khi chưa có land. |

Menu này chỉ hiện khi bạn chưa có land để mở. Sau khi tạo thành công, menu chuyển sang land vừa tạo.

## Land {land}

Gõ `/land`, hoặc chọn một land trong **Land của tôi**.

![Land {land}](/gui/vi/turtle-lands-hub.svg)

*Hình: Bố cục minh họa Land {land}.*

| # | Ô | Làm gì |
| --- | --- | --- |
| 1 | 4 | Rê chuột xem chủ, vai trò, số chunk, giới hạn thành viên và cảnh báo nợ. |
| 2 | 19 | Mở bản đồ chiếm hoặc bỏ chiếm chunk. |
| 3 | 20 | Mở danh sách thành viên. |
| 4 | 21 | Mở danh sách vai trò. |
| 5 | 22 | Mở các công tắc áp dụng cho cả land. |
| 6 | 23 | Mở ngân hàng; xem số dư và thuế mỗi kỳ. |
| 7 | 24 | Đóng menu và hiện ranh giới quanh bạn trong thời gian ngắn. |
| 8 | 25 | Bắt đầu dịch chuyển nếu bạn có quyền; đứng yên khi chờ. |
| 9 | 28 | Đặt điểm đến tại chỗ bạn đứng trong land, nếu được phép. |
| 10 | 29 | Chọn land bạn sở hữu hoặc tham gia. |
| 11 | 30 | Chủ bấm rồi nhập tên mới trong chat. |
| 12 | 33 | Chủ mở xác nhận xoá vĩnh viễn; đọc khoản hoàn trước khi đồng ý. |

Hình minh họa chủ land khi có thuế. Ô 23 biến mất nếu server không dùng thuế; biểu tượng chuyển thành khối redstone khi đang nợ và thuế không tạm dừng. Thành viên thấy **Rời land** ở ô 31; chỉ chủ thấy ô 30 và 33. Các nút còn lại vẫn có thể từ chối thao tác nếu vai trò bạn thiếu quyền.

## Land của tôi

Mở bằng nút **Land của tôi**; `/land` cũng mở danh sách nếu cần chọn giữa nhiều land.

![Land của tôi](/gui/vi/turtle-lands-land-list.svg)

*Hình: Bố cục minh họa Land của tôi.*

| # | Ô | Làm gì |
| --- | --- | --- |
| 1 | 10, 11, 12, 13, 14, 15, 16, 19, 20, 21, 22, 23, 24, 25, 28, 29, 30, 31, 32, 33, 34 | Rê chuột xem chủ, vai trò và số chunk; bấm mở menu land. |
| 2 | 45 | Bấm để xem trang trước, nếu có. |
| 3 | 53 | Bấm để xem trang sau, nếu có. |

Danh sách có tối đa 21 mục mỗi trang. Hình minh họa một trang có mục; số mục thực tế thay đổi. Mũi tên ô 45 chỉ xuất hiện khi có trang trước, ô 53 khi có trang sau. Khi không có mục, các ô danh sách trống. Land bạn sở hữu đứng trước, rồi sắp theo tên. Land sở hữu dùng khối cỏ; land bạn tham gia dùng cây sồi non. Không có land thì ô 22 hiện **Bạn chưa có land nào** bằng biểu tượng rào cấm. Không có nút quay lại; dùng phím đóng túi đồ.

## Về land nào?

Gõ `/land spawn` để chọn land cần tới.

![Về land nào?](/gui/vi/turtle-lands-spawn-list.svg)

*Hình: Bố cục minh họa Về land nào?.*

| # | Ô | Làm gì |
| --- | --- | --- |
| 1 | 10, 11, 12, 13, 14, 15, 16, 19, 20, 21, 22, 23, 24, 25, 28, 29, 30, 31, 32, 33, 34 | Rê chuột xem chủ và vai trò; bấm bắt đầu dịch chuyển tới land. |
| 2 | 45 | Bấm để xem trang trước, nếu có. |
| 3 | 53 | Bấm để xem trang sau, nếu có. |

Danh sách có tối đa 21 mục mỗi trang. Hình minh họa một trang có mục; số mục thực tế thay đổi. Mũi tên ô 45 chỉ xuất hiện khi có trang trước, ô 53 khi có trang sau. Khi không có mục, các ô danh sách trống. Land bạn sở hữu đứng trước, rồi sắp theo tên. Land sở hữu dùng khối cỏ; land bạn tham gia dùng cây sồi non. Không có land thì ô 22 hiện **Bạn chưa có land nào** bằng biểu tượng rào cấm. Không có nút quay lại; dùng phím đóng túi đồ.

## Bản đồ chiếm đất

Gõ `/land map` hoặc bấm **Bản đồ chiếm đất**. Để chọn đúng land khi có nhiều land, mở bản đồ từ menu land đó.

![Bản đồ chiếm đất](/gui/vi/turtle-lands-map.svg)

*Hình: Bố cục minh họa Bản đồ chiếm đất.*

| # | Ô | Làm gì |
| --- | --- | --- |
| 1 | 0, 1, 2, 9, 10, 11, 18, 19, 20, 27, 28, 29, 36, 37, 38 | Chunk của land đang chọn: bấm để mở xác nhận bỏ chiếm, nếu bạn có quyền. |
| 2 | 3, 4, 5, 12, 13, 14, 21, 23, 30, 31, 32, 39, 40, 41 | Rê chuột xem giá; bấm mở xác nhận chiếm. Xem cả phí một lần, thuế mỗi kỳ và giới hạn trước khi đồng ý. |
| 3 | 6, 15, 24, 33, 42 | Rê chuột đọc lý do không thể chiếm. |
| 4 | 7, 8, 16, 17, 25, 26, 34, 35, 43, 44 | Rê chuột xem land và chủ; không chiếm được đất đã có chủ. |
| 5 | 22 | Đánh dấu chunk bạn đứng. Vẫn giữ tên, mô tả và thao tác của trạng thái đất tại đó; hình dùng ví dụ hoang dã. |
| 6 | 45 | Bấm để dịch vùng bản đồ theo hướng này. |
| 7 | 46 | Bấm để dịch vùng bản đồ theo hướng này. |
| 8 | 47 | Bấm để dịch vùng bản đồ theo hướng này. |
| 9 | 48 | Bấm để dịch vùng bản đồ theo hướng này. |
| 10 | 49 | Đóng menu và hiện ranh giới quanh bạn. |
| 11 | 50 | Rê chuột đọc ý nghĩa màu và vị trí của bạn. |
| 12 | 53 | Đóng bản đồ. |

Ô 0–44 là lưới 9 × 5 chunk, không phải danh sách. Hình minh họa các trạng thái, không phải bản đồ cố định. Mỗi ô ứng với tọa độ ghi khi rê chuột. Ban đầu ô 22 là chỗ bạn đứng; khi kéo bản đồ, mắt ender chỉ hiện nếu vị trí ấy còn nằm trong vùng xem. Mỗi mũi tên dịch vùng xem 3 chunk. Chunk xanh thuộc land khác bạn cũng tham gia chỉ để xem, không thể bỏ chiếm từ land đang chọn. Màu cam giải thích lý do bị chặn; nút đóng không quay lại hub.

## Thành viên {land}

Trong menu land, bấm **Thành viên**.

![Thành viên {land}](/gui/vi/turtle-lands-members.svg)

*Hình: Bố cục minh họa Thành viên {land}.*

| # | Ô | Làm gì |
| --- | --- | --- |
| 1 | 10, 11, 12, 13, 14, 15, 16, 19, 20, 21, 22, 23, 24, 25, 28, 29, 30, 31, 32, 33, 34 | Rê chuột xem vai trò, ngày tham gia, lần online cuối; bấm người thấp hơn để quản lý nếu được phép. |
| 2 | 45 | Bấm để xem trang trước, nếu có. |
| 3 | 53 | Bấm để xem trang sau, nếu có. |
| 4 | 48 | Về menu land. |
| 5 | 49 | Mở chọn người online, rồi chọn vai trò cho lời mời. |
| 6 | 50 | Xem hoặc quản lý người bị cấm. |

Danh sách có tối đa 21 mục mỗi trang. Hình minh họa một trang có mục; số mục thực tế thay đổi. Mũi tên ô 45 chỉ xuất hiện khi có trang trước, ô 53 khi có trang sau. Khi không có mục, các ô danh sách trống. Chủ đứng đầu, sau đó theo vai trò rồi tên. Ô 49 chỉ hiện nếu bạn được mời người khác. Bạn chỉ quản lý người có vai trò thấp hơn mình; bấm chủ không mở quản lý thành viên.

## Mời ai?

Bấm **Mời người chơi** từ danh sách thành viên.

![Mời ai?](/gui/vi/turtle-lands-pick-player.svg)

*Hình: Bố cục minh họa Mời ai?.*

| # | Ô | Làm gì |
| --- | --- | --- |
| 1 | 10, 11, 12, 13, 14, 15, 16, 19, 20, 21, 22, 23, 24, 25, 28, 29, 30, 31, 32, 33, 34 | Bấm người nhận lời mời; tiếp theo chọn vai trò. |
| 2 | 45 | Bấm để xem trang trước, nếu có. |
| 3 | 53 | Bấm để xem trang sau, nếu có. |
| 4 | 49 | Về danh sách thành viên. |

Danh sách có tối đa 21 mục mỗi trang. Hình minh họa một trang có mục; số mục thực tế thay đổi. Mũi tên ô 45 chỉ xuất hiện khi có trang trước, ô 53 khi có trang sau. Khi không có mục, các ô danh sách trống. Chỉ liệt kê người online chưa ở land và không bị cấm; bỏ qua chính bạn. Người ở gần được xếp trước. Không có ai thì ô 22 hiện **Không có ai để chọn** bằng rào cấm. Nếu người đã thoát, chọn lại từ danh sách.

## Mời làm vai trò gì?

Chọn người nhận trong **Mời ai?**.

![Mời làm vai trò gì?](/gui/vi/turtle-lands-pick-role.svg)

*Hình: Bố cục minh họa Mời làm vai trò gì?.*

| # | Ô | Làm gì |
| --- | --- | --- |
| 1 | 10 | Bấm để gửi lời mời với vai trò này. |
| 2 | 11 | Bấm để gửi lời mời với vai trò này. |
| 3 | 12 | Bấm để gửi lời mời với vai trò này. |
| 4 | 22 | Về danh sách thành viên. |

Hình là danh sách mặc định khi chủ mời. Bạn chỉ chọn được vai trò thấp hơn mình; danh sách được dồn từ ô 10. Vai trò khách không dùng để mời. Bấm vai trò gửi lời mời, chưa tự thêm người vào land. Tên và biểu tượng vai trò có thể khác trên server.

## Quản lý {player}

Trong **Thành viên**, bấm một người bạn được phép quản lý.

![Quản lý {player}](/gui/vi/turtle-lands-member.svg)

*Hình: Bố cục minh họa Quản lý {player}.*

| # | Ô | Làm gì |
| --- | --- | --- |
| 1 | 4 | Rê chuột xem vai trò hiện tại. |
| 2 | 19 | Bấm để đặt vai trò này; thao tác đổi ngay. |
| 3 | 20 | Bấm để đặt vai trò này; thao tác đổi ngay. |
| 4 | 21 | Bấm để đặt vai trò này; thao tác đổi ngay. |
| 5 | 38 | Mở xác nhận đuổi; người này mất tư cách thành viên. |
| 6 | 39 | Mở xác nhận cấm; loại khỏi thành viên và chặn vào land. |
| 7 | 41 | Chủ cần xác nhận hai lần. Sau đó bạn không còn sở hữu land. |
| 8 | 49 | Về danh sách thành viên. |

Hình là góc nhìn chủ với các vai trò mặc định. Ô 19–25 chứa tối đa 7 vai trò được gán, dồn từ trái sang phải; chỉ hiện khi bạn được đổi vai trò và người đó thấp hơn bạn. Vai trò hiện tại có mô tả riêng. Ô 38–39 cần quyền đuổi và cấp cao hơn; ô 41 chỉ dành cho chủ. Khi chuyển chủ xong, bạn thành thành viên cấp cao nhất.

## Danh sách cấm

Từ **Thành viên**, bấm **Danh sách cấm**.

![Danh sách cấm](/gui/vi/turtle-lands-bans.svg)

*Hình: Bố cục minh họa Danh sách cấm.*

| # | Ô | Làm gì |
| --- | --- | --- |
| 1 | 10, 11, 12, 13, 14, 15, 16, 19, 20, 21, 22, 23, 24, 25, 28, 29, 30, 31, 32, 33, 34 | Bấm để bỏ cấm ngay, nếu được phép. Bỏ cấm không tự thêm lại thành viên. |
| 2 | 45 | Bấm để xem trang trước, nếu có. |
| 3 | 53 | Bấm để xem trang sau, nếu có. |
| 4 | 48 | Về danh sách thành viên. |
| 5 | 49 | Bấm rồi gõ tên vào chat; cấm được áp dụng ngay nếu hợp lệ. |

Danh sách có tối đa 21 mục mỗi trang. Hình minh họa một trang có mục; số mục thực tế thay đổi. Mũi tên ô 45 chỉ xuất hiện khi có trang trước, ô 53 khi có trang sau. Khi không có mục, các ô danh sách trống. Danh sách sắp theo tên. Ô 49 chỉ hiện nếu bạn được đuổi/cấm; bỏ cấm cũng cần quyền này. Thêm qua chat cần tên người online hoặc người server còn nhận diện được; nếu không tìm thấy, hỏi quản trị viên.

## Vai trò và quyền

Trong menu land, bấm **Vai trò và quyền**.

![Vai trò và quyền](/gui/vi/turtle-lands-role-list.svg)

*Hình: Bố cục minh họa Vai trò và quyền.*

| # | Ô | Làm gì |
| --- | --- | --- |
| 1 | 10 | Bấm mở quyền của vai trò này nếu bạn được sửa. |
| 2 | 11 | Bấm mở quyền của vai trò này nếu bạn được sửa. |
| 3 | 12 | Bấm mở quyền của vai trò này nếu bạn được sửa. |
| 4 | 13 | Bấm mở quyền của vai trò này nếu bạn được sửa. |
| 5 | 22 | Về menu land. |

Vai trò mặc định nằm ở ô 10–13; server có thể thay tên, biểu tượng, quyền và số vai trò, tối đa 7 ô 10–16. Rê chuột xem số quyền đang bật và trạng thái mặc định/đã chỉnh. Bạn cần quyền chỉnh vai trò và chỉ sửa được cấp thấp hơn mình; chủ không có mục vai trò riêng ở đây.

## Quyền của Quản lý

Bấm vai trò được sửa trong **Vai trò và quyền**. Hình dùng vai trò mặc định **Quản lý**.

![Quyền của Quản lý](/gui/vi/turtle-lands-role-perms.svg)

*Hình: Bố cục minh họa Quyền của Quản lý.*

| # | Ô | Làm gì |
| --- | --- | --- |
| 1 | 4 | Thông tin vai trò và cách đọc màu quyền. |
| 2 | 10 | Bấm bật/tắt quyền **Xây** cho vai trò, nếu được phép. |
| 3 | 11 | Bấm bật/tắt quyền **Phá** cho vai trò, nếu được phép. |
| 4 | 12 | Bấm bật/tắt quyền **Rương và thùng chứa** cho vai trò, nếu được phép. |
| 5 | 13 | Bấm bật/tắt quyền **Cửa** cho vai trò, nếu được phép. |
| 6 | 14 | Bấm bật/tắt quyền **Redstone** cho vai trò, nếu được phép. |
| 7 | 15 | Bấm bật/tắt quyền **Tương tác sinh vật** cho vai trò, nếu được phép. |
| 8 | 16 | Bấm bật/tắt quyền **Đánh động vật** cho vai trò, nếu được phép. |
| 9 | 19 | Bấm bật/tắt quyền **Phương tiện** cho vai trò, nếu được phép. |
| 10 | 20 | Bấm bật/tắt quyền **Dịch chuyển** cho vai trò, nếu được phép. |
| 11 | 21 | Bấm bật/tắt quyền **Mời** cho vai trò, nếu được phép. |
| 12 | 22 | Bấm bật/tắt quyền **Đuổi và cấm** cho vai trò, nếu được phép. |
| 13 | 23 | Bấm bật/tắt quyền **Chiếm đất** cho vai trò, nếu được phép. |
| 14 | 24 | Bấm bật/tắt quyền **Bỏ chiếm** cho vai trò, nếu được phép. |
| 15 | 25 | Bấm bật/tắt quyền **Đặt điểm hồi sinh** cho vai trò, nếu được phép. |
| 16 | 28 | Bấm bật/tắt quyền **Đổi cờ** cho vai trò, nếu được phép. |
| 17 | 29 | Bấm bật/tắt quyền **Chỉnh vai trò** cho vai trò, nếu được phép. |
| 18 | 30 | Bấm bật/tắt quyền **Nạp ngân hàng** cho vai trò, nếu được phép. |
| 19 | 31 | Bấm bật/tắt quyền **Rút ngân hàng** cho vai trò, nếu được phép. |
| 20 | 48 | Bấm để trả toàn bộ quyền vai trò này về mặc định của server. |
| 21 | 49 | Về danh sách vai trò. |

Xanh lá là bật, đỏ là tắt. Bấm quyền để đổi ngay; bạn không thể bật quyền chính mình không có. Chỉ sửa vai trò thấp hơn bạn. Với vai trò khách, chỉ 9 quyền hành động đầu xuất hiện ở ô 10–16, 19–20; các quyền quản lý không xuất hiện. Tiêu đề, biểu tượng ô 4 và trạng thái đổi theo vai trò đang chọn. Ô 32–34 trống trong hình, không phải quyền bổ sung.

## Cờ của land

Trong menu land, bấm **Cờ của land**. Cờ là công tắc áp dụng cho cả land.

![Cờ của land](/gui/vi/turtle-lands-flags.svg)

*Hình: Bố cục minh họa Cờ của land.*

| # | Ô | Làm gì |
| --- | --- | --- |
| 1 | 10 | Bấm để đổi. Cho phép người chơi đánh nhau; xét land nơi nạn nhân đứng. |
| 2 | 11 | Bấm để đổi. Cho phép quái sinh tự nhiên và các đợt sinh quái được bảo vệ. |
| 3 | 12 | Bấm để đổi. Cho phép vụ nổ phá khối trong land. |
| 4 | 14 | Bấm để đổi. Cho phép lửa lan và đốt khối. |
| 5 | 15 | Bấm để đổi. Cho phép sinh vật như enderman thay đổi khối; cừu ăn cỏ và dân làng làm ruộng được xử lý riêng. |
| 6 | 16 | Bấm để đổi. Bật: mọi người nhặt đồ rơi. Tắt: chỉ chủ và thành viên được tính vào giới hạn được nhặt; Khách tin cậy mặc định không được nhặt. |
| 7 | 22 | Về menu land. |

Tên nút luôn kèm **BẬT** hoặc **TẮT**. Hình dùng mặc định: chỉ **Ai cũng nhặt đồ** bật; server có thể đổi. Bạn có thể xem, nhưng chỉ đổi được nếu vai trò cho phép. Tắt nổ chỉ bảo vệ khối; không phải bảo đảm miễn sát thương vụ nổ. Tắt quái sinh ra không xóa quái đã có và không chặn mọi kiểu sinh quái.

## Ngân hàng và thuế

Trong menu land, bấm **Ngân hàng và thuế**. Ngân hàng land tách biệt với ví của bạn.

![Ngân hàng và thuế](/gui/vi/turtle-lands-bank.svg)

*Hình: Bố cục minh họa Ngân hàng và thuế.*

| # | Ô | Làm gì |
| --- | --- | --- |
| 1 | 4 | Rê chuột xem số dư, thuế mỗi kỳ, số kỳ đủ trả, lần thu tới và cảnh báo nợ. |
| 2 | 10 | Chuyển tiền từ ví bạn vào ngân hàng land ngay. Số tiền: 1,000. |
| 3 | 11 | Chuyển tiền từ ví bạn vào ngân hàng land ngay. Số tiền: 10,000. |
| 4 | 12 | Chuyển tiền từ ví bạn vào ngân hàng land ngay. Số tiền: 100,000. |
| 5 | 13 | Chuyển tiền từ ví bạn vào ngân hàng land ngay. Số tiền: 1,000,000. |
| 6 | 19 | Chuyển tiền từ ngân hàng land về ví bạn ngay. Số tiền: 1,000. |
| 7 | 20 | Chuyển tiền từ ngân hàng land về ví bạn ngay. Số tiền: 10,000. |
| 8 | 21 | Chuyển tiền từ ngân hàng land về ví bạn ngay. Số tiền: 100,000. |
| 9 | 22 | Chuyển tiền từ ngân hàng land về ví bạn ngay. Số tiền: 1,000,000. |
| 10 | 14 | Bấm rồi gõ số nguyên dương vào chat, ví dụ `5000`, `5.000`, `10k`. |
| 11 | 23 | Bấm rồi nhập số tiền vào chat. |
| 12 | 31 | Rê chuột xem lịch sử, gồm nạp/rút, hoàn tiền và thuế. Trạng thái chờ admin cần hỏi quản trị viên. |
| 13 | 49 | Về menu land. |

Chỉ có menu này khi server dùng thuế. Nút nạp/rút hiện theo quyền của bạn; hình thể hiện cả hai nhóm. Thông tin đổi theo số chunk, miễn thuế, thời điểm thu, trạng thái nợ hoặc tạm dừng. Lịch sử tự tải khi mở và gộp tối đa 10 giao dịch/thuế mới nhất. Không đặt vật phẩm vào đây; đây là giao dịch tiền.

## Đọc ranh giới ngoài thế giới

**Xem ranh giới** chỉ hiện đường viền cho bạn trong thời gian ngắn: xanh là land bạn sở hữu hoặc tham gia, đỏ là land khác, vàng là chunk vừa chiếm. Mặc định hiện 10 giây; server có thể đổi. Đây là dấu chỉ vị trí, không phải khối xây thật.

## Các hộp xác nhận

Chiếm chunk mở **Chiếm chunk này?**; bỏ chiếm mở **Bỏ chiếm chunk này?**. Đọc giá, thuế, khoản hoàn và tác động trước khi xác nhận. Hủy để không áp dụng thao tác.

**Rời land?**, **Xoá land?**, **Đuổi người này?** và **Cấm người này?** yêu cầu xác nhận. Riêng **Chuyển chủ (1/2)** tiếp tục tới **Chắc chắn chuyển chủ? (2/2)**; xác nhận bước cuối làm bạn mất quyền chủ.

Nhận lời mời: bấm **[Chấp nhận]** hoặc **[Từ chối]** trong chat để mở **Vào land {land}?** hoặc **Từ chối land {land}?**. Kiểm tra người mời và vai trò, rồi xác nhận. Không có lời mời hợp lệ thì không thể tham gia bằng cách tự gõ mã.

:::caution[Chưa rõ]
Hộp xác nhận là menu dùng chung của server nên hướng dẫn này không vẽ nó. Nếu game báo chưa có hộp xác nhận, hỏi quản trị viên; thao tác chưa được thực hiện.
:::
