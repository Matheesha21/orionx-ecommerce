import prisma from '../src/lib/prisma.js';

async function main() {
  const models = [
    { key: 'user', label: 'User' },
    { key: 'product', label: 'Product' },
    { key: 'order', label: 'Order' },
    { key: 'orderItem', label: 'OrderItem' },
    { key: 'contactMessage', label: 'ContactMessage' },
    { key: 'subscriber', label: 'Subscriber' },
    { key: 'emailOtp', label: 'EmailOtp' },
  ];

  for (const m of models) {
    try {
      if (typeof prisma[m.key] === 'undefined' || typeof prisma[m.key].count !== 'function') {
        console.log(`${m.label}: model not found in Prisma client`);
        continue;
      }

      const count = await prisma[m.key].count();
      console.log(`${m.label}: ${count}`);
    } catch (err) {
      console.log(`${m.label}: error - ${err.message}`);
    }
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('Script failed:', e);
  prisma.$disconnect();
  process.exit(1);
});
