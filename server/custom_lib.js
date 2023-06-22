//unfortunately but this didn't get used at all
//but it is useful for server persistent memory
//server persistent memory: it means that even if the server gets restarted the variable still exist, as long as the files don't corrupt
const fs = require('fs');
const path = require('path');
const util = require('util');
const readFileAsync = util.promisify(fs.readFile);
const vars_path = path.join(__dirname, 'file_variables');

// Function to save a variable to a file
const saveVariableToFile = (name, variable) => {
  const data = JSON.stringify(variable);

  fs.writeFile(path.join(vars_path, name), data, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
    } else {
      console.log('Variable saved to file');
    }
  });
};
// Function to read a variable from a file with callback for more complex task
const readVariableFromFileCB = (name, callback) => {
  fs.readFile(path.join(vars_path, name), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      callback(err, null);
    } else {
      const variable = JSON.parse(data);
      callback(null, variable);
    }
  });
};
// Function to read a variable from a file returns the variable as is or null if not found or error
const readVariableFromFile = async (name) => {
    try {
        const data = await readFileAsync(path.join(vars_path, name), 'utf8');
        const variable = JSON.parse(data);
        return variable;
    } catch (err) {
        console.error('Error reading file:', err);
        throw err;
    }
};
//goto custom_lib_test for sample usage

module.exports = {
    saveVariableToFile,readVariableFromFileCB,readVariableFromFile
};