// 保存
export const handleSave = (
  landmarkDict: { [key: string]: number[][] },
  selectedItems: string[],
  currentTime: string // 現在の日時
) => {
  // 現在のランドマークデータと選択されたアイテムを取得
  const thermo_landmark = landmarkDict[`${currentTime}.csv`] || {};

  // thermo_landmark データを CSV フォーマットに変換
  const thermoLandmarkString = JSON.stringify(thermo_landmark || [])
    .replace(/,/g, ", "); // カンマの後にスペースを入れる

  // state データを CSV フォーマットに変換
  const stateString = JSON.stringify(selectedItems)
    .replace(/"/g, "'") // ダブルクォーテーションをシングルクォーテーションに置換
    .replace(/,/g, ", "); // カンマの後にスペースを入れる

  // CSV形式のデータを作成
  const csvContent = [
    ["thermo_landmark", `"${thermoLandmarkString}"`], // thermo_landmark をダブルクォーテーションで囲む
    ["state", `"${stateString}"`] // state をダブルクォーテーションで囲む
  ]
    .map(e => e.join(",")) // 各行をカンマで結合
    .join("\n"); // 行を改行で結合

  // Blobオブジェクトを作成
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  // ダウンロードリンクを作成
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${currentTime}.csv`); // ファイル名を指定
  link.style.visibility = "hidden"; // リンクを隠す

  // リンクをDOMに追加してクリック
  document.body.appendChild(link);
  link.click();

  // 後片付け
  document.body.removeChild(link);
  URL.revokeObjectURL(url); // URLを解放
};
