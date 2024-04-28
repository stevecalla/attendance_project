const dotenv = require('dotenv');
dotenv.config();
// dotenv.config({path: "../.env"}); // add path to read .env file

// console.log(process.env); // check avail of .env
// console.log(process.env.LOCAL_ATTENDANCE_DB); // check avail of .env

const local_mock_attendance_db_config = {
    host: process.env.LOCAL_HOST,
    port: 3306,
    user: process.env.LOCAL_MYSQL_USER,
    password: process.env.LOCAL_MYSQL_PASSWORD,
    // database: process.env.LOCAL_ATTENDANCE_DB,
    connectionLimit: 20,
};

const csv_export_path = `C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/data/`;

module.exports = {
    local_mock_attendance_db_config,
    csv_export_path,
};