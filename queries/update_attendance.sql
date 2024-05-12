UPDATE attendance
SET is_present =
	CASE
		WHEN is_present = false THEN true
    ELSE false
  END,
  updated_at = CURRENT_TIMESTAMP
WHERE student_id = 2
  AND class_id = 1
  AND attendance_date = '2024-04-16';

SELECT
  is_present,
  created_at,
  updated_at
FROM attendance 
WHERE student_id = 2
  AND class_id = 1
  AND attendance_date = '2024-04-16';