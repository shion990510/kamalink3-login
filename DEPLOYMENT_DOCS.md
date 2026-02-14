# 📚 デプロイドキュメント一覧

アプリケーション公開のための完全なドキュメントセットです。

## 📄 ドキュメント

### 1. **DEPLOYMENT_READY.md** ⭐ ここから始める
準備が完了しているか確認するための詳細チェックリスト
- JWT_SECRET の更新方法
- Google Maps API キーの取得手順
- GitHub リポジトリの設定
- セキュリティ確認

**使用場面**: デプロイする前に、必要な準備をすべて確認したい

---

### 2. **DEPLOYMENT_DETAILED.md** 📖 ステップバイステップガイド
Vercel と Render を使用した完全なデプロイガイド
- Vercel でのフロントエンドデプロイ
- Render でのバックエンドデプロイ
- 環境変数の設定方法
- テスト手順
- トラブルシューティング

**使用場面**: 実際にデプロイを進める際の詳細手順

---

### 3. **DEPLOYMENT_CHECKLIST.md** ✅ チェックリスト
デプロイ前後の確認項目一覧
- デプロイ前の確認事項
- デプロイ手順の要約
- デプロイ後の確認事項
- 本番環境の監視方法

**使用場面**: デプロイの進捗状況を確認したい

---

### 4. **DEPLOYMENT.md** 🔧 概要ガイド
簡潔なデプロイ概要
- 概要
- Vercel でのデプロイ
- Render でのデプロイ
- セキュリティ設定
- サポート情報

**使用場面**: 全体的な流れを素早く把握したい

---

## 🚀 推奨される進行順序

```
1️⃣ DEPLOYMENT_READY.md を読む
   ↓
   (準備が完了しているか確認)
   ↓
2️⃣ prepare-for-deploy.sh を実行
   ↓
   (チェック結果を確認)
   ↓
3️⃣ DEPLOYMENT_DETAILED.md に従ってデプロイ
   ↓
4️⃣ DEPLOYMENT_CHECKLIST.md でテスト
   ↓
5️⃣ 本番環境で動作確認
```

---

## 📋 クイックリファレンス

### Vercel フロントエンド
- URL: https://vercel.com
- ビルドコマンド: `npm run build`
- 出力ディレクトリ: `dist`
- 推奨リージョン: 日本

### Render バックエンド
- URL: https://render.com
- ビルドコマンド: `npm install && npm run build`
- スタートコマンド: `npm start`
- 推奨リージョン: Singapore

### 環境変数
- VITE_API_URL: Render バックエンド URL
- VITE_GOOGLE_MAPS_API_KEY: Google Maps API キー
- FIREBASE_PROJECT_ID: Firebase プロジェクトID
- JWT_SECRET: 強力なランダムキー

---

## 🆘 よくある質問

**Q: どのドキュメントから始めればいい？**
A: `DEPLOYMENT_READY.md` から始めてください。

**Q: デプロイにかかる時間は？**
A: 通常 10-20 分です（アカウント作成時間を除く）

**Q: 費用はかかる？**
A: Vercel・Render とも無料プランで可能です（トラフィック制限あり）

**Q: 途中で失敗したら？**
A: 各ドキュメントの「トラブルシューティング」セクションを確認

---

## 📞 サポート

- Vercel ドキュメント: https://vercel.com/docs
- Render ドキュメント: https://render.com/docs
- Firebase ドキュメント: https://firebase.google.com/docs

---

## ✨ 準備完了

**今すぐデプロイを始めましょう！**

```bash
# 準備確認
bash prepare-for-deploy.sh

# その後、DEPLOYMENT_READY.md を確認
# DEPLOYMENT_DETAILED.md に従ってデプロイ
```

---

*最終更新: 2026年2月14日*
