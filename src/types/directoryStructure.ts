type DirectoryItem = {
  csv_data: string | null; // ファイルパス (または null)
  thermo_images: string | null;
  visible_images: string | null;
  isEdited: boolean; // 編集済みかどうかを示すフラグ
};

export type DirectoryStructure = {
  [date: string]: {
    [time: string]: DirectoryItem;
  };
};
