# コレクター管理システム デプロイチェックリスト

## デプロイ前の確認事項

- [ ] フロントエンドがビルドされた（`frontend/dist/` が存在）
- [ ] Firebase 認証情報が正しく設定されている（`backend/.env`）
- [ ] JWT_SECRET が本番用の強力なキーに変更されている
- [ ] Google Maps API キーが有効である
- [ ] バックエンドの `package.json` に build と start スクリプトがある

## デプロイ手順

### 1️⃣ Vercel でフロントエンドをデプロイ

```bash
# フロントエンドをビルド
cd frontend && npm run build

# Vercel CLI をインストール
npm i -g vercel

# デプロイ
vercel
```

環境変数を設定：
- `VITE_API_URL`: バックエンド URL
- `VITE_GOOGLE_MAPS_API_KEY`: Google Maps API キー

### 2️⃣ Render でバックエンドをデプロイ

Render ダッシュボード → New Web Service

**ビルドコマンド**:
```bash
npm install && npm run build
```

**スタートコマンド**:
```bash
npm start
```

**環境変数** (`backend/.env` から'):
```
PORT=3000
NODE_ENV=production
FIREBASE_PROJECT_ID=kamalink2-779cb
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@kamalink2-779cb.iam.gserviceaccount.com
JWT_SECRET=(強力なランダム文字列)
```

### 3️⃣ Vercel 環境変数をアップデート

デプロイしたバックエンド URL を使用して、フロントエンドの環境変数を更新：
```
VITE_API_URL=https://your-backend.onrender.com/api
```

### 4️⃣ テスト

1. 一般向けサイト: `https://your-frontend.vercel.app/`
2. コレクターログイン: `https://your-frontend.vercel.app/login`
3. 認証後、全機能が動作することを確認

## デプロイ後の確認事項

- [ ] ログインが正常に動作する
- [ ] マップが表示される（位置情報許可後）
- [ ] イベントカレンダーが表示される
- [ ] 掲示板にメッセージを投稿できる
- [ ] Instagram フィードが表示される

## トラブルシューティング

| 問題 | 解決方法 |
|------|---------|
| CORS エラー | backend で CORS 設定を確認 |
| 401 エラー | JWT_SECRET が一致しているか確認 |
| マップ表示されない | Google Maps API キーが有効か確認 |
| Firebase エラー | Firebase 認証情報が正しいか確認 |

## 本番環境の監視

- Render / Vercel のログを定期的に確認
- エラーをトラッキング（Sentry など）
- データベースバックアップを定期的に実行
