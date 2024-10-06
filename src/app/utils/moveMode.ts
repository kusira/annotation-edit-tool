import { Dispatch } from "react";

export const handleMouseDownMoveMode = (
  event: React.MouseEvent,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  points: number[][],
  setDraggingPoint: React.Dispatch<React.SetStateAction<number | null>>,
  magnification: number,
) => {
  if (!canvasRef.current) return;

  const rect = canvasRef.current.getBoundingClientRect();
  const mouseX = (event.clientX - rect.left) / magnification;
  const mouseY = (event.clientY - rect.top) / magnification;

  points.forEach(([x, y], index) => {
    const distance = Math.sqrt((x - mouseX) ** 2 + (y - mouseY) ** 2);
    if (distance < 2) {
      setDraggingPoint(index); // ドラッグ対象のポイントを設定
    }
  });
};

export const handleMouseMoveMoveMode = (
  event: React.MouseEvent,
  draggingPoint: number | null,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  points: number[][],
  setPoints: React.Dispatch<React.SetStateAction<number[][]>>,
  magnification: number,
  currentTime: string, // 現在の日付
  landmarkDict: { [key: string]: number[][] },
  setLandmarkDict: Dispatch<React.SetStateAction<{ [key: string]: number[][] }>>
) => {
  if (draggingPoint === null) return;
  if (!canvasRef.current) return;

  const rect = canvasRef.current.getBoundingClientRect();
  const mouseX = (event.clientX - rect.left) / magnification;
  const mouseY = (event.clientY - rect.top) / magnification;

  const updatedPoints = points.map((point, index) => {
    if (index === draggingPoint) {
      // 現在の位置を取得
      const currentX = point[0];
      const currentY = point[1];

      // 移動量を計算
      const deltaX = mouseX - currentX;
      const deltaY = mouseY - currentY;

      const movement = 1;
      // 最小単位で移動
      const movementX = Math.round(deltaX / magnification) * movement;
      const movementY = Math.round(deltaY / magnification) * movement;

      return [currentX + movementX, currentY + movementY];
    }
    return point;
  });

  setPoints(updatedPoints);
  const tmpLandmarkDict = landmarkDict;
  tmpLandmarkDict[`${currentTime}.csv`] = updatedPoints;
  setLandmarkDict(tmpLandmarkDict)
};

export const handleMouseUpMoveMode = (
  setDraggingPoint: React.Dispatch<React.SetStateAction<number | null>>
) => {
  setDraggingPoint(null); // ドラッグ終了
};
