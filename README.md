# 🌸 Emotional Flower — ดอกไม้แห่งใจ

> Interactive Art Installation — Real-time Emotional Analysis via Generative Flowers

แบบสอบถามด้านความเครียด ความหวัง และความรู้สึกภายใน ที่วิเคราะห์ผลลัพธ์ออกมาเป็น "ดอกไม้" และส่งข้อมูลแบบ real-time ไปยัง TouchDesigner

---

## 🌺 ดอกไม้และความหมาย

| ดอกไม้ | ความหมาย |
|--------|----------|
| 🌻 Sunflower / ทานตะวัน | มีความหวังสูง แม้กำลังเหนื่อย |
| 💜 Lavender / ลาเวนเดอร์ | เครียดสะสม ต้องการการพักผ่อน |
| 🪷 Lotus / บัว | ผ่านปัญหามาเยอะและกำลังเติบโต |
| 🌹 Rose / กุหลาบ | อ่อนไหวแต่เข้มแข็ง |
| 🌼 Daisy / เดซี่ | ต้องการกำลังใจและความสบายใจ |

---

## 📁 โครงสร้างโปรเจกต์

```
emotional-flower/
├── backend/
│   ├── server.js          ← Express + Socket.IO server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ParticleCanvas.jsx   ← Animated particles
│   │   │   ├── QuestionCard.jsx     ← Slider question UI
│   │   │   ├── FlowerVisual.jsx     ← Generative flower canvas
│   │   │   └── ResultDisplay.jsx   ← Result screen
│   │   ├── hooks/
│   │   │   └── useSocket.js        ← WebSocket hook
│   │   ├── utils/
│   │   │   └── flowerData.js       ← Questions & flower config
│   │   ├── App.jsx
│   │   ├── App.module.css
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── touchdesigner/
│   └── td_integration.py  ← TD setup guide & callbacks
├── start-backend.bat      ← Windows: รัน backend
├── start-frontend.bat     ← Windows: รัน frontend
└── README.md
```

---

## ⚙️ การติดตั้งและรัน (Windows)

