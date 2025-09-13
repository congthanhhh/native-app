# API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication
Các API được đánh dấu *(Requires Bearer Token)* cần gửi JWT token trong header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 1. User APIs

### 1.1 Đăng ký user mới
- **Method:** `POST`
- **Endpoint:** `/api/users/`
- **Description:** Tạo tài khoản user mới
- **Request Body:**
  ```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response Success (201):**
  ```json
  {
    "message": "User created successfully"
  }
  ```
- **Response Error (400):**
  ```json
  {
    "error": "User already exists"
  }
  ```

---

### 1.2 Đăng nhập
- **Method:** `POST`
- **Endpoint:** `/api/users/login`
- **Description:** Đăng nhập và nhận JWT token
- **Request Body:**
  ```json
  {
    "username": "john_doe",
    "password": "password123"
  }
  ```
- **Response Success (200):**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Response Error (401):**
  ```json
  {
    "error": "Invalid credentials"
  }
  ```

---

### 1.3 Lấy danh sách user *(Requires Bearer Token)*
- **Method:** `GET`
- **Endpoint:** `/api/users/`
- **Description:** Lấy tất cả user trong hệ thống
- **Headers:**
  ```
  Authorization: Bearer <token>
  ```
- **Response Success (200):**
  ```json
  [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "username": "john_doe",
      "email": "john@example.com",
      "createdAt": "2023-09-01T10:30:00.000Z"
    }
  ]
  ```

---

### 1.4 Lấy user theo ID *(Requires Bearer Token)*
- **Method:** `GET`
- **Endpoint:** `/api/users/:id`
- **Description:** Lấy thông tin user theo ID
- **Headers:**
  ```
  Authorization: Bearer <token>
  ```
- **Response Success (200):**
  ```json
  {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "username": "john_doe",
    "email": "john@example.com",
    "createdAt": "2023-09-01T10:30:00.000Z"
  }
  ```
- **Response Error (404):**
  ```json
  {
    "error": "User not found"
  }
  ```

---

### 1.5 Cập nhật user *(Requires Bearer Token)*
- **Method:** `PUT`
- **Endpoint:** `/api/users/:id`
- **Description:** Cập nhật thông tin user
- **Headers:**
  ```
  Authorization: Bearer <token>
  ```
- **Request Body:** (có thể gửi 1 hoặc nhiều trường)
  ```json
  {
    "username": "john_updated",
    "email": "john_new@example.com",
    "password": "newpassword123"
  }
  ```
- **Response Success (200):**
  ```json
  {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "username": "john_updated",
    "email": "john_new@example.com",
    "createdAt": "2023-09-01T10:30:00.000Z"
  }
  ```

---

### 1.6 Xóa user *(Requires Bearer Token)*
- **Method:** `DELETE`
- **Endpoint:** `/api/users/:id`
- **Description:** Xóa user khỏi hệ thống
- **Headers:**
  ```
  Authorization: Bearer <token>
  ```
- **Response Success (200):**
  ```json
  {
    "message": "User deleted"
  }
  ```

---

### 1.7 Tìm kiếm user *(Requires Bearer Token)*
- **Method:** `GET`
- **Endpoint:** `/api/users/find?username=...&email=...`
- **Description:** Tìm kiếm user theo username hoặc email
- **Headers:**
  ```
  Authorization: Bearer <token>
  ```
- **Query Parameters:**
  - `username` (optional): Tìm theo username
  - `email` (optional): Tìm theo email
- **Example:** `/api/users/find?username=john`
- **Response Success (200):**
  ```json
  [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "username": "john_doe",
      "email": "john@example.com",
      "createdAt": "2023-09-01T10:30:00.000Z"
    }
  ]
  ```

---

## 2. Favorite APIs *(All require Bearer Token)*

### 2.1 Thêm favorite
- **Method:** `POST`
- **Endpoint:** `/api/favorites/`
- **Description:** Thêm phim vào danh sách yêu thích
- **Headers:**
  ```
  Authorization: Bearer <token>
  ```
- **Request Body:**
  ```json
  {
    "userId": "64f1a2b3c4d5e6f7g8h9i0j1",
    "movieId": "movie_12345"
  }
  ```
- **Response Success (201):**
  ```json
  {
    "_id": "64f2b3c4d5e6f7g8h9i0j1k2",
    "userId": "64f1a2b3c4d5e6f7g8h9i0j1",
    "movieId": "movie_12345",
    "addedAt": "2023-09-01T11:00:00.000Z"
  }
  ```

---

### 2.2 Lấy danh sách favorite của user
- **Method:** `GET`
- **Endpoint:** `/api/favorites/`
- **Description:** Lấy tất cả phim yêu thích của user hiện tại
- **Headers:**
  ```
  Authorization: Bearer <token>
  ```
- **Response Success (200):**
  ```json
  [
    {
      "_id": "64f2b3c4d5e6f7g8h9i0j1k2",
      "userId": "64f1a2b3c4d5e6f7g8h9i0j1",
      "movieId": "movie_12345",
      "addedAt": "2023-09-01T11:00:00.000Z"
    }
  ]
  ```

---

### 2.3 Lấy favorite theo ID
- **Method:** `GET`
- **Endpoint:** `/api/favorites/:id`
- **Description:** Lấy thông tin favorite theo ID
- **Headers:**
  ```
  Authorization: Bearer <token>
  ```
- **Response Success (200):**
  ```json
  {
    "_id": "64f2b3c4d5e6f7g8h9i0j1k2",
    "userId": "64f1a2b3c4d5e6f7g8h9i0j1",
    "movieId": "movie_12345",
    "addedAt": "2023-09-01T11:00:00.000Z"
  }
  ```

---

### 2.4 Cập nhật favorite
- **Method:** `PUT`
- **Endpoint:** `/api/favorites/:id`
- **Description:** Cập nhật thông tin favorite
- **Headers:**
  ```
  Authorization: Bearer <token>
  ```
- **Request Body:**
  ```json
  {
    "userId": "64f1a2b3c4d5e6f7g8h9i0j1",
    "movieId": "movie_67890"
  }
  ```
- **Response Success (200):**
  ```json
  {
    "_id": "64f2b3c4d5e6f7g8h9i0j1k2",
    "userId": "64f1a2b3c4d5e6f7g8h9i0j1",
    "movieId": "movie_67890",
    "addedAt": "2023-09-01T11:00:00.000Z"
  }
  ```

---

### 2.5 Xóa favorite
- **Method:** `DELETE`
- **Endpoint:** `/api/favorites/:id`
- **Description:** Xóa phim khỏi danh sách yêu thích
- **Headers:**
  ```
  Authorization: Bearer <token>
  ```
- **Response Success (200):**
  ```json
  {
    "message": "Favorite removed"
  }
  ```

---

### 2.6 Tìm kiếm favorite
- **Method:** `GET`
- **Endpoint:** `/api/favorites/find?userId=...&movieId=...`
- **Description:** Tìm kiếm favorite theo userId hoặc movieId
- **Headers:**
  ```
  Authorization: Bearer <token>
  ```
- **Query Parameters:**
  - `userId` (optional): Tìm theo user ID
  - `movieId` (optional): Tìm theo movie ID
- **Example:** `/api/favorites/find?movieId=movie_12345`
- **Response Success (200):**
  ```json
  [
    {
      "_id": "64f2b3c4d5e6f7g8h9i0j1k2",
      "userId": "64f1a2b3c4d5e6f7g8h9i0j1",
      "movieId": "movie_12345",
      "addedAt": "2023-09-01T11:00:00.000Z"
    }
  ]
  ```

---

## Error Responses

### 401 Unauthorized (Token issues)
```json
{
  "error": "Access denied. No token provided." 
}
```

### 403 Forbidden (Invalid token)
```json
{
  "error": "Invalid token."
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error message"
}
```

---

## Notes
- Tất cả timestamps được trả về theo format ISO 8601
- Password sẽ được hash trước khi lưu vào database
- JWT token có thời hạn (cấu hình trong JWT_SECRET)
- Các API yêu cầu authentication sẽ kiểm tra token trong header Authorization