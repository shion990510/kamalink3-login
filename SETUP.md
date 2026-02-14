# コレクター管理システム - セットアップガイド

このドキュメントは、プロジェクトの初期セットアップと実行方法を説明します。

## 必要な環境

- Node.js v16以上
- npm またはyarn
- Firebaseアカウント
- Git

## インストール手順

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd "kamalink3 ログイン"
```

### 2. バックエンドのセットアップ

```bash
cd backend

# 依存関係をインストール
npm install

# 環境変数ファイルを作成
cp .env.example .env

# Firebaseの認証情報を.envに設定
# FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL を入力
```

### 3. フロントエンドのセットアップ

```bash
cd ../frontend

# 依存関係をインストール
npm install
```

## 実行方法

### バックエンドの起動（ターミナル1）

```bash
cd backend
npm run dev
```

サーバーが `http://localhost:3000` で起動します。

### フロントエンドの起動（ターミナル2）

```bash
cd frontend
npm run dev
```

アプリケーションが `http://localhost:5173` で起動します。

## Firebase設定

### サービスアカウントキーの取得

1. [Firebase Console](https://console.firebase.google.com) にアクセス
2. プロジェクトを選択
3. 左側メニューの「プロジェクト設定」をクリック
4. 「サービスアカウント」タブを選択
5. 「新しい秘密鍵を生成」をクリック
6. JSONファイルをダウンロード

### 環境変数の設定

`backend/.env` ファイルにサービスアカウント情報を記入：

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQE...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
```

## テストログイン

テストに使用するサンプルユーザーを作成するには、Firebaseコンソールを使用してください。

1. Firebase ConsoleのAuthenticaionセクションで新規ユーザーを作成
2. Firestoreのusersコレクションに以下を追加：

```json
{
  "email": "test@example.com",
  "name": "テストユーザー",
  "role": "collector",
  "status": "active",
  "createdAt": "2024-01-20T00:00:00Z"
}
```

## トラブルシューティング

### "Cannot find module 'firebase-admin'" エラー

```bash
cd backend
npm install firebase-admin
```

### CORSエラー

`backend/src/index.ts` のCORS設定を確認してください。

### ポート既に使用中エラー

別のポート番号を指定：

```bash
# バックエンド
PORT=3001 npm run dev

# フロントエンド
npm run dev -- --port 5174
```

## ビルド

### バックエンド

```bash
cd backend
npm run build
npm start
```

### フロントエンド

```bash
cd frontend
npm run build
# dist/ フォルダにビルドアウトプットが生成されます
```

## よくある質問

Q: パスワードをリセットするには？
A: Firebaseコンソールから「パスワードをリセット」オプションを使用してください。

Q: 新しいユーザーを追加するには？
A: 管理者ユーザーが管理画面から新規登録リクエストを承認してください。

Q: デプロイする場合？
A: バックエンドをサーバーにデプロイし、フロントエンドをCDNにデプロイしてください。詳細は別途ドキュメントを参照。

## サポート

問題が発生した場合は、コンソールのエラーメッセージを確認してください。
