const fs = require('fs').promises;
const { exec } = require('child_process');
const { generateLogFile } = require('../utilities/generateLogFile');

const { csv_export_path } = require('../utilities/config');

const bucketName = 'attendance_db_bucket';
const destinationPath = `gs://${bucketName}/`;

// ASYNC FUNCTION TO UPLOAD CSV FILES TO GOOGLE CLOUD STORAGE
async function execute_upload_csv_to_cloud() {
  const startTime = performance.now();
  const directory = `${csv_export_path}attendance_data`; // DIRECTORY CONTAINING CSV FILES

  try {
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
