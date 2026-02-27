'use strict';

module.exports = {
  async up(queryInterface) {
    // 1. Institutes
    await queryInterface.sequelize.query(`
      INSERT INTO institutes (name, slug, email, phone, address, created_at, updated_at)
      SELECT
        'Institute ' || i,
        'institute-' || i,
        'institute' || i || '@example.com',
        '0170000' || i,
        'Address ' || i,
        NOW(),
        NOW()
      FROM generate_series(1, 100000) AS i;
    `);

    // 2. Courses
    await queryInterface.sequelize.query(`
      INSERT INTO courses (title, slug, created_at, updated_at)
      SELECT
        'Course ' || i,
        'course-' || i,
        NOW(),
        NOW()
      FROM generate_series(1, 100000) AS i;
    `);

    // 3. Students
    await queryInterface.sequelize.query(`
      INSERT INTO students
        (institute_id, name, class, roll, section, email, course_ids, created_at, updated_at)
      SELECT
        (i % 10000) + 1,
        'Student ' || i,
        'Class ' || ((i % 10) + 1),
        i,
        'A',
        'student' || i || '@example.com',
        ARRAY[1,2,3]::int[],
        NOW(),
        NOW()
      FROM generate_series(1, 100000) AS i;
    `);

    // 4. Results
    await queryInterface.sequelize.query(`
      INSERT INTO results
        (student_id, course_id, institute_id, score, exam_date, created_at, updated_at)
      SELECT
        i,
        ((i % 10000) + 1),
        ((i % 10000) + 1),
        (i % 100),
        NOW(),
        NOW(),
        NOW()
      FROM generate_series(1, 100000) AS i;
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      TRUNCATE TABLE results RESTART IDENTITY CASCADE;
    `);
    await queryInterface.sequelize.query(`
      TRUNCATE TABLE students RESTART IDENTITY CASCADE;
    `);
    await queryInterface.sequelize.query(`
      TRUNCATE TABLE courses RESTART IDENTITY CASCADE;
    `);
    await queryInterface.sequelize.query(`
      TRUNCATE TABLE institutes RESTART IDENTITY CASCADE;
    `);
    await queryInterface.sequelize.query(`
      TRUNCATE TABLE users RESTART IDENTITY CASCADE;
    `);
  },
};
