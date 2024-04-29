const dotenv = require('dotenv');
dotenv.config({ path: "../.env" }); // add path to read.env file

const fs = require('fs').promises;
const { exec } = require('child_process');

const { generateLogFile } = require('../utilities/generateLogFile');
const { execute_google_cloud_command } = require('../utilities/google_cloud_execute_command');

const { csv_export_path } = require('../utilities/config');

const bucketName = 'attendance_db_bucket';
const destinationPath = `gs://${bucketName}/`;

// ASYNC FUNCTION TO UPLOAD CSV FILES TO GOOGLE CLOUD STORAGE
async function execute_upload_csv_to_cloud() {
  try {
    const startTime = performance.now();
  
    const directory = `${csv_export_path}attendance_data`; // DIRECTORY CONTAINING CSV FILES

    // GOOGLE CLOUD = LOGIN AND SET PROPERTY ID
    await execute_google_cloud_command("login", "Login successful", "login_to_google_cloud");
    await execute_google_cloud_command("set_property_id", "Project Id set successfully.", "set_project_id_for_google_cloud");

    const files = await fs.readdir(directory); // LIST ALL FILES IN THE DIRECTORY
    console.log(files);
    let numberOfFiles = 0;

    // ITERATE THROUGH EACH FILE USING A FOR...OF LOOP
    for (const file of files) {
      if (file.endsWith('.csv')) {
        numberOfFiles++;
        const localFilePath = `${directory}/${file}`;
        const command = `gsutil cp "${localFilePath}" ${destinationPath}`;
        // console.log(command);

        // AWAIT EXECUTION OF GSUTIL CP COMMAND
        await new Promise((resolve, reject) => {
          exec(command, (error, stdout, stderr) => {
            if (error) {
              console.error('Error:', error);
              reject(error); // REJECT THE PROMISE IF THERE'S AN ERROR
              return;
            }

            console.log('File uploaded successfully.');
            console.log('stdout:', stdout);
            console.error('stderr:', stderr);

            // GENERATE LOG FILE FOR SUCCESSFUL UPLOAD
            generateLogFile('load_cloud_attendnce_data', `File uploaded successfully. ${stdout} ${stderr}`);
            resolve(); // RESOLVE THE PROMISE AFTER UPLOAD COMPLETES
          });
        });
      }
    }

    const endTime = performance.now();
    const elapsedTime = ((endTime - startTime) / 1000).toFixed(2); // CONVERT MS TO SEC
    return elapsedTime; // RETURN ELAPSED TIME AFTER ALL UPLOADS COMPLETE
  } catch (error) {
    console.error('Error:', error);
    throw error; // THROW ERROR IF AN ERROR OCCURS DURING UPLOAD PROCESS
  }
}

execute_upload_csv_to_cloud();

module.exports = {
  execute_upload_csv_to_cloud,
};
