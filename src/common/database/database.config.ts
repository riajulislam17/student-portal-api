export function buildDatabaseConfig() {
  const source = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
  };
  const parsedPort = Number(source.port ?? 5432);

  return {
    dialect: 'postgres' as const,
    host: source.host,
    port: Number.isFinite(parsedPort) ? parsedPort : 5432,
    database: source.database,
    username: source.username,
    password: source.password,
    logging: false,
  };
}
