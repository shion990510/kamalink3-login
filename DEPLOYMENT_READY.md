# 🔐 デプロイ前の準備チェック

このドキュメントで、デプロイに必要な準備を確認できます。

## ✅ 確認事項

### 1. JWT_SECRET の更新

現在、JWT_SECRET がデフォルト値のままです。本番環境では**必ず変更**してください。

**手順:**

```bash
# 強力なランダムキーを生成
openssl rand -base64 32
# 出力例: abc123XYZ+/def456...

# backend/.env を編集
nano backend/.env

# 以下の行を変更
JWT_SECRET=your-secret-key-change-this-in-production
↓
JWT_SECRET=abc123XYZ+/def456...
```

### 2. Google Maps API キーの取得

地図機能を使用するためには Google Maps API キーが必要です。

**取得方法:**

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 新しいプロジェクトを作成
   - プロジェクト名: `kamalink3-maps`
   - 作成をクリック

3. **API を有効化**
   - 左側メニューで「API とサービス」を開く
   - 「ライブラリ」をクリック
   - 「Maps JavaScript API」を検索
   - 「有効化」をクリック

4. **API キーを生成**
   - 左側メニューで「認証情報」をクリック
   - 「+ 認証情報を作成」→「API キー」
   - 表示されたキーをコピー
   - 「キーを編集」で以下を設定：
     - 制限なし（開発中は）
     - API の制限: `Maps JavaScript API` のみ選択

5. **frontend/.env に設定**
   ```
   VITE_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
   ```

### 3. GitHub リポジトリの準備

デプロイには GitHub リポジトリが必須です。

**手順:**

```bash
# ローカルでGitを初期化（未設定の場合）
cd /Users/yamamotoshion/kamalink3\ ログイン
git init

# すべてのファイルをステージ
git add .

# 初回コミット
git commit -m "Initial commit: Collector management system"

# GitHub で新規リポジトリを作成（https://github.com/new）
# リポジトリ名: kamalink3-login
# 説明: Collector management system with geolocation and event scheduling
# その後、以下を実行

# リモートを追加
git remote add origin https://github.com/YOUR-USERNAME/kamalink3-login.git

# ブランチ名を main に
git branch -M main

# GitHub にプッシュ
git push -u origin main
```

### 4. Vercel アカウント作成

**URL**: https://vercel.com/signup

**推奨**: GitHub で登録（連携がスムーズ）

### 5. Render アカウント作成

**URL**: https://render.com

**推奨**: GitHub で登録（リポジトリ連携が必須）

---

## 📋 デプロイ前チェックリスト

以下をすべて確認してください：

```
□ JWT_SECRET を更新した
  openssl rand -base64 32 で生成した新しいキーを backend/.env に設定

□ Google Maps API キーを取得した
  https://console.cloud.google.com で取得

□ Google Maps API キーを frontend/.env に設定した
  VITE_GOOGLE_MAPS_API_KEY=YOUR_KEY

□ GitHub リポジトリを作成した
  https://github.com/new で新規リポジトリ作成

□ ローカルコードを GitHub にプッシュした
  git push -u origin main で完了

□ Vercel アカウントを作成した
  https://vercel.com/signup で登録

□ Render アカウントを作成した
  https://render.com で登録

□ frontend/dist がビルドされている
  cd frontend && npm run build で確認
```

---

## 🚀 次のステップ

すべてのチェックが完了したら、DEPLOYMENT_DETAILED.md に従ってデプロイを進めてください。

**ステップ順序:**
1. Vercel でフロントエンドをデプロイ
2. Render でバックエンドをデプロイ
3. 環境変数をアップデート
4. テスト実行

---

## 📞 問題が発生した場合

| 問題 | 解決方法 |
|------|--------|
| GitHub に push できない | `git remote -v` で URL を確認。SSH キーを設定してください |
| Google Maps API キーが見つからない | Google Cloud Console の認証情報ページで確認 |
| Vercel にログインできない | ブラウザのキャッシュをクリアして再試行 |
| Render にリポジトリが見つからない | GitHub との認可を確認（Settings → Applications） |

---

## 💡 本番環境のセキュリティ

- **JWT_SECRET**: 絶対に default 値のままにしないこと
- **FIREBASE_PRIVATE_KEY**: 外部に漏らさないこと
- **Google Maps API キー**: IP 制限を設定することを推奨
- **.env ファイル**: `git ignore` に追加して GitHub に commit しないこと（すでに設定済み）

---

## ✨ 準備完了

すべての準備ができたら、[DEPLOYMENT_DETAILED.md](./DEPLOYMENT_DETAILED.md) でデプロイ手順を進めてください！
