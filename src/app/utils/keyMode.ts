export const handleKeyDown = (
  event: KeyboardEvent,
  selectedPoint: number | null,
  points: number[][],
  setPoints: React.Dispatch<React.SetStateAction<number[][]>>,
  magnification: number,
  setSelectedPoint: React.Dispatch<React.SetStateAction<number | null>>
) => {
  // すでに選択されていないか、選択ポイントが無効な場合は処理をスキップ
  if (selectedPoint === null) {
    switch (event.key) {
      case "z":
        setSelectedPoint(0);
        return;
      case "x":
        setSelectedPoint(67);
        return;
      default:
        return; // 無視
    }
  }

  const updatedPoints = [...points];
  const movement = 1;

  switch (event.key) {
    case "w":
      updatedPoints[selectedPoint][1] -= movement;
      break;
    case "s":
      updatedPoints[selectedPoint][1] += movement;
      break;
    case "a":
      updatedPoints[selectedPoint][0] -= movement;
      break;
    case "d":
      updatedPoints[selectedPoint][0] += movement;
      break;
    case "z":
      // 選択している点を+1
      setSelectedPoint((prev: number | null) => (prev === null ? 0 : (prev - 1 + 68) % 68)); // 循環させる
      return;
    case "x":
      // 選択している点を-1
      setSelectedPoint((prev: number | null) => (prev === null ? 67 : (prev + 1) % 68)); // 循環させる
      return;
    default:
      return; // 無視
  }

  setPoints(updatedPoints);
};

export const handleMouseDownKeyMode = (
  event: React.MouseEvent,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  points: number[][],
  setSelectedPoint: React.Dispatch<React.SetStateAction<number | null>>,
  selectedPoint: number | null,
  magnification: number
) => {
  if (!canvasRef.current) return;

  const rect = canvasRef.current.getBoundingClientRect();
  const mouseX = (event.clientX - rect.left) / magnification;
  const mouseY = (event.clientY - rect.top) / magnification;

  const clickedPointIndex = points.findIndex(([x, y]) => {
    const distance = Math.sqrt((x - mouseX) ** 2 + (y - mouseY) ** 2);
    return distance < 2; // クリックされたポイントの半径
  });

  if (clickedPointIndex !== -1) {
    // クリックしたポイントが存在する場合
    if (selectedPoint === clickedPointIndex) {
      setSelectedPoint(null); // 既に選択されている場合は非選択に
    } else {
      console.log(clickedPointIndex)
      setSelectedPoint(clickedPointIndex); // 新たに選択
    }
  } else {
    setSelectedPoint(null); // クリックしたポイントが存在しない場合は非選択に
  }
};
