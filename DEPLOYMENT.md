# コレクター管理システム - デプロイガイド

## 概要
このアプリケーションを公開するための手順書です。

## ステップ1: Vercel でフロントエンドをデプロイ

1. [Vercel](https://vercel.com) にアクセスしてアカウントを作成
2. GitHub、GitLab、Bitbucket のいずれかと連携
3. このリポジトリをインポート
4. 以下の環境変数を設定：
   ```
   VITE_API_URL=https://your-backend-url.com/api
   VITE_GOOGLE_MAPS_API_KEY=（ご自身のAPIキー）
   ```
5. デプロイボタンをクリック

**結果**: `https://your-app-name.vercel.app` でアクセス可能

---

## ステップ2: Render でバックエンドをデプロイ

1. [Render](https://render.com) にアクセスしてアカウントを作成
2. 「New +」→「Web Service」を選択
3. このリポジトリを連携
4. 以下の設定を入力：
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: `.`

5. 環境変数を設定（`.env` ファイルの内容をコピー）：
   ```
   PORT=3000
   NODE_ENV=production
   FIREBASE_PROJECT_ID=kamalink2-779cb
   FIREBASE_PRIVATE_KEY=（秘密鍵をコピー）
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@kamalink2-779cb.iam.gserviceaccount.com
   JWT_SECRET=（強力なランダム文字列に変更）
   ```

6. デプロイ

**結果**: `https://your-backend.onrender.com` でアクセス可能

---

## ステップ3: フロントエンド環境変数を更新

Vercel の設定画面で以下を更新：
```
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## ステップ4: カスタムドメイン設定（オプション）

### ドメインを既に持っている場合
1. Vercel / Render の設定で「Domains」セクションに移動
2. ドメイン名を追加
3. DNS レコードを設定（表示される指示に従う）
4. SSL 証明書は自動で設定されます

### 新しくドメインを購入する場合
1. Namecheap、Google Domains などでドメイン購入
2. ネームサーバーを Vercel / Render が指定するものに変更
3. 完全にアクティベートされるまで 24-48 時間待機

---

## ステップ5: セキュリティ設定

### Firestore セキュリティルール
Firebase Console で以下ルールを設定：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 認証されたユーザーのみアクセス可能
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    match /events/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    match /messages/{document=**} {
      allow read, write: if request.auth != null;
    }
    
    match /locations/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 環境変数の保護
- `JWT_SECRET` は強力なランダム文字列に変更（`openssl rand -base64 32` で生成）
- Render / Vercel は自動的に環境変数を暗号化

---

## テスト

1. **一般向けサイト**: `https://your-app-name.vercel.app/`
2. **ログインページ**: `https://your-app-name.vercel.app/login`
3. **テストユーザーでログイン**して機能を確認

---

## トラブルシューティング

### CORS エラーが出る場合
```typescript
// backend/src/index.ts で確認
app.use(cors({
  origin: 'https://your-frontend-url.vercel.app',
  credentials: true
}))
```

### API が 401 エラーを返す場合
- JWT_SECRET が一致しているか確認
- Firebase 認証情報が正しいか確認

### マップが表示されない場合
- Google Maps API が有効になっているか確認
- API キーが正しく設定されているか確認

---

## 本番運用のベストプラクティス

- [ ] エラー監視を設定（Sentry など）
- [ ] データベースバックアップを有効化
- [ ] 定期的にセキュリティアップデートを確認
- [ ] ユーザーサポート体制を構築
- [ ] ログを定期的に確認

---

## サポート

問題が発生した場合は、バックエンドのログをご確認ください：
```bash
# Render で実行中のログを確認
# → Render ダッシュボード → サービス → ログ
```
