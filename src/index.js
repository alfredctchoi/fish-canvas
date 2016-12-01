const _downloadFileName = 'fish-slap.png';
const _fishCoordinates = {
  x: 0,
  y: 0
};

let _isMouseDown = false;

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

    this._el.appendChild(this._canvas);
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
    const self = this;
    let file = event.target.files[ 0 ];

    if (!file) {
      return;
    }

    _readAsDataUrl(file, function (data) {
      _createImageElement(data, function (image) {
        self._face = image;
        self.draw();
      });
    });
  }

  handleCanvasMouseUp(event) {
    _isMouseDown = false;
  }

  handleCanvasMouseMove(event) {
    if (!_isMouseDown) return;
    _fishCoordinates.x = event.clientX;
    _fishCoordinates.y = event.clientY;
    this.draw();
  }

  handleCanvasMouseDown(event) {
    _isMouseDown = true;
    _fishCoordinates.x = event.clientX;
    _fishCoordinates.y = event.clientY;
    this.draw();
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
    this._canvas = document.createElement('canvas');
    this._canvas.width = parentDimensions.width;
    this._canvas.height = parentDimensions.height;
  }

  createUploader(){
    this._uploader = document.createElement('input');
    this._uploader.type = 'file';
  }

  createSaveButton(){
    this._saveButton = document.createElement('button');
    this._saveButton.type = 'button';
    this._saveButton.innerHTML = 'Save Image';
    return this._saveButton;
  }

  draw() {
    const context = this._canvas.getContext('2d');
    context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    context.drawImage(this._face, 0, 0);
    context.drawImage(this._fish, _fishCoordinates.x, _fishCoordinates.y, 100, 100);
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