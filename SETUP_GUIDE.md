# Wowo App - 完整設置指南

## 🎯 專案結構

```
.
├── backend/                 # Express.js API 伺服器
│   ├── src/
│   │   ├── config/         # 資料庫配置
│   │   ├── middleware/     # JWT 認證中間件
│   │   ├── routes/         # API 路由
│   │   ├── services/       # 業務邏輯（天氣服務）
│   │   ├── types/          # TypeScript 類型定義
│   │   └── index.ts        # 伺服器入口
│   ├── scripts/
│   │   └── init-db.sql     # 資料庫初始化
│   └── package.json
│
└── artifacts/wowo-app/     # React + Vite 前端
    ├── src/
    │   ├── pages/
    │   │   ├── Weather.tsx        # 天氣頁面（已更新）
    │   │   ├── Login.tsx          # 登入頁
    │   │   ├── Register.tsx       # 註冊頁
    │   │   ├── ProfileSetup.tsx   # 個人資料設置
    │   │   ├── PetSelection.tsx   # 寵物選擇
    │   │   └── Dashboard.tsx      # 儀表板
    │   ├── lib/
    │   │   └── api.ts            # API 客戶端
    │   └── ...
    └── package.json
```

## 🚀 快速開始

### 1. 後端設置

#### 安裝依賴
```bash
cd backend
npm install
```

#### 配置 PostgreSQL
```bash
# 建立資料庫
createdb wowo_app

# 初始化表格
psql -U postgres -d wowo_app -f scripts/init-db.sql
```

#### 環境變數 (.env)
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=wowo_app
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_super_secret_jwt_key

CWB_API_KEY=your_cwb_api_key_here

FRONTEND_URL=http://localhost:5173
```

#### 啟動後端
```bash
npm run dev
```

### 2. 前端設置

#### 環境變數 (.env)
```
VITE_API_URL=http://localhost:5000/api
```

#### 啟動前端
```bash
cd artifacts/wowo-app
npm install
npm run dev
```

## 📋 API 端點詳細

### 認證流程
```
1. POST /api/auth/register - 建立帳戶
   ↓
2. POST /api/auth/login - 登入並取得 JWT
   ↓
3. PUT /api/users/profile - 設置個人資料
   ↓
4. POST /api/pets - 建立寵物
   ↓
5. GET /api/tasks - 查看任務
```

### 天氣系統
- **實時同步**: 後端每次請求都調用 CWB API
- **格式標準化**: 後端統一處理資料格式
- **保護密鑰**: API Key 存放在後端環境變數

### 寵物系統
- **HP 衰減**: 設計為每小時 5% 的自動衰減
- **經驗值**: 完成任務獲得 5-15% 經驗值
- **等級系統**: 經驗值滿 100 自動晉級

### 任務系統
- **難度等級**:
  - 低 (5%) - 綠色 `bg-green-50`
  - 中 (10%) - 黃色 `bg-yellow-50`
  - 高 (15%) - 紅色 `bg-red-50`

## 🔑 重要功能

### 位置持久化
```typescript
// 用戶選擇的位置保存在 localStorage
localStorage.setItem('user-location-id', 'taipei');
localStorage.setItem('user-location-cwb', '臺北市');
localStorage.setItem('user-location-label', '台北市');
```

### JWT 認證
```typescript
// 前端存儲 token
localStorage.setItem('auth_token', response.token);

// 所有 API 請求自動帶上 token
Authorization: Bearer <token>
```

### 前端路由流程
```
/ 或無 token
  ↓
/login 或 /register
  ↓ (登入成功後)
/setup (個人資料)
  ↓
/pet-selection (選擇寵物)
  ↓
/dashboard (主頁面)
  ↓
/weather (天氣頁面 - 持久化位置)
```

## 🐛 常見問題

### Q: 天氣資訊仍為固定值？
**A**: 確認後端已正確配置 `CWB_API_KEY` 環境變數，並且 `weatherService.ts` 正確解析 API 回應。

### Q: 用戶位置無法保存？
**A**: 檢查 `syncLocationToStorage` 函數是否在每次選擇時調用。

### Q: 寵物 HP 無法衰減？
**A**: 需要在前端實現計時器定期調用 `/api/pets/:petId/decay-hp` 端點。

### Q: 登入後無法重新定向？
**A**: 確認前端有正確的路由守衛（Router Guard）和條件渲染邏輯。

## 📚 下一步

- [ ] 實現寵物 HP 自動衰減計時器
- [ ] 完成儀表板頁面
- [ ] 添加行事曆視圖
- [ ] 部署到生產環境
- [ ] 添加單元測試
- [ ] 優化 API 性能

