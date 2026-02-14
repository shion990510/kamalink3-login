# コレクター管理システム - ログイン機能

メールアドレスとパスワードを使用したコレクター専用のログイン機能を備えたアプリケーションです。管理者の承認がないと新規登録できません。

## 🚀 クイックスタート

### 開発環境での起動

```bash
# バックエンド（ポート3000）
cd backend && npm run dev

# フロントエンド（ポート5173）（別ターミナル）
cd frontend && npm run dev
```

ブラウザで `http://localhost:5173` にアクセス

### 本番環境へのデプロイ

**初めての方は、以下のガイドをご覧ください：**

1. 📋 [DEPLOYMENT_READY.md](./DEPLOYMENT_READY.md) - デプロイ前準備
2. 📖 [DEPLOYMENT_DETAILED.md](./DEPLOYMENT_DETAILED.md) - 詳細デプロイガイド
3. ✅ [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - チェックリスト

**デプロイ検査スクリプト:**
```bash
bash prepare-for-deploy.sh
```

---

## 機能一覧

### ユーザー機能
- メールアドレスとパスワードでログイン
- ログイン後、ダッシュボードでアカウント情報を確認
- ログアウト機能

### 管理者機能
- 新規登録リクエストの一覧表示
- リクエストの承認/却下
- 承認済みコレクター一覧の表示

## セットアップ手順

### 前提条件
- Node.js 16以上
- Firebaseプロジェクト（サービスアカウントキー）

### バックエンドセットアップ

1. **依存関係をインストール**
   ```bash
   cd backend
   npm install
   ```

2. **.envファイルを作成**
   ```bash
   cp .env.example .env
   ```

3. **.envにFirebaseの設定を記入**
   ```
   PORT=3000
   NODE_ENV=development
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY=your-private-key
   FIREBASE_CLIENT_EMAIL=your-client-email
   JWT_SECRET=your-secret-key-change-this-in-production
   ```

4. **開発サーバーを起動**
   ```bash
   npm run dev
   ```

### フロントエンドセットアップ

1. **依存関係をインストール**
   ```bash
   cd frontend
   npm install
   ```

2. **開発サーバーを起動**
   ```bash
   npm run dev
   ```

3. ブラウザで `http://localhost:5173` にアクセス

## Firebaseセットアップ

### 必要なコレクション構造

```
users/ (ユーザー情報)
  - {userId}
    - email: string
    - name: string
    - role: 'admin' | 'collector'
    - status: 'active' | 'pending' | 'rejected'
    - createdAt: timestamp

pending_registrations/ (新規登録リクエスト)
  - {email}
    - email: string
    - requestedAt: timestamp
    - status: 'pending'
```

### ユーザーの初期化

管理者ユーザーをFirebaseで作成する場合：

1. Firebase Consoleで新規ユーザーを作成
2. Firestoreのusersコレクションに以下の情報を追加：
   ```json
   {
     "email": "admin@example.com",
     "name": "管理者",
     "role": "admin",
     "status": "active",
     "createdAt": "2024-01-01T00:00:00Z"
   }
   ```

## ログインフロー

1. ログインページでメールアドレスとパスワードを入力
2. バックエンドで認証処理を実行
3. ステータスが「active」であることを確認
4. JWTトークンを発行
5. ダッシュボードにリダイレクト

## 新規登録フロー（将来の実装向け）

1. ユーザーが新規登録をリクエスト
2. `pending_registrations`コレクションに記録
3. 管理者が申請を確認
4. 管理者が承認すると、usersコレクションに追加してstatus=activeに設定
5. ユーザーがログイン可能になる

## トラブルシューティング

### Firebaseの認証エラー
- Firebaseのサービスアカウントキーが正しく設定されているか確認
- FIREBASE_PRIVATE_KEYに改行が含まれているか確認

### ログインできない
- メールアドレスが正しく入力されているか確認
- ユーザーのステータスが「active」に設定されているか確認
- JWTトークンの有効期限を確認

## ライセンス

MIT
