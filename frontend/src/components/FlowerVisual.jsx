import { useEffect, useRef } from "react";
import { FLOWER_META } from "../utils/flowerData";

export default function FlowerVisual({ flowerType, animated = true }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const frameRef = useRef(0);

  const meta = FLOWER_META[flowerType] || FLOWER_META.daisy;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2 + 30;

    const drawPetal = (angle, radius, petalW, petalH, color, alpha, frame) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.globalAlpha = alpha;

      const breathe = 1 + Math.sin(frame * 0.02 + angle) * 0.02;
      ctx.scale(breathe, breathe);

      const grad = ctx.createRadialGradient(0, -radius * 0.3, 0, 0, -radius, petalW);
      grad.addColorStop(0, color + "ff");
      grad.addColorStop(0.6, color + "cc");
      grad.addColorStop(1, color + "44");

      ctx.beginPath();
      ctx.ellipse(0, -radius, petalW, petalH, 0, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.shadowBlur = 20;
      ctx.shadowColor = color;
      ctx.fill();
      ctx.restore();
    };

    const drawStem = () => {
      ctx.save();
      ctx.strokeStyle = meta.stemColor;
      ctx.lineWidth = 3;
      ctx.shadowBlur = 8;
      ctx.shadowColor = meta.stemColor;
      ctx.beginPath();
      ctx.moveTo(cx, cy + 20);
      ctx.bezierCurveTo(cx + 15, cy + 60, cx - 10, cy + 100, cx, cy + 130);
      ctx.stroke();

      // leaf
      ctx.fillStyle = meta.stemColor + "aa";
      ctx.beginPath();
      ctx.ellipse(cx + 18, cy + 80, 16, 8, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawCenter = (frame) => {
      const pulse = 1 + Math.sin(frame * 0.04) * 0.05;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(pulse, pulse);

      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 22);
      grad.addColorStop(0, "#fff8");
      grad.addColorStop(0.4, meta.centerColor);
      grad.addColorStop(1, meta.centerColor + "88");

      ctx.beginPath();
      ctx.arc(0, 0, 22, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.shadowBlur = 30;
      ctx.shadowColor = meta.centerColor;
      ctx.fill();
      ctx.restore();
    };

    const drawSparkles = (frame) => {
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + frame * 0.01;
        const r = 70 + Math.sin(frame * 0.03 + i) * 15;
        const sx = cx + Math.cos(angle) * r;
        const sy = cy + Math.sin(angle) * r;
        const a = (Math.sin(frame * 0.05 + i * 1.2) + 1) * 0.25;
        ctx.save();
        ctx.globalAlpha = a;
        ctx.fillStyle = meta.petalColor;
        ctx.shadowBlur = 10;
        ctx.shadowColor = meta.petalColor;
        ctx.beginPath();
        ctx.arc(sx, sy, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    };

    const render = (frame) => {
      ctx.clearRect(0, 0, W, H);
      drawStem();

      // petals - back layer (offset)
      const n = meta.petals;
      for (let i = 0; i < n; i++) {
        const angle = (i / n) * Math.PI * 2 + Math.PI / n;
        drawPetal(angle, 48, 14, 30, meta.petalColor, 0.4, frame);
      }
      // petals - front layer
      for (let i = 0; i < n; i++) {
        const angle = (i / n) * Math.PI * 2;
        drawPetal(angle, 52, 16, 34, meta.petalColor, 0.85, frame);
      }

      drawCenter(frame);
      drawSparkles(frame);
    };

    if (animated) {
      const loop = () => {
        frameRef.current++;
        render(frameRef.current);
        animRef.current = requestAnimationFrame(loop);
      };
      // Bloom animation: start small
      let scale = 0;
      const bloom = () => {
        scale = Math.min(scale + 0.04, 1);
        ctx.clearRect(0, 0, W, H);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(scale, scale);
        ctx.translate(-cx, -cy);
        render(frameRef.current);
        ctx.restore();
        if (scale < 1) {
          animRef.current = requestAnimationFrame(bloom);
        } else {
          animRef.current = requestAnimationFrame(loop);
        }
      };
      animRef.current = requestAnimationFrame(bloom);
    } else {
      render(0);
    }

    return () => cancelAnimationFrame(animRef.current);
  }, [flowerType]);

  return (
    <canvas
      ref={canvasRef}
      width={280}
      height={300}
      style={{ display: "block", margin: "0 auto" }}
    />
  );
}
