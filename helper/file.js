const fs = require('fs');

const createFile = (file, route) => {
  // validate folder
  fs.access(route, (err) => {
    if (err) {
      // create folder
      fs.mkdir(route, (error) => {
        if (error) throw error;
      });
    }
  });

  // validate file
  fs.access(`${route}${file}`, (err) => {
    if (err) {
      // create file
      fs.writeFile(`${route}${file}`, 'Content', (error) => {
        if (error) throw error;
        console.log('File is created successfully.');
      });
    }
  });
};

module.exports = {
  createFile,
};
