import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT),
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL client error:", err);
});

export default pool;
