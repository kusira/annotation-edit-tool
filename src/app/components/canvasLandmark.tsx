import React, { useEffect, useRef, useState } from 'react';

interface CanvasLandmarksProps {
  imageWidth: number;
  imageHeight: number;
  points: number[][]; // 2次元配列としてポイントを受け取る
  magnification: number; // 拡大倍率
  currentDay: string;
  mode: string; // 追加: モードを受け取る
}

const CanvasLandmarks: React.FC<CanvasLandmarksProps> = ({
  imageWidth,
  imageHeight,
  points,
  magnification,
  currentDay,
  mode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [draggingPoint, setDraggingPoint] = useState<number | null>(null); // ドラッグ中のポイントのインデックス
  const [currentPoints, setCurrentPoints] = useState(points); // 現在のポイント座標

  useEffect(() => {
    setCurrentPoints(points);
  }, [currentDay]);

  const drawPoints = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = "red"; // ポイントの色
    currentPoints.forEach((point, index) => {
      const [x, y] = point.map(coord => coord * magnification); // 拡大倍率を適用
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, 2 * Math.PI); // ポイントを描画
      ctx.fill();
    });
  };

  const drawConnections = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = "blue"; // 線の色
    ctx.lineWidth = 1;

    const skipIndices = new Set([17, 22, 27, 36, 42, 48]); // 接続をスキップするインデックス

    for (let i = 0; i < currentPoints.length - 1; i++) {
      if (skipIndices.has(i + 1)) continue;

      const [x1, y1] = currentPoints[i].map(coord => coord * magnification);
      const [x2, y2] = currentPoints[i + 1].map(coord => coord * magnification);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  };

  // キャンバスの描画
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // キャンバスをクリア
        drawPoints(ctx); // ポイントを描画
        drawConnections(ctx); // 線を描画
      }
    }
  }, [currentPoints, magnification]);

  // ドラッグ開始
  const handleMouseDown = (event: React.MouseEvent) => {
    if (mode !== "move") return; // モードが"move"以外なら動作させない

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = (event.clientX - rect.left) / magnification;
    const mouseY = (event.clientY - rect.top) / magnification;

    currentPoints.forEach(([x, y], index) => {
      const distance = Math.sqrt((x - mouseX) ** 2 + (y - mouseY) ** 2);
      if (distance < 2) {
        setDraggingPoint(index); // ドラッグ対象のポイントを設定
      }
    });
  };

  // ドラッグ中
  const handleMouseMove = (event: React.MouseEvent) => {
    if (mode !== "move" || draggingPoint === null) return; // モードが"move"以外か、ドラッグしていない場合は何もしない

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = (event.clientX - rect.left) / magnification;
    const mouseY = (event.clientY - rect.top) / magnification;

    const updatedPoints = currentPoints.map((point, index) => 
      index === draggingPoint ? [mouseX, mouseY] : point
    );

    setCurrentPoints(updatedPoints); // 座標を更新
  };

  // ドラッグ終了
  const handleMouseUp = () => {
    // if (mode !== "move") return; // モードが"move"以外なら動作させない
    setDraggingPoint(null); // ドラッグを終了
  };

  return (
    <div style={{ position: 'relative', zIndex: 100 }}>
      <canvas
        ref={canvasRef}
        width={imageWidth * magnification}
        height={imageHeight * magnification}
        style={{ position: 'absolute', top: 0, left: 0 }}
        onPointerDown={handleMouseDown}
        onPointerMove={handleMouseMove}
        onPointerUp={handleMouseUp}
      />
    </div>
  );
};

export default CanvasLandmarks;
