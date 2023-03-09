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

                const loginInteractive =  AllCustomTasks[task].login;

                if (loginInteractive) {

                  const user = await leerInput('Enter the username:');
                  const pass = await leerInput('Enter the password:', 'password');
  
                  // prelogin
                  try {
  
                    const login = await AllCustomTasks[task].login(user, pass);
                    const idLogin = login.data.id;
  
                    // validate login
                    try {
                      
                      const otp = await leerInput('Enter the otp code:');
  
                      const parametersLogin = {
                        email: user,
                        password: pass,
                        code:otp,
                        key: idLogin
                      }
  
                      const validateLogin = await AllCustomTasks[task].validateLogin(parametersLogin);
                      global.CLI_TOKEN = validateLogin.data.token;
                      
                      console.clear();
                      console.log('\n');
                      console.log('Login successful!!'.green);
                      console.log('\n');
                    } catch (error) {
                      console.log('\n');
                      console.log('Login error'.red);
                    }
                    
                  } catch (error) {

                    console.log('Plugin error'.red);
                  }
                }

                // maximum 5 steps
                const steps = [];
                const interactiveMenus = [];
                const globalVariables = [];

                for (let i = 1; i <= 5; i++) {

                  // Almacena nombre de tarea personalizada
                  const customTask =  AllCustomTasks[task];

                  // steps almacenados en el archivo de la carpeta cli
                  steps[i] = customTask[`step${i}`];

                  // variables generales
                  const stepValues = {}
                  stepValues[`resultStep${i}`] = '';
                  stepValues[`taskStep${i}`] = '';
                  stepValues[`selectMenu${i}`] = '';

                  if (steps[i]) {
                  
                    stepValues[`taskStep${i}`] = await steps[i]();
                    stepValues[`resultStep${i}`] = await leerInput(stepValues[`taskStep${i}`].value);
                  }

                  // interactive menu en el archivo de la carpeta cli
                  interactiveMenus[i] = customTask[`interactiveMenu${i}`];

                  if (interactiveMenus[i]) {

                    const paramsMenu = {}


                    if (stepValues[`taskStep${i}`].name) {
                      paramsMenu[stepValues[`taskStep${i}`].name] = stepValues[`resultStep${i}`] ;
                    }
  
                    // si tiene login
                     if (loginInteractive) {
                       paramsMenu.token = CLI_TOKEN;
                     }

                     // paramsMenu.token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI2MjFkMDE4Y2NjMTQ1ZWEwMjM1MmNkNTQiLCJlbWFpbCI6ImNhbWlsby5ib3JyZXJvQGhlbGxvZGVicmFpbi5jb20iLCJleHAiOjE2ODQ5Mzk4Mzl9.pmweA9t_rDsxYFplTRg_Su4xQ9BzMN0jgiAgMq4VUiI';

                     try {

                      // ejecuta función interactiveMenu de la carpeta cli
                      const functionTask = customTask[`interactiveMenu${i}`];

                      if (functionTask) {
                        const respMenu = await functionTask(paramsMenu, globalVariables);

                        // Agregar opciones para finalizar y retornar
                        if(respMenu.options && respMenu.continue) {
                          respMenu.options.push({ value: 'return', name: '<- Return Menu'});
                        }

                        stepValues[`selectMenu${i}`] = await inquirerMenu(preguntasPersonalizadas(respMenu.message, respMenu.options));
                        globalVariables[`MENU${i}`] = stepValues[`selectMenu${i}`];

                        // retornar al menu anterior
                        if (stepValues[`selectMenu${i}`] === 'return') i-=2;

                        // si no trae el parametro para continuar
                        if (!respMenu.continue) {
                          console.log('El proceso ha finalizado!!!!!!!');
                          i-=2;
                        }
                      }
                      
                    } catch (error) {
                      console.log(`${error}`.red);
                      i-=1;
                    }
                  } // end if

                } // end for
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
