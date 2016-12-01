export default class {
  constructor({onClick}){
    this._el = document.createElement('button');
    this._el.type = 'button';
    this._el.innerHTML = 'Save Image';

    this._el.addEventListener('click', onClick)
  }

  get el(){
    return this._el;
  }
}