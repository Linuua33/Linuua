# 後端 API 詳細文檔

## 基礎信息

- **基礎 URL**: `http://localhost:5000/api` (開發環境)
- **認證方式**: JWT Bearer Token
- **Content-Type**: `application/json`

## 認證 API

### 註冊用戶

**端點**: `POST /auth/register`

**請求體**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**成功響應** (201):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": null,
    "avatar_url": null,
    "location_id": null,
    "notification_enabled": true,
    "created_at": "2026-06-06T00:00:00Z",
    "updated_at": "2026-06-06T00:00:00Z"
  }
}
```

### 用戶登入

**端點**: `POST /auth/login`

**請求體**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**成功響應** (200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar_url": "data:image/...",
    "location_id": "taipei",
    "notification_enabled": true,
    "created_at": "2026-06-06T00:00:00Z",
    "updated_at": "2026-06-06T12:00:00Z"
  }
}
```

## 用戶 API

### 獲取用戶資料

**端點**: `GET /users/profile`

**請求頭**:
```
Authorization: Bearer <token>
```

**成功響應** (200):
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "avatar_url": "data:image/...",
  "location_id": "taipei",
  "notification_enabled": true,
  "created_at": "2026-06-06T00:00:00Z",
  "updated_at": "2026-06-06T12:00:00Z"
}
```

### 更新用戶資料

**端點**: `PUT /users/profile`

**請求頭**:
```
Authorization: Bearer <token>
```

**請求體** (所有欄位可選):
```json
{
  "name": "Jane Doe",
  "avatar_url": "data:image/...",
  "location_id": "kaohsiung",
  "notification_enabled": false
}
```

**成功響應** (200):
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "Jane Doe",
  "avatar_url": "data:image/...",
  "location_id": "kaohsiung",
  "notification_enabled": false,
  "created_at": "2026-06-06T00:00:00Z",
  "updated_at": "2026-06-06T14:00:00Z"
}
```

## 天氣 API

### 獲取實時天氣

**端點**: `GET /weather/:location`

**參數**:
- `location` (string, required): 台灣地區名稱（繁體），如 `臺北市`、`臺中市`

**請求頭**:
```
Authorization: Bearer <token>
```

**範例**:
```
GET /weather/臺北市
```

**成功響應** (200):
```json
{
  "location": "臺北市",
  "temperature": 28,
  "max_temperature": 32,
  "condition": "晴天",
  "feels_like": "熱",
  "rain_probability": 10,
  "updated_at": "2026-06-06T12:00:00Z"
}
```

**支持的地區**:
- 臺北市、新北市、桃園市、新竹市、新竹縣、苗栗縣
- 臺中市、彰化縣、南投縣、雲林縣
- 嘉義市、嘉義縣、臺南市、高雄市、屏東縣
- 臺東縣、花蓮縣、宜蘭縣
- 澎湖縣、金門縣、連江縣

## 寵物 API

### 列出用戶的所有寵物

**端點**: `GET /pets`

**請求頭**:
```
Authorization: Bearer <token>
```

**成功響應** (200):
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "name": "Fluffy",
    "type": "cat",
    "image_url": "/pets/cat.png",
    "hp": 75,
    "max_hp": 80,
    "exp": 45,
    "level": 3,
    "created_at": "2026-06-06T00:00:00Z",
    "updated_at": "2026-06-06T12:00:00Z"
  }
]
```

### 建立新寵物

**端點**: `POST /pets`

**請求頭**:
```
Authorization: Bearer <token>
```

**請求體**:
```json
{
  "name": "Fluffy",
  "type": "cat"
}
```

**寵物類型**:
- `cat` - 貓
- `dog` - 狗
- `rabbit` - 兔子
- `penguin` - 企鵝
- `bird` - 鳥

**成功響應** (201):
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "name": "Fluffy",
  "type": "cat",
  "image_url": "/pets/cat.png",
  "hp": 80,
  "max_hp": 80,
  "exp": 0,
  "level": 1,
  "created_at": "2026-06-06T12:00:00Z",
  "updated_at": "2026-06-06T12:00:00Z"
}
```

### 更新寵物統計

**端點**: `PUT /pets/:petId`

**請求頭**:
```
Authorization: Bearer <token>
```

