# Wowo App Backend

完整的後端 API 服務，提供天氣資訊、用戶認證、寵物系統和任務管理。

## 功能

### 🌤️ 天氣系統
- 實時同步氣象局 (CWB) API 資料
- 支持台灣全22個縣市查詢
- 後端處理所有 API 邏輯，保護密鑰安全

### 👤 用戶系統
- JWT 認證
- 密碼加密存儲
- 用戶資料更新（名稱、頭貼、通知設置）

### 🐱 寵物系統
- 5 種寵物類型：貓、狗、兔子、企鵝、鳥
- HP 自動衰減（每小時 5%）
- 經驗值升級系統（滿 100 晉級）
- 完成任務恢復 HP

### 📋 任務系統
- 三難度等級（低5%、中10%、高15%）
- 難度顏色分級
- 任務完成獎勵經驗值
- 行事曆支持

## 快速開始

### 1. 安裝依賴
```bash
cd backend
npm install
```

### 2. 配置環境變數
```bash
cp .env.example .env
# 編輯 .env 文件，填入你的配置
```

### 3. 初始化資料庫
```bash
psql -U postgres -d wowo_app -f scripts/init-db.sql
```

### 4. 啟動開發服務
```bash
npm run dev
```

服務將在 `http://localhost:5000` 運行

## API 端點

### 認證 (`/api/auth`)
- `POST /register` - 註冊新用戶
- `POST /login` - 用戶登入

### 用戶 (`/api/users`)
- `GET /profile` - 取得用戶資料
- `PUT /profile` - 更新用戶資料

### 天氣 (`/api/weather`)
- `GET /:location` - 獲取實時天氣

### 寵物 (`/api/pets`)
- `GET /` - 獲取用戶的寵物列表
- `POST /` - 創建新寵物
- `PUT /:petId` - 更新寵物統計
- `POST /:petId/decay-hp` - 寵物 HP 衰減

### 任務 (`/api/tasks`)
- `GET /` - 獲取任務列表
- `POST /` - 創建任務
- `PUT /:taskId/complete` - 完成任務
- `DELETE /:taskId` - 刪除任務

## 環境變數

```env
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=wowo_app
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key_change_in_production

# Weather API
CWB_API_KEY=your_cwb_api_key

# CORS
FRONTEND_URL=http://localhost:5173
```

## 資料庫架構

### users 表
- 存儲用戶基本資訊、認證資料
- 與 pets 表一對多關係

### pets 表
- 存儲用戶寵物資訊
- HP、經驗值、等級管理

### tasks 表
- 存儲任務和行事曆項目
- 難度、獎勵、完成狀態

## 技術棧

- **框架**: Express.js + TypeScript
- **資料庫**: PostgreSQL
- **認證**: JWT + Bcrypt
- **天氣 API**: 中央氣象局 (CWB)
