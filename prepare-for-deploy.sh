#!/bin/bash

# コレクター管理システム - デプロイ準備スクリプト
# 使用方法: bash prepare-for-deploy.sh

set -e

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  🚀 コレクター管理システム デプロイ準備スクリプト         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Step 1: フロントエンドのビルド確認
echo "📋 Step 1: フロントエンドの確認"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -d "frontend" ]; then
    echo "✓ frontend ディレクトリが存在します"
    
    if [ -f "frontend/package.json" ]; then
        echo "✓ package.json が存在します"
    fi
    
    if [ -d "frontend/dist" ]; then
        echo "✓ ビルド済み (frontend/dist が存在)"
    else
        echo "⚠ フロントエンドがまだビルドされていません"
        echo "実行: cd frontend && npm run build"
    fi
else
    echo "✗ エラー: frontend ディレクトリが見つかりません"
    exit 1
fi

echo ""

# Step 2: バックエンドの設定確認
echo "📋 Step 2: バックエンドの確認"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -d "backend" ]; then
    echo "✓ backend ディレクトリが存在します"
    
    if [ -f "backend/.env" ]; then
        echo "✓ backend/.env が存在します"
        
        # Firebase 設定確認
        if grep -q "FIREBASE_PROJECT_ID" backend/.env; then
            PROJECT_ID=$(grep "FIREBASE_PROJECT_ID" backend/.env | cut -d'=' -f2)
            echo "  - Firebase Project: $PROJECT_ID"
        fi
        
        if grep -q "JWT_SECRET" backend/.env; then
            JWT_SECRET=$(grep "JWT_SECRET" backend/.env | cut -d'=' -f2)
            if [ -z "$JWT_SECRET" ] || [ "$JWT_SECRET" = "your-secret-key-change-this-in-production" ]; then
                echo "  ⚠ JWT_SECRET: デフォルト値のままです（本番環境では必ず変更してください）"
                echo "    実行: openssl rand -base64 32 で新しいキーを生成"
            else
                echo "  ✓ JWT_SECRET: 設定済み"
            fi
        fi
    else
        echo "✗ エラー: backend/.env が見つかりません"
        echo "実行: cp backend/.env.example backend/.env"
        exit 1
    fi
    
    if [ -f "backend/package.json" ]; then
        echo "✓ backend/package.json が存在します"
    fi
else
    echo "✗ エラー: backend ディレクトリが見つかりません"
    exit 1
fi

echo ""

# Step 3: Git 設定確認
echo "📋 Step 3: Git リポジトリの確認"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -d ".git" ]; then
    echo "✓ Git リポジトリが初期化されています"
    
    REMOTE=$(git remote get-url origin 2>/dev/null || echo "なし")
    echo "  - Remote: $REMOTE"
    
    if [ "$REMOTE" != "なし" ]; then
        echo "✓ GitHub リモートが設定されています"
    else
        echo "⚠ GitHub リモートが設定されていません"
        echo "実行手順:"
        echo "  1. https://github.com/new で新規リポジトリを作成"
        echo "  2. git remote add origin https://github.com/YOUR-USERNAME/kamalink3-login.git"
        echo "  3. git branch -M main"
        echo "  4. git push -u origin main"
    fi
else
    echo "⚠ Git リポジトリがまだ初期化されていません"
    echo "実行:"
    echo "  git init"
    echo "  git add ."
    echo "  git commit -m 'Initial commit: Collector management system'"
fi

echo ""

# Step 4: デプロイチェックリスト
echo "📋 Step 4: デプロイ前チェックリスト"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "以下を確認してください:"
echo ""
echo "[ ] Google Maps API キーを取得した"
echo "    → https://console.cloud.google.com"
echo ""
echo "[ ] Vercel アカウントを作成した"
echo "    → https://vercel.com"
echo ""
echo "[ ] Render アカウントを作成した"
echo "    → https://render.com"
echo ""
echo "[ ] GitHub リポジトリにコードをプッシュした"
echo ""
echo "[ ] JWT_SECRET を強力なキーに変更した"
echo ""

# Step 5: デプロイガイド表示
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  📖 次のステップ                                          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "1️⃣  Vercel にフロントエンドをデプロイ"
echo "   詳細: DEPLOYMENT_DETAILED.md の「Vercel フロントエンドのデプロイ」"
echo ""
echo "2️⃣  Render にバックエンドをデプロイ"
echo "   詳細: DEPLOYMENT_DETAILED.md の「Render バックエンドのデプロイ」"
echo ""
echo "3️⃣  環境変数をアップデート"
echo "   詳細: DEPLOYMENT_DETAILED.md の「環境変数の設定」"
echo ""
echo "4️⃣  機能をテスト"
echo "   詳細: DEPLOYMENT_DETAILED.md の「テスト手順」"
echo ""
echo "📚 完全ガイド: DEPLOYMENT_DETAILED.md を参照"
echo ""
