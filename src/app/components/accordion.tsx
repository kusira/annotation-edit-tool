import { DirectoryStructure } from "@/types/directoryStructure";
import React, { useState, useEffect } from "react";
import { useFileStore } from "../zustand/useFileStore";

const Accordion = ({
  directoryStructure,
  currentDay,
  setCurrentDay,
}: { 
  directoryStructure: DirectoryStructure,
  currentDay: string,
  setCurrentDay: any,
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
    <div className="w-full">
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
              <ul>
                {Object.keys(directoryStructure[date]).map((time) => {
                  const item = directoryStructure[date][time];
                  // dataオブジェクトのcsv_dataが存在する場合のみリストに表示
                  return item.csv_data ? (
                    <li key={time} className={`flex items-center p-1 pl-4 ${time === currentDay && "bg-red-200 font-bold"}`}>
                      <input
                        type="checkbox"
                        checked={item.isEdited} // チェックボックスの状態を更新
                        onChange={() => toggleEdited(date, time)} // チェックボックスの状態を変更
                      />
                      <div onClick={() => setCurrentDay(time)}
                        className={`ml-1 cursor-pointer w-full`}
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

export default Accordion;
