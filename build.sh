#!/usr/bin/env bash
# exit on error
set -o errexit

# Instala todas as dependências a partir da raiz
npm install

# Constrói o backend e o frontend com um único comando
npm run build