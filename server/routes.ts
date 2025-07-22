import { Router, Request, Response } from 'express';
import { db } from './index'; // Caminho corrigido

const router = Router();

// Exemplo de uma rota protegida
router.get('/profile', (req: Request, res: Response) => {
  // Esta é uma rota de exemplo. Adapte conforme sua necessidade.
  // A lógica para verificar se o usuário está logado (middleware) deve ser adicionada aqui.
  if ((req.session as any).user) {
    res.json({ user: (req.session as any).user });
  } else {
    res.status(401).json({ error: 'Não autorizado' });
  }
});

export default router;
