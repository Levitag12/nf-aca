import { db } from './index';
import { users } from '../shared/drizzle/schema';
import bcrypt from 'bcryptjs';

async function seed() {
  try {
    console.log('Iniciando o seeding do banco de dados...');

    // Verifica se o usuário admin já existe
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
    process.exit(1); // Encerra o processo com erro
  }
}

seed().then(() => {
  console.log('Seeding finalizado.');
  process.exit(0); // Encerra o processo com sucesso
});
