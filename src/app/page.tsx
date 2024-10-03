"use client";
import { DirectoryStructure } from "@/types/directoryStructure";
import { useFileStore } from "./zustand/useFileStore";
import { useState } from "react";
import Accordion from "./components/accordion";
import { LandmarkEdit } from "./components/landmarkEdit";
import { Button } from "@/components/ui/button";
import CheckBoxForm from "./components/checkBoxForm";

export default function Home() {
  // Zustandのフックを呼び出す
  const { setDirectoryStructure } = useFileStore();
  const directoryStructure = useFileStore((state) => state.directoryStructure);

  // ファイルの読み込み
  const [files, setFiles] = useState<File[]>();
  // 現在みている画像
  const [currentDay, setCurrentDay] = useState<string>("");
  // 画像辞書 // key例: thermo-240105-060323
  const [imageDict, setImageDict] = useState<{ [key: string]: string }>({});

  // 入力されたファイルからディレクトリ構造を作成
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

      console.log("--- files ---");
      console.log(files);
      setFiles(files);

      const filePaths = filteredFiles.map((file) => (file as File).webkitRelativePath);

      // `webkitRelativePath`が取得できているか確認
      if (filePaths.some((path) => !path)) {
        console.warn("webkitRelativePathがサポートされていません");
      } else {
        if (!directoryStructure) {
          const dict = buildDirectoryStructure(filePaths);
          setDirectoryStructure(dict); // ディレクトリ構造の状態をセット
          console.log("--- directory ---");
          console.log(JSON.stringify(dict, null, 2));
        }
      }

      // 画像辞書を生成
      const tempImageDict: { [key: string]: string } = {};
      files.forEach((file) => {
        console.log(file)
        if (file.type === "image/png") { // PNGファイルをフィルタリング
          const url = URL.createObjectURL(file);
          console.log(file.webkitRelativePath);
          const key = file.webkitRelativePath.split("/")[3]; // 辞書のキーを形成

          tempImageDict[key] = url; // 辞書にURLを格納
        }
      });
      setImageDict(tempImageDict);
      console.log("--- image dict ---");
      console.log(JSON.stringify(tempImageDict, null, 2));
    }
  };

  return (
    <div className="w-[80vw] max-width-[1000px] mx-auto mt-[2vh]">
      {/* ディレクトリ選択フォーム */}
      <form className="flex flex-col ">
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

      {/* メイン画面 */}
      <div className="relative border-2 border-black h-[80vh] flex flex-row  justify-between">
        {/* 左側: 編集部 */}
        <div className="w-max mx-auto">
          <CheckBoxForm />
          <LandmarkEdit imageDict={imageDict} currentDay={currentDay} />
        </div>

        {/* 右側 */}
        <div className="border-black border-l-2 min-w-[300px] h-full right-0 bottom-0 bg-white flex flex-col">
          {/* 可視画像 */}
          <img
            src={imageDict[`${currentDay}_visible_image.png`]}
            width={640 * 1 / 2}
            height={480 * 1 / 2}
          />
          {/* アコーディオン */}
          <div className="relative w-full h-full">
            {Object.keys(directoryStructure).length > 0 ? (
              <Accordion directoryStructure={directoryStructure} currentDay={currentDay} setCurrentDay={setCurrentDay} />
            ) : (
              <div>フォルダがありません</div>
            )}

            <div className="absolute bottom-0 w-full p-4 flex justify-between items-center">
              <div className="">あ</div>
              <Button className="bg-blue-500">保存</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
