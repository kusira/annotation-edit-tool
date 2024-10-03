import { DirectoryStructure } from "@/types/directoryStructure";
import React, { useState } from "react";
import { useFileStore } from "../zustand/useFileStore";

const Accordion = ({ directoryStructure }: { directoryStructure: DirectoryStructure }) => {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);
  const { toggleEdited } = useFileStore(); // ZustandからtoggleEditedを取得

  const toggleAccordion = (index: number) => {
    if (openIndexes.includes(index)) {
      setOpenIndexes(openIndexes.filter(i => i !== index));
    } else {
      setOpenIndexes([...openIndexes, index]);
    }
  };

  return (
    <div className="w-[200px]">
      {Object.keys(directoryStructure).map((date, index) => (
        <div key={date}>
          <div
            className="cursor-pointer bg-gray-200 p-2"
            onClick={() => toggleAccordion(index)}
          >
            {date}
          </div>
          {openIndexes.includes(index) && (
            <div className="pl-4">
              <ul>
                {Object.keys(directoryStructure[date]).map((time) => {
                  const item = directoryStructure[date][time];
                  // dataオブジェクトのcsv_dataが存在する場合のみリストに表示
                  return item.csv_data ? (
                    <li key={time} className="flex items-center p-1">
                      <input
                        type="checkbox"
                        checked={item.isEdited} // チェックボックスの状態を更新
                        onChange={() => toggleEdited(date, time)} // チェックボックスの状態を変更
                      />
                      <span className="ml-1">{time.slice(0, -4)}</span>
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
