import { Router } from "express";

const routes = Router();

// Rota de status da API
routes.get("/", (req, res) => {
  res.json({ message: "✅ API funcionando corretamente." });
});

// Ponto para adicionar futuras rotas protegidas ou públicas
// routes.get("/exemplo", (req, res) => { ... });

export default routes;
