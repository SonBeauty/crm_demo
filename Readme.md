[ MANAGER (User A) ]                     [ ADMIN (User B) ]
      |                                          |
      | (1) POST /create-employee                | (Đang xem danh sách)
      | "Thêm nhân viên mới tên Teo"             |
      v                                          |
+-------------------------------------------------------------+
|                MAIN SERVER (NodeJS + Socket.IO)             |
|                                                             |
|  [1. API HANDLER]                                           |
|     - Validate                                      |
|     - Save "Teo" to Database -----------------> [ DATABASE ]|
|     - Trả về "Success" cho Manager                          |
|                                                             |
|  [2. SOCKET EMITTER (Nhánh Nhanh)]                          |
|     - Logic: "Dữ liệu nhân viên đã đổi"                     |
|     - Action: Gửi sự kiện tới "Room Admin"                  |
|        +---------------------------------------+            |
|        | (2) Event: "UPDATE_EMPLOYEE_LIST"     |----------->| (3) Client Admin tự
|        +---------------------------------------+            |     reload lại list
|                                                             |     (AJAX/Fetch)
|  [3. KAFKA PRODUCER (Nhánh Chậm)]                           |
|     - Logic: "Cần báo tin và gửi mail"                      |
|     - Action: Đẩy job vào Kafka                             |
|        +---------------------------------------+            |
|        | (4) Msg: { type: "NEW_EMP", id: 99 }  |            |
|        +-------------------+-------------------+            |
+----------------------------|--------------------------------+
                             |
                             v
+-------------------------------------------------------------+
|                   BROKER (KAFKA / REDIS)                    |
|           [ Topic: notification_events ]                    |
|           > Msg 1: NEW_EMP (Waiting...)                     |
+----------------------------|--------------------------------+
                             | (5) Pull Job
                             v
+-------------------------------------------------------------+
|                  SERVICE CON (WORKER)                       |
|                                                             |
|  [CONSUMER]                                                 |
|     - Nhận tin: "Có nhân viên mới ID 99"                    |
|                                                             |
|  [LOGIC XỬ LÝ]                                              |
|     1. Gửi Email Welcome cho nhân viên "Teo"                |
|     2. Tạo thông báo (Noti) trong DB cho Admin              |
|                                                             |
|  [PHẢN HỒI NGƯỢC (Feedback Loop)]                           |
|     - Gọi lại Main Server để báo chuông                     |
|     - API: POST /internal/push-notify                       |
|       Body: { to: "Group_Admin", msg: "Có NV mới" }         |
+----------------------------|--------------------------------+
                             |
                             | (6) Webhook: Trigger Bell
                             v
+-------------------------------------------------------------+
|                MAIN SERVER (Lại là nó)                      |
|                                                             |
|  [SOCKET EMITTER]                                           |
|     - Nhận yêu cầu từ Worker                                |
|     - Bắn sự kiện "TING TING" tới Admin                     |
|        +---------------------------------------+            |
|        | (7) Event: "NEW_NOTIFICATION_BELL"    |----------->| (8) Admin thấy
|        +---------------------------------------+            |     chuông đỏ lên
+-------------------------------------------------------------+