/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
/**

 */
// const Controller = require('./Controller');
const { createFile } = require('../libs/file');
const routes = require('../helper/routesCli');

const template = `

module.exports = {

  /* Scaffold */
  scaffold: true,

  /* Model */
  model: ''

};

`;

class Controllers {
  _listado = {};

  get listadoArr() {
    const listado = [];
    Object.keys(this._listado).forEach((key) => listado.push(this._listado[key]));
    return listado;
  }

  constructor() {
    this._listado = {};
  }

  cargarTareaFromArray(tareas = []) {
    tareas.forEach((tarea) => {
      this._listado[tarea.id] = tarea;
    });
  }

  createController(name = '') {
    // Nombre de clase correcto
    const oldName = name.toLowerCase().replace('controller', '');
    const firstLetter = oldName.charAt(0).toUpperCase();
    const otherText = oldName.slice(1);
    const newName = `${firstLetter}${otherText}Controller`;
    // const controller = new Controller(newName);

    // create file
    createFile(`${newName}.js`, routes.controllerRoute, template);
  }
}

module.exports = Controllers;
