# API Queries and Mutations

This document lists all implemented API operations and highlights complex query logic.

## Auth

| Type     | Method | Path             | Auth | Description                                    |
| -------- | ------ | ---------------- | ---- | ---------------------------------------------- |
| Mutation | POST   | `/auth/register` | No   | Register user, hash password, return JWT token |
| Mutation | POST   | `/auth/login`    | No   | Validate credentials, return JWT token         |

## Users

| Type     | Method | Path                  | Auth                 | Description         |
| -------- | ------ | --------------------- | -------------------- | ------------------- |
| Mutation | POST   | `/users`              | Yes (`JwtAuthGuard`) | Create user         |
| Query    | GET    | `/users?page=&limit=` | Yes                  | Paginated user list |
| Query    | GET    | `/users/:id`          | Yes                  | Get single user     |
| Mutation | PATCH  | `/users/:id`          | Yes                  | Update user         |
| Mutation | DELETE | `/users/:id`          | Yes                  | Delete user         |

## Institutes

| Type     | Method | Path                       | Auth                 | Description                                         |
| -------- | ------ | -------------------------- | -------------------- | --------------------------------------------------- |
| Mutation | POST   | `/institutes`              | Yes (`JwtAuthGuard`) | Create institute with slug generation               |
| Query    | GET    | `/institutes?page=&limit=` | Yes                  | Paginated institute list                            |
| Query    | GET    | `/institutes/:id`          | Yes                  | Get single institute                                |
| Mutation | PATCH  | `/institutes/:id`          | Yes                  | Update institute (slug recalculated on name change) |
| Mutation | DELETE | `/institutes/:id`          | Yes                  | Delete institute                                    |

## Students

| Type     | Method | Path                     | Auth                 | Description            |
| -------- | ------ | ------------------------ | -------------------- | ---------------------- |
| Mutation | POST   | `/students`              | Yes (`JwtAuthGuard`) | Create student         |
| Query    | GET    | `/students?page=&limit=` | Yes                  | Paginated student list |
| Query    | GET    | `/students/:id`          | Yes                  | Get single student     |
| Mutation | PATCH  | `/students/:id`          | Yes                  | Update student         |
| Mutation | DELETE | `/students/:id`          | Yes                  | Delete student         |

## Courses

| Type     | Method | Path                    | Auth                 | Description                        |
| -------- | ------ | ----------------------- | -------------------- | ---------------------------------- |
| Mutation | POST   | `/courses`              | Yes (`JwtAuthGuard`) | Create course with slug generation |
| Query    | GET    | `/courses?page=&limit=` | Yes                  | Paginated course list              |
| Query    | GET    | `/courses/:id`          | Yes                  | Get single course                  |
| Mutation | PATCH  | `/courses/:id`          | Yes                  | Update course                      |
| Mutation | DELETE | `/courses/:id`          | Yes                  | Delete course                      |

## Results

| Type     | Method | Path                    | Auth                | Description           |
| -------- | ------ | ----------------------- | ------------------- | --------------------- |
| Mutation | POST   | `/results`              | No (currently open) | Create exam result    |
| Query    | GET    | `/results?page=&limit=` | No (currently open) | Paginated result list |
| Query    | GET    | `/results/:id`          | No (currently open) | Get single result     |
| Mutation | PATCH  | `/results/:id`          | No (currently open) | Update result         |
| Mutation | DELETE | `/results/:id`          | No (currently open) | Delete result         |

## Reports

| Type  | Method | Path                                                           | Auth                | Description                                |
| ----- | ------ | -------------------------------------------------------------- | ------------------- | ------------------------------------------ |
| Query | GET    | `/reports/institute-student-results?instituteId=&page=&limit=` | No (currently open) | Student-wise institute performance summary |
| Query | GET    | `/reports/top-courses-by-year?year=&top=`                      | No (currently open) | Most taken courses in a year               |
| Query | GET    | `/reports/top-students?top=`                                   | No (currently open) | Top students by average and best score     |

## Complex Query Explanations

### 1) Institute Student Results

Endpoint: `GET /reports/institute-student-results`

Purpose:

- For one institute, summarize each student:
- total exams
- average score
- maximum score

SQL behavior:

- `institutes -> students` inner join restricts to students in the institute.
- `students -> results` left join keeps students even if they have no result row.
- Aggregates:
- `COUNT(r.id)`
- `AVG(r.score)`
- `MAX(r.score)`
- Sorted by average score descending with nulls last.
- Paginated by `LIMIT/OFFSET`.

### 2) Top Courses By Year

Endpoint: `GET /reports/top-courses-by-year`

Purpose:

- Identify courses with highest exam attempt count in a target year.

SQL behavior:

- Filters `results.exam_date` to `[year-01-01, next-year-01-01)`.
- Joins `courses` for course metadata.
- Groups by extracted year + course.
- Orders by `COUNT(*)` descending.
- Returns top `N` rows.

### 3) Top Students

Endpoint: `GET /reports/top-students`

Purpose:

- Rank students across dataset by:

1.  average score (descending)
2.  best score tie-breaker (descending)

SQL behavior:

- Joins `students`, `institutes`, `results`.
- Aggregates per student:
- average score
- max score
- total attempts
- Orders using aggregate ranking fields and applies top limit.
