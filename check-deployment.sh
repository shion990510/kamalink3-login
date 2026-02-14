#!/bin/bash

# このスクリプトは deploy 用のチェックリスト

echo "🚀 コレクター管理システム デプロイ準備チェック"
echo "================================================"

echo ""
echo "✅ フロントエンドのビルド確認"
if [ -d "frontend/dist" ]; then
    echo "   ✓ frontend/dist が存在します"
else
    echo "   ✗ frontend/dist が見つかりません"
    echo "   → cd frontend && npm run build を実行してください"
fi

echo ""
echo "✅ バックエンド設定確認"
if [ -f "backend/.env" ]; then
    echo "   ✓ backend/.env が存在します"
    if grep -q "FIREBASE_PROJECT_ID" backend/.env; then
        echo "   ✓ Firebase 設定が完了しています"
    fi
    if grep -q "JWT_SECRET" backend/.env; then
        echo "   ✓ JWT_SECRET が設定されています"
    fi
else
    echo "   ✗ backend/.env が見つかりません"
fi

echo ""
echo "✅ フロントエンド設定確認"
if [ -f "frontend/.env" ]; then
    echo "   ✓ frontend/.env が存在します"
    if grep -q "VITE_API_URL" frontend/.env; then
        echo "   ✓ API URL が設定されています"
    fi
else
    echo "   ✗ frontend/.env が見つかりません"
fi

echo ""
echo "================================================"
echo "📋 次のステップ:"
echo ""
echo "1️⃣  Vercel でフロントエンドをデプロイ"
echo "    https://vercel.com → Import Project"
echo ""
echo "2️⃣  Render でバックエンドをデプロイ"
echo "    https://render.com → New Web Service"
echo ""
echo "3️⃣  環境変数をアップデート"
echo "    Vercel: VITE_API_URL を Render のバックエンド URL に設定"
echo ""
echo "4️⃣  テスト実行"
echo "    https://your-frontend.vercel.app/ にアクセス"
echo ""
