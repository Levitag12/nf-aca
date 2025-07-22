import express, { Request, Response } from 'express';
import session from 'express-session';
import cors from 'cors';
import path from 'path';
import authRoutes from './auth';
import protectedRoutes from './routes';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '@shared/drizzle/schema'; // <-- Caminho corrigido com alias

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});
export const db = drizzle(pool, { schema });

app.set('trust proxy', 1);

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'uma-chave-secreta-muito-forte',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24
  }
}));

app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);

const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));

app.get('*', (req: Request, res: Response) => {
  if (!req.originalUrl.startsWith('/api')) {
    res.sendFile(path.join(publicPath, 'index.html'));
  } else {
    res.status(404).json({ message: 'Endpoint não encontrado' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
