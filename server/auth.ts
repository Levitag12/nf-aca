import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../index';
import { users } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await db.select().from(users).where(eq(users.email, email)).then(res => res[0]);
  if (!user) return res.status(401).json({ error: 'Usuário não encontrado' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Senha inválida' });

  (req.session as any).user = { id: user.id, email: user.email };
  res.json({ message: 'Logado com sucesso' });
});

router.post('/logout', (req, res) => {
  req.session?.destroy(() => res.json({ message: 'Logout feito' }));
});

export default router;
