import React, { useState, useEffect, Dispatch } from "react";
import CanvasLandmarks from "./canvasLandmark";

export const LandmarkEdit = ({
  imageDict,
  landmarkDict,
  setLandmarkDict,
  currentTime,
}: {
  imageDict: { [key: string]: string };
  landmarkDict: { [key: string]: number[][] };
  setLandmarkDict: Dispatch<React.SetStateAction<{ [key: string]: number[][] }>>;
  currentTime: string;
}) => {
  // モード
  const [mode, setMode] = useState<string>("move");

  // コントラストと明るさの状態を管理
  const [contrast, setContrast] = useState<number>(100);
  const [brightness, setBrightness] = useState<number>(100);
  // 画像の倍率
  const magnification = 2

  // currentTimeが変更されたときにコントラストと明るさをリセット
  useEffect(() => {
    setContrast(100);
    setBrightness(100);
  }, [currentTime]);

  // コントラストの変更時に呼ばれる関数
  const handleContrastChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContrast(Number(e.target.value));
  };

  // 明るさの変更時に呼ばれる関数
  const handleBrightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrightness(Number(e.target.value));
  };

  // モードの切り替え時に呼ばれる関数
  const handleModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMode(e.target.value);
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
          src={imageDict[`${currentTime}_thermo_image.png`]}
          width={320 * magnification}
          height={256 * magnification}
          className="absolute"
          style={{ filter: `contrast(${contrast}%) brightness(${brightness}%)` }}
        />

        {landmarkDict[`${currentTime}.csv`] && (
          <CanvasLandmarks
            imageWidth={320}
            imageHeight={256}
            currentTime={currentTime}
            landmarkDict={landmarkDict}
            setLandmarkDict={setLandmarkDict}
            points={landmarkDict[`${currentTime}.csv`]}
            magnification={magnification}
            mode={mode}
          />
        )}

        {/* モード切り替え用のラジオボタン */}
        <div className="absolute bottom-2 right-2 z-[100] flex flex-col gap-2 rounded-xl bg-white p-2">
          <label className="cursor-pointer">
            <input
              type="radio"
              value="move"
              checked={mode === "move"}
              onChange={handleModeChange}
            />
            Move
          </label>
          <label className="cursor-pointer">
            <input
              type="radio"
              value="key"
              checked={mode === "key"}
              onChange={handleModeChange}
            />
            Key
          </label>
        </div>
      </div>
    </div>
  );
};
