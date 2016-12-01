const _downloadFileName = 'fish-slap.png';
const _fishObject = {
  x: 20,
  y: 20,
  width: 100,
  height: 100,
};

let _isMouseDown = false;
let _canvasOffset = {
  left: 0,
  top: 0,
};

module.exports = class {
  constructor(el) {
    this._el = el;
    this._canvas = null;
    this._uploader = null;
    this._fish = null;
    this._face = null;
    this._saveButton = null;

    _createFish((image) => {
      this._fish = image;
      this.initialize();
    });
  }


  initialize() {
    this.createCanvas();
    this.createUploader();
    this.createSaveButton();

    this._el.appendChild(this._uploader);
    this._el.appendChild(this._saveButton);

    this.bindEvents();
  }

  bindEvents() {
    this._uploader.addEventListener('change', this.handleUploadChange.bind(this));
    this._saveButton.addEventListener('click', this.handleSaveClick.bind(this));
    this._canvas.addEventListener('mousedown', this.handleCanvasMouseDown.bind(this));
    this._canvas.addEventListener('mousemove', this.handleCanvasMouseMove.bind(this));
    this._canvas.addEventListener('mouseup', this.handleCanvasMouseUp.bind(this));
  }

  handleUploadChange(event) {
    let file = event.target.files[ 0 ];

    if (!file) {
      return;
    }

    _readAsDataUrl(file, (data) => {
      _createImageElement(data,  (image) => {
        this._face = image;
        this.draw();
      });
    });
  }

  handleCanvasMouseUp(event) {
    _isMouseDown = false;
  }

  handleCanvasMouseMove(event) {
    if (!_isMouseDown) return;
    _fishObject.x = event.clientX;
    _fishObject.y = event.clientY;
    this.draw();
  }

  handleCanvasMouseDown(event) {
    const { clientX, clientY } = event;
    if(this.isInFish(clientX, clientY)){
      _isMouseDown = true;
      _fishObject.x = event.clientX;
      _fishObject.y = event.clientY;
      this.draw();
    }
  }

  handleSaveClick() {
    const linkElement = document.createElement('a');
    linkElement.download = _downloadFileName;
    linkElement.href = this._canvas.toDataURL();
    linkElement.style.opacity = 0;
    document.body.appendChild(linkElement);
    linkElement.addEventListener('click', () => {
      linkElement.parentElement.removeChild(linkElement);
    });
    linkElement.click();
  }

  createCanvas() {
    const parentDimensions = this._el.getBoundingClientRect();
    const canvas = this._canvas = document.createElement('canvas');
    canvas.width = parentDimensions.width;
    canvas.height = parentDimensions.height;
    this._el.appendChild(canvas);
    _canvasOffset.left = canvas.offsetLeft;
    _canvasOffset.top = canvas.offsetTop;
  }

  createUploader() {
    this._uploader = document.createElement('input');
    this._uploader.type = 'file';
  }

  createSaveButton() {
    this._saveButton = document.createElement('button');
    this._saveButton.type = 'button';
    this._saveButton.innerHTML = 'Save Image';
    return this._saveButton;
  }

  draw() {
    const context = this._canvas.getContext('2d');
    context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    context.drawImage(this._face, 0, 0);
    context.drawImage(
      this._fish,
      _fishObject.x,
      _fishObject.y,
      100,
      100,
    );
  }

  isInFish(mouseX, mouseY){
    const actualX = mouseX - _canvasOffset.left;
    const actualY = mouseY - _canvasOffset.top;
    return actualX > _fishObject.x &&
      actualX < _fishObject.x + _fishObject.width &&
      actualY > _fishObject.y &&
      actualY < _fishObject.y + _fishObject.height;
  }
};

// private functions

function _createFish(callback) {
  _createImageElement('assets/fish.png', function (image) {
    callback(image);
  });
}

function _createImageElement(src, callback) {
  const image = new Image();
  image.addEventListener('load', function () {
    callback(image)
  });
  image.src = src;
}

function _readAsDataUrl(file, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', function () {
    callback(reader.result)
  });

  reader.readAsDataURL(file);
}