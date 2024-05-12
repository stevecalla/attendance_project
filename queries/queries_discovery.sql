USE mock_attendance_db; 

SELECT * FROM schools;
SELECT * FROM classes;
SELECT * FROM teachers;
SELECT * FROM students;
SELECT * FROM attendance;
SELECT * FROM attendance_change_log;

SHOW COLUMNS FROM attendance;

SELECT 
	* 
FROM mock_attendance_db.attendance AT
LEFT JOIN schools AS SC ON SC.school_id = AT.school_id
LEFT JOIN classes AS CL ON CL.class_id = AT.class_id
LEFT JOIN teachers AS TC ON TC.teacher_id = AT.teacher_id
LEFT JOIN students AS ST ON ST.student_id = AT.student_id;

SELECT 
	 SC.school_name,
     AT.attendance_date,
     CL.class_name,
     CONCAT(TC.last_name, ", ", TC.first_name) AS teacher,
     CONCAT(ST.last_name, ", ", ST.first_name) AS student,
     AT.is_present,
     notes,
     at.created_at,
     at.updated_at
FROM mock_attendance_db.attendance AS AT
LEFT JOIN schools AS SC ON SC.school_id = AT.school_id
LEFT JOIN classes AS CL ON CL.class_id = AT.class_id
LEFT JOIN teachers AS TC ON TC.teacher_id = AT.teacher_id
LEFT JOIN students AS ST ON ST.student_id = AT.student_id;