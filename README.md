# こどもとおとなの絵本棚

こどももおとなも、好きなときにひらける、小さなWeb絵本の本棚。

ZIPを展開し、docs、counter、このREADMEをリポジトリ直下に置きます。
GitHubの Settings → Pages → Deploy from a branch で main と /docs を選んで保存します。
ローカル確認はリポジトリ直下で python3 -m http.server 8000 --directory docs を実行し、http://localhost:8000 を開きます。

## 絵本の編集
docs/books/ の下に作品ごとのフォルダを置きます。kuroneko-kissa は『黒猫喫茶、夜の灯り』、pancake は『いちまいめのパンケーキ』、forest-picnic は『おべんとうは、木の下で』です。
各作品の JavaScript ファイルに全4場面の見出し・本文・代替テキスト・画像パスが順番に並びます。同じフォルダの cover.webp が表紙、page-01.webp〜page-04.webp が挿絵です。
本棚のレイアウトは docs/index.html、本の並びとページ送りは docs/reader.js で管理します。

## 全読者で共有する集計
GitHub Pagesに加えてCloudflare Workersの設定が必要です。
1. CloudflareアカウントとNode.jsを用意し、counter/wrangler.jsonc の SITE_ORIGIN を公開元に変更します。例 https://yo0825.github.io （リポジトリ名・末尾のスラッシュは含めません）。
2. counter フォルダで npx wrangler login、npx wrangler deploy を実行します。初回は必要に応じて workers.dev サブドメインを設定します。SQLite Durable Objectが集計を保存します。
3. 表示されたWorkerのHTTPS URLを docs/config.js の counterURL に設定してGitHubに反映します。空欄の間は集計欄が非表示になります。

アクセスはタブのセッション単位。同じタブで更新しても重複しません。いいねとしおりは本棚全体に対するブラウザ単位の登録数です。もう一度押すと解除できます。ブラウザのお気に入りとは別で、端末をまたぐ同期はありません。匿名のランダムIDで集計し、ブラウザデータの削除や自動アクセスの影響は受けます。

## 店主のひみつ（制作者用）
2ページ目で黒猫をそっとタップすると、店主からのひと言が現れます。
