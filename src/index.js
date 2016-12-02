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
    this._resizeProperty = null;
    this._isSelected = false;

    // add canvas
    this._el.appendChild(this._uploader.el);
    this._el.appendChild(this._saveButton.el);
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
    } = this._fish;
    const ctx = this._canvas.context2d;

    ctx.drawImage(image, x, y, width, height);

    // if (this._clickCount >= 1){
    //   ctx.beginPath();
    //   ctx.moveTo(x, y);
    //   ctx.lineTo(x + width, y);
    //   ctx.lineTo(x + width, y + height);
    //   ctx.lineTo(x, y + height);
    //   ctx.closePath();
    //   ctx.stroke();
    // }

    if (this._isSelected) {
      this._fish.drawAnchors(ctx);
    }
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
    this._resizeProperty = null;
  }

  handleCanvasMouseMove(event) {
    // do nothing if fish is not selected
    if (!this._isSelected) return;

    const { clientX, clientY } = event;

    // get the real mouse position including offset when canvas is clicked
    const { x, y } = mouseEventService.getCanvasMousePosition({
      clientX,
      clientY,
      canvas: this._canvas
    });

    if (this._resizeProperty !== null) {
      let width;
      let height;

      switch (this._resizeProperty) {
        case 'topLeft':
          width = (this._fish.x + this._fish.width) - x;
          height = (this._fish.y + this._fish.height) - y;
          this._fish.resize({ x, y, width, height });
          break;
        case 'topRight':
          width = x - this._fish.x;
          height = (this._fish.y + this._fish.height) - y;
          this._fish.resize({
            x: this._fish.x,
            y: y,
            width,
            height,
          });
          break;
        case 'bottomRight':
          width = x - this._fish.x;
          height = y - this._fish.y ;
          this._fish.resize({
            x: this._fish.x,
            y: this._fish.y,
            width,
            height,
          });
          break;
        case 'bottomLeft':
          width = (this._fish.x + this._fish.width) - x;
          height = y - this._fish.y;
          this._fish.resize({
            x,
            y: this._fish.y,
            width,
            height,
          });
          break;
      }
      this.draw();
      return;
    }

    if (this._isMouseDown) {
      this._fish.move(x, y);
    }

    this.draw();
  }

  handleCanvasMouseDown(event) {
    const { clientX, clientY } = event;
    const { x, y } = mouseEventService.getCanvasMousePosition({
      clientX,
      clientY,
      canvas: this._canvas
    });

    this._resizeProperty = mouseEventService.getResizeProp({ x, y, fish: this._fish });
    const isFish = mouseEventService.isFishClicked({ x, y, fish: this._fish });

    if (isFish || this._resizeProperty !== null) {
      this._isMouseDown = true;
      this._isSelected = true;
    } else {
      this._isSelected = false;
    }

    this.draw();
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