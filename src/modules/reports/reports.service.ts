import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { QueryTypes, Sequelize } from 'sequelize';
import { getOffsetPagination } from 'src/common/pagination/pagination';

@Injectable()
export class ReportsService {
  constructor(@InjectConnection() private readonly sequelize: Sequelize) {}

  async instituteStudentResults(instituteId: number, page = 1, limit = 20) {
    const pagination = getOffsetPagination(page, limit);

    const rows = await this.sequelize.query(
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
      {
        type: QueryTypes.SELECT,
        replacements: {
          instituteId,
          limit: pagination.limit,
          offset: pagination.offset,
        },
      },
    );

    return { page: pagination.page, limit: pagination.limit, data: rows };
  }

  async topCoursesByYear(year: number, top = 10) {
    const startDate = new Date(Date.UTC(year, 0, 1));
    const endDate = new Date(Date.UTC(year + 1, 0, 1));

    const rows = await this.sequelize.query(
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
    GROUP BY EXTRACT(YEAR FROM r.exam_date), c.id, c.title
    ORDER BY "takenCount" DESC
    LIMIT :top
    `,
      {
        type: QueryTypes.SELECT,
        replacements: { startDate, endDate, top },
      },
    );

    return { year, top, data: rows };
  }

  async topStudents(top = 20) {
    const rows = await this.sequelize.query(
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
      { type: QueryTypes.SELECT, replacements: { top } },
    );

    return { top, data: rows };
  }

  async explain(sql: string, replacements: Record<string, any>) {
    const rows = await this.sequelize.query(
      `EXPLAIN (ANALYZE, BUFFERS, VERBOSE) ${sql}`,
      { type: QueryTypes.SELECT, replacements },
    );
    return (rows as any[]).map((r) => r['QUERY PLAN']).join('\n');
  }
}
