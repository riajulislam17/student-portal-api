# student-portal-api

NestJS + Sequelize + PostgreSQL API:

- Auth (JWT) + role validation at DTO level (no DB enum)
- CRUD: users, institutes, courses, students, results
- Reports (3 endpoints)
- Before/After indexing performance artifacts via `EXPLAIN (ANALYZE, BUFFERS, VERBOSE)`
- Sequelize CLI migrations + seeders (0.1M rows/table)

## Documentation
- JWT approach: `docs/jwt-approach.md`
- API queries and mutations: `docs/api-queries-mutations.md`
- SQL schema script: `docs/sql/schema.sql`
- SQL indexes script: `docs/sql/indexes.sql`
- Performance comparison report: `docs/performance-report.md`

## Setup

```bash
cp .env.example .env
npm i
```

Create DB:

```sql
CREATE DATABASE DB_NAME;
```

## Run (Before Indexes)

```bash
npx sequelize db:migrate --name 20260227190216-create-all-table.js
npx sequelize-cli db:seed:all
npm run perf:before
```

## Apply Index Migration + After

```bash
npx sequelize db:migrate --name 20260227190857-create-add-indexing.js
npm run perf:after
```

## Start API

```bash
npm run start:dev
```

Outputs:

- `docs/explain-before/*.txt`
- `docs/explain-after/*.txt`
- Fill: `docs/performance-report.md`
