# **Corpus Christi LMS 🕊️**

Hệ thống **Corpus Christi LMS** là một nền tảng Quản lý Học tập (Learning Management System) chạy trên nền tảng web, được thiết kế chuyên biệt cho công tác giáo lý và phong trào Thiếu Nhi Thánh Thể (TNTT) thuộc Giáo xứ (Iuventus Eucharistica Corporis Christi).

&nbsp;

Dự án hỗ trợ Ban điều hành và các Huynh trưởng/Giáo lý viên (GLV) quản lý toàn diện thông tin đoàn sinh, sổ điểm danh, sổ học bạ, thi đua đội nhóm và tiến độ công việc thông qua môi trường đồng bộ dữ liệu thời gian thực (Cloud).

# **🌟 Các tính năng nổi bật (Features)**

* **📊 Tổng quan (Dashboard):** Báo cáo bằng số liệu và biểu đồ trực quan thống kê điểm thi đua tổ và Top 10 cá nhân xuất sắc.  
* **👥 Quản lý Sơ yếu lý lịch:** Ghi nhận và quản lý Tên Thánh, thông tin Bí tích, phụ huynh, địa chỉ và các ghi chú cá nhân.  
* **✅ Sổ điểm danh Đám mây:** Đánh giá chuyên cần, đi trễ, vắng mặt có phép/không phép với hệ thống tự động tính điểm trừ.  
* **💯 Sổ điểm Học bạ:** Tự động tính Điểm trung bình môn (M15, 1 Tiết, Thi HK) và điểm chuyên cần.  
* **🏆 Thi đua & Đội nhóm:** Kéo \- thả (Drag & Drop) đoàn sinh giữa các tổ, thao tác cộng/trừ điểm trực tiếp nhanh chóng.  
* **📋 Quản lý Công việc (Task Board):** Giao việc, nhận minh chứng (link/file) và hệ thống chuông nhắc việc nội bộ.  
* **🎡 Tiện ích Vui chơi:** Tích hợp Vòng quay may mắn sinh động phục vụ cho các buổi sinh hoạt.  
* **⚙️ Quản trị Hệ thống:** Backup/Restore dữ liệu chuẩn JSON, Nạp danh sách tự động từ file Excel, phân quyền Huynh trưởng (Lead, Assistant, Collab).

# **🛠️ Công nghệ sử dụng (Tech Stack)**

* **Frontend:** HTML5, CSS3 (Glassmorphism UI), Vanilla JavaScript.  
* **Backend & Database:** Google Firebase (Realtime Database & Cloud Storage) v8.10.1.  
* **Thư viện/Third-party (thông qua CDN):**  
  * [FontAwesome](https://fontawesome.com/) & Google Fonts (Inter, Playfair Display) cho UI/UX.  
  * [Chart.js](https://www.chartjs.org/) để vẽ biểu đồ thống kê.  
  * [SortableJS](https://sortablejs.github.io/Sortable/) cho thao tác kéo thả (Drag & Drop) tổ nhóm.  
  * [SheetJS (xlsx)](https://sheetjs.com/) để đọc, xuất dữ liệu file Excel.  
  * [Canvas-Confetti](https://www.npmjs.com/package/canvas-confetti) cho hiệu ứng Vòng quay may mắn.

# **⚙️ Hướng dẫn cài đặt và Cấu hình (Setup & Configuration)**

Do hệ thống sử dụng CDN và Backend-as-a-Service (Firebase), bạn không cần cài đặt Node.js hay các framework phức tạp. Chỉ cần cấu hình các dịch vụ bên thứ 3 và chạy file `index.html`.

## **1\. Cấu hình Google Firebase**

1. Truy cập [Firebase Console](https://console.firebase.google.com/) và tạo một Project mới.  
2. Đăng ký Web App và copy đoạn config của bạn.  
3. Mở file `index.html`, tìm đến hằng số `firebaseConfig` và thay thế bằng config của bạn:  
   \`\`\`javascript  
   &nbsp;&nbsp;&nbsp;const firebaseConfig \= {  
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;apiKey: "YOUR\_API\_KEY",  
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;authDomain: "YOUR\_PROJECT\_ID.firebaseapp.com",  
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;databaseURL: "https://YOUR\_PROJECT\_ID-default-rtdb.firebaseio.com",  
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;projectId: "YOUR\_PROJECT\_ID",  
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;storageBucket: "YOUR\_PROJECT\_ID.appspot.com",  
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;messagingSenderId: "YOUR\_SENDER\_ID",  
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;appId: "YOUR\_APP\_ID"  
   &nbsp;&nbsp;&nbsp;};  
   \`\`\`  
4. **Realtime Database:** Khởi tạo DB và cấu hình *Rules* để cấp quyền đọc/ghi.  
5. **Storage:** Tạo bucket để lưu minh chứng và mở quyền Write. Đừng quên bật CORS cho bucket để tránh lỗi tải file.

## **2\. Cấu hình Google Apps Script (Tiện ích mở rộng)**

1. Tạo một file Google Sheets và mở *Extensions \> Apps Script*.  
2. Viết logic của bạn và triển khai dưới dạng **Web App** (Quyền truy cập: *Anyone*).  
3. Copy link Web App mới sinh ra.  
4. Mở file `index.html`, tìm đến khối `<div id="tab-external-tool">` và dán link vào thuộc tính `src` của thẻ `<iframe>`.

## **3\. Lưu ý khi dùng file Excel (SheetJS)**

* **Import Danh sách:** Hệ thống quét từ khóa `STT` làm Header. Đảm bảo file Excel luôn có cột `STT` và giữ đúng thứ tự các cột: *Tên Thánh, Họ tên, Giới tính, Ngày sinh, v.v.*  
* Hãy dùng tính năng **"Tải file mẫu"** có sẵn trong hệ thống (Tab Quản trị nhân sự) để phổ biến cho người dùng.

# **🚧 Những điểm cần cải thiện (To-Do & Future Improvements)**

* **Bảo mật Xác thực (Authentication):** Hiện tại hệ thống đang kiểm tra logic auth tĩnh ở frontend. Cần tích hợp Firebase Authentication (Email/Password) và siết chặt Firebase Security Rules.  
* **Tối ưu Hiệu suất (Performance):** Thay vì nạp toàn bộ cấu trúc (Học sinh \+ Điểm số \+ Điểm danh) của một lớp cùng lúc, cần chia nhỏ cấu trúc Database để query hiệu quả hơn cho các lớp có sĩ số đông.  
* **Xuất Báo Cáo Nâng cao (Reporting):** Bổ sung thư viện `jsPDF` hoặc `html2pdf` để in trực tiếp Phiếu điểm học kỳ dạng PDF cho Phụ huynh.  
* **Thông báo Tự động (Notifications):** Tích hợp Firebase Cloud Functions để tự động đẩy thông báo qua Email hoặc Zalo ZNS khi có Task/Nhắc việc mới.

# **📝 Giấy phép (License)**

Dự án được phát triển nội bộ cho mục đích sinh hoạt Tôn giáo và Giáo dục.

&nbsp;

Una productio de Iuventus Eucharistica Corporis Christi \- Paroecia Sanctae Spes \- Archidioecesis Hochiminhopolitana.
