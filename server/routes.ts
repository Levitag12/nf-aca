import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../index'; // Importa a instância do DB
import { users } from '../../drizzle/schema'; // Corrige o caminho para o schema
import { eq } from 'drizzle-orm';

const router = Router();

// Rota de Registro
router.post('/register', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.insert(users).values({ email, password: hashedPassword });
        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao registrar usuário.' });
    }
});

// Rota de Login
router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }

    try {
        const user = await db.select().from(users).where(eq(users.email, email));

        if (user.length === 0) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user[0].password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        // Se você estiver usando sessions, aqui é onde você a criaria:
        // req.session.userId = user[0].id;

        res.status(200).json({ message: 'Login bem-sucedido!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao fazer login.' });
    }
});

export default router;

