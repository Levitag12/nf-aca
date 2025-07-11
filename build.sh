#!/usr/bin/env bash
set -o errexit

# --- Build do frontend ---
cd client
npm install
npm run build

# --- Build do backend ---
cd ../server
npm install
npm run build  # compila para dist/
