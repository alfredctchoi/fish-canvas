import * as domService from '../services/dom'

export default class {
  constructor({ onChange }) {
    this._el = document.createElement('input');
    this._el.type = 'file';
    this._el.addEventListener('change', (event) => {
      const { files } = event.target;
      if (!files || files.length === 0){
        onChange(null);
        return;
      }
      
      domService.readAsDataUrl({
        file: files[0],
        cb: onChange
      })
    });
  }

  get el() {
    return this._el;
  }
}