// Seed data for schools, classes, teachers, students, and attendance
const seed_data = [
  // Schools
  { table_name: "schools", school_name: 'School 1', city: 'City 1', state: 'State 1' },
  { table_name: "schools", school_name: 'School 2', city: 'City 2', state: 'State 2' },
  { table_name: "schools", school_name: 'School 3', city: 'City 3', state: 'State 3' },
  { table_name: "schools", school_name: 'School 4', city: 'City 4', state: 'State 4' },
  { table_name: "schools", school_name: 'School 5', city: 'City 5', state: 'State 5' },

  // Classes
  { table_name: "classes", class_name: 'Class A', school_id: 1 },
  { table_name: "classes", class_name: 'Class B', school_id: 1 },
  { table_name: "classes", class_name: 'Class C', school_id: 2 },
  { table_name: "classes", class_name: 'Class D', school_id: 3 },
  { table_name: "classes", class_name: 'Class E', school_id: 4 },

  // Teachers
  { table_name: "teachers", first_name: 'Teacher 1', last_name: 'last_name_1', class_id: 1 },
  { table_name: "teachers", first_name: 'Teacher 2', last_name: 'last_name_2', class_id: 2 },
  { table_name: "teachers", first_name: 'Teacher 3', last_name: 'last_name_3', class_id: 3 },
  { table_name: "teachers", first_name: 'Teacher 4', last_name: 'last_name_4', class_id: 4 },
  { table_name: "teachers", first_name: 'Teacher 5', last_name: 'last_name_5', class_id: 5 },

  // Students
  { table_name: "students", first_name: 'Student 1', last_name: 'last_name_1', class_id: 1 },
  { table_name: "students", first_name: 'Student 2', last_name: 'last_name_2', class_id: 1 },
  { table_name: "students", first_name: 'Student 3', last_name: 'last_name_3', class_id: 2 },
  { table_name: "students", first_name: 'Student 4', last_name: 'last_name_4', class_id: 3 },
  { table_name: "students", first_name: 'Student 5', last_name: 'last_name_5', class_id: 4 },

  // Attendance
  { table_name: "attendance", teacher_id: 1, class_id: 1, student_id: 1, attendance_date: '2024-04-30', is_present: 0, status: 'Present' },
  { table_name: "attendance", teacher_id: 1, class_id: 1, student_id: 2, attendance_date: '2024-04-30', is_present: 1, status: 'Absent' },
  { table_name: "attendance", teacher_id: 2, class_id: 2, student_id: 3, attendance_date: '2024-04-30', is_present: 0, status: 'Present' },
  { table_name: "attendance", teacher_id: 2, class_id: 2, student_id: 4, attendance_date: '2024-04-30', is_present: false, status: 'Present' },
  { table_name: "attendance", teacher_id: 3, class_id: 3, student_id: 5, attendance_date: '2024-04-30', is_present: true, status: 'Absent' },
];

module.exports = {
    seed_data
}