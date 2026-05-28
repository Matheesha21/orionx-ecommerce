import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

let prisma;
try {
	const databaseUrl = process.env.DATABASE_URL;
	if (!databaseUrl) {
		throw new Error("DATABASE_URL is not set");
	}

	const adapterUrl = databaseUrl.startsWith("mysql://")
		? databaseUrl.replace("mysql://", "mariadb://")
		: databaseUrl;

	const adapter = new PrismaMariaDb(adapterUrl);
	prisma = new PrismaClient({ adapter });
} catch (err) {
	console.error("Prisma client initialization failed:", err.message || err);
	// Provide a minimal fallback object so the app can start; calls will fail at runtime with clear errors.
	prisma = {
		user: {
			findUnique: async () => { throw new Error('Prisma client not initialized'); },
			create: async () => { throw new Error('Prisma client not initialized'); },
		},
		product: {
			findMany: async () => { throw new Error('Prisma client not initialized'); },
		},
		contactMessage: {
			create: async () => { throw new Error('Prisma client not initialized'); },
			findMany: async () => { throw new Error('Prisma client not initialized'); },
			update: async () => { throw new Error('Prisma client not initialized'); },
			delete: async () => { throw new Error('Prisma client not initialized'); },
			findUnique: async () => { throw new Error('Prisma client not initialized'); },
		},
		subscriber: {
			findUnique: async () => { throw new Error('Prisma client not initialized'); },
			create: async () => { throw new Error('Prisma client not initialized'); },
			findMany: async () => { throw new Error('Prisma client not initialized'); },
			delete: async () => { throw new Error('Prisma client not initialized'); },
		},
		emailOtp: {
			create: async () => { throw new Error('Prisma client not initialized'); },
			findFirst: async () => { throw new Error('Prisma client not initialized'); },
			findMany: async () => { throw new Error('Prisma client not initialized'); },
			update: async () => { throw new Error('Prisma client not initialized'); },
			deleteMany: async () => { throw new Error('Prisma client not initialized'); },
		},
		$connect: async () => {},
		$disconnect: async () => {},
	};
}

export default prisma;