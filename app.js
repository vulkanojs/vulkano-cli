/* eslint-disable no-case-declarations */
/* eslint-disable default-case */
/* eslint-disable no-await-in-loop */
require('colors');

const { inquirerMenu, pausarMenu, leerInput } = require('./helper/inquirer');

const Models = require('./models/Models');
const Controllers = require('./models/Controllers');

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
    }

    await pausarMenu();
  } while (opt !== '0');
};

main();
