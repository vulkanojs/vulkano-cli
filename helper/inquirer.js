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
      // {
      //     value: '3',
      //     name: `${'3.'.green} Save Record`
      // },
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

const inquirerMenu = async () => {
  console.clear();
  console.log('==============================='.green);
  console.log('   Select one option'.white);
  console.log('===============================\n'.green);

  const { opcion } = await inquirer.prompt(preguntas);

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
};
