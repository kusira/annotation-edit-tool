"use client";
import { DirectoryStructure } from "@/types/directoryStructure";
import { useFileStore } from "./zustand/useFileStore";
import { useState } from "react";
import Accordion from "./components/accordion";

export default function Home() {
  // Zustandのフックを呼び出す
  const { setDirectoryStructure } = useFileStore();
  const directoryStructure = useFileStore((state) => state.directoryStructure);
  
  const [files, setFiles] = useState<{ [key: string] : File }>()

  function buildDirectoryStructure(paths: string[]): DirectoryStructure {
    const structure: DirectoryStructure = {};
  
    paths.forEach((path) => {
      const parts = path.split("/");
      if (parts.length < 3) return; // 想定するパス形式でない場合はスキップ
  
      const date = parts[1]; // 日付 (例: 240105)
      const filenameWithExtension = parts[3]?.split("_")[0]; // 時間部分を取得 (例: 240105-060323)
      const filename = filenameWithExtension?.split(".")[0]; // 拡張子を除去したファイル名
  
      if (!filename) return; // ファイル名がない場合はスキップ
  
      if (!structure[date]) {
        structure[date] = {};
      }
  
      if (!structure[date][filename]) {
        structure[date][filename] = {
          csv_data: null,
          thermo_images: null,
          visible_images: null,
          isEdited: false, // 初期値を false に設定
        };
      }
  
      // カテゴリに応じてファイルパスを割り当て
      if (path.includes("csv_data")) {
        structure[date][filename].csv_data = path;
      } else if (path.includes("thermo_images")) {
        structure[date][filename].thermo_images = path;
      } else if (path.includes("visible_images")) {
        structure[date][filename].visible_images = path;
      }
    });
  
    return structure;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      // 不要なファイルをフィルタリング (例: .DS_Storeを除外)
      const filteredFiles = files.filter((file) => !file.name.startsWith("."));
      // ファイルパスとファイルのペアを作成する
      const fileMap: { [path: string]: File } = {};
      filteredFiles.forEach((file) => {
        const path = (file as File).webkitRelativePath;
        if (path) {
          fileMap[path] = file;
        }
      });
      console.log("--- files ---");
      console.log(files)
      setFiles(fileMap);

      const filePaths = filteredFiles.map((file) => (file as File).webkitRelativePath);
      
      // `webkitRelativePath`が取得できているか確認
      if (filePaths.some((path) => !path)) {
        console.warn("webkitRelativePathがサポートされていません");
      } else {
        const dict = buildDirectoryStructure(filePaths);
        setDirectoryStructure(dict); // ディレクトリ構造の状態をセット
        // console.log("--- directory ---");
        // console.log(JSON.stringify(dict, null, 2));
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form className="flex flex-col items-center">
        <input
          type="file"
          /* @ts-expect-error: Allow webkitdirectory */
          directory=""
          webkitdirectory=""
          multiple
          onChange={handleFileChange} // ファイル変更時にパスを取得
          className="mb-4"
        />
      </form>

      {Object.keys(directoryStructure).length > 0 && (
        <Accordion directoryStructure={directoryStructure} />
      )}
    </div>
  );
}
