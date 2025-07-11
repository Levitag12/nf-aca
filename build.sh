#!/usr/bin/env bash
set -o errexit

# Caminho absoluto da raiz do projeto
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# --- Build do frontend ---
echo "📦 Instalando dependências do frontend..."
cd "$ROOT_DIR/client"
npm install

echo "⚙️  Buildando frontend com Vite..."
npm run build

# --- Build do backend ---
echo "📦 Instalando dependências do backend..."
cd "$ROOT_DIR/server"
npm install

echo "⚙️  Buildando backend (compilando TypeScript)..."
npm run build
