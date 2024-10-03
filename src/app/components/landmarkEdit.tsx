import React, { useState, useEffect } from "react";

export const LandmarkEdit = ({
  imageDict,
  landmarkDict,
  currentDay,
}: {
  imageDict: { [key: string]: string };
  landmarkDict: { [key: string]: number[][] };
  currentDay: string;
}) => {
  // コントラストと明るさの状態を管理
  const [contrast, setContrast] = useState<number>(100);
  const [brightness, setBrightness] = useState<number>(100);
  // 画像の倍率
  const magnification = 2.0;

  // currentDayが変更されたときにコントラストと明るさをリセット
  useEffect(() => {
    setContrast(100);
    setBrightness(100);
  }, [currentDay]);

  // コントラストの変更時に呼ばれる関数
  const handleContrastChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContrast(Number(e.target.value));
  };

  // 明るさの変更時に呼ばれる関数
  const handleBrightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrightness(Number(e.target.value));
  };

  return (
    <div>
      {/* スライダー */}
      <div className="flex gap-4">
        {/* コントラストを調整するスライダー */}
        <div className="mt-4 w-[200px]">
          <label htmlFor="contrast" className="mr-2">
            Contrast: {contrast}%
          </label>
          <input
            type="range"
            id="contrast"
            name="contrast"
            min="0"
            max="200"
            value={contrast}
            onChange={handleContrastChange}
            className="w-full"
          />
        </div>
        {/* 明るさを調整するスライダー */}
        <div className="mt-4 w-[200px]">
          <label htmlFor="brightness" className="mr-2">
            Brightness: {brightness}%
          </label>
          <input
            type="range"
            id="brightness"
            name="brightness"
            min="0"
            max="200"
            value={brightness}
            onChange={handleBrightnessChange}
            className="w-full"
          />
        </div>
      </div>

      {/* 画像コンテナ */}
      <div
        className="relative bg-white"
        style={{ width: `${320 * magnification}px`, height: `${256 * magnification}px` }}
      >
        {/* 背景画像 */}
        <img
          src={imageDict[`${currentDay}_thermo_image.png`]}
          width={320 * magnification}
          height={256 * magnification}
          className="absolute"
          style={{ filter: `contrast(${contrast}%) brightness(${brightness}%)` }}
        />

        {/* 特徴点の描画 */}
        {landmarkDict[`${currentDay}.csv`] &&
          landmarkDict[`${currentDay}.csv`].map((landmark, index) => (
            <div
              key={index}
              className="absolute bg-red-500 rounded-full"
              style={{
                width: "2px",
                height: "5px",
                left: `${landmark[0] * magnification}px`, // x座標に倍率を掛ける
                top: `${landmark[1] * magnification}px`,  // y座標に倍率を掛ける
                transform: "translate(-50%, -50%)", // 中心を基準に位置を調整
              }}
            />
          ))}
      </div>
    </div>
  );
};
