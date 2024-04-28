// Seed data for schools, classes, teachers, students, and attendance
const seed_data = [
  // Schools
  { table_name: "schools", school_id: 1, school_name: 'Boulder High School', city: 'Boulder', state: 'CO' },
  { table_name: "schools", school_id: 2, school_name: 'Denver Central High School', city: 'Denver', state: 'CO' },
  { table_name: "schools", school_id: 3, school_name: 'Springs High School', city: 'Colorado Springs', state: 'CO' },
  { table_name: "schools", school_id: 4, school_name: 'Arvada High School', city: 'Arvada', state: 'CO' },
  { table_name: "schools", school_id: 5, school_name: 'Niwot High School', city: 'Niwot', state: 'CO' },

  // Classes
  { table_name: "classes", class_name: 'Math 101', school_id: 1 },
  { table_name: "classes", class_name: 'English 101', school_id: 1 },
  { table_name: "classes", class_name: 'Science 101', school_id: 1 },
  { table_name: "classes", class_name: 'Home Economics 101', school_id: 1 },
  { table_name: "classes", class_name: 'Recreation 101', school_id: 1 },

  // Teachers
  { table_name: "teachers", first_name: 'Sam', last_name: 'Waters', class_id: 1 },
  { table_name: "teachers", first_name: 'Debbie', last_name: 'Johnson', class_id: 2 },
  { table_name: "teachers", first_name: 'Bessie', last_name: 'Doodle', class_id: 3 },
  { table_name: "teachers", first_name: 'Tom', last_name: 'Horsh', class_id: 4 },
  { table_name: "teachers", first_name: 'Robert', last_name: 'Griffin', class_id: 5 },

  // Students
  { table_name: "students", first_name: 'John', last_name: 'Sullivan', school_id: 1, class_id: 1 },
  { table_name: "students", first_name: 'Ann', last_name: 'Barnaby', school_id: 1, class_id: 1 },
  { table_name: "students", first_name: 'Nicole', last_name: 'Churn', school_id: 1, class_id: 2 },
  { table_name: "students", first_name: 'Bart', last_name: 'Sims', school_id: 1, class_id: 3 },
  { table_name: "students", first_name: 'Pam', last_name: 'Wasby', school_id: 1, class_id: 4 },

  // Attendance
  { table_name: "attendance", school_id: 1, class_id: 1, teacher_id: 1, student_id: 1, attendance_date: '2024-04-30', is_present: 1, status: 'Present' },
  { table_name: "attendance", school_id: 1, class_id: 1, teacher_id: 1, student_id: 2, attendance_date: '2024-04-30', is_present: 0, status: 'Late' },
  { table_name: "attendance", school_id: 1, class_id: 3, teacher_id: 2, student_id: 3, attendance_date: '2024-04-30', is_present: 1, status: 'Present' },
  { table_name: "attendance", school_id: 1, class_id: 2, teacher_id: 2, student_id: 4, attendance_date: '2024-04-30', is_present: false, status: 'Excused' },
  { table_name: "attendance", school_id: 1, class_id: 3, teacher_id: 3, student_id: 4, attendance_date: '2024-04-30', is_present: false, status: 'Excused' },
];

module.exports = {
    seed_data
}