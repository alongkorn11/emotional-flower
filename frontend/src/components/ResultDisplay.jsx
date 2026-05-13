import FlowerVisual from "./FlowerVisual";
import styles from "./ResultDisplay.module.css";

export default function ResultDisplay({ result, onReset }) {
  const { flowerName, flowerEmoji, description, message, flowerType,
          stressLevel, hopeLevel, restLevel, lonelinessLevel, growthLevel } = result;

  const stats = [
    { label: "ความเครียด", value: stressLevel, color: "#E8335A" },
    { label: "ความหวัง", value: hopeLevel, color: "#FFD700" },
    { label: "การพักผ่อน", value: restLevel, color: "#9B7DC4" },
    { label: "ความโดดเดี่ยว", value: lonelinessLevel, color: "#4FC3F7" },
    { label: "การเติบโต", value: growthLevel, color: "#81C784" },
  ];

  return (
    <div className={styles.wrapper}>
      {/* Glow orb behind flower */}
      <div
        className={styles.glowOrb}
        style={{ background: result.glowColor?.replace("0.4", "0.15") }}
      />

      <div className={styles.flowerSection}>
        <FlowerVisual flowerType={flowerType} animated />
      </div>

      <div className={styles.nameRow}>
        <span className={styles.emoji}>{flowerEmoji}</span>
        <div>
          <p className={styles.flowerLabel}>คุณคือ</p>
          <h1 className={styles.flowerName}>{flowerName}</h1>
        </div>
      </div>

      <div className={styles.descriptionCard}>
        <p className={styles.description}>{description}</p>
      </div>

      <div className={styles.messageCard}>
        <span className={styles.quoteIcon}>"</span>
        <p className={styles.message}>{message}</p>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        {stats.map((s) => (
          <div key={s.label} className={styles.statItem}>
            <div className={styles.statLabel}>{s.label}</div>
            <div className={styles.statBar}>
              <div
                className={styles.statFill}
                style={{
                  width: `${s.value * 10}%`,
                  background: s.color,
                  boxShadow: `0 0 8px ${s.color}66`,
                }}
              />
            </div>
            <div className={styles.statValue}>{s.value}/10</div>
          </div>
        ))}
      </div>

      <div className={styles.tdNotice}>
        <span className={styles.tdDot} />
        <span>ข้อมูลถูกส่งไปยัง TouchDesigner แล้ว</span>
      </div>

      <button className={styles.resetBtn} onClick={onReset}>
        ✦ เริ่มใหม่อีกครั้ง
      </button>
    </div>
  );
}
