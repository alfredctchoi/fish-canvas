import * as mouseEventService from './services/mouse-events'
import * as domService from './services/dom'
import FishClass from './models/fish'
import CanvasClass from './models/canvas'
import Uploader from './models/uploader'
import SaveButtonClass from './models/save'

const _downloadFileName = 'fish-slap.png';

module.exports = class {
  constructor(el) {
    // bindings
    this.draw = this.draw.bind(this);
    this.drawFish = this.drawFish.bind(this);
    this.drawFace = this.drawFace.bind(this);
    this.uploadChange = this.uploadChange.bind(this);
    this.handleCanvasMouseDown = this.handleCanvasMouseDown.bind(this);
    this.handleCanvasMouseMove = this.handleCanvasMouseMove.bind(this);
    this.handleCanvasMouseUp = this.handleCanvasMouseUp.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);

    // constants
    const { width, height } = el.getBoundingClientRect();
    const uploaderProps = {
      onChange: this.uploadChange
    };
    const canvasProps = {
      parent: el,
      width,
      height,
      onMouseDown: this.handleCanvasMouseDown,
      onMouseMove: this.handleCanvasMouseMove,
      onMouseUp: this.handleCanvasMouseUp
    };
    const saveButtonProps = {
      onClick: this.handleSaveClick
    };

    // private properties
    this._el = el;
    this._canvas = new CanvasClass(canvasProps);
    this._uploader = new Uploader(uploaderProps);
    this._fish = new FishClass({ cb: this.draw });
    this._face = null;
    this._saveButton = new SaveButtonClass(saveButtonProps);
    this._isMouseDown = false;

    // add canvas
    this._el.appendChild(this._uploader.el);
    this._el.appendChild(this._saveButton.el);
  }

  get fish() {
    return this._fish;
  }

  uploadChange(file) {
    domService.createImage({
      src: file,
      cb: (face) => {
        this._face = face;
        this.draw();
      }
    })
  }

  drawFish() {
    const {
      image,
      x,
      y,
      width,
      height,
    } = this.fish;

    this._canvas.context2d.drawImage(image, x, y, width, height);
  }

  drawFace() {
    if (!this._face) return;
    this._canvas.context2d.drawImage(this._face, 0, 0);
  }

  draw() {
    this._canvas.clear();
    this.drawFace();
    this.drawFish();
  }

  handleCanvasMouseUp() {
    this._isMouseDown = false;
  }

  handleCanvasMouseMove(event) {
    if (!this._isMouseDown) return;
    const { clientX, clientY } = event;
    const { x, y } = mouseEventService.getCanvasMousePosition({
      clientX,
      clientY,
      canvas: this._canvas
    });
    this._fish.move(x, y);
    this.draw();
  }

  handleCanvasMouseDown(event) {
    const { clientX, clientY } = event;
    const { x, y } = mouseEventService.getCanvasMousePosition({ clientX, clientY, canvas: this._canvas });
    if (!mouseEventService.isFishClicked({ x, y, fish: this._fish })) return;
    this._isMouseDown = true;
  }

  handleSaveClick() {
    const linkElement = document.createElement('a');
    linkElement.download = _downloadFileName;
    linkElement.href = this._canvas.el.toDataURL();
    linkElement.style.opacity = 0;
    document.body.appendChild(linkElement);
    linkElement.addEventListener('click', () => {
      linkElement.parentElement.removeChild(linkElement);
    });
    linkElement.click();
  }
};