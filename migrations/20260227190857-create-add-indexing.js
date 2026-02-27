'use strict';

module.exports = {
  async up(queryInterface) {
    // ---------- students ----------
    await queryInterface.addIndex('students', ['institute_id'], {
      name: 'idx_students_institute_id',
    });

    // ARRAY column search
    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_students_course_ids_gin
      ON students USING GIN (course_ids);
    `);

    // ---------- results ----------
    await queryInterface.addIndex('results', ['student_id'], {
      name: 'idx_results_student_id',
    });

    await queryInterface.addIndex('results', ['course_id'], {
      name: 'idx_results_course_id',
    });

    await queryInterface.addIndex('results', ['institute_id'], {
      name: 'idx_results_institute_id',
    });

    await queryInterface.addIndex('results', ['exam_date'], {
      name: 'idx_results_exam_date',
    });

    //  institute + date range
    await queryInterface.addIndex('results', ['institute_id', 'exam_date'], {
      name: 'idx_results_institute_date',
    });

    //  student + date range (your down() had this)
    await queryInterface.addIndex('results', ['student_id', 'exam_date'], {
      name: 'idx_results_student_date',
    });

    await queryInterface.sequelize.query('ANALYZE;');
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP INDEX IF EXISTS idx_students_institute_id;
      DROP INDEX IF EXISTS idx_students_course_ids_gin;

      DROP INDEX IF EXISTS idx_results_student_id;
      DROP INDEX IF EXISTS idx_results_course_id;
      DROP INDEX IF EXISTS idx_results_institute_id;
      DROP INDEX IF EXISTS idx_results_exam_date;
      DROP INDEX IF EXISTS idx_results_institute_date;
      DROP INDEX IF EXISTS idx_results_student_date;
    `);
  },
};
