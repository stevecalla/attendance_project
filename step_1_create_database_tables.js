const mysql = require('mysql');
const {} = require('./utilities/config');
const {} = require('./utilities/connectionLocalDB');

// Create a connection to MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password'
});

// Connect to MySQL
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');

  // Create the database if it doesn't exist
  connection.query('CREATE DATABASE IF NOT EXISTS attendance_system', (err, result) => {
    if (err) throw err;
    console.log('Database created or already exists');

    // Use the attendance_system database
    connection.query('USE attendance_system', (err, result) => {
      if (err) throw err;
      console.log('Using attendance_system database');

      // Create tables
      const createTables = `
        CREATE TABLE IF NOT EXISTS schools (
          school_id INT PRIMARY KEY AUTO_INCREMENT,
          school_name VARCHAR(255) NOT NULL,
          location VARCHAR(255)
        );

        CREATE TABLE IF NOT EXISTS classes (
          class_id INT PRIMARY KEY AUTO_INCREMENT,
          class_name VARCHAR(255) NOT NULL,
          school_id INT,
          FOREIGN KEY (school_id) REFERENCES schools(school_id)
        );

        CREATE TABLE IF NOT EXISTS teachers (
          teacher_id INT PRIMARY KEY AUTO_INCREMENT,
          teacher_name VARCHAR(255) NOT NULL,
          class_id INT,
          FOREIGN KEY (class_id) REFERENCES classes(class_id)
        );

        CREATE TABLE IF NOT EXISTS students (
          student_id INT PRIMARY KEY AUTO_INCREMENT,
          student_name VARCHAR(255) NOT NULL,
          class_id INT,
          FOREIGN KEY (class_id) REFERENCES classes(class_id)
        );

        CREATE TABLE IF NOT EXISTS attendance (
          attendance_id INT PRIMARY KEY AUTO_INCREMENT,
          student_id INT,
          date DATE,
          status ENUM('Present', 'Absent', 'Late') NOT NULL,
          FOREIGN KEY (student_id) REFERENCES students(student_id)
        );
      `;

      // Execute the create tables query
      connection.query(createTables, (err, result) => {
        if (err) throw err;
        console.log('Tables created successfully');
        // Close the connection
        connection.end();
      });
    });
  });
});
