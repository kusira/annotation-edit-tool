import React, { useEffect, useRef } from 'react';

interface CanvasLandmarksProps {
    points: number[][]; // 2次元配列としてポイントを受け取る
}

const CanvasLandmarks: React.FC<CanvasLandmarksProps> = ({ points }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const drawPoints = (ctx: CanvasRenderingContext2D) => {
        ctx.fillStyle = "red"; // ポイントの色
        points.forEach((point, index) => {
            const [x, y] = point; // 2次元配列から座標を取得
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI); // ポイントを描画
            ctx.fill();
            ctx.fillStyle = "black"; // テキストの色
            ctx.fillText(String(index + 1), x + 10, y); // 各ポイントに番号を表示
            ctx.fillStyle = "red"; // 再度ポイントの色に戻す
        });
    };

    const drawConnections = (ctx: CanvasRenderingContext2D) => {
        ctx.strokeStyle = "blue"; // 線の色
        ctx.lineWidth = 2;

        for (let i = 0; i < points.length - 1; i++) {
            ctx.beginPath();
            ctx.moveTo(points[i][0], points[i][1]); // 現在のポイント
            ctx.lineTo(points[i + 1][0], points[i + 1][1]); // 次のポイント
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
    }, [points]); // pointsが変更されたときに再描画

    return (
        <canvas ref={canvasRef} width={600} height={600} style={{ border: '1px solid black' }} />
    );
};

export default CanvasLandmarks;
