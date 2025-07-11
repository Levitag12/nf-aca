#!/bin/bash

# Build do frontend
cd client
npm install
npm run build

# Volta pro root/backend
cd ../server
npm install

# Inicia o backend
npx tsx index.ts
