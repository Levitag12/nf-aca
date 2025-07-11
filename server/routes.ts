import { Router } from 'express';

const router = Router();

router.get('/protected', (req, res) => {
  if (!(req.session as any).user) return res.status(401).json({ error: 'Não autenticado' });
  res.json({ message: 'Rota protegida acessada com sucesso!' });
});

export default router;
