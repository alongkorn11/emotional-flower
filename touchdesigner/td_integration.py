# ══════════════════════════════════════════════════════════════════════════════
#  Emotional Flower — TouchDesigner Integration
#  วิธีใช้: Copy โค้ดนี้ไปใส่ใน Text DAT หรือ Script DAT ใน TouchDesigner
# ══════════════════════════════════════════════════════════════════════════════
#
#  SETUP ใน TouchDesigner:
#  1. เปิด TouchDesigner
#  2. สร้าง "websocket DAT" node ใหม่
#     - Protocol: WebSocket
#     - Active: ON
#     - Server: localhost
#     - Port: 3001
#     - Message Type: Text
#  3. สร้าง "Script DAT" และ copy โค้ดข้างล่างไปใส่ใน onReceiveText callback
#  4. กด Run / เปิด Active
#
#  หรือใช้ socketio library ใน Python:
#  pip install python-socketio[client] websocket-client
# ══════════════════════════════════════════════════════════════════════════════

# ── Option A: ใช้ WebSocket DAT ของ TouchDesigner (แนะนำ) ──────────────────
# ใส่ใน WebSocket DAT → Callbacks → onReceiveText

import json

def onReceiveText(dat, rowIndex, message):
    """Callback เมื่อได้รับข้อมูลจาก server"""
    try:
        data = json.loads(message)

        # ตรวจสอบว่าเป็น flower_result event
        if data.get('flowerType'):
            flower_type    = data.get('flowerType', 'daisy')
            stress_level   = data.get('stressLevel', 5)
            hope_level     = data.get('hopeLevel', 5)
            rest_level     = data.get('restLevel', 5)
            loneliness     = data.get('lonelinessLevel', 5)
            growth         = data.get('growthLevel', 5)
            flower_message = data.get('message', '')
            timestamp      = data.get('timestamp', '')

            # ── ส่งค่าไปยัง CHOP / DAT ──────────────────────────────────────

            # Example: ส่งไปยัง Constant CHOP ชื่อ 'flower_data'
            # op('flower_data')['flower_type']    = flower_type
            # op('flower_data')['stress']         = stress_level / 10.0
            # op('flower_data')['hope']           = hope_level / 10.0
            # op('flower_data')['rest']           = rest_level / 10.0
            # op('flower_data')['loneliness']     = loneliness / 10.0
            # op('flower_data')['growth']         = growth / 10.0

            # Example: เขียนไปยัง Table DAT ชื่อ 'flower_table'
            # tbl = op('flower_table')
            # tbl.clear()
            # tbl.appendRow(['flowerType', flower_type])
            # tbl.appendRow(['stressLevel', stress_level])
            # tbl.appendRow(['hopeLevel', hope_level])
            # tbl.appendRow(['message', flower_message])

            # ── Map ดอกไม้ไปเป็นตัวเลข สำหรับควบคุม visual ─────────────────
            flower_index = {
                'sunflower': 0,
                'lavender':  1,
                'lotus':     2,
                'rose':      3,
                'daisy':     4,
            }.get(flower_type, 0)

            # ── Color mapping ─────────────────────────────────────────────────
            flower_colors = {
                'sunflower': (1.0, 0.84, 0.0),
                'lavender':  (0.61, 0.49, 0.77),
                'lotus':     (1.0, 0.42, 0.62),
                'rose':      (0.91, 0.20, 0.36),
                'daisy':     (1.0, 0.95, 0.46),
            }
            r, g, b = flower_colors.get(flower_type, (1.0, 1.0, 1.0))

            # Uncomment ตาม setup ของคุณ:
            # op('flower_color')['r'] = r
            # op('flower_color')['g'] = g
            # op('flower_color')['b'] = b
            # op('flower_index')['index'] = flower_index

            print(f"🌸 Received: {flower_type} | Stress:{stress_level} Hope:{hope_level}")
            print(f"   Color: rgb({r:.2f}, {g:.2f}, {b:.2f})")
            print(f"   Message: {flower_message[:50]}...")

    except json.JSONDecodeError:
        pass  # ไม่ใช่ JSON ข้ามไป


# ══════════════════════════════════════════════════════════════════════════════
#  Option B: Python Script แบบ standalone (รันแยกจาก TD)
#  ใช้ทดสอบหรือ debug ก่อน integrate เข้า TouchDesigner
# ══════════════════════════════════════════════════════════════════════════════

STANDALONE_TEST = """
# ติดตั้ง: pip install python-socketio websocket-client
import socketio
import json

sio = socketio.Client()

@sio.event
def connect():
    print('Connected to Emotional Flower Server!')
    sio.emit('register_touchdesigner', {'name': 'TouchDesigner', 'version': '2023'})

@sio.on('flower_result')
def on_flower_result(data):
    print('\\n🌸 NEW FLOWER RESULT:')
    print(f'  Type      : {data[\"flowerType\"]}')
    print(f'  Stress    : {data[\"stressLevel\"]}')
    print(f'  Hope      : {data[\"hopeLevel\"]}')
    print(f'  Rest      : {data[\"restLevel\"]}')
    print(f'  Loneliness: {data[\"lonelinessLevel\"]}')
    print(f'  Growth    : {data[\"growthLevel\"]}')
    print(f'  Message   : {data[\"message\"]}')
    print(f'  Timestamp : {data[\"timestamp\"]}')

@sio.event
def disconnect():
    print('Disconnected')

sio.connect('http://localhost:3001', headers={'client': 'touchdesigner'})
sio.wait()
"""

# ══════════════════════════════════════════════════════════════════════════════
#  WebSocket DAT Configuration (ใส่ใน Parameter ของ WebSocket DAT)
# ══════════════════════════════════════════════════════════════════════════════
#
#  Network: localhost
#  Port   : 3001
#  Path   : /socket.io/?EIO=4&transport=websocket
#
#  หมายเหตุ: Socket.IO ใช้ protocol พิเศษ
#  แนะนำให้ใช้ Python script (Option B) มากกว่า WebSocket DAT ตรงๆ
#  เพราะ Socket.IO มี handshake พิเศษ
#
# ══════════════════════════════════════════════════════════════════════════════
#  ข้อมูลที่ได้รับ (JSON format):
# ══════════════════════════════════════════════════════════════════════════════
#  {
#    "flowerType"      : "sunflower",   // sunflower|lavender|lotus|rose|daisy
#    "flowerName"      : "ดอกทานตะวัน",
#    "flowerEmoji"     : "🌻",
#    "color"           : "#FFD700",
#    "glowColor"       : "rgba(255,215,0,0.4)",
#    "petals"          : 12,
#    "description"     : "...",
#    "message"         : "...",
#    "stressLevel"     : 7,             // 1-10
#    "hopeLevel"       : 8,             // 1-10
#    "restLevel"       : 3,             // 1-10
#    "lonelinessLevel" : 5,             // 1-10
#    "growthLevel"     : 6,             // 1-10
#    "sessionId"       : "session_...",
#    "timestamp"       : "2024-01-01T00:00:00.000Z"
#  }
# ══════════════════════════════════════════════════════════════════════════════
