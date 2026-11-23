---
title: "TurtleFarmPets: Mẹo và hỏi đáp"
description: Giải đáp về trứng, đói, thức ăn, EXP, boss, thăm trại và phần thưởng.
sidebar:
  label: Mẹo và hỏi đáp
  order: 4
---

## 1. Kiếm trứng đầu tiên ở đâu?

Boss có thể rơi **Trứng Lửa**. Rương thưởng cũng có thể phát trứng nếu server có phần thưởng đó. Bạn không cần có pet để gặp quái theo mặc định, nhưng server có thể đổi điều kiện. Hãy thu hoạch hoặc chặt cây ở khu được hỗ trợ, tự đánh quái rồi tăng tiến độ boss.

:::caution[Chưa rõ]
Mã plugin không xác định rương cụ thể nào trên server có trứng, hay cách bạn lấy chìa khóa rương đó. Hỏi quản trị viên về nguồn trứng đang mở.
:::

## 2. Trứng ấp khi offline có bị dừng không?

Không. Thời gian ấp tính theo thời điểm. Khi đủ giờ, mở Lò ấp và bấm trứng sẵn sàng; khi cảnh trại hoạt động và chủ online, trứng cũng có thể tự nở. Mỗi lò chỉ giữ một quả đang ấp. Chuồng đầy không làm mất pet mới: pet vào Kho pet.

## 3. Pet đói có chết hoặc mất buff không?

Mã xử lý đói làm pet ngừng bắn khi hết độ no, không xóa pet. Mặc định đói không tắt buff; server có thể đổi. Pet trong chuồng giảm độ no cả lúc offline và tốn thêm độ no khi bắn. Rút về kho dừng giảm theo thời gian, nhưng cũng dừng buff và chiến đấu.

## 4. Vì sao có thức ăn mà pet chưa no hẳn?

Pet ở chuồng tự ăn từ máng khi cần bổ sung. Nó ưu tiên món yêu thích, rồi món có lượng điểm no lớn hơn; tự ăn bỏ qua món vượt phần độ no còn thiếu để tránh lãng phí. Vì thế có thể còn thiếu một ít. Muốn cho đầy, mở Cho ăn và bấm món. Cho ăn thủ công dùng cả món cuối dù một phần điểm no bị vượt mức tối đa. Shift + bấm chỉ dùng một món, dừng nếu pet đã no.

## 5. Nạp một món sao lại mất nhiều chồng trong túi?

Bấm món ở túi đồ khi mở Máng ăn sẽ nạp mọi chồng cùng món, đến sức chứa còn trống. Không phải chỉ nạp chồng vừa bấm. Biểu tượng thức ăn ở phần máng chỉ hiển thị thông tin. Nếu thấy “không phải thức ăn”, dùng đúng món được máng liệt kê. Sức chứa tính theo điểm no cơ bản; thưởng món yêu thích không làm tăng phần sức chứa mà món chiếm.

## 6. Vì sao không thấy nút Nạp từ ba lô?

Nút chỉ hiện trên trại bạn khi server bật chức năng và TurtleBackpack khả dụng. Khi bấm mà không nạp được, ba lô có thể không còn món hợp lệ hoặc máng không đủ chỗ cho một món. Khách không được nạp máng trại người khác.

## 7. Tại sao pet không lên cấp khi tôi tự đánh?

Pet nhận EXP chiến đấu từ sát thương và quái hạ được bằng đạn của chính nó. Bạn tự hạ quái không trực tiếp cho pet EXP theo cách này. Một số thức ăn cũng cho EXP; xem dòng EXP khi ăn. Món yêu thích tăng điểm no, không tự nhân EXP. Khi đã đạt cấp tối đa, pet không lên thêm cấp.

## 8. Vì sao bạn tôi không thấy quái, hoặc quái biến mất?

Quái farm là quái riêng của bạn. Chúng bỏ chạy khi hết thời gian; boss chạy mất không có thưởng. Đổi thế giới, dịch chuyển xa, chết hoặc rời game có thể xóa cuộc chạm trán đang diễn ra. Hãy đánh sớm và giữ khu vực đang farm. Pet ưu tiên boss khi có boss; mặc định Cáo Lửa đánh đơn, Sói Lửa đánh lan, Phượng Hoàng Con đánh nhiều mục tiêu (server có thể đổi).

## 9. Tôi có thể thăm trại offline và sửa giúp bạn không?

Bạn có thể thăm trại chủ offline nếu server nhận diện được người đó và quyền xem cho phép. Công khai cho mọi người xem; Cùng đảo yêu cầu cùng đảo được server nhận diện; Riêng tư dành cho chủ. Khách chỉ xem pet, máng và lò, không cho ăn, đổi tên, chuyển hoặc thả pet. Mở menu trại của bạn không tự kết thúc lượt thăm; dùng `/traithu thoat` để thoát hẳn.

## 10. Đổi tên pet được dùng ký tự nào?

Dùng chữ, số, dấu cách, gạch dưới hoặc gạch ngang. Mặc định tối đa 16 ký tự (server có thể đổi). Gõ tên vào ô chữ bàn đe rồi bấm kết quả bên phải. Nút Đặt lại tên gốc xuất hiện khi pet có tên riêng. Đổi tên không tốn cấp kinh nghiệm.

## 11. Thả pet có lấy lại đủ thức ăn không?

Không hoàn toàn bộ thức ăn đã dùng. Mặc định trả 5 Wheat mỗi cấp pet vào máng, chỉ tới sức chứa còn trống (server có thể đổi món và lượng trả). Pet bị xóa vĩnh viễn sau xác nhận. Nếu chỉ cần chỗ chuồng, dùng Rút về kho để giữ pet.

## 12. Túi đầy thì thưởng đi đâu?

Plugin thử giao vật phẩm qua hệ thống thưởng và gửi hòm thư khi cần. Nếu thấy thông báo gửi hòm thư, kiểm tra hòm thư của server. Nếu dịch vụ này không khả dụng và túi vẫn đầy, vật phẩm có thể không giao được; hãy chừa chỗ trước khi farm. Tiền thưởng được cộng vào ví khi hệ thống tiền hỗ trợ loại tiền đó.
