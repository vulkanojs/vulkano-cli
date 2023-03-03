const Promise = require('bluebird');
const fs = require('fs');
require('colors');

const {
  preguntasPersonalizadas,
  inquirerMenu,
  pausarMenu,
  leerInput
} = require('./inquirer');

const Models = require('../models/Models');
const Controllers = require('../models/Controllers');

const Files = require('./file');

module.exports = (process ) => {

  process.title = '@vulkano/cli';

  if (!fs.existsSync(VULKANO_APP)) {
    return console.log(`Error: Vulkano APP ${VULKANO_APP} is not detectet`.red);
  }

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

  const filter = {
    filter: /(.+)\.js$/,
    excludeDirs: /^\.(git|svn)$/
  };

  Promise
    .props({
      models: Files.readDirectory({ ...filter, dirname: `${VULKANO_APP}/models` }),
      controllers: Files.readDirectory({ ...filter, dirname: `${VULKANO_APP}/controllers` }),
      tasks: Files.readDirectory({ ...filter, dirname: `${VULKANO_APP}/cli` })
    })
    .then( (result) => {

      const {
        models,
        controllers,
        tasks
      } = result || {};

      const allModels = (models || []).map( (modelName) => {
        const file = modelName.split(`${VULKANO_APP}/models/`)[1];
        return file.split('.js')[0];
      });

      // console.log('Models Detected:');
      // console.log('--------------------------------');
      // console.log(allModels);

      const allControllers = (controllers || []).map( (controllerName) => {
        const file = controllerName.split(`${VULKANO_APP}/controllers/`)[1];
        return file.split('.js')[0];
      });

      // console.log('Controllers Detected:');
      // console.log('--------------------------------');
      // console.log(allControllers);

      const allCustomTasks = (tasks || []).map( (taskName) => {
        const file = taskName.split(`${VULKANO_APP}/cli/`)[1];
        return file.split('.js')[0];
      });

      // console.log('Tasks Detected:');
      // console.log('--------------------------------');
      // console.log(allCustomTasks);

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
                await AllCustomTasks[task].task;
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
