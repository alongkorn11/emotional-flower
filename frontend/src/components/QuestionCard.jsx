import { useState } from "react";
import styles from "./QuestionCard.module.css";

export default function QuestionCard({ question, value, onChange, index, total }) {
  const [hovered, setHovered] = useState(false);

  const percentage = ((value - 1) / 9) * 100;

  return (
    <div
      className={styles.card}
      style={{
        animationDelay: `${index * 0.1}s`,
      }}
    >
      <div className={styles.header}>
        <span className={styles.icon}>{question.icon}</span>
        <div className={styles.meta}>
          <span className={styles.label}>{question.label}</span>
          <span className={styles.counter}>{index + 1} / {total}</span>
        </div>
      </div>

      <h2 className={styles.question}>{question.question}</h2>
      <p className={styles.subtext}>{question.subtext}</p>

      <div className={styles.sliderSection}>
        <div className={styles.sliderWrapper}>
          <input
            type="range"
            min="1"
            max="10"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className={styles.slider}
            style={{ "--fill": `${percentage}%` }}
          />
          <div className={styles.sliderTrack}>
            <div
              className={styles.sliderFill}
              style={{ width: `${percentage}%` }}
            />
            <div
              className={styles.sliderThumb}
              style={{ left: `${percentage}%` }}
            >
              <span className={styles.thumbValue}>{value}</span>
            </div>
          </div>
        </div>

        <div className={styles.labels}>
          <span>{question.min}</span>
          <span>{question.max}</span>
        </div>
      </div>

      <div className={styles.dots}>
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className={`${styles.dot} ${i < value ? styles.dotActive : ""}`}
            onClick={() => onChange(i + 1)}
          />
        ))}
      </div>
    </div>
  );
}
