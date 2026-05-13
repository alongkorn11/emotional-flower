const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// ─── Socket.IO Setup ─────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: ["http://emotionalflower.runasp.net", "https://emotionalflower.runasp.net"], 
    methods: ["GET", "POST"],
    credentials: true
  },
});

app.use(cors({
  origin: ["http://emotionalflower.runasp.net", "https://emotionalflower.runasp.net"],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

// ─── Flower Analysis Logic ────────────────────────────────────────────────────
const FLOWER_PROFILES = {
  sunflower: {
    name: "Sunflower",
    nameTH: "ดอกทานตะวัน",
    emoji: "🌻",
    color: "#FFD700",
    glowColor: "rgba(255, 215, 0, 0.4)",
    description:
      "มีความหวังสูงแม้กำลังเหนื่อย คุณเป็นคนที่มองโลกในแง่ดีและมีพลังงานภายใน แม้ความเหนื่อยจะมีอยู่บ้าง แต่แสงสว่างในใจคุณไม่เคยดับ",
    message:
      "แสงแดดที่คุณมีอยู่ภายในนั้น ไม่มีอะไรดับได้ ให้ตัวเองพักบ้าง แล้วกลับมาสว่างต่อไป 🌟",
    petals: 12,
    condition: (s) =>
      s.hopeLevel >= 7 && s.stressLevel >= 4 && s.stressLevel <= 8,
  },
  lavender: {
    name: "Lavender",
    nameTH: "ดอกลาเวนเดอร์",
    emoji: "💜",
    color: "#9B7DC4",
    glowColor: "rgba(155, 125, 196, 0.4)",
    description:
      "เครียดสะสม ต้องการการพักผ่อน ร่างกายและจิตใจของคุณกำลังบอกให้ชะลอลง เหมือนกลิ่นหอมของลาเวนเดอร์ที่ต้องการความเงียบสงบ",
    message:
      "ไม่เป็นไรถ้าจะพักก่อน การดูแลตัวเองไม่ใช่ความอ่อนแอ แต่คือความฉลาด 💜",
    petals: 6,
    condition: (s) => s.stressLevel >= 7 && s.restLevel <= 4,
  },
  lotus: {
    name: "Lotus",
    nameTH: "ดอกบัว",
    emoji: "🪷",
    color: "#FF6B9D",
    glowColor: "rgba(255, 107, 157, 0.4)",
    description:
      "ผ่านปัญหามาเยอะและกำลังเติบโต เหมือนดอกบัวที่เติบโตขึ้นมาจากโคลนตม คุณผ่านความยากมาแล้ว และกำลังผลิบานอยู่",
    message:
      "ทุกสิ่งที่คุณผ่านมา ไม่ได้ทำให้คุณแตก แต่ทำให้คุณแข็งแกร่งขึ้น นั่นคือพลังของดอกบัว 🪷",
    petals: 8,
    condition: (s) =>
      s.growthLevel >= 6 && s.lonelinessLevel >= 5 && s.hopeLevel >= 5,
  },
  rose: {
    name: "Rose",
    nameTH: "ดอกกุหลาบ",
    emoji: "🌹",
    color: "#E8335A",
    glowColor: "rgba(232, 51, 90, 0.4)",
    description:
      "อ่อนไหวแต่เข้มแข็ง คุณรู้สึกได้ถึงทุกอารมณ์อย่างลึกซึ้ง ความอ่อนไหวของคุณคือพลัง ไม่ใช่จุดอ่อน",
    message:
      "ดอกกุหลาบมีหนาม แต่ก็สวยงามที่สุด ความอ่อนไหวของคุณทำให้คุณเข้าใจโลกได้ลึกกว่าใคร 🌹",
    petals: 10,
    condition: (s) =>
      s.sensitivityLevel >= 6 && s.strengthLevel >= 5,
  },
  daisy: {
    name: "Daisy",
    nameTH: "ดอกเดซี่",
    emoji: "🌼",
    color: "#FFF176",
    glowColor: "rgba(255, 241, 118, 0.4)",
    description:
      "ต้องการกำลังใจและความสบายใจ ใจคุณกำลังมองหาความอบอุ่น ความเรียบง่าย และแสงสว่างเล็กๆ ที่ทำให้วันผ่านไปได้",
    message:
      "บางวันแค่มีคนอยู่เคียงข้างก็พอแล้ว คุณไม่ต้องผ่านทุกอย่างคนเดียวเสมอไป 🌼",
    petals: 14,
    condition: (s) =>
      s.lonelinessLevel >= 6 && s.hopeLevel >= 4 && s.stressLevel <= 6,
  },
};

function analyzeFlower(answers) {
  const scores = {
    stressLevel: answers.stress || 5,
    hopeLevel: answers.hope || 5,
    restLevel: answers.rest || 5,
    lonelinessLevel: answers.loneliness || 5,
    growthLevel: answers.growth || 5,
    sensitivityLevel: answers.sensitivity || 5,
    strengthLevel: answers.strength || 5,
  };

  // Score each flower profile
  const flowerScores = {};
  for (const [key, profile] of Object.entries(FLOWER_PROFILES)) {
    flowerScores[key] = profile.condition(scores) ? 10 : 0;
  }

  // Weighted scoring fallback
  if (Object.values(flowerScores).every((v) => v === 0)) {
    if (scores.hopeLevel >= 6) flowerScores["sunflower"] += 5;
    if (scores.stressLevel >= 6) flowerScores["lavender"] += 5;
    if (scores.growthLevel >= 6) flowerScores["lotus"] += 5;
    if (scores.sensitivityLevel >= 6) flowerScores["rose"] += 5;
    if (scores.lonelinessLevel >= 5) flowerScores["daisy"] += 5;

    // Ensure at least one gets selected
    flowerScores["sunflower"] += scores.hopeLevel;
    flowerScores["lavender"] += (10 - scores.restLevel);
    flowerScores["lotus"] += scores.growthLevel;
    flowerScores["rose"] += scores.sensitivityLevel;
    flowerScores["daisy"] += scores.lonelinessLevel;
  }

  const topFlower = Object.entries(flowerScores).sort(([, a], [, b]) => b - a)[0][0];
  const profile = FLOWER_PROFILES[topFlower];

  return {
    flowerType: topFlower,
    flowerName: profile.nameTH,
    flowerEmoji: profile.emoji,
    color: profile.color,
    glowColor: profile.glowColor,
    petals: profile.petals,
    description: profile.description,
    message: profile.message,
    stressLevel: scores.stressLevel,
    hopeLevel: scores.hopeLevel,
    restLevel: scores.restLevel,
    lonelinessLevel: scores.lonelinessLevel,
    growthLevel: scores.growthLevel,
    timestamp: new Date().toISOString(),
  };
}

// ─── REST Endpoints ──────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Emotional Flower API is running 🌸" });
});

app.post("/api/analyze", (req, res) => {
  const { answers, sessionId } = req.body;

  if (!answers) {
    return res.status(400).json({ error: "Answers are required" });
  }

  const result = analyzeFlower(answers);
  result.sessionId = sessionId || `session_${Date.now()}`;

  // Broadcast to ALL connected clients (including TouchDesigner)
  io.emit("flower_result", result);
  io.emit("new_submission", result); // alias for TouchDesigner

  console.log(`\n🌸 New Flower: ${result.flowerName} (${result.flowerType})`);
  console.log(`   Stress: ${result.stressLevel} | Hope: ${result.hopeLevel}`);
  console.log(`   Broadcast to ${io.engine.clientsCount} clients\n`);

  res.json({ success: true, result });
});

// ─── WebSocket (Socket.IO) Events ────────────────────────────────────────────
io.on("connection", (socket) => {
  const clientType = socket.handshake.query.client || "browser";
  console.log(`✅ Client connected: ${clientType} [${socket.id}]`);

  socket.emit("connection_ack", {
    message: "Connected to Emotional Flower Server 🌸",
    clientId: socket.id,
    timestamp: new Date().toISOString(),
  });

  // TouchDesigner can send this to identify itself
  socket.on("register_touchdesigner", (data) => {
    socket.join("touchdesigner");
    console.log("🎛️  TouchDesigner registered:", data);
    socket.emit("td_registered", { status: "ok" });
  });

  // Manual trigger from TouchDesigner (optional)
  socket.on("request_last_result", () => {
    socket.emit("pong_result", { message: "No cached result" });
  });

  socket.on("disconnect", () => {
    console.log(`❌ Client disconnected: ${clientType} [${socket.id}]`);
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log("\n╔════════════════════════════════════════╗");
  console.log("║   🌸 Emotional Flower Server Running   ║");
  console.log("╠════════════════════════════════════════╣");
  console.log(`║  REST API  → http://localhost:${PORT}      ║`);
  console.log(`║  WebSocket → ws://localhost:${PORT}        ║`);
  console.log(`║  Health    → /health                   ║`);
  console.log(`║  Analyze   → POST /api/analyze         ║`);
  console.log("╚════════════════════════════════════════╝\n");
});
