const fs = require('fs');

module.exports = async (process ) => {

  process.title = '@vulkano/cli';

  console.log(`Detecting Vulkano APP: ${VULKANO_CLI}`);

  if (!fs.existsSync(VULKANO_APP)) {
    throw new Error('Vulkano APP is not detectet');
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

  const AllTasks = require('include-all')({
    dirname: `${VULKANO_CLI}/tasks`,
    filter: /(.+)\.js$/,
    excludeDirs: /^\.(git|svn)$/,
    optional: true
  });

  console.log('Models Detected:');
  console.log('--------------------------------');
  console.log(Object.keys(AllModels));

  console.log('');

  console.log('Controllers Detected:');
  console.log('--------------------------------');
  console.log(Object.keys(AllControllers));

  console.log('');
  console.log('Tareas Generales:');
  console.log('--------------------------------');
  console.log(Object.keys({ ...AllTasks, ...AllCustomTasks }));

  console.error('We are testing :)');

  process.exit(1);

};
