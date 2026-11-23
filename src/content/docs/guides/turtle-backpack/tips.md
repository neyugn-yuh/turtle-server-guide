---
title: "TurtleBackpack: Mẹo và hỏi đáp"
description: Giải đáp các tình huống thường gặp khi dùng TurtleBackpack.
sidebar:
  label: Mẹo và hỏi đáp
  order: 4
---

## Vì sao không kéo đồ từ túi vào ba lô được?

Menu dùng để xem và bấm thao tác. Kéo, Shift + bấm đồ trong túi và phím số không gửi đồ vào kho. Dùng nguồn thu đồ được server tích hợp; không có lệnh gửi đồ thủ công trong nhóm lệnh người chơi.

## Vì sao nhặt lúa mì vẫn vào túi thường?

Tự cất đồ nhặt dưới đất mặc định bị tắt. Nếu server bật, nguyên chồng phải vừa sức chứa của loại đó. Đồ người chơi ném ra hoặc đồ thường đã đổi tên, thêm mô tả hay phù phép không được nhận như nguyên liệu Minecraft thuần.

## Một loại đầy thì cả ba lô đầy sao?

Không. Mỗi loại có giới hạn riêng. Bạn có thể tiếp tục cất loại khác còn chỗ. Cá đặc biệt cùng loại chia sẻ giới hạn dù từng con có kích thước hoặc giá khác nhau.

## Đồ dư có rơi xuống đất để nhặt lại không?

Với đồ từ công cụ đi qua ba lô, không. Mặc định đồ dư thử vào túi, rồi chờ bán tự động nếu có giá và server cho phép bạn. Phần không xử lý được bị bỏ. Nếu đồ chờ bán không bán được, hệ thống thử trả vào ba lô; phần không vừa vẫn có thể mất. Dọn chỗ trước khi tiếp tục thu đồ.

## Bật tự bán rồi, vì sao chưa nhận tiền?

Đợt tự bán chạy khoảng mỗi 5 giây khi bạn trực tuyến. Loại đó cần có đồ và có giá bán. Kiểm tra trạng thái **Tự bán** trong mô tả; biểu tượng phát sáng khi bật. Nếu server không cho phép bạn dùng nữa, tự bán loại đã chọn cũng không chạy. Đồ dư có thể được bán theo cách xử lý khi đầy, dù bạn chưa bật tự bán loại đó.

## Vì sao bán tất cả mà vẫn còn đồ?

Đồ không có giá hoặc không còn được hỗ trợ không nằm trong phần bán được. Cửa hàng có thể chỉ nhận một phần. Ngoài ra, **Giữ đồ** có thể cho tiền mà vẫn giữ lại loại đó; mặc định tính năng này không áp dụng cho tự bán.

## Giá ước tính có gồm bán may mắn không?

Không. Giá ước tính có tính hệ số bán nhưng chưa tính lần may mắn. May mắn được xét một lần cho cả đợt bán, không riêng từng vật phẩm. Mặc định lần may mắn nhân đôi tiền; server có thể đổi. Giá thực tế được tính lại lúc bán.

## Không rút được đồ thì làm gì?

Chừa chỗ trong túi. Nhấn trái chỉ rút tối đa một stack; Shift + trái rút tối đa vừa túi. Nếu báo **Hiện chưa tạo được vật phẩm này.**, hãy hỏi quản trị viên: vật phẩm tùy chỉnh có thể tạm không tạo được. Số đang lưu không bị trừ khi chưa tạo được đồ.

## Vật phẩm ngừng hỗ trợ có mất hết không?

Số còn lưu được giữ lại và xuất hiện qua **Vật phẩm ngừng hỗ trợ** khi bạn còn đồ. Bạn chỉ rút được ở đó, không bán hay bật tự bán bằng các nút của danh mục này. Nếu biểu tượng là rào cấm và rút thất bại, hỏi quản trị viên.

## Biểu tượng ba lô có phải vật phẩm để trao đổi không?

Không. Nó chỉ mở menu; bạn không thể ném, cất vào rương hay chuyển sang tay phụ. Mặc định nó nằm ở ô thứ chín thanh phím tắt, server có thể đổi. Dùng `/bp icon` để ẩn hoặc hiện nếu server cho phép. Nếu ô bị chiếm và túi đầy, dọn một ô trống. Ẩn biểu tượng không xóa đồ trong ba lô.

## Nâng cấp báo lỗi hoặc đã tối đa thì sao?

Kiểm tra giá và đúng loại tiền hiển thị. **ĐÃ ĐẠT CẤP TỐI ĐA** nghĩa không mua thêm cấp của mục đó được. Nếu một lần nâng cấp khác đang lưu, chờ kết quả. Khi không lưu được nâng cấp, hệ thống hoàn tiền. Nếu loại tiền không có trên server, hỏi quản trị viên.

## Mốc sưu tầm tính theo số đồ đang giữ sao?

Không. Mốc dựa trên tổng số đã nhận vào ba lô của từng loại qua thời gian; bán hoặc rút không đặt lại tổng này. Mặc định mốc 10.000, 100.000 và 1.000.000 thưởng tương ứng 1.000, 10.000 và 100.000 tiền; server có thể đổi hoặc tắt. Khi vượt mốc, bạn thấy thông báo thưởng, không cần nút nhận riêng.
