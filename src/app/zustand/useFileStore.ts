import { DirectoryStructure } from "@/types/directoryStructure";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type FileStateType = {
  directoryStructure: DirectoryStructure;
  setDirectoryStructure: (structure: DirectoryStructure) => void;
  toggleEdited: (date: string, time: string) => void; // 新しいメソッドを追加
};

const useFileStore = create<FileStateType>()(
  persist(
    immer((set) => ({
      directoryStructure: {} as DirectoryStructure,
      setDirectoryStructure: (structure: DirectoryStructure) =>
        set({ directoryStructure: structure }),
      toggleEdited: (date: string, time: string) => {
        set((state) => {
          const item = state.directoryStructure[date][time];
          if (item) {
            item.isEdited = !item.isEdited; // isEditedの値をトグル
          }
        });
      },
    })),
    {
      name: "FileStorage",
    }
  )
);

export { useFileStore };
