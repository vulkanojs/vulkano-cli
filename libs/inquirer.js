const inquirer = require('inquirer');
require('colors');

const preguntas = [
  {
    type: 'list',
    name: 'opcion',
    message: 'What do you want to do?',
    choices: [
      {
        value: '1',
        name: `${'1.'.green} Create Vulkano Model`,
      },
      {
        value: '2',
        name: `${'2.'.green} Create Vulkano Controller`,
      },
      {
          value: '3',
          name: `${'3.'.green} Execute Tasks`
      },
      // {
      //     value: '4',
      //     name: `${'4.'.green} Find Record`
      // },
      // {
      //     value: '5',
      //     name: `${'5.'.green} Update Record`
      // },
      {
        value: '0',
        name: `${'0.'.green} Exit`,
      },
    ],
  },
];

/**
 * 
 * @param { String } message - mensaje personalizado 
 * @param { Array } options - array de objetos con las opciones
 * @returns Array - array de objetos
 */
const preguntasPersonalizadas = (message, options) => {
  return [
    {
      type: 'list',
      name: 'opcion',
      message: message,
      choices: options,
    },
  ];
};

/**
 * 
 * @param {Array} options - preguntas definidas 
 * @returns 
 */
const inquirerMenu = async (options = preguntas) => {
  console.clear();
  console.log('==============================='.green);
  console.log('   Select one option'.white);
  console.log('===============================\n'.green);

  const { opcion } = await inquirer.prompt(options);

  return opcion;
};

const pausarMenu = async () => {
  const question = [
    {
      type: 'input',
      name: 'enter',
      message: `Press ${'ENTER'.green} to continue`,
    },
  ];
  console.log('\n');
  await inquirer.prompt(question);
};

const leerInput = async (message) => {
  const question = [
    {
      type: 'input',
      name: 'desc',
      message,
      validate(value) {
        if (value.length === 0) {
          return 'Please select a value';
        }
        return true;
      },
    },
  ];

  const { desc } = await inquirer.prompt(question);
  return desc;
};

module.exports = {
  inquirerMenu,
  pausarMenu,
  leerInput,
  preguntasPersonalizadas
};
