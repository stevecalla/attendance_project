// const schools = `SELECT * FROM schools;`;
// const classes = `SELECT * FROM classes;`;
// const teachers = `SELECT * FROM teachers;`;
// const students = `SELECT * FROM students;`;

const { local_mock_attendance_db_config } = require('../utilities/config');

function select_query(table_name) {
    return `SELECT * FROM ${table_name}`
}

function select_attendance_data(table_name) {
  return `
    SELECT 
      attendance_id,
      school_id,
      class_id,
      teacher_id,
      student_id,

      DATE_FORMAT(attendance_date, '%Y-%m-%d') AS attendance_date,

      is_present,
      notes,
      DATE_FORMAT(CONVERT_TZ(created_at, '+00:00', '+00:00'), '%Y-%m-%d %H:%i:%s UTC') as created_at,
      DATE_FORMAT(CONVERT_TZ(updated_at, '+00:00', '+00:00'), '%Y-%m-%d %H:%i:%s UTC') as updated_at
    FROM ${table_name}`
}

function select_attendance_change_log_data(table_name) {
  return `
    SELECT 
      attendance_id,
      school_id,
      class_id,
      teacher_id,
      student_id,

      DATE_FORMAT(attendance_date, '%Y-%m-%d') AS attendance_date,

      is_present,
      notes,
      DATE_FORMAT(CONVERT_TZ(created_at, '+00:00', '+00:00'), '%Y-%m-%d %H:%i:%s UTC') as created_at,
      DATE_FORMAT(CONVERT_TZ(updated_at, '+00:00', '+00:00'), '%Y-%m-%d %H:%i:%s UTC') as updated_at,
      modified_by_email,
      modified_by_full_name
    FROM ${table_name}`
}

// const pacingQuery = `
//     SELECT
//         DATE_FORMAT(CONVERT_TZ(max_booking_datetime, '+00:00', '+00:00'), '%Y-%m-%d %H:%i:%s Asia/Dubai') as max_booking_datetime,
//         is_before_today,

//         pickup_month_year,
//         DATE_FORMAT(booking_date, '%Y-%m-%d') AS booking_date,

//         days_from_first_day_of_month,
//         count,
//         total_booking_charge_aed,
//         total_booking_charge_less_discount_aed,
//         total_booking_charge_less_discount_extension_aed,
//         total_extension_charge_aed,
//         running_count,running_total_booking_charge_aed,
//         running_total_booking_charge_less_discount_aed,
//         running_total_booking_charge_less_discount_extension_aed,
//         running_total_extension_charge_aed,

//         DATE_FORMAT(CONVERT_TZ(created_at, '+00:00', '+00:00'), '%Y-%m-%d %H:%i:%s MST') as created_at

//     FROM ezhire_pacing_metrics.pacing_final_data
//     ORDER BY pickup_month_year ASC, booking_date ASC
//     -- LIMIT 1;
// `;

const tables_library = [
    { table_name: "schools",
      pool_name: local_mock_attendance_db_config,
    //   query: schools,
      file_name: 'schools_data',
      step: "STEP #2.1:",
      step_info: "schools",
    },
    { table_name: "classes",
      pool_name: local_mock_attendance_db_config,
    //   query: classes,
      file_name: 'classes_data',
      step: "STEP #2.2:",
      step_info: "classes",
    },
    { table_name: "teachers",
      pool_name: local_mock_attendance_db_config,
    //   query: teachers,
      file_name: 'teachers_data',
      step: "STEP #2.3:",
      step_info: "teachers",
    },
    { table_name: "students",
      pool_name: local_mock_attendance_db_config,
    //   query: students,
      file_name: 'students_data',
      step: "STEP #2.4:",
      step_info: "students",
    },
    { table_name: "attendance",
      pool_name: local_mock_attendance_db_config,
    //   query: attendanace,
      file_name: 'attendance_data',
      step: "STEP #2.5:",
      step_info: "attendance",
    },
    { table_name: "attendance_change_log",
      pool_name: local_mock_attendance_db_config,
    //   query: attendanace_change_log,
      file_name: 'attendance_change_log_data',
      step: "STEP #2.5:",
      step_info: "attendance change log",
    },
]

module.exports = {
    select_query,
    select_attendance_data,
    select_attendance_change_log_data,
    tables_library,
}

//NOTE: Need to fix date formats so biqquery would convert properly; BQ saves all timestamps in UTC thus need to convert for analysis/Looker queries 
//NOTE: source: https://www.googlecloudcommunity.com/gc/Data-Analytics/Timezone-in-BigQuery/m-p/698624
//NOTE: source: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones

// DATE_FORMAT(booking_date, '%Y-%m-%d') AS booking_date
// converts 2022-11-08T07:00:00.000Z to '2022-11-08'

// DATE_FORMAT(CONVERT_TZ(booking_datetime, '+00:00', '+00:00'), '%Y-%m-%d %H:%i:%s Asia/Dubai') as booking_datetime,
    // converts 2024-01-01T07:18:36.000Z to '2024-01-01 00:18:36 Asia/Dubai'
    // then biquery will convert GST to UTC (less 4 hours)

// DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s MST') as created_at
    // converts timestamp 2024-04-03T20:38:20.000Z to the format 2018-07-05 12:54:00 MST
    // then biquery will convert MST to UTC (or +7 hours)

// DATE_FORMAT(STR_TO_DATE('2023-01-01', '%Y-%m-%d'), '%Y-%m-%d') AS calendar_date,
    // converts string '2023-01-01' to date

// DATE_FORMAT(STR_TO_DATE(date_of_birth, '%m/%d/%Y'), '%Y-%m-%d') AS date_of_birth
    // converts string '01/1/1995' to '1995-01-01' 
