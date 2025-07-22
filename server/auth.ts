import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from './index'; // Caminho corrigido
import { users } from '../shared/drizzle/schema'; // Caminho corrigido
import { eq } from 'drizzle-orm';

const router = Router();

// Rota de Login
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  try {
    const user = await db.select().from(users).where(eq(users.email, email)).then(res => res[0]);
    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Senha inválida' });
    }

    // Cria a sessão para o usuário
    (req.session as any).user = { id: user.id, email: user.email };
    res.json({ message: 'Logado com sucesso' });

  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota de Logout
router.post('/logout', (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Falha ao fazer logout' });
    }
    res.clearCookie('connect.sid'); // Limpa o cookie da sessão
    res.json({ message: 'Logout feito com sucesso' });
  });
});

export default router;
