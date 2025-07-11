import express from 'express';
import session from 'express-session';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/auth';
import protectedRoutes from './routes/routes';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import * as schema from './drizzle/schema';

const app = express();
const port = process.env.PORT || 3000;

// Drizzle + Neon
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });

// Middlewares
app.use(cors());
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
}));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);

// Serve o frontend
const distPath = path.join(__dirname, '../../client/dist');
app.use(express.static(distPath));
app.get('*', (_, res) => res.sendFile(path.join(distPath, 'index.html')));

// Inicia o servidor
app.listen(port, () => console.log(`Server running on port ${port}`));
