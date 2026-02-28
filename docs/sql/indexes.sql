-- students
CREATE INDEX IF NOT EXISTS idx_students_institute_id
 ON students (institute_id);


CREATE INDEX IF NOT EXISTS idx_students_course_ids_gin
 ON students USING GIN (course_ids);


-- results
CREATE INDEX IF NOT EXISTS idx_results_student_id
 ON results (student_id);


CREATE INDEX IF NOT EXISTS idx_results_course_id
 ON results (course_id);


CREATE INDEX IF NOT EXISTS idx_results_institute_id
 ON results (institute_id);


CREATE INDEX IF NOT EXISTS idx_results_exam_date
 ON results (exam_date);


CREATE INDEX IF NOT EXISTS idx_results_institute_date
 ON results (institute_id, exam_date);


CREATE INDEX IF NOT EXISTS idx_results_student_date
 ON results (student_id, exam_date);


ANALYZE;
