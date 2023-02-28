/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
/**

 */

// const Model = require('./Model');
const { createFile } = require('../helper/file');
const routes = require('../helper/routesCli');

class Models {
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

  createModel(name = '') {
    // Nombre de clase correcto
    const firstLetter = name.charAt(0).toUpperCase();
    const otherText = name.slice(1);
    const newName = `${firstLetter}${otherText}`;
    // const model = new Model(newName);

    // create file
    createFile(`${newName}.js`, routes.modelRoute);
  }
}

module.exports = Models;
