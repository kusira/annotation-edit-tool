import React, { useEffect, useState } from "react";

const CheckBoxForm = () => {
  // チェックボックスの状態を管理
  const [selected, setSelected] = useState({
    face: false,
    glasses: false,
    bread: false,
    fullmask: false,
    chinmask: false,
  });

  // 状態を更新する関数
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    if (name === "face" && checked) {
      setSelected({
        face: true,
        glasses: false,
        bread: false,
        fullmask: false,
        chinmask: false,
      });
    } else {
      setSelected((prevState) => {
        const newState = { ...prevState, [name]: checked };

        if (name === "chinmask" && checked) {
          newState.fullmask = false;
        } else if (name === "fullmask" && checked) {
          newState.chinmask = false;
        }

        return newState;
      });
    }
  };

  // キーボードイベントを監視するためのuseEffectフック
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "0") {
        // '0'キーを押したらfaceをトグル
        setSelected((prevState) => ({
          face: !prevState.face,
          glasses: false,
          bread: false,
          fullmask: false,
          chinmask: false,
        }));
      } else if (e.key === "1") {
        // '1'キーを押したらglassesをトグル
        setSelected((prevState) => ({
          ...prevState,
          glasses: !prevState.glasses && !prevState.face,
        }));
      } else if (e.key === "2") {
        // '2'キーを押したらbreadをトグル
        setSelected((prevState) => ({
          ...prevState,
          bread: !prevState.bread && !prevState.face,
        }));
      } else if (e.key === "3") {
        // '3'キーを押したらfullmaskをトグル
        setSelected((prevState) => ({
          ...prevState,
          fullmask: !prevState.fullmask && !prevState.face,
          chinmask: false,
        }));
      } else if (e.key === "4") {
        // '4'キーを押したらchinmaskをトグル
        setSelected((prevState) => ({
          ...prevState,
          chinmask: !prevState.chinmask && !prevState.face,
          fullmask: false,
        }));
      }
    };

    // キーボードイベントのリスナーを追加
    window.addEventListener("keydown", handleKeyDown);

    // クリーンアップ処理
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="flex gap-4">
      <div>
        <input
          type="checkbox"
          id="face"
          name="face"
          checked={selected.face}
          onChange={handleChange}
        />
        <label htmlFor="face" className="cursor-pointer pl-2">0: Face</label>
      </div>
      <div>
        <input
          type="checkbox"
          id="glasses"
          name="glasses"
          checked={selected.glasses}
          onChange={handleChange}
          disabled={selected.face} // faceがONの時は無効化
        />
        <label htmlFor="glasses" className="cursor-pointer pl-2">1: Glasses</label>
      </div>
      <div>
        <input
          type="checkbox"
          id="bread"
          name="bread"
          checked={selected.bread}
          onChange={handleChange}
          disabled={selected.face} // faceがONの時は無効化
        />
        <label htmlFor="bread" className="cursor-pointer pl-2">2: Bread</label>
      </div>
      <div>
        <input
          type="checkbox"
          id="fullmask"
          name="fullmask"
          checked={selected.fullmask}
          onChange={handleChange}
          disabled={selected.face || selected.chinmask} // faceがONの時、またはchinmaskがONの時は無効化
        />
        <label htmlFor="fullmask" className="cursor-pointer pl-2">3: Full Mask</label>
      </div>
      <div>
        <input
          type="checkbox"
          id="chinmask"
          name="chinmask"
          checked={selected.chinmask}
          onChange={handleChange}
          disabled={selected.face || selected.fullmask} // faceがONの時、またはfullmaskがONの時は無効化
        />
        <label htmlFor="chinmask" className="cursor-pointer pl-2">4: Chin Mask</label>
      </div>
    </div>
  );
};

export default CheckBoxForm;
