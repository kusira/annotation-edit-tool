"use client";
import { DirectoryStructure } from "@/types/directoryStructure";
import { useFileStore } from "./zustand/useFileStore";
import { useEffect, useState } from "react";
import { LandmarkEdit } from "./components/landmarkEdit";
import { Button } from "@/components/ui/button";
import CheckBoxForm from "./components/checkBoxForm";
import DirectoryAccordion from "./components/directoryAccordion";
import { handleSave } from "./utils/saveCSV";

export default function Home() {
  // Zustandのフックを呼び出す
  const { setDirectoryStructure } = useFileStore();
  const directoryStructure = useFileStore((state) => state.directoryStructure);

  // ファイルの読み込み
  const [files, setFiles] = useState<File[]>();
  // CSV辞書
  const [csvDict, setCsvDict] = useState<{ [key: string]: string[] }>({});
  // 現在見ている時間画像
  const [currentTime, setcurrentTime] = useState<string>("");
  // 画像辞書
  const [imageDict, setImageDict] = useState<{ [key: string]: string }>({});
  // 特徴点辞書
  const [landmarkDict, setLandmarkDict] = useState<{ [key: string]: number[][] }>({});

  // trueである項目を配列で保存する状態
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    setSelectedItems([]);
  },[currentTime])

  // 入力されたファイルからディレクトリ構造を作成
  function buildDirectoryStructure(paths: string[]): DirectoryStructure {
    const structure: DirectoryStructure = {};

    paths.forEach((path) => {
      const parts = path.split("/");
      if (parts.length < 3) return; // 想定するパス形式でない場合はスキップ

      const date = parts[1]; // 日付 (例: 240105)
      const filenameWithExtension = parts[3]?.split("_")[0]; // 時間部分を取得
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

  // ファイル入力時
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const filteredFiles = filterFiles(files);

      console.log("--- files ---");
      console.log(files);
      setFiles(files);

      const filePaths = filteredFiles.map((file) => (file as File).webkitRelativePath);
      handleDirectoryStructure(filePaths);
      handleImageDictionary(files);
      await handleLandmarkDictionary(filteredFiles); // Async処理に変更

      // すべてのキー（日付）を取得
      const dates = Object.keys(directoryStructure);

      // 一番古い日時を取得してcurrentTimeを設定
      if (dates.length > 0) {
        const oldestDate = dates.reduce((a, b) => (a < b ? a : b)); // 一番古い日付を取得
        const filenames = Object.keys(directoryStructure[oldestDate]);

        if (filenames.length > 0) {
          // 一番古いファイル名を持つキーを見つける
          const oldestFile = filenames.reduce((a, b) => (a < b ? a : b));
          setcurrentTime(oldestFile); // currentTimeを最初の日時に設定
        }
      }
    }
  };

  const filterFiles = (files: File[]) => {
    // 不要なファイルをフィルタリング (例: .DS_Storeを除外)
    return files.filter((file) => !file.name.startsWith("."));
  };

  // ディレクトリ辞書
  const handleDirectoryStructure = (filePaths: string[]) => {
    // 情報がないときだけ更新
    if (Object.keys(directoryStructure).length == 0) {
      const dict = buildDirectoryStructure(filePaths);
      setDirectoryStructure(dict); // ディレクトリ構造の状態をセット
      console.log("--- directory ---");
      console.log(JSON.stringify(dict, null, 2));
    }

  };

  // 画像辞書
  const handleImageDictionary = (files: File[]) => {
    const tempImageDict: { [key: string]: string } = {};
    files.forEach((file) => {
      if (file.type === "image/png") { // PNGファイルをフィルタリング
        const url = URL.createObjectURL(file);
        const key = file.webkitRelativePath.split("/")[3]; // 辞書のキーを形成
        tempImageDict[key] = url; // 辞書にURLを格納
      }
    });
    setImageDict(tempImageDict);
    console.log("--- image dict ---");
    console.log(JSON.stringify(tempImageDict, null, 2));
  };

  // 特徴点辞書 (非同期処理)
  const handleLandmarkDictionary = async (filteredFiles: File[]) => {
    const tempLandmarkDict: { [key: string]: number[][] } = {};

    const tmpCsvDict: { [key: string]: string[] } = {}
    await Promise.all(
      filteredFiles.map(async (file) => {
        if (file.name.endsWith(".csv")) { // CSVファイルをフィルタリング
          const reader = new FileReader();
          const filePromise = new Promise<void>((resolve) => {
            reader.onload = (event) => {
              const csvContent = event.target?.result as string;
              const lines = csvContent.split("\n");
              const key = file.webkitRelativePath.split("/")[3]; // 辞書のキーを形成
              // キーにcsvデータを追加
              tmpCsvDict[key] = lines

              lines.forEach((line) => {
                // thermo_landmark以降の部分を抽出
                const thermoLandmarkIndex = line.indexOf("thermo_landmark");
                if (thermoLandmarkIndex !== -1) {
                  const dataString = line.substring(thermoLandmarkIndex).split('"')[1]; // 二重引用符の中の部分を取得
                  try {
                    const thermoLandmarkArray = JSON.parse(dataString); // JSONとして解析
                    tempLandmarkDict[key] = thermoLandmarkArray; // 辞書にURLを格納
                  } catch (error) {
                    console.error("JSONの解析エラー:", error);
                  }
                }
              });
              // csvを読み込む
              console.log(tmpCsvDict); 
              setCsvDict(tmpCsvDict);
              resolve();
            };
          });

          reader.readAsText(file); // CSVファイルをテキストとして読み込む
          await filePromise;
        }
      })
    );

    setLandmarkDict(tempLandmarkDict);
    // console.log("--- landmark dict ---");
    // console.log(JSON.stringify(tempLandmarkDict, null, 2));
  };

  return (
    <div 
      onContextMenu={(e) => e.preventDefault()} // 右クリック無効化
      className="nx-auto mx-auto mt-[2vh] w-[90vw]"
    >
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
      <div className="relative flex h-[85vh] flex-row justify-between border-2 border-black">
        {/* 左側: サイドバー */}
        <div className="mx-auto w-max">
          <CheckBoxForm 
            currentTime={currentTime}
            setSelectedItems={setSelectedItems}
          />
          <LandmarkEdit
            imageDict={imageDict}
            landmarkDict={landmarkDict}
            setLandmarkDict={setLandmarkDict}
            currentTime={currentTime}
          />
        </div>

        {/* 右側: メインビュー */}
        <div className="bottom-0 right-0 flex min-w-[300px] flex-col border-l-2 border-black bg-white">
          {/* 可視画像 */}
          <img
            src={imageDict[`${currentTime}_visible_image.png`]}
            width={640}
            height={480}
            className="h-[30vh] w-[40vh]"
          />

          <div className="h-[50vh]">
            {/* アコーディオン */}
            <div className="relative w-full">
              {Object.keys(directoryStructure).length > 0 ? (
                <DirectoryAccordion
                  directoryStructure={directoryStructure}
                  currentTime={currentTime}
                  setcurrentTime={setcurrentTime}
                />
              ) : (
                <div>フォルダがありません</div>
              )}
              {/* 保存 */}
              <div className="flex h-[7vh] w-full translate-y-[-2px] items-center justify-between border-b-2 border-black bg-blue-50 p-2">
                <Button
                  onClick={() => handleSave(landmarkDict, selectedItems, currentTime, csvDict[`${currentTime}.csv`])}
                  disabled={selectedItems.length === 0 || files === undefined}
                  className="bg-blue-500 transition-all hover:bg-blue-700"
                >
                  保存
                </Button>
              </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
