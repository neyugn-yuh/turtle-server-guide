---
title: "TurtleFarmPets: Giao diện"
description: Cách mở và thao tác mọi giao diện trại pet.
sidebar:
  label: Giao diện
  order: 2
---

## Cách đọc hình

Ô được đếm từ 0, trái sang phải, trên xuống. Hình là ví dụ trạng thái, không phải ảnh chụp. Tên menu và nút giữ nguyên tiếng Việt như bản game đi kèm. `{player}` là tên chủ trại. Kính xám chỉ trang trí; không kéo đồ vào menu.

## Trại pet của {player}

Gõ `/traithu`.

![Trại pet của {player}](/gui/vi/turtle-farm-pets-hub.svg)

*Hình: Trại pet của {player}.*

| # | Ô | Làm gì |
| --- | --- | --- |
| 1 | 10 | Bấm chọn pet từ kho. |
| 2 | 11 | Bấm xem giá và mở chuồng tiếp theo. |
| 3 | 12 | Cần mở chuồng trước và được server cho phép. |
| 4 | 46 | Rê chuột xem tổng buff từ pet trong chuồng. |
| 5 | 47 | Bấm mở máng ăn. |
| 6 | 48 | Bấm xem trứng và thời gian ấp. |
| 7 | 49 | Bấm xem pet trong kho. |
| 8 | 50 | Bấm chọn trại để thăm. |
| 9 | 51 | Bấm đổi quyền xem. |
| 10 | 52 | Bấm dịch chuyển tới lối vào trại. |

Hình là trại mới theo mặc định. Chuồng có pet hiện biểu tượng pet. Chuồng trống mở danh sách chọn pet; chuồng khóa mở trang mua. Mở theo thứ tự. Nếu server có nhiều chuồng, mỗi trang chứa 21 chuồng ở các ô 10–16, 19–25, 28–34; mũi tên 45/53 chỉ hiện khi có trang trước/sau. Quyền xem luân phiên Công khai, Cùng đảo, Riêng tư.

## Chuồng 2 · Chuồng 2

Bấm chuồng khóa trong trại hoặc trong menu chính.

![Chuồng 2 · Chuồng 2](/gui/vi/turtle-farm-pets-pen.svg)

*Hình: Chuồng 2 · Chuồng 2.*

| # | Ô | Làm gì |
| --- | --- | --- |
| 1 | 13 | Rê chuột xem giá. |
| 2 | 15 | Bấm mở hộp xác nhận, rồi xác nhận hoặc hủy. |
| 3 | 22 | Về menu chính. |

Hình minh họa chuồng 2. Mặc định giá 50.000 orbs; chuồng 3 giá 250.000 orbs và cần server cho phép (server có thể đổi). Nếu chưa mở chuồng trước, ô 15 là Chưa thể mở.

## Kho pet

Bấm Kho pet trong menu chính.

![Kho pet](/gui/vi/turtle-farm-pets-storage.svg)

*Hình: Kho pet.*

| # | Ô | Làm gì |
| --- | --- | --- |
| 1 | 0–44 | Bấm mở chi tiết pet. |
| 2 | 49 | Về menu chính. |

Hình minh họa kho có một Sói Lửa. Pet nằm ở ô 0–44, tối đa 45 mỗi trang; mũi tên 45/53 chỉ hiện khi có trang tương ứng. Kho trống hiện Kho trống ở ô 22.

## Chọn pet cho chuồng 1

Bấm chuồng đã mở còn trống.

![Chọn pet cho chuồng 1](/gui/vi/turtle-farm-pets-pet-pick.svg)

*Hình: Chọn pet cho chuồng 1.*

| # | Ô | Làm gì |
| --- | --- | --- |
| 1 | 0–44 | Bấm đặt pet vào chuồng đã chọn. |
| 2 | 49 | Về menu chính. |

Hình minh họa kho có một Sói Lửa. Pet nằm ở ô 0–44, tối đa 45 mỗi trang; mũi tên 45/53 chỉ hiện khi có trang tương ứng. Kho trống hiện Kho trống ở ô 22.

## Pet · Sói Lửa

Bấm pet trong chuồng hoặc Kho pet.

![Pet · Sói Lửa](/gui/vi/turtle-farm-pets-pet.svg)

*Hình: Pet · Sói Lửa.*

| # | Ô | Làm gì |
| --- | --- | --- |
| 1 | 13 | Rê chuột xem loài, độ hiếm, cấp, EXP, độ no, sát thương hiện tại/cấp sau và buff. |
| 2 | 29 | Mở danh sách thức ăn trong máng. |
| 3 | 30 | Rút pet về kho. |
| 4 | 32 | Mở bàn đe đổi tên. |
| 5 | 33 | Mở xác nhận thả pet vĩnh viễn. |
| 6 | 40 | Về menu chính. |

Hình là pet đang ở chuồng. Khi pet trong kho, ô 30 đổi thành Đặt vào chuồng (cổng gỗ), đặt vào chuồng trống đầu tiên. Khách chỉ thấy thông tin và Đóng ở ô 40; không có nút sửa.

## Máng ăn · {player}

Bấm Máng ăn trong menu chính hoặc tại trại.

![Máng ăn · {player}](/gui/vi/turtle-farm-pets-trough.svg)

*Hình: Máng ăn · {player}.*

