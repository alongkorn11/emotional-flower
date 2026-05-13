import { useState, useCallback } from "react";
import ParticleCanvas from "./components/ParticleCanvas";
import QuestionCard from "./components/QuestionCard";
import ResultDisplay from "./components/ResultDisplay";
import { QUESTIONS } from "./utils/flowerData";
import { useSocket } from "./hooks/useSocket";
import styles from "./App.module.css";

const PHASES = { INTRO: "intro", QUIZ: "quiz", LOADING: "loading", RESULT: "result" };

const initAnswers = () =>
  Object.fromEntries(QUESTIONS.map((q) => [q.key, 5]));

export default function App() {
  const [phase, setPhase] = useState(PHASES.INTRO);
  const [answers, setAnswers] = useState(initAnswers);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const { connected } = useSocket();

  const handleStart = () => setPhase(PHASES.QUIZ);

  const handleAnswer = useCallback((key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSubmit = async () => {
    setPhase(PHASES.LOADING);
    setError(null);

    const sessionId = `session-${Date.now()}`;

    try {
      // เปลี่ยนจาก http เป็น https
      const res = await fetch("https://emotional-flower.onrender.com/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers, sessionId }),
      });

      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setResult(data.result);
      setPhase(PHASES.RESULT);
    } catch (e) {
      console.error("เกิดข้อผิดพลาด:", e); // เพิ่มบรรทัดนี้เพื่อดู Error จริงใน Console
      setError("ไม่สามารถเชื่อมต่อ server ได้ กรุณาตรวจสอบ backend");
      setPhase(PHASES.QUIZ);
    }
  };

  const handleReset = () => {
    setAnswers(initAnswers());
    setResult(null);
    setPhase(PHASES.INTRO);
  };

  return (
    <div className={styles.app}>
      <ParticleCanvas />

      {/* Connection indicator */}
      <div className={styles.connectionBadge}>
        <span
          className={styles.connectionDot}
          style={{ background: connected ? "#4caf50" : "#f44336" }}
        />
        <span>{connected ? "เชื่อมต่อแล้ว" : "ออฟไลน์"}</span>
      </div>

      <div className={styles.container}>
        {/* ── INTRO ── */}
        {phase === PHASES.INTRO && (
          <div className={styles.intro}>
            <div className={styles.orbDecor} />
            <div className={styles.symbol}>✦</div>
            <h1 className={styles.title}>
              ดอกไม้
              <br />
              <em>แห่งใจ</em>
            </h1>
            <p className={styles.subtitle}>
              ตอบคำถามสั้นๆ เกี่ยวกับความรู้สึกภายใน
              <br />
              แล้วค้นพบดอกไม้ที่สะท้อนตัวตนของคุณ
            </p>
            <div className={styles.introMeta}>
              <span>{QUESTIONS.length} คำถาม</span>
              <span className={styles.dot}>·</span>
              <span>ประมาณ 3 นาที</span>
            </div>
            <button className={styles.startBtn} onClick={handleStart}>
              เริ่มต้น
            </button>
            <p className={styles.disclaimer}>
              ทุกคำตอบจะถูกวิเคราะห์และส่งไปยัง TouchDesigner แบบ real-time
            </p>
          </div>
        )}

        {/* ── QUIZ ── */}
        {phase === PHASES.QUIZ && (
          <div className={styles.quiz}>
            <div className={styles.quizHeader}>
              <h2 className={styles.quizTitle}>รู้สึกอย่างไรบ้าง?</h2>
              <p className={styles.quizSub}>ตอบตามความรู้สึกจริงๆ ของคุณ ไม่มีผิดถูก</p>
            </div>

            <div className={styles.questions}>
              {QUESTIONS.map((q, i) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  value={answers[q.key]}
                  onChange={(v) => handleAnswer(q.key, v)}
                  index={i}
                  total={QUESTIONS.length}
                />
              ))}
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button className={styles.submitBtn} onClick={handleSubmit}>
              ✦ ค้นพบดอกไม้ของฉัน
            </button>
          </div>
        )}

        {/* ── LOADING ── */}
        {phase === PHASES.LOADING && (
          <div className={styles.loading}>
            <div className={styles.loadingFlower}>
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={styles.loadingPetal}
                  style={{ transform: `rotate(${i * 45}deg)`, animationDelay: `${i * 0.12}s` }}
                />
              ))}
              <div className={styles.loadingCenter} />
            </div>
            <p className={styles.loadingText}>กำลังวิเคราะห์ความรู้สึก…</p>
            <p className={styles.loadingSubtext}>ค้นหาดอกไม้ที่เหมาะกับคุณ</p>
          </div>
        )}

        {/* ── RESULT ── */}
        {phase === PHASES.RESULT && result && (
          <ResultDisplay result={result} onReset={handleReset} />
        )}
      </div>

      {/* Ambient light decor */}
      <div className={styles.ambientLeft} />
      <div className={styles.ambientRight} />
    </div>
  );
}
