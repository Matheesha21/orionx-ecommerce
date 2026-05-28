import prisma from '../src/lib/prisma.js';

async function main() {
  const email = process.env.EMAIL || 'matheeshaweerawansha32@gmail.com';
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log('NOT FOUND');
      return;
    }

    const updated = await prisma.user.update({
      where: { email },
      data: { isAdmin: true },
    });

    console.log('UPDATED', JSON.stringify({ id: updated.id, email: updated.email, username: updated.username, isAdmin: updated.isAdmin }, null, 2));
  } catch (e) {
    console.error('ERROR', e?.message || e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
