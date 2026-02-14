# 🚀 詳細デプロイガイド - Vercel + Render

このガイドでは、アプリケーションを実際に公開するための完全な手順を説明します。

## 目次
1. [Vercel（フロントエンド）のデプロイ](#vercelフロントエンドのデプロイ)
2. [Render（バックエンド）のデプロイ](#renderバックエンドのデプロイ)
3. [環境変数の設定](#環境変数の設定)
4. [テスト手順](#テスト手順)
5. [トラブルシューティング](#トラブルシューティング)

---

## Vercel（フロントエンド）のデプロイ

### ステップ1: Vercel アカウント作成

1. [https://vercel.com](https://vercel.com) にアクセス
2. 右上の「Sign Up」をクリック
3. 以下のいずれかで登録：
   - GitHub
   - GitLab
   - Bitbucket
   - Email

**推奨**: GitHub で登録（後の連携がスムーズです）

### ステップ2: GitHub にリポジトリをアップロード

```bash
# ローカルでプロジェクトをGitに初期化（未設定の場合）
cd /Users/yamamotoshion/kamalink3\ ログイン
git init
git add .
git commit -m "Initial commit: Collector management system"

# GitHub に新規リポジトリを作成（https://github.com/new）
# リポジトリ名: kamalink3-login
# その後、以下を実行
git remote add origin https://github.com/YOUR-USERNAME/kamalink3-login.git
git branch -M main
git push -u origin main
```

### ステップ3: Vercel にプロジェクトをインポート

1. Vercel ダッシュボード（[https://vercel.com/dashboard](https://vercel.com/dashboard)）にアクセス
2. 「Add New」→「Project」をクリック
3. 「Import Git Repository」セクションで「GitHub」を選択
4. リポジトリを検索して「kamalink3-login」を選択
5. 「Import」をクリック

### ステップ4: Vercel でビルド設定

インポート後、以下の画面が表示されます：

**Framework Preset**: `Vite` を選択（自動検出されるはず）

**Build and Output Settings**:
```
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
```

**Environment Variables** を設定：
```
名前: VITE_API_URL
値: http://localhost:3000/api （後で更新します）

名前: VITE_GOOGLE_MAPS_API_KEY
値: （ご自身の Google Maps API キー）
```

Google Maps API キーの取得方法：
1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 新しいプロジェクトを作成
3. 「Maps JavaScript API」を有効化
4. 認証情報から API キーを生成
5. IP 制限などを設定（localhost のみなど）

### ステップ5: デプロイ

「Deploy」ボタンをクリック

デプロイが完了すると、以下のような URL が割り当てられます：
```
https://kamalink3-login.vercel.app
```

**このURL をメモしておいてください**（後でバックエンド設定で使用）

---

## Render（バックエンド）のデプロイ

### ステップ1: Render アカウント作成

1. [https://render.com](https://render.com) にアクセス
2. 右上の「Sign Up」をクリック
3. GitHub で登録（GitHub リポジトリ連携が必要）

### ステップ2: Render で Web Service を作成

1. Render ダッシュボード（[https://dashboard.render.com](https://dashboard.render.com)）にアクセス
2. 「New +」→「Web Service」をクリック
3. 「Connect a repository」で GitHub を選択
4. 先ほどの「kamalink3-login」リポジトリを選択
5. 「Connect」をクリック

### ステップ3: Render でビルド設定

**基本設定**:
```
Name: kamalink3-backend
Environment: Node
Region: Singapore (東京がなければ アジア圏を選択)
Branch: main
```

**Build Command**:
```bash
npm install && npm run build
```

**Start Command**:
```bash
npm start
```

**Root Directory**: `backend`

### ステップ4: 環境変数の設定

「Environment」セクションで以下を追加：

```
PORT=3000
NODE_ENV=production
FIREBASE_PROJECT_ID=kamalink2-779cb
FIREBASE_PRIVATE_KEY=(backend/.env から秘密鍵をコピー)
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@kamalink2-779cb.iam.gserviceaccount.com
JWT_SECRET=(以下の方法で生成)
```

**JWT_SECRET の生成方法**:
```bash
# ターミナルで実行
openssl rand -base64 32

# 出力例: aBc123XyZ456+/=...
# この文字列を JWT_SECRET にコピー
```

### ステップ5: デプロイ

「Create Web Service」をクリック

デプロイが完了すると、以下のような URL が割り当てられます：
```
https://kamalink3-backend.onrender.com
```

**このURL をメモしておいてください**

---

## 環境変数の設定

### Vercel フロントエンド環境変数をアップデート

1. Vercel ダッシュボード → プロジェクト選択
2. 「Settings」→「Environment Variables」
3. 既存の `VITE_API_URL` を編集：
   ```
   http://localhost:3000/api
   ↓
   https://kamalink3-backend.onrender.com/api
   ```
4. 「Save」をクリック
5. 「Deployments」に戻り、最新デプロイの右側「...」→「Redeploy」

**再デプロイが完了すると、フロントエンドがバックエンドと正常に通信できるようになります**

---

## テスト手順

### 1. アプリケーションにアクセス

```
https://kamalink3-login.vercel.app
```

### 2. 一般向けサイトの確認

- [ ] ホームページが表示される
- [ ] 「コレクターとしてログイン」ボタンが見える
- [ ] 地図が読み込まれる
- [ ] Instagram セクションが表示される

### 3. ログイン機能の確認

1. 「コレクターとしてログイン」をクリック
2. ログインページが表示される
3. テストメールアドレスとパスワードで試す
   ```
   Email: test@example.com
   Password: TestPassword123
   ```
   
   **注意**: 初回はサインアップが必要です

### 4. 新規登録

1. ログインページの「新規登録」をクリック
2. 以下の情報を入力：
   ```
   名前: テストユーザー
   メール: your-email@gmail.com
   電話番号: 09012345678
   パスワード: TestPassword123
   ```
3. 登録ボタンをクリック

### 5. ダッシュボードの確認

ログイン後、以下が表示されることを確認：
- [ ] ウェルカムメッセージ
- [ ] アカウント情報
- [ ] クイックリンク（マップ、イベント、掲示板）
- [ ] Instagram セクション

### 6. マップ機能の確認

1. 「📍 マップを表示」をクリック
2. ブラウザの位置情報許可を求められたら「許可」をクリック
3. 地図が表示されることを確認

### 7. イベントカレンダーの確認

1. 「📅 イベントカレンダー」をクリック
2. カレンダーが表示される
3. 日付をクリックしてイベント作成画面が出現

### 8. 掲示板の確認

1. 「💬 掲示板」をクリック
2. メッセージ入力欄がある
3. テストメッセージを投稿できる
4. メッセージが表示される

---

## トラブルシューティング

### エラー: "Cannot GET /"

**原因**: バックエンドが正常に動作していない

**解決方法**:
1. Render ダッシュボード → Logs を確認
2. Firebase 認証情報が正しいか確認
3. JWT_SECRET が正しく設定されているか確認

### エラー: CORS エラー（ブラウザコンソール）

**原因**: フロントエンドとバックエンドのドメイン不一致

**解決方法**:
```typescript
// backend/src/index.ts を確認
app.use(cors({
  origin: [
    'https://kamalink3-login.vercel.app',
    'http://localhost:5173'  // 開発用
  ],
  credentials: true
}))
```

必要に応じて追加してから再デプロイ

### エラー: "Firebase authentication failed"

**原因**: Firebase 認証情報が不正

**解決方法**:
1. backend/.env の `FIREBASE_PRIVATE_KEY` をコピー
2. 特に改行文字 `\n` が正しくエスケープされているか確認
3. Render で環境変数を再設定

### エラー: "Unable to locate Google Maps API"

**原因**: Google Maps API キーが無効または制限されている

**解決方法**:
1. Google Cloud Console で API キーを確認
2. API キーが有効か確認
3. IP ホワイトリストが設定されていないか確認
4. 新しい API キーを生成してみる

### メッセージ送信がエラーになる

**原因**: バックエンドのユーザーID が JWT に含まれていない

確認手順：
1. ブラウザの開発者ツール（F12）を開く
2. Network タブで POST リクエストを確認
3. Response が 401 なら認証エラー
4. Render ログで詳細を確認

---

## パフォーマンス最適化（オプション）

### Vercel の キャッシュ設定

```javascript
// frontend/vercel.json を作成
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_URL": "@vite_api_url",
    "VITE_GOOGLE_MAPS_API_KEY": "@vite_google_maps_api_key"
  }
}
```

### Render の リージョン選択

- 日本ユーザーの場合: Singapore リージョン推奨
- レイテンシー測定: [https://render.com/regions](https://render.com/regions)

---

## 監視とログ確認

### Vercel ログ確認

1. ダッシュボード → プロジェクト → Deployments
2. デプロイをクリック
3. Logs タブでリアルタイムログを確認

### Render ログ確認

1. ダッシュボード → Web Service
2. Logs タブをクリック
3. リアルタイムログを確認

---

## よくある質問

**Q: デプロイ後、変更を反映させるには？**
A: Git に push すれば、Vercel/Render が自動的に再デプロイします

**Q: ローカルで開発を続けるには？**
A: 
```bash
cd backend && npm run dev
cd frontend && npm run dev
```

**Q: 本番環境でデバッグするには？**
A: Render/Vercel のログを確認するか、ブラウザの開発者ツール（F12）で Network/Console を確認

---

## 次のステップ

デプロイが完了したら：

- [ ] SSL 証明書を確認（Vercel/Render が自動で設定）
- [ ] ユーザーにリンク `https://kamalink3-login.vercel.app` を共有
- [ ] 定期的にエラーログをモニタリング
- [ ] ユーザーフィードバックを収集
- [ ] 必要に応じてカスタムドメインを設定

---

## サポート

- Vercel ドキュメント: [https://vercel.com/docs](https://vercel.com/docs)
- Render ドキュメント: [https://render.com/docs](https://render.com/docs)
- Firebase ドキュメント: [https://firebase.google.com/docs](https://firebase.google.com/docs)
