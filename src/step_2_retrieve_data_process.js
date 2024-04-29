const fs = require('fs');
const mysql = require('mysql2');

const dotenv = require('dotenv');
dotenv.config({ path: "../.env" }); // add path to read.env file

const { csv_export_path } = require('../utilities/config');
const { create_local_db_connection } = require('../utilities/connectionLocalDB');
const { getCurrentDateTime, getCurrentDateTimeForFileNaming } = require('../utilities/getCurrentDate');
const { generateLogFile } = require('../utilities/generateLogFile');

const { 
    select_query,
    tables_library,
    // schools,
    // classes,
    // teachers,
    // students,
    // attendanace
} = require('../queries/query_all_tables_for_biquery');

async function create_directory(directoryPath) {
    // CHECK IF DIRECTORY EXISTS, IF NOT, CREATE IT
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
        // console.log(`Directory created: ${directoryPath}`);
    }
}

// STEP #1.0 - MOVE FILES TO ARCHIVE
async function moveFilesToArchive() {

    // DEFINE DIRECTORY PATH
    const directoryPath = `${csv_export_path}attendance_data`;
    // Create the directory if it doesn't exist
    await create_directory(directoryPath);

    try {
        // List all files in the directory
        const files = fs.readdirSync(`${csv_export_path}attendance_data`);
        console.log(files);

        const archivePath = `${csv_export_path}attendance_data_archive`;
        // Create the directory if it doesn't exist
        await create_directory(archivePath);

        // Iterate through each file
        for (const file of files) {
            if (file.endsWith('.csv')) {
                // Construct the full file paths
                const sourceFilePath = `${csv_export_path}attendance_data/${file}`;
                const destinationFilePath = `${archivePath}/${file}`;

                // console.log(sourceFilePath);
                // console.log(destinationFilePath);

                try {
                    // Move the file to the "archive" directory
                    fs.renameSync(sourceFilePath, destinationFilePath);
                    // console.log(`Archived ${file}`);
                    generateLogFile('archive_big_query', `Archived ${file}`, csv_export_path);
                } catch (archiveErr) {
                    console.error(`Error moving file ${file} to archive:`, archiveErr);
                    generateLogFile('archive_big_query', `Error archive file ${file}: ${archiveErr}`, csv_export_path);
                }
            }
        }

    } catch (readErr) {
        console.error('Error reading files:', readErr);
    }
}

//todo:
// STEP #2.0 - RETRIEVE DATA FROM ALL TABLES
async function execute_mysql_working_query(db_name, pool, query, step_info) {
    return new Promise((resolve, reject) => {

        const startTime = performance.now();

        pool.query(`USE ${db_name};`, (queryError, results) => {
            pool.query(query, (queryError, results) => {
                const endTime = performance.now();
                const elapsedTime = ((endTime - startTime) / 1_000).toFixed(2); //convert ms to sec

                if (queryError) {
                    console.error('Error executing select query:', queryError);
                    reject(queryError);
                } else {
                    console.log(`\n${step_info}`);
                    // console.table(results);
                    console.log(`Query results: ${results.info}, Elapsed Time: ${elapsedTime} sec\n`);
                    resolve(results);
                }
            });
        });
    });
}

// STEP #3.0 EXPORT RESULTS TO CSV FILE
async function export_results_to_csv(results, file_name) {
    if (results.length === 0) {
        console.log('No results to export.');
        generateLogFile('load_big_query', 'No results to export.', csv_export_path);
        return;
    }

    // DEFINE DIRECTORY PATH
    const directoryPath = `${csv_export_path}attendance_data`;
    // CHECK IF DIRECTORY EXISTS, IF NOT, CREATE IT
    await create_directory(directoryPath);

    try {
        const header = Object.keys(results[0]);

        const csvContent = `${header.join(',')}\n${results.map(row =>
            header.map(key => (row[key] !== null ? row[key] : 'NULL')).join(',')
        ).join('\n')}`;

        const createdAtFormatted = getCurrentDateTimeForFileNaming();
        const filePath = `${csv_export_path}attendance_data/results_${createdAtFormatted}_${file_name}.csv`;
        // console.log('File path = ', filePath);

        fs.writeFileSync(filePath, csvContent);

        console.log(`Results exported to ${filePath}`);
        generateLogFile('load_big_query', `Results exported to ${filePath}`, csv_export_path);

    } catch (error) {
        console.error(`Error exporting results to csv:`, error);
        generateLogFile('load_big_query', `Error exporting results to csv: ${error}`, csv_export_path);
    }
}

//TODO:
// MAIN FUNCTION TO EXECUTE THE PROCESS
async function execute_retrieve_data() {
    try {
        const startTime = performance.now();

        // SET DATA OBJECT

        // STEP 1.0 ARCHIVE FILES
        console.log(`\nSTEP 1.0: ARCHIVE FILES`);
        console.log(`${getCurrentDateTime()}\n`);
        moveFilesToArchive();

        // STEP 2.0 PULL SQL DATA FROM BOOKING, KEY METRICS & PACING METRICS TABLES
        console.log(`\nSTEP 2.0: PULL SQL DATA FROM EACH TABLE`);
        console.log(`${getCurrentDateTime()}\n`);

        // for (let i = 0; i < getData.length; i++) {
        for (const data of tables_library) {
            const { table_name, pool_name, file_name, step, step_info } = data;

            const pool = await create_local_db_connection(pool_name);
            // console.log(pool);

            const query = select_query(table_name);
            
            const info = `${step} GET ${step_info.toUpperCase()} DATA`;

            const results = await execute_mysql_working_query('mock_attendance_db', pool, query, info);

            // STEP 3.0 SAVE DATA TO CSV FILE
            console.log(`STEP 3.0 SAVE ${file_name} TO CSV FILE`);
            await export_results_to_csv(results, file_name);

            // CLOSE POOL
            await pool.end(err => {
                if (err) {
                    console.error('Error closing connection pool:', err.message);
                } else {
                    console.log('Connection pool closed successfully.\n');
                }
            });
        }

        console.log('All queries executed successfully.');

        const endTime = performance.now();
        const elapsedTime = ((endTime - startTime) / 1_000).toFixed(2); //convert ms to sec

        return elapsedTime;

    } catch (error) {
        console.error('Error:', error);
    } finally {
        // End the pool
    }
}

// Run the main function
execute_retrieve_data();

module.exports = {
    execute_retrieve_data,
}