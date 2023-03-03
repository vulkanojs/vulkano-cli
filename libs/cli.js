require('colors');

const Promise = require('bluebird');
const fs = require('fs');
const includeAll = require('include-all');

const Models = require('../models/Models');
const Controllers = require('../models/Controllers');

const {
  preguntasPersonalizadas,
  inquirerMenu,
  pausarMenu,
  leerInput
} = require('./inquirer');

module.exports = (process ) => {

  process.title = '@vulkano/cli';

  if (!fs.existsSync(VULKANO_APP)) {
    return console.log(`Error: Vulkano APP ${VULKANO_APP} is not detectet`.red);
  }

  const AllCustomTasks = require('include-all')({
    dirname: `${VULKANO_APP}/cli`,
    filter: /(.+)\.js$/,
    excludeDirs: /^\.(git|svn)$/,
    optional: true
  });

  const customTasks = () => {

    let tasks = {};
    let message = 'Select one task';
    const options = [];

    if (Object.keys(AllCustomTasks).length) {

      Object.keys(AllCustomTasks).forEach(key => {

        options.push({
          value: key,
          name: `${key.green} ${AllCustomTasks[key].name}`
        });
      });

      tasks = preguntasPersonalizadas(message, options);

    } else {

      options.push({
        value: '99',
        name: `${'99.'.green} ${'Tasks not found'.red}`
      });

      tasks = preguntasPersonalizadas(message, options)
    }

    return tasks;
  };

  const filterFiles = {
    filter: /(.+)\.js$/,
    excludeDirs: /^\.(git|svn)$/,
    optional: true,
    dontLoad: true
  };


  Promise
    .props({
      models: Promise.resolve( includeAll({ ...filterFiles, dirname: `${VULKANO_APP}/models` }) ),
      controllers: Promise.resolve( includeAll({ ...filterFiles, dirname: `${VULKANO_APP}/controllers` }) ),
      tasks: Promise.resolve( includeAll({ ...filterFiles, dirname: `${VULKANO_APP}/cli` }) ),
    })
    .then( (result) => {

      const {
        models,
        controllers,
        tasks
      } = result || {};

      // console.log(models);
      // console.log(controllers);
      // console.log(tasks);

      const main = async () => {

        console.clear();

        let opt = '';

        do {
          opt = await inquirerMenu();
          switch (opt) {
            case '1':
              // Create Model
              const model = new Models();
              const nameModel = await leerInput('Enter the Model name:');
              model.createModel(nameModel);
              break;

            case '2':
              // create Controller
              const controller = new Controllers();
              const nameController = await leerInput('Enter the Controller name:');
              controller.createController(nameController);
              break;
            case '3':
              // Tareas personalizadas
              const task = await inquirerMenu(customTasks());

              if (task !== '99') {
                const funtionality = await AllCustomTasks[task].task();
                console.log(funtionality);
              }
              break;
          }

          await pausarMenu();
        } while (opt !== '0');
      };

      main();
      // process.exit(1);

    });

};
