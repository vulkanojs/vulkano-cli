const fs = require('fs');
const path = require('path');

const { readdir } = fs.promises || {};

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

readDirectory = (props) => {

  const {
    dirname,
    // filter,
    // excludeDirs
  } = props || {};

  //@ TODO: excludeDir

  return readdir(dirname, { withFileTypes: true })
    .then( (result) => {
      return result;
    })
    .catch( () => { // Directory does not exist
      return Promise.resolve([]);
    })
    .then( (dirents) => {

      return Promise
        .all(dirents.map((dirent) => {

          const res = path.resolve(dirname, dirent.name);

          //@ TODO: filter

          return dirent.isDirectory()
            ? readDirectory({ ...props, dirname: res })
            : res;

        }))
        .then( (files) => {

          return Array.prototype.concat(...files)
            .filter( (f) => f)
            .map( (f) => {
              console.log(dirname, f);
              return f.replace(`${dirname}/`, '')
            });

        });

    });


};

module.exports = {
  createFile,
  readDirectory
};
