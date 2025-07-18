import express from 'express';
import session from 'express-session';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/auth';
import protectedRoutes from './routes/routes';
import { drizzle } from 'drizzle-orm/node-postgres'; // Ajustado para node-postgres
import { Pool } from 'pg'; // Usar o Pool do 'pg'
import * as schema from './drizzle/schema';

const app = express();
const port = process.env.PORT || 3000;

// --- CORREÇÃO: Usar 'pg' em vez de '@neondatabase/serverless' para compatibilidade com Drizzle v0.20+ no Node.js ---
// A biblioteca @neondatabase/serverless é para ambientes serverless como Vercel Edge, não para Node.js no Render.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});
export const db = drizzle(pool, { schema });

// Habilita proxy (necessário para Render reconhecer HTTPS e setar cookies corretamente)
app.set('trust proxy', 1);

// Middlewares
app.use(cors({
  origin: true, // Ou defina a URL do seu frontend em produção
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'uma-chave-secreta-muito-forte',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // true apenas em produção
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' para produção, 'lax' para dev
    maxAge: 1000 * 60 * 60 * 24 // 1 dia
  }
}));

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);

// --- CORREÇÃO: Servir os arquivos estáticos do frontend a partir da pasta 'dist/public' ---
// O build unificado colocará os arquivos do Vite aqui.
const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));

// Rota "catch-all" para servir o index.html do React para qualquer rota que não seja da API.
// Isso permite que o roteamento do React (React Router) funcione corretamente.
app.get('*', (req, res) => {
  // Garante que as rotas da API não sejam capturadas
  if (!req.originalUrl.startsWith('/api')) {
    res.sendFile(path.join(publicPath, 'index.html'));
  }
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
