const db_name = `mock_attendance_db`;

const query_create_schools_table = `
    CREATE TABLE IF NOT EXISTS schools (
        school_id INT AUTO_INCREMENT PRIMARY KEY,
        school_name VARCHAR(255) NOT NULL,
        city VARCHAR(255),
        state VARCHAR(255)
      );
`;

const query_create_classes_table = `
      CREATE TABLE IF NOT EXISTS classes (
        class_id INT AUTO_INCREMENT PRIMARY KEY,
        class_name VARCHAR(255) NOT NULL,
        school_id INT,
        FOREIGN KEY (school_id) REFERENCES schools(school_id)
      );
`;

const query_create_teachers_table = `
    CREATE TABLE IF NOT EXISTS teachers (
        teacher_id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email_address VARCHAR(255),
        class_id INT,
        FOREIGN KEY (class_id) REFERENCES classes(class_id)
    );
`;

const query_create_students_table = `
    CREATE TABLE IF NOT EXISTS students (
        student_id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        school_id INT,
        class_id INT,
        FOREIGN KEY (school_id) REFERENCES schools(school_id),
        FOREIGN KEY (class_id) REFERENCES classes(class_id)
    );
`;

const query_create_attendance_table = `
    CREATE TABLE IF NOT EXISTS attendance (
        attendance_id INT AUTO_INCREMENT PRIMARY KEY,
        school_id INT,
        class_id INT,
        teacher_id INT,
        student_id INT,
        attendance_date DATE,
        is_present BOOLEAN,
        notes VARCHAR(255),
        FOREIGN KEY (school_id) REFERENCES schools(school_id),
        FOREIGN KEY (class_id) REFERENCES classes(class_id),
        FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id),
        FOREIGN KEY (student_id) REFERENCES students(student_id)
    );
`;

const query_create_attendance_log_change_table = `
    CREATE TABLE IF NOT EXISTS attendance_change_log (
        attendance_id INT AUTO_INCREMENT PRIMARY KEY,
        school_id INT,
        class_id INT,
        teacher_id INT,
        student_id INT,
        attendance_date DATE,
        is_present BOOLEAN,
        notes VARCHAR(255),
        modified_by_email VARCHAR(255),
        modified_by_full_name VARCHAR(255),
        FOREIGN KEY (school_id) REFERENCES schools(school_id),
        FOREIGN KEY (class_id) REFERENCES classes(class_id),
        FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id),
        FOREIGN KEY (student_id) REFERENCES students(student_id)
    );
`;

const tables_library = [
    { table_name: "schools",
      create_query: query_create_schools_table,
      step: "STEP #2.1:",
      step_info: "schools",
    },
    { table_name: "classes",
      create_query: query_create_classes_table,
      step: "STEP #2.2:",
      step_info: "classes",
    },
    { table_name: "teachers",
      create_query: query_create_teachers_table,
      step: "STEP #2.3:",
      step_info: "teachers",
    },
    { table_name: "students",
      create_query: query_create_students_table,
      step: "STEP #2.4:",
      step_info: "students",
    },
    { table_name: "attendance",
      create_query: query_create_attendance_table,
      step: "STEP #2.5:",
      step_info: "attendance",
    },
    { table_name: "attendance_change_log",
      create_query: query_create_attendance_log_change_table,
      step: "STEP #2.5:",
      step_info: "attendance change log",
    },
]

module.exports = {
    query_create_schools_table,
    query_create_classes_table,
    query_create_teachers_table,
    query_create_students_table,
    query_create_attendance_table,
    query_create_attendance_log_change_table,
    tables_library
}