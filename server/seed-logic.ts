import { db } from './index';
import { users } from '@shared/drizzle/schema'; // <-- Caminho corrigido com alias
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm'; // <-- Importação que faltava

async function seed() {
  try {
    console.log('Iniciando o seeding do banco de dados...');

    const existingUser = await db.select().from(users).where(eq(users.email, 'admin@admin.com'));
    if (existingUser.length > 0) {
      console.log('Usuário admin já existe. Seeding não é necessário.');
      return;
    }

    const hash = await bcrypt.hash('123456', 10);
    await db.insert(users).values({
      email: 'admin@admin.com',
      password: hash,
    });
    console.log('Usuário "admin@admin.com" inserido com sucesso!');

  } catch (error) {
    console.error('Erro durante o seeding:', error);
    process.exit(1);
  }
}

seed().then(() => {
  console.log('Seeding finalizado.');
  process.exit(0);
});
