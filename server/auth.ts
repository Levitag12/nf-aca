import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from './index';
import { users } from '@shared/drizzle/schema'; // <-- Caminho corrigido com alias
import { eq } from 'drizzle-orm';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  // ... (código do login)
});

router.post('/logout', (req: Request, res: Response) => {
  // ... (código do logout)
});

export default router;
