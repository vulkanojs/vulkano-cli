module.exports = (process) => {


  const {
    host,
    project,
    env
  } = process || {};


  axios.get(`${host}/api/records?project=${project}&environment=${env}`)
    .then( (result) => console.log(result) );

};
