export default class {
  constructor({ width, height, onMouseDown, onMouseMove, onMouseUp, parent }) {
    this._element = document.createElement('canvas');

    // need to mount before setting offset
    parent.appendChild(this._element);

    this._offsetLeft = this._element.offsetLeft;
    this._offsetTop = this._element.offsetTop;

    // init
    this._element.width = width;
    this._element.height = height;
    this._element.addEventListener('mousedown', onMouseDown);
    this._element.addEventListener('mouseup', onMouseUp);
    this._element.addEventListener('mousemove', onMouseMove);
  }

  get offsetLeft() {
    return this._offsetLeft;
  }

  get offsetTop() {
    return this._offsetTop;
  }

  get el() {
    return this._element;
  }

  get context2d() {
    return this._element.getContext('2d');
  }

  get center() {
    return {
      x: this.el.width / 2,
      y: this.el.height / 2
    }
  }

  clear() {
    this.context2d.clearRect(0, 0, this.el.width, this.el.height);
  }
}