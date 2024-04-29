SELECT 
  	 s.school_name,
     a.attendance_date,
     c.class_name,
     CONCAT(t.last_name, ", ", t.first_name) AS teacher,
     CONCAT(d.last_name, ", ", d.first_name) AS student,
     a.is_present,
     a.status
FROM `centered-loader-246515.attendance_db.attendance_data` as a
LEFT JOIN `centered-loader-246515.attendance_db.classes_data` as c ON c.class_id = a.class_id
LEFT JOIN `centered-loader-246515.attendance_db.schools_data` as s ON s.school_id = a.school_id
LEFT JOIN `centered-loader-246515.attendance_db.students_data`as d ON d.student_id = a.student_id
LEFT JOIN `centered-loader-246515.attendance_db.teachers_data` as t ON t.teacher_id = a.teacher_id;

-- INSERT INTO `centered-loader-246515.attendance_db.attendance_data`  (school_id, class_id, teacher_id, student_id, attendance_date, is_present, status) VALUES (1, 1, 1, 1, '2024-04-15', 1, 'Present');

-- SELECT * FROM `centered-loader-246515.attendance_db.attendance_data`;
