import prisma from '../src/lib/prisma.js';

async function main() {
  const email = process.env.EMAIL_TO_CHECK || 'matheeshaweerawansha32@gmail.com';
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log('NOT FOUND');
    } else {
      console.log(JSON.stringify(user, null, 2));
    }
  } catch (e) {
    console.error('ERROR', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
