import React, { useEffect, useState } from "react";

interface SelectedState {
  face: boolean;
  glasses: boolean;
  bread: boolean;
  fullmask: boolean;
  chinmask: boolean;
  other: boolean;
}

const CheckBoxForm: React.FC = () => {
  // チェックボックスの状態を管理
  const [selected, setSelected] = useState<SelectedState>({
    face: false,
    glasses: false,
    bread: false,
    fullmask: false,
    chinmask: false,
    other: false,
  });

  // 状態を更新する関数
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    // 'face' または 'other' のチェックボックスがONの時、他のチェックボックスは無効化
    if (name === "face" && checked) {
      setSelected({
        face: true,
        glasses: false,
        bread: false,
        fullmask: false,
        chinmask: false,
        other: false,
      });
    } else if (name === "other" && checked) {
      setSelected({
        face: false,
        glasses: false,
        bread: false,
        fullmask: false,
        chinmask: false,
        other: true,
      });
    } else {
      setSelected((prevState) => {
        const newState: SelectedState = { ...prevState, [name]: checked };

        // 'chinmask' または 'fullmask' がチェックされたら、もう一方をOFF
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
        if (!selected.other) { // 'other' がONでない時のみ 'face' をトグル
          setSelected({
            face: !selected.face,
            glasses: false,
            bread: false,
            fullmask: false,
            chinmask: false,
            other: false,
          });
        }
      } else if (e.key === "1") {
        if (!selected.face && !selected.other) {
          setSelected((prevState) => ({
            ...prevState,
            glasses: !prevState.glasses,
          }));
        }
      } else if (e.key === "2") {
        if (!selected.face && !selected.other) {
          setSelected((prevState) => ({
            ...prevState,
            bread: !prevState.bread,
          }));
        }
      } else if (e.key === "3") {
        if (!selected.face && !selected.other) {
          setSelected({
            face: false,
            glasses: false,
            bread: false,
            fullmask: !selected.fullmask,
            chinmask: false,
            other: false,
          });
        }
      } else if (e.key === "4") {
        if (!selected.face && !selected.other) {
          setSelected({
            face: false,
            glasses: false,
            bread: false,
            fullmask: false,
            chinmask: !selected.chinmask,
            other: false,
          });
        }
      } else if (e.key === "5") {
        setSelected({
          face: false, // 'other' がONの時は 'face' をOFF
          glasses: false,
          bread: false,
          fullmask: false,
          chinmask: false,
          other: !selected.other,
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selected]); // selectedを依存配列に追加

  return (
    <div className="flex gap-4">
      <div>
        <input
          type="checkbox"
          id="face"
          name="face"
          checked={selected.face}
          onChange={handleChange}
          disabled={selected.other} // 'other' がONの時は無効化
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
          disabled={selected.face || selected.other} // faceまたはotherがONの時は無効化
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
          disabled={selected.face || selected.other} // faceまたはotherがONの時は無効化
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
          disabled={selected.face || selected.chinmask || selected.other} // face、chinmask、またはotherがONの時は無効化
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
          disabled={selected.face || selected.fullmask || selected.other} // face、fullmask、またはotherがONの時は無効化
        />
        <label htmlFor="chinmask" className="cursor-pointer pl-2">4: Chin Mask</label>
      </div>
      <div>
        <input
          type="checkbox"
          id="other"
          name="other"
          checked={selected.other}
          onChange={handleChange}
          disabled={selected.face} // faceがONの時は無効化
        />
        <label htmlFor="other" className="cursor-pointer pl-2">5: Other</label>
      </div>
    </div>
  );
};

export default CheckBoxForm;