### ข้อกำหนด
- **Node.js** v18 ขึ้นไป → [nodejs.org](https://nodejs.org)
- **npm** (มาพร้อม Node.js)
- **Windows Terminal** หรือ Command Prompt

---

### วิธีที่ 1 — ใช้ไฟล์ .bat (ง่ายที่สุด)

เปิด Terminal 2 หน้าต่าง:

**Terminal 1 — Backend:**
```bat
start-backend.bat
```

**Terminal 2 — Frontend:**
```bat
start-frontend.bat
```

---

### วิธีที่ 2 — รันด้วยมือ

**Terminal 1 — Backend:**
```bash
cd emotional-flower\backend
npm install
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd emotional-flower\frontend
npm install
npm run dev
```

---

### เปิดเว็บ
- **Frontend:** http://localhost:5173
- **Flower Display (TD):** http://localhost:5173/flower
- **Backend API:** http://localhost:3001
- **Health Check:** http://localhost:3001/health

---

## 🎛️ TouchDesigner — Flower Display Route

### `http://localhost:5173/flower`

หน้านี้ออกแบบมาสำหรับ **TouchDesigner Web Browser COMP** โดยเฉพาะ:
- ไม่มี UI, ปุ่ม, หรือแบบสอบถาม
- เต็มจอ 100% — ดอกไม้ + particles + glow เท่านั้น
- **Auto-update real-time** ทันทีเมื่อมีคน submit แบบสอบถาม
- Bloom transition animation เมื่อเปลี่ยนดอกไม้
- ชื่อดอกไม้จะ fade in แล้วหายไปเองใน 5 วินาที

**ใน TouchDesigner:**
1. สร้าง **Web Browser COMP**
2. ใส่ URL: `http://localhost:5173/flower`
3. เปิด Active → เห็นดอกไม้ทันที
4. เมื่อมีคน submit แบบสอบถาม → ดอกไม้เปลี่ยนแบบ realtime โดยอัตโนมัติ

---

## 🌐 API Endpoints

### `GET /health`
ตรวจสอบว่า server ทำงานอยู่

### `POST /api/analyze`
วิเคราะห์คำตอบและคืนผลดอกไม้

**Request:**
```json
{
  "sessionId": "session_123",
  "answers": {
    "stress":      7,
    "hope":        8,
    "rest":        3,
    "loneliness":  5,
    "growth":      6,
    "sensitivity": 7,
    "strength":    6
  }
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "flowerType":      "sunflower",
    "flowerName":      "ดอกทานตะวัน",
    "flowerEmoji":     "🌻",
    "color":           "#FFD700",
    "glowColor":       "rgba(255, 215, 0, 0.4)",
    "petals":          12,
    "description":     "...",
    "message":         "...",
    "stressLevel":     7,
    "hopeLevel":       8,
    "restLevel":       3,
    "lonelinessLevel": 5,
    "growthLevel":     6,
    "sessionId":       "session_123",
    "timestamp":       "2024-01-01T00:00:00.000Z"
  }
}
```

---

## ⚡ WebSocket Events

### Events ที่ Client รับได้:
| Event | ข้อมูล | คำอธิบาย |
|-------|--------|----------|
| `connection_ack` | `{clientId, timestamp}` | ยืนยันการเชื่อมต่อ |
| `flower_result` | result object | ผลดอกไม้ใหม่ (broadcast ทุก client) |
| `new_submission` | result object | alias สำหรับ TouchDesigner |

### Events ที่ Client ส่งได้:
| Event | ข้อมูล | คำอธิบาย |
|-------|--------|----------|
| `register_touchdesigner` | `{name, version}` | ลงทะเบียน TouchDesigner client |
| `request_last_result` | — | ขอผลล่าสุด |

---

## 🎛️ การเชื่อม TouchDesigner

### วิธีที่แนะนำ — Python Script DAT

1. เปิด TouchDesigner
2. สร้าง **Script DAT** ใหม่
3. ใน Python Console หรือ Script DAT ให้รัน:

```python
# ติดตั้ง library ก่อน (ทำครั้งเดียว)
import subprocess
subprocess.run(['python', '-m', 'pip', 'install', 'python-socketio', 'websocket-client'])
```

4. Copy โค้ดจาก `touchdesigner/td_integration.py` ส่วน **Option B** ไปรัน
5. เมื่อมีคน submit แบบสอบถาม จะเห็น log ใน console ทันที

---

### วิธีที่ 2 — WebSocket DAT (ไม่ต้อง library)

> ⚠️ Socket.IO มี protocol พิเศษ ต้องทำ HTTP upgrade ก่อน

1. สร้าง **WebSocket DAT**
2. ตั้งค่า:
   - **Server:** `localhost`
   - **Port:** `3001`
   - **Active:** ON
3. ใน Callbacks → `onReceiveText` ใส่ code จาก `td_integration.py`

---

### ข้อมูลที่ TouchDesigner ได้รับ

```json
{
  "flowerType":      "sunflower",
  "stressLevel":     7,
  "hopeLevel":       8,
  "restLevel":       3,
  "lonelinessLevel": 5,
  "growthLevel":     6,
  "color":           "#FFD700",
  "petals":          12,
  "message":         "แสงแดดที่คุณมีอยู่...",
  "timestamp":       "2024-01-01T12:00:00.000Z"
}
```

### Mapping ดอกไม้ → ตัวเลข (สำหรับ CHOP)
```python
flower_index = {
    'sunflower': 0,   # สีทอง
    'lavender':  1,   # สีม่วง
    'lotus':     2,   # สีชมพู
    'rose':      3,   # สีแดง
    'daisy':     4,   # สีเหลืองอ่อน
}
```

---

## 🧪 ทดสอบด้วย curl

```bash
# Health check
curl http://localhost:3001/health

# ส่งแบบสอบถาม
curl -X POST http://localhost:3001/api/analyze ^
  -H "Content-Type: application/json" ^
  -d "{\"answers\":{\"stress\":8,\"hope\":7,\"rest\":3,\"loneliness\":6,\"growth\":5,\"sensitivity\":7,\"strength\":5}}"
```

---

## 🔧 Troubleshooting

**Backend ไม่ขึ้น:**
```bash
# ตรวจสอบว่า port 3001 ว่าง
netstat -ano | findstr :3001
```

**Frontend เชื่อม backend ไม่ได้:**
- ตรวจสอบว่า backend รันอยู่ที่ port 3001 ก่อน
- ดู console ใน browser (F12)

**TouchDesigner เชื่อมไม่ได้:**
- ตรวจสอบ firewall ว่าอนุญาต port 3001
- ลองใช้ `127.0.0.1` แทน `localhost`

---

## 🎨 Tech Stack

| ส่วน | Technology |
|------|-----------|
| Frontend | React 18 + Vite 5 |
| Backend | Node.js + Express 4 |
| Real-time | Socket.IO 4 |
| Visual | Canvas API (Generative) |
| Style | CSS Modules + Glassmorphism |
| Font | Cormorant Garamond + DM Sans |

---

*สร้างด้วย ❤️ สำหรับ Interactive Art Installation*
