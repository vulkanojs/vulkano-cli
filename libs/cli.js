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

module.exports = async (process ) => {

  process.title = '@vulkano/cli';

  // console.log(`Detecting Vulkano APP: ${VULKANO_CLI}`);

  if (!fs.existsSync(VULKANO_APP)) {
    return console.log('Error: Vulkano APP is not detectet'.red);
  }

  const AllModels = require('include-all')({
    dirname: `${VULKANO_APP}/models`,
    filter: /(.+)\.js$/,
    excludeDirs: /^\.(git|svn)$/,
    optional: true
  });

  const AllControllers = require('include-all')({
    dirname: `${VULKANO_APP}/controllers`,
    filter: /(.+)\.js$/,
    excludeDirs: /^\.(git|svn)$/,
    optional: true
  });

  const AllCustomTasks = require('include-all')({
    dirname: `${VULKANO_APP}/cli`,
    filter: /(.+)\.js$/,
    excludeDirs: /^\.(git|svn)$/,
    optional: true
  });


  // console.log('Models Detected:');
  // console.log('--------------------------------');
  // console.log(Object.keys(AllModels));

  const customTasks = () => {
    
    let tasks = {};
    let message = 'Select one task';
    const options = [];

    
    if(Object.keys(AllCustomTasks).length) {
      
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


  console.clear();
  const main = async () => {
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
};
