import { DirectoryStructure } from "@/types/directoryStructure";
import React, { useState, useEffect, Dispatch } from "react";
import { useFileStore } from "../zustand/useFileStore";

const DirectoryAccordion = ({
  directoryStructure,
  currentTime,
  setcurrentTime,
}: { 
  directoryStructure: DirectoryStructure,
  currentTime: string,
  setcurrentTime: Dispatch<React.SetStateAction<string>>;
}) => {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);
  const { toggleEdited } = useFileStore(); // ZustandからtoggleEditedを取得

  // ディレクトリ構造のキー数に基づいて初期化
  useEffect(() => {
    const initialIndexes = Object.keys(directoryStructure).map((_, index) => index);
    setOpenIndexes(initialIndexes);
  }, [directoryStructure]);

  const toggleAccordion = (index: number) => {
    if (openIndexes.includes(index)) {
      setOpenIndexes(openIndexes.filter(i => i !== index));
    } else {
      setOpenIndexes([...openIndexes, index]);
    }
  };

  return (
    <div className="h-[48vh] w-full overflow-y-scroll bg-red-50">
      {Object.keys(directoryStructure).map((date, index) => (
        <div key={date}>
          <div
            className="cursor-pointer bg-gray-200 p-2"
            onClick={() => toggleAccordion(index)}
          >
            {date}
          </div>
          {openIndexes.includes(index) && (
            <div>
              <ul className="max-h-64 overflow-y-auto">
                {Object.keys(directoryStructure[date]).map((time) => {
                  const item = directoryStructure[date][time];
                  // dataオブジェクトのcsv_dataが存在する場合のみリストに表示
                  return item.csv_data ? (
                    <li key={time} className={`flex items-center p-1 pl-4 ${time === currentTime && "bg-orange-200 font-bold"}`}>
                      <input
                        type="checkbox"
                        checked={item.isEdited} // チェックボックスの状態を更新
                        onChange={() => toggleEdited(date, time)} // チェックボックスの状態を変更
                      />
                      <div onClick={() => setcurrentTime(time)}
                        className={`ml-1 w-full cursor-pointer`}
                      >
                        {time}
                      </div>
                    </li>
                  ) : null;
                })}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DirectoryAccordion;