**請求體** (所有欄位可選):
```json
{
  "hp": 70,
  "exp": 50,
  "level": 2
}
```

**成功響應** (200):
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "name": "Fluffy",
  "type": "cat",
  "image_url": "/pets/cat.png",
  "hp": 70,
  "max_hp": 80,
  "exp": 50,
  "level": 2,
  "created_at": "2026-06-06T00:00:00Z",
  "updated_at": "2026-06-06T14:00:00Z"
}
```

### 寵物 HP 衰減

**端點**: `POST /pets/:petId/decay-hp`

**請求頭**:
```
Authorization: Bearer <token>
```

**說明**: 每次呼叫衰減 5% HP (相當於每小時衰減)

**成功響應** (200):
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "name": "Fluffy",
  "type": "cat",
  "image_url": "/pets/cat.png",
  "hp": 76,
  "max_hp": 80,
  "exp": 50,
  "level": 2,
  "created_at": "2026-06-06T00:00:00Z",
  "updated_at": "2026-06-06T15:00:00Z"
}
```

## 任務 API

### 列出所有任務

**端點**: `GET /tasks`

**請求頭**:
```
Authorization: Bearer <token>
```

**成功響應** (200):
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "pet_id": "uuid",
    "title": "完成報告",
    "description": "完成專案月度報告",
    "difficulty": "high",
    "exp_reward": 15,
    "completed": false,
    "due_date": "2026-06-10T18:00:00Z",
    "created_at": "2026-06-06T10:00:00Z",
    "updated_at": "2026-06-06T10:00:00Z"
  }
]
```

### 建立新任務

**端點**: `POST /tasks`

**請求頭**:
```
Authorization: Bearer <token>
```

**請求體**:
```json
{
  "title": "完成報告",
  "description": "完成專案月度報告",
  "difficulty": "high",
  "pet_id": "uuid",
  "due_date": "2026-06-10T18:00:00Z"
}
```

**難度等級和經驗值**:
- `low` - 5% 經驗值
- `medium` - 10% 經驗值
- `high` - 15% 經驗值

**成功響應** (201):
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "pet_id": "uuid",
  "title": "完成報告",
  "description": "完成專案月度報告",
  "difficulty": "high",
  "exp_reward": 15,
  "completed": false,
  "due_date": "2026-06-10T18:00:00Z",
  "created_at": "2026-06-06T10:00:00Z",
  "updated_at": "2026-06-06T10:00:00Z"
}
```

### 完成任務

**端點**: `PUT /tasks/:taskId/complete`

**請求頭**:
```
Authorization: Bearer <token>
```

**說明**: 
- 標記任務為已完成
- 自動增加關聯寵物的經驗值
- 如果經驗值 ≥ 100，寵物自動晉級，經驗值清零
- 寵物 HP 恢復至最大值

**成功響應** (200):
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "pet_id": "uuid",
  "title": "完成報告",
  "description": "完成專案月度報告",
  "difficulty": "high",
  "exp_reward": 15,
  "completed": true,
  "due_date": "2026-06-10T18:00:00Z",
  "created_at": "2026-06-06T10:00:00Z",
  "updated_at": "2026-06-06T15:30:00Z"
}
```

### 刪除任務

**端點**: `DELETE /tasks/:taskId`

**請求頭**:
```
Authorization: Bearer <token>
```

**成功響應** (200):
```json
{
  "message": "Task deleted successfully"
}
```

## 錯誤回應

### 401 - 未認證
```json
{
  "error": "No token provided"
}
```

### 400 - 請求錯誤
```json
{
  "error": "Invalid pet data"
}
```

### 404 - 資源不存在
```json
{
  "error": "Pet not found"
}
```

### 500 - 伺服器錯誤
```json
{
  "error": "Failed to create task"
}
```

## 使用範例 (cURL)

### 註冊
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### 取得天氣
```bash
curl -X GET http://localhost:5000/api/weather/臺北市 \
  -H "Authorization: Bearer <your_token>"
```

### 建立寵物
```bash
curl -X POST http://localhost:5000/api/pets \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Fluffy","type":"cat"}'
```

### 完成任務
```bash
curl -X PUT http://localhost:5000/api/tasks/<task_id>/complete \
  -H "Authorization: Bearer <your_token>"
```

---

**最後更新**: 2026-06-06
