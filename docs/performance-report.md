# Performance Report (Before vs After Indexing)

## Overview

This report analyzes PostgreSQL query performance before and after applying report-driven indexing and query optimization.

Performance measurements were captured using:

EXPLAIN (ANALYZE, BUFFERS, VERBOSE)

Dataset:

- 0.1M rows per table
- PostgreSQL
- NestJS + Sequelize
- Performance measured using standalone SQL script (no API overhead)

## Query Results Summary

| Query                     | Before (ms) | After (ms) |   Improvement |
| ------------------------- | ----------: | ---------: | ------------: |
| institute-student-results |      23.617 |      0.383 | 98.38% faster |
| top-courses-by-year       |       7.868 |      0.058 | 99.26% faster |
| top-students              |     278.680 |    213.656 | 23.34% faster |

## Detailed Findings

### 1) institute-student-results

- Before:
  - `Seq Scan` on `students` with `Rows Removed by Filter: 99990`
  - `Seq Scan` on `results` (100k rows)
  - Execution Time: `23.617 ms`
- After:
  - `Bitmap Index Scan` on `idx_students_institute_id`
  - `Index Scan` on `idx_results_student_id`
  - Execution Time: `0.383 ms`
- Impact:
  - Largest gain from avoiding full-table scans for institute/student filtering and student->result lookup.

### 2) top-courses-by-year

- Before:
  - `Seq Scan` on `results` with date filter (`Rows Removed by Filter: 100000`)
  - Execution Time: `7.868 ms`
- After:
  - `Index Scan` on `idx_results_exam_date`
  - Execution Time: `0.058 ms`
- Impact:
  - Date-range filtering became index-driven; query cost dropped sharply.

### 3) top-students

- Before:
  - `Seq Scan` on `students`, `results`, `institutes`
  - `HashAggregate` spilled to disk (`temp read/written`)
  - Execution Time: `278.680 ms`
- After:
  - `Index Scan` on `idx_results_student_id`
  - `Merge Join` + `Incremental Sort` + `GroupAggregate`
  - `Memoize` reduced repeated institute lookups
  - Execution Time: `213.656 ms`
- Impact:
  - Improved, but still aggregation/sort-heavy on large grouped dataset, so gain is moderate compared to the first two queries.

## Conclusion

Indexing produced clear improvements across all report queries:

- Two filter-driven queries (`institute-student-results`, `top-courses-by-year`) improved by ~98-99%.
- The aggregation-heavy query (`top-students`) improved by ~23%, but remains the most expensive endpoint.

Overall, indexing successfully removed major full-table scan bottlenecks and significantly reduced report query latency.
