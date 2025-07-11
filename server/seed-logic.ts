import { db } from '../index';
import { users } from './schema';
import bcrypt from 'bcryptjs';

async function seed() {
  const hash = await bcrypt.hash('123456', 10);
  await db.insert(users).values({
    email: 'admin@admin.com',
    password: hash,
  });
  console.log('Usuário seed inserido');
}

seed();
