//this is a test file, it's in the name
//to run this[v]
// node server/custom_lib_test.js
//output should be[v]
// Variable saved to file
// Variable (async): { name: 'John', age: 30 }
// Variable (callback): { name: 'John', age: 30 }

const { saveVariableToFile, readVariableFromFile, readVariableFromFileCB } = require('./custom_lib');

const name = 'data';

// Save a variable to a file
const variableToSave = { name: 'John', age: 30 };
saveVariableToFile(name, variableToSave);

// Read a variable from a file using the callback-based function
readVariableFromFileCB(name, (err, variable) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Variable (callback):', variable);
  }
});

(async () => {
  try {
    const variable = await readVariableFromFile(name);
    // Use the variable
    console.log('Variable (async):', variable);
  } catch (err) {
    // Handle error
  }
})();