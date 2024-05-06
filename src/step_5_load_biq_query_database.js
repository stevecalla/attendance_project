'use strict';
const dotenv = require('dotenv');
dotenv.config({ path: "../.env" }); // add path to read.env file

// Import the Google Cloud client libraries
const fs = require('fs').promises;
const { BigQuery } = require('@google-cloud/bigquery');
const { Storage } = require('@google-cloud/storage');

const { execute_google_cloud_command } = require('../utilities/google_cloud_execute_command');

const GOOGLE_SERVICE_ACCOUNT = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
const { csv_export_path } = require('../utilities/config');
const { attendance_schema } = require('../utilities/attendance_schema');
const { attendance_change_log_schema } = require('../utilities/attendance_change_log_schema');

const datasetId = "attendance_db";
//TODO: Based on testing the order is important; below is in alpha order
const tableIds = ["attendance_change_log", "attendance_data", "classes_data", "schools_data", "students_data",  "teachers_data"];
// const tableIds = ["attendance_data", "classes_data"]; // for testing

// Import a GCS file into a table with manually defined schema.
async function execute_load_big_query_database() {
    const startTime = performance.now();
    let elapsedTime;
        
    // GOOGLE CLOUD = LOGIN AND SET PROPERTY ID
    await execute_google_cloud_command("login", "Login successful", "login_to_google_cloud");
    await execute_google_cloud_command("set_property_id", "Project Id set successfully.", "set_project_id_for_google_cloud");
    
    // Instantiate clients
    const bigqueryClient = new BigQuery({ credentials: GOOGLE_SERVICE_ACCOUNT });
    const storageClient = new Storage();
    
    /**
     * This sample loads the CSV file at
     * https://storage.googleapis.com/cloud-samples-data/bigquery/us-states/us-states.csv
    *
    * TODO(developer): Replace the following lines with the path to your file.
    */
    const directory = `${csv_export_path}attendance_data`; // DIRECTORY CONTAINING CSV FILES
    const files = await fs.readdir(directory); // LIST ALL FILES IN THE DIRECTORY
    let numberOfFiles = 0;

    const bucketName = 'attendance_db_bucket';

    // Merge arrays into an object using map
    const merged_table_details = tableIds.map((table_name, index) => {
        return {
            tableName: table_name,
            tablePath: files[index],
        }
    });
    console.log(files);
    console.log(merged_table_details);

    const filesLength = merged_table_details.length;

    // Imports a GCS file into a table with auto detect defined schema.

    for (const file of merged_table_details) {

        // Configure the load job. For full list of options, see:
        // https://cloud.google.com/bigquery/docs/reference/rest/v2/Job#JobConfigurationLoad
        // source: https://cloud.google.com/bigquery/docs/samples/bigquery-load-table-gcs-csv-truncate
        const metadataOptions = {
            'attendance_data': {
                sourceFormat: 'CSV',
                skipLeadingRows: 1,
                schema: { fields: attendance_schema },
                location: 'US',
                // Set the write disposition to overwrite existing table data.
                writeDisposition: 'WRITE_TRUNCATE',
            },
            'attendance_change_log': {
                sourceFormat: 'CSV',
                skipLeadingRows: 1,
                schema: { fields: attendance_change_log_schema },
                location: 'US',
                writeDisposition: 'WRITE_TRUNCATE',
            },
            // Add more options for other file.tableName values if needed
        };
        
        const metadata = metadataOptions[file.tableName] || {
            sourceFormat: 'CSV',
            skipLeadingRows: 1,
            autodetect: true,
            location: 'US',
            writeDisposition: 'WRITE_TRUNCATE',
        };
        
        // Load data from a Google Cloud Storage file into the table
        const [job] = await bigqueryClient
            .dataset(datasetId)
            .table(file.tableName)
            .load(storageClient.bucket(bucketName).file(file.tablePath), metadata);
            
        const endTime = performance.now();
        elapsedTime = ((endTime - startTime) / 1000).toFixed(2); // CONVERT MS TO SEC
        
        // load() waits for the job to finish
        console.log(`File ${++numberOfFiles} of ${filesLength}, File name: ${file.tableName}`);
        console.log(`Job ${job.id} completed. Elapsed time: ${elapsedTime}\n`);
    
        // Check the job's status for errors
        const errors = job.status.errors;
        if (errors && errors.length > 0) {
            throw errors;
        }
    }

    const endTime = performance.now();
    elapsedTime = ((endTime - startTime) / 1000).toFixed(2); // CONVERT MS TO SEC
    return elapsedTime; // RETURN ELAPSED TIME AFTER ALL UPLOADS COMPLETE
}

execute_load_big_query_database();

module.exports = {
    execute_load_big_query_database,
}


