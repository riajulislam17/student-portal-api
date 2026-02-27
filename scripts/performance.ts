import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import { Sequelize, QueryTypes } from 'sequelize';

const mode = process.argv[2]; // before|after
if (!mode || !['before', 'after'].includes(mode)) {
  console.error('Usage: npm run perf:before OR npm run perf:after');
  process.exit(1);
}

const outDir = path.resolve(
  'docs',
  mode === 'before' ? 'explain-before' : 'explain-after',
);
fs.mkdirSync(outDir, { recursive: true });

const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASS!,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    dialect: 'postgres',
    logging: false,
  },
);

async function explain(
  filename: string,
  sql: string,
  replacements: Record<string, any>,
) {
  const rows = await sequelize.query<{ 'QUERY PLAN': string }>(
    `EXPLAIN (ANALYZE, BUFFERS, VERBOSE) ${sql}`,
    {
      replacements,
      type: QueryTypes.SELECT,
    },
  );

  const text = rows.map((r) => r['QUERY PLAN']).join('\n');
  fs.writeFileSync(path.join(outDir, filename), text, 'utf-8');
}

async function run() {
  await sequelize.authenticate();

  const instituteId = 1;
  const year = 2025;
  const top = 20;
  const limit = 20;
  const offset = 0;
  const startDate = `${year}-01-01`;
  const endDate = `${year + 1}-01-01`;

  await explain(
    'institute-student-results.txt',
    `
    SELECT
      i.id AS "instituteId",
      i.name AS "instituteName",
      s.id AS "studentId",
      s.name AS "studentName",
      COUNT(r.id) AS "totalExams",
      AVG(r.score) AS "avgScore",
      MAX(r.score) AS "maxScore"
    FROM institutes i
    JOIN students s ON s.institute_id = i.id
    LEFT JOIN results r ON r.student_id = s.id
    WHERE i.id = :instituteId
    GROUP BY i.id, i.name, s.id, s.name
    ORDER BY "avgScore" DESC NULLS LAST
    LIMIT :limit OFFSET :offset
    `,
    { instituteId, limit, offset },
  );

  await explain(
    'top-courses-by-year.txt',
    `
    SELECT
      EXTRACT(YEAR FROM r.exam_date)::int AS "year",
      c.id AS "courseId",
      c.title AS "courseTitle",
      COUNT(*) AS "takenCount"
    FROM results r
    JOIN courses c ON c.id = r.course_id
    WHERE r.exam_date >= :startDate
      AND r.exam_date <  :endDate
    GROUP BY "year", c.id, c.title
    ORDER BY "takenCount" DESC
    LIMIT 10
    `,
    { startDate, endDate },
  );

  await explain(
    'top-students.txt',
    `
    SELECT
      s.id AS "studentId",
      s.name AS "studentName",
      i.name AS "instituteName",
      AVG(r.score) AS "avgScore",
      MAX(r.score) AS "bestScore",
      COUNT(r.id) AS "attempts"
    FROM students s
    JOIN institutes i ON i.id = s.institute_id
    JOIN results r ON r.student_id = s.id
    GROUP BY s.id, s.name, i.name
    ORDER BY "avgScore" DESC, "bestScore" DESC
    LIMIT :top
    `,
    { top },
  );

  console.log('Saved EXPLAIN outputs to:', outDir);
}

run()
  .then(() => sequelize.close())
  .catch(async (e) => {
    console.error(e);
    await sequelize.close().catch(() => {});
    process.exit(1);
  });
