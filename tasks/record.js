module.exports = {

  host: '',

  endpoint: '',

  get() {
    return this._send();
  },

  save() {
    return this._send();
  },

  update() {
    return this._send();
  },

  _send() {
    return Promise.resolve(false)
  }

};
