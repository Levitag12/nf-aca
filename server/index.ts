import express from 'express';
import session from 'express-session';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/auth';
import protectedRoutes from './routes/routes';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
// CORREÇÃO: O caminho para o schema deve sair da pasta 'server/src' para encontrar a pasta 'shared'.
import * as schema from '../../shared/drizzle/schema'; // Por favor, verifique se este é o caminho correto para seu arquivo de schema.

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Adiciona configuração de SSL para produção, exigido por serviços como Neon/Render.
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});
export const db = drizzle(pool, { schema });

// Habilita proxy para que o express confie nos headers do Render (essencial para cookies seguros).
app.set('trust proxy', 1);

// Middlewares
app.use(cors({
  origin: true, // Em produção, é recomendado trocar para a URL exata do seu frontend.
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'uma-chave-secreta-muito-forte-e-longa',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // true apenas em produção
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' para cookies cross-site em produção
    maxAge: 1000 * 60 * 60 * 24 // Cookie válido por 1 dia
  }
}));

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);

// --- CORREÇÃO FINAL: Servir os arquivos estáticos do frontend ---
// O __dirname será 'dist/server/src', então precisamos voltar dois níveis para chegar em 'dist'.
const publicPath = path.join(__dirname, '..', '..', 'public');
app.use(express.static(publicPath));

// Rota "catch-all" para servir o index.html do React para qualquer rota que não seja da API.
// Isso permite que o roteamento do React (React Router) funcione corretamente.
app.get('*', (req, res) => {
  if (!req.originalUrl.startsWith('/api')) {
    res.sendFile(path.join(publicPath, 'index.html'));
  } else {
    // Se for uma rota de API não encontrada, envie um 404.
    res.status(404).json({ message: 'Endpoint não encontrado' });
  }
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
