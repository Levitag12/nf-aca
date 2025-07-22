import { Router, Request, Response } from 'express';
import { db } from './index'; // Caminho correto para o db

const router = Router();

// Exemplo de uma rota protegida que verifica a sessão do usuário
router.get('/profile', (req: Request, res: Response) => {
  // A lógica de middleware para verificar a sessão deve ser aplicada a esta rota no server/index.ts
  if ((req.session as any).user) {
    res.json({ user: (req.session as any).user });
  } else {
    res.status(401).json({ error: 'Não autorizado' });
  }
});

export default router;
