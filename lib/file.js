const fs = require('fs');
const path = require('path');

const defaultTemplate = `
module.exports = {

};
`;

const createFile = (fileName, folder, content) => {

  const pathToFile = path.join(VULKANO_APP, folder);

  // validate folder
  fs.access(pathToFile, (err) => {
    if (err) {
      // create folder
      fs.mkdir(pathToFile, (error) => {
        if (error) {
          throw error;
        }
      });
    }
  });

  // validate file
  fs.access(`${pathToFile}${fileName}`, (err) => {
    if (err) {
      // create file
      fs.writeFile(`${pathToFile}${file}`, content || defaultTemplate, (error) => {
        if (error) {
          throw error;
        }
        console.log(`The file ${fileName} was created successfully.`);
      });
    }
  });

};

module.exports = {
  createFile,
};
