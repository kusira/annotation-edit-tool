import React, { useState, useEffect } from "react";
import CheckBoxForm from "./checkBoxForm";

export const LandmarkEdit = ({
  imageDict,
  currentDay,
}: {
  imageDict: { [key: string]: string };
  currentDay: string;
}) => {
  // コントラストと明るさの状態を管理
  const [contrast, setContrast] = useState<number>(100);
  const [brightness, setBrightness] = useState<number>(100);

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
          <label htmlFor="contrast" className="mr-2">Contrast: {contrast}%</label>
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
          <label htmlFor="brightness" className="mr-2">Brightness: {brightness}%</label>
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
      
      {/* 画像 */}
      <div className="w-[640px] h-[512px] bg-white relative">
        <img
          src={imageDict[`${currentDay}_thermo_image.png`]}
          width={320 * 2}
          height={256 * 2}
          className="absolute"
          // コントラストと明るさを適用
          style={{ filter: `contrast(${contrast}%) brightness(${brightness}%)` }}
        />
      </div>

    </div>
  );
};