| # | Ô | Làm gì |
| --- | --- | --- |
| 1 | 4 | Xem điểm no đang chứa/tối đa. |
| 2 | 10 | Wheat: xem số lượng, điểm no và EXP. |
| 3 | 11 | Melon Slice: xem thông tin; không nạp bằng nút này. |
| 4 | 12 | Cooked Salmon: xem thông tin. |
| 5 | 40 | Về menu chính. |
| 6 | 41 | Bấm lấy thức ăn từ TurtleBackpack đến khi hết chỗ. |
| 7 | 13 | Thit Nuong x0: món tùy chỉnh, chỉ xem thông tin. |

Hình minh họa ba món thường, món tùy chỉnh và nút ba lô khi khả dụng. Ô 13 minh họa dạng giấy dự phòng Thit Nuong khi vật phẩm tùy chỉnh không khả dụng; khi khả dụng, tên và hình do server cung cấp. Danh sách xếp theo điểm no tăng dần, ở ô 10–16, 19–25; mũi tên 36/44 khi có thêm trang. Khách chỉ xem; ô 40 là Đóng và không có nút ba lô.

1. Để thức ăn trong túi đồ của bạn.
2. Bấm món đó ở phần túi đồ bên dưới. Plugin nạp mọi chồng cùng món, chỉ lấy lượng vừa máng.
3. Mở pet rồi Cho ăn để sử dụng. Bấm biểu tượng món trong phần máng không nạp hay rút đồ.

## Cho Sói Lửa ăn

Trong trang pet, bấm Cho ăn.

![Cho Sói Lửa ăn](/gui/vi/turtle-farm-pets-feed.svg)

*Hình: Cho Sói Lửa ăn.*

| # | Ô | Làm gì |
| --- | --- | --- |
| 1 | 4 | Xem pet đang cho ăn. |
| 2 | 10 | Bấm ăn Wheat tới no; Shift + bấm ăn một món. |
| 3 | 11 | Bấm ăn Melon Slice tới no; Shift + bấm ăn một món. |
| 4 | 12 | Bấm ăn Cooked Salmon tới no; Shift + bấm ăn một món. |
| 5 | 31 | Về chi tiết pet. |

Chỉ hiện món đang có trong máng, ở ô 10–16, 19–25; không phân trang. Hình minh họa máng có ba món thường. Máng rỗng hiện Máng đang trống ở ô 22. Rê chuột xem món yêu thích và lượng điểm no thực nhận.

## Lò ấp · {player}

Bấm Lò ấp trong menu chính hoặc tại trại.

![Lò ấp · {player}](/gui/vi/turtle-farm-pets-incubator.svg)

*Hình: Lò ấp · {player}.*

| # | Ô | Làm gì |
| --- | --- | --- |
| 1 | 10 | Bấm đặt một quả từ túi vào lò; rê chuột xem số lượng và thời gian. |
| 2 | 22 | Về menu chính. |

Hình là lò trống khi bạn mang Trứng Lửa. Các loại trứng mang theo xếp theo thứ tự túi đồ ở ô 10–16, không phân trang. Khi đang ấp hoặc sẵn sàng, chỉ trứng ở ô 13: chờ hết giờ rồi bấm nở. Khi cảnh trại hoạt động và chủ online, trứng đủ giờ cũng có thể tự nở. Không có trứng hiện thông báo ở ô 13. Khách chỉ xem, ô 22 là Đóng.

## Xem trại người khác

Bấm Xem trại người khác trong menu chính.

![Xem trại người khác](/gui/vi/turtle-farm-pets-visit.svg)

*Hình: Xem trại người khác.*

| # | Ô | Làm gì |
| --- | --- | --- |
| 1 | 3 | Bấm chuyển sang người đang online. |
| 2 | 5 | Bấm xem trại nổi bật theo tổng cấp pet. |
| 3 | 9–44 | Rê chuột xem tổng cấp; bấm bắt đầu thăm. |
| 4 | 47 | Bấm đổi quyền xem trại của chính bạn. |
| 5 | 49 | Thoát thăm nếu có, rồi mở trại của bạn. |

Hình minh họa tab online có một trại. Danh sách ở ô 9–44, tối đa 36 mỗi trang; mũi tên 45/53 khi có trang tương ứng. Online xếp tổng cấp giảm dần; Nổi bật có cả chủ offline. Trại riêng tư vẫn có thể có tên trong danh sách nhưng không cho bạn vào. Trống/đang tải có thông báo ở ô 22. Khi đang thăm, ô 49 đổi lời nhắc thoát xem.

## Đổi tên pet

Trong trang pet, bấm Đổi tên.

![Đổi tên pet](/gui/vi/turtle-farm-pets-rename.svg)

*Hình: Đổi tên pet.*

| # | Ô | Làm gì |
| --- | --- | --- |
| 1 | 0 | Giấy mang tên hiện tại; gõ tên trong ô chữ phía trên bàn đe, không đặt đồ vào. |
| 2 | 1 | Bấm xóa tên riêng, trở về tên loài. |
| 3 | 2 | Bấm kết quả để đổi tên; không tốn cấp kinh nghiệm. |

Đây là sơ đồ ba ô bàn đe 0–2; các ô 3–8 chỉ do khung vẽ chín cột, không tồn tại trong bàn đe thật. Ô 1 chỉ hiện khi pet đã có tên riêng. Ô 2 chỉ hiện khi bạn gõ tên mới khác tên hiện tại, không rỗng.

## Xác nhận mua và thả pet

Mở chuồng và Thả đi dùng hộp xác nhận. Kiểm tra giá hoặc pet trước khi đồng ý; hủy để giữ nguyên. Nếu menu xác nhận chưa sẵn sàng, thao tác không thực hiện.

:::caution[Thả pet]
Thả đi xóa pet vĩnh viễn. Thức ăn hoàn vào máng chỉ đến sức chứa còn trống.
:::
