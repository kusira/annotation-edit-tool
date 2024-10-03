import React, { useEffect, useRef } from 'react';

interface CanvasLandmarksProps {
  imageWidth: number;
  imageHeight: number;
  points: number[][]; // 2次元配列としてポイントを受け取る
  magnification: number; // 拡大倍率
}

const CanvasLandmarks: React.FC<CanvasLandmarksProps> = ({ points, magnification }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawPoints = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = "red"; // ポイントの色
    points.forEach((point, index) => {
      const [x, y] = point.map(coord => coord * magnification); // 拡大倍率を適用
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, 2 * Math.PI); // ポイントを描画
      ctx.fill();
      // ctx.fillStyle = "black"; // テキストの色
      // ctx.fillText(String(index + 1), x + 10, y); // 各ポイントに番号を表示
      ctx.fillStyle = "red"; // 再度ポイントの色に戻す
    });
  };

  const drawConnections = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = "blue"; // 線の色
    ctx.lineWidth = 1;

    const skipIndices = new Set([17, 22, 27, 36, 42, 48]); // 接続をスキップするインデックス

    for (let i = 0; i < points.length - 1; i++) {
      // iがスキップ対象の場合、次のインデックスをスキップ
      if (skipIndices.has(i + 1)) {
        continue;
      }

      const [x1, y1] = points[i].map(coord => coord * magnification); // 拡大倍率を適用
      const [x2, y2] = points[i + 1].map(coord => coord * magnification); // 拡大倍率を適用

      ctx.beginPath();
      ctx.moveTo(x1, y1); // 現在のポイント
      ctx.lineTo(x2, y2); // 次のポイント
      ctx.stroke();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Canvasをクリア
        drawPoints(ctx);     // ポイントを描画
        drawConnections(ctx); // 線を描画
      }
    }
  }, [points, magnification]); // pointsまたはmagnificationが変更されたときに再描画

  return (
    <div style={{ position: 'relative', zIndex: 100 }}> {/* z-indexを大きくする */}
      <canvas ref={canvasRef} width={600} height={600} style={{ position: 'absolute', top: 0, left: 0 }} />
    </div>
  );
};

export default CanvasLandmarks;
