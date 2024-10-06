import React, { useRef, useState, useEffect } from "react";
import { drawPoints, drawConnections } from "../utils/drawLandmark";
import { handleKeyDown, handleMouseDownKeyMode } from "../utils/keyMode";
import { handleMouseDownMoveMode, handleMouseMoveMoveMode, handleMouseUpMoveMode } from "../utils/moveMode";

interface CanvasLandmarksProps {
  imageWidth: number;
  imageHeight: number;
  points: number[][]; // 2次元配列としてポイントを受け取る
  magnification: number; // 拡大倍率
  currentDay: string; // 現在の日付
  mode: string; // 操作モード
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
  const [draggingPoint, setDraggingPoint] = useState<number | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  const [currentPoints, setCurrentPoints] = useState(points);
  const radius = 12;

  // points が変わったときに currentPoints を更新
  useEffect(() => {
    setCurrentPoints(points);
    setSelectedPoint(null);
  }, [points]);

  // モードが変わったときに選択をリセット
  useEffect(() => {
    setSelectedPoint(null); // モード変更時に選択状態をリセット
  }, [mode]);

  // キーイベントの設定
  useEffect(() => {
    const handleKeyDownEvent = (event: KeyboardEvent) => {
      handleKeyDown(event, selectedPoint, currentPoints, setCurrentPoints, magnification, setSelectedPoint);
    };

    window.addEventListener("keydown", handleKeyDownEvent);
    return () => {
      window.removeEventListener("keydown", handleKeyDownEvent);
    };
  }, [selectedPoint, currentPoints, magnification]);

  // キャンバスの描画
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPoints(ctx, currentPoints, magnification, selectedPoint);
        drawConnections(ctx, currentPoints, magnification);
        
        // モードが brush のときに赤い円を描く
        if (mode === "brush") {
          ctx.fillStyle = "red";
          ctx.beginPath();
          ctx.arc(0, 0, radius, 0, Math.PI * 2); // 初期位置の赤い円
          ctx.fill();
        }
      }
    }
  }, [currentPoints, magnification, selectedPoint, mode]); // modeを依存関係に追加

  // ポインターダウンイベント
  const handlePointerDown = (event: React.MouseEvent) => {
    if (mode === "move") {
      handleMouseDownMoveMode(event, canvasRef, currentPoints, setDraggingPoint, magnification);
    } else if (mode === "key") {
      handleMouseDownKeyMode(event, canvasRef, currentPoints, setSelectedPoint, selectedPoint, magnification);
    }
  };

  // ポインタームーブイベント
  const handlePointerMove = (event: React.MouseEvent) => {
    if (mode === "move") {
      handleMouseMoveMoveMode(event, draggingPoint, canvasRef, currentPoints, setCurrentPoints, magnification);
    }
  };

  return (
    <div style={{ position: "relative", zIndex: 100 }}>
      <canvas
        ref={canvasRef}
        width={imageWidth * magnification}
        height={imageHeight * magnification}
        style={{ position: "absolute", top: 0, left: 0 }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={() => {
          if (mode === "move") {
            handleMouseUpMoveMode(setDraggingPoint);
          }
        }}
      />
    </div>
  );
};

export default CanvasLandmarks;
