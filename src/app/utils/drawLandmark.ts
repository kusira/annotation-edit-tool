export const drawPoints = (
  ctx: CanvasRenderingContext2D,
  points: number[][],
  magnification: number,
  selectedPoint: number | null
) => {
  points.forEach((point, index) => {
    const [x, y] = point.map(coord => coord * magnification);
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, 2 * Math.PI);
    ctx.fillStyle = index === selectedPoint ? "blue" : "red"; // 選択された点は青に
    ctx.fill();
  });
};

export const drawConnections = (
  ctx: CanvasRenderingContext2D,
  points: number[][],
  magnification: number
) => {
  ctx.strokeStyle = "blue"; // 線の色
  ctx.lineWidth = 1;

  const skipIndices = new Set([17, 22, 27, 36, 42, 48]); // 接続をスキップするインデックス

  for (let i = 0; i < points.length - 1; i++) {
    if (skipIndices.has(i + 1)) continue;

    const [x1, y1] = points[i].map(coord => coord * magnification);
    const [x2, y2] = points[i + 1].map(coord => coord * magnification);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
};
