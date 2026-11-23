---
title: "TurtleLands: Mẹo và hỏi đáp"
description: Giải đáp về chiếm đất, vai trò, thuế và bảo vệ land.
sidebar:
  label: Mẹo và hỏi đáp
  order: 4
---

## Vì sao tôi không chiếm được ô hoang dã?

Rê chuột lên ô cam để đọc lý do: thế giới không cho chiếm, chunk bị khóa, quá gần spawn hoặc land khác, vượt giới hạn hay không liền cạnh. Mặc định phải cách spawn ít nhất 300 khối, cách land khác 1 chunk và nối cạnh đất mình; server có thể đổi. Thiếu quyền, thiếu tiền hoặc land nợ thuế cũng chặn chiếm. Đất nối góc chéo không tính là liền cạnh.

## Vì sao bỏ chiếm bị từ chối? Nhà có mất không?

Không bỏ được chunk cuối cùng; muốn bỏ hết, chủ phải xóa land. Khi yêu cầu liền mạch đang áp dụng, không bỏ được chunk làm land tách thành hai mảnh trong cùng thế giới. Khối xây vẫn còn sau bỏ chiếm, nhưng không còn bảo vệ. Đọc khoản hoàn trước khi xác nhận; mặc định hoàn phí chiếm là 0%, server có thể đổi. Nếu có hoàn, tiền bỏ chiếm trả về ví người bấm.

## Tôi còn tiền trong ví, vì sao land vẫn nợ?

Thuế duy trì chỉ lấy từ ngân hàng land. Mở **Ngân hàng và thuế**, xem số cần trả rồi nạp. Khi thuế đang hoạt động, nạp đủ trả kỳ hiện tại sẽ tự trả thuế và xóa nợ; nạp thiếu sẽ báo số còn thiếu. Giữ thêm tiền cho kỳ sau. Phí chiếm chunk lại lấy từ ví người bấm, không dùng ngân hàng land.

## Khi nào thu thuế? Offline có giữ được đất không?

Mặc định land mới miễn duy trì 3 ngày, rồi tới kỳ thu kế tiếp; thu hằng ngày lúc 00:00 theo giờ Việt Nam. Land nợ liên tục 7 ngày mặc định có thể bị giải tán. Server có thể đổi các mốc này; ưu tiên thời điểm và đếm ngược trong menu. Bạn thoát game không dừng thuế. Nếu thuế được tạm dừng, đồng hồ nợ cũng dừng; đây khác với việc bạn offline. Mặc định server tắt lâu quá 30 phút được xử lý như tạm dừng, nhưng server có thể đổi.

## Land đã bị giải tán do nợ thì sao?

Đất mất bảo vệ và số dư ngân hàng còn lại được hoàn cho chủ. Liên hệ quản trị viên sớm: mã cho phép khôi phục trong 24 giờ sau giải tán. Khôi phục không bảo đảm lấy lại chunk đã bị người khác chiếm; tên land cũng phải còn dùng được và ngân hàng khôi phục về 0. Xóa land chủ động là thao tác vĩnh viễn, không phải khôi phục do nợ.

## Khách tin cậy khác Thành viên thế nào?

Mặc định **Thành viên** có quyền xây, phá, dùng rương và nạp ngân hàng; **Khách tin cậy** chỉ dùng cửa, rương và dịch chuyển, không tính vào giới hạn thành viên. **Khách** là người không tham gia land, mặc định dùng được cửa. Server và chủ có thể đổi quyền. Khi **Ai cũng nhặt đồ** tắt, chỉ chủ và thành viên được tính vào giới hạn được nhặt; Khách tin cậy mặc định không được. Đừng dựa vào tên vai trò để đoán quyền.

## Vì sao tôi không đổi được quyền hoặc quản lý một người?

Bạn cần quyền tương ứng và chỉ quản lý người, vai trò thấp hơn mình. Bạn không thể bật quyền mình không có cho vai trò khác. Chủ có mọi quyền; khách chỉ giữ quyền hành động, không giữ quyền quản lý. Vai trò **Quản lý** mặc định không có quyền chỉnh vai trò hoặc bỏ chiếm. Nhờ chủ kiểm tra; các quyền này có thể đã đổi trên server.

## Đuổi, cấm, bỏ cấm và chuyển chủ khác nhau ra sao?

Đuổi loại người đó khỏi thành viên; cấm còn chặn họ vào land và đưa họ ra ngoài nếu đang ở trong. Bỏ cấm không tự khôi phục thành viên: cần mời lại. Chủ không thể tự rời land; cần chuyển chủ hoặc xóa. Chuyển chủ cho thành viên cần hai lần xác nhận, và chủ cũ thành thành viên cấp cao nhất. Người nhận phải còn chỗ sở hữu land theo giới hạn của họ.

## Vì sao dịch chuyển bị hủy hoặc tới chỗ khác tôi mong đợi?

Di chuyển hoặc bị thương hủy thời gian chờ. Bạn cần quyền dịch chuyển tại land đích. Nếu chưa đặt điểm, plugin chọn giữa một chunk của land và vị trí trên mặt đất; hãy đặt điểm rõ ràng trong land để chủ động nơi tới. **Đặt điểm hồi sinh** dùng cho dịch chuyển tới land; mã này không thay điểm hồi sinh khi chết.

## Tắt nổ, quái hoặc lửa có bảo vệ tuyệt đối không?

Tắt **Nổ** bảo vệ khối khỏi vụ nổ, không hứa chặn sát thương. Tắt **Quái sinh ra** chặn các kiểu sinh quái được xử lý, không xóa quái đã có và không chặn mọi cách sinh. Cờ lửa kiểm soát lan và cháy khối; người chơi châm lửa vẫn được kiểm tra quyền xây. PvP xét land nơi người bị đánh đứng. Đọc mô tả mỗi cờ trước khi đổi.

## Vì sao phễu, piston hoặc nước không đi qua ranh land?

Plugin chặn nhiều tác động vượt ranh vào land khác: nước/dung nham, piston, máy phân phát và tăng trưởng cây. Phễu ngoài land không được hút đồ từ trong land; chuyển đồ vào land khác cũng bị chặn. Đặt hệ thống bên trong cùng land và kiểm tra ranh trước khi xây máy sát mép.

## Nạp tiền lỗi hoặc thấy “chờ admin” thì làm gì?

Nhập số nguyên dương, ví dụ `5000`, `5.000`, `10k`; không nhập số âm hoặc số lẻ. Kiểm tra ví khi nạp, số dư land khi rút, và quyền của mình. Nếu báo đang xử lý, chờ kết quả rồi kiểm tra lại. Giao dịch “chờ admin” cần quản trị viên kiểm tra; không coi khoản đó đã hoàn tất. Nếu hệ thống tiền hoặc lưu dữ liệu lỗi lặp lại, báo quản trị viên kèm thời điểm và số tiền.
