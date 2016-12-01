(function (window, document) {

  var proto = FishCanvas.prototype;
  var _fishCoordinates = {
    x: 0,
    y: 0
  };

  var _isMouseDown = false;

  function FishCanvas(el) {
    this._el = el;
    this._canvas = null;
    this._uploader = _createUploader();
    this._fish = null;
    this._face = null;
    this._saveButton = _createSaveButton();

    _createFish(function (image) {
      this._fish = image;
      this.initialize();
    }.bind(this));
  }

  proto.initialize = function () {
    this.createCanvas();

    this._el.appendChild(this._canvas);
    this._el.appendChild(this._uploader);
    this._el.appendChild(this._saveButton);

    this.bindEvents();
  };

  proto.handleUploadChange = function (event) {
    var self = this;
    var file = event.target.files[ 0 ];

    if (!file) {
      return;
    }

    _readAsDataUrl(file, function (data) {
      _createImageElement(data, function (image) {
        self._face = image;
        self.draw();
      });
    });
  };

  proto.bindEvents = function () {
    this._uploader.addEventListener('change', this.handleUploadChange.bind(this));
    this._saveButton.addEventListener('click', this.handleSaveClick);
    this._canvas.addEventListener('mousedown', this.handleCanvasMouseDown.bind(this));
    this._canvas.addEventListener('mousemove', this.handleCanvasMouseMove.bind(this));
    this._canvas.addEventListener('mouseup', this.handleCanvasMouseUp.bind(this));
  };

  proto.handleCanvasMouseUp = function (event) {
    _isMouseDown = false;
  };

  proto.handleCanvasMouseMove = function (event) {
    if (!_isMouseDown) return;
    _fishCoordinates.x = event.clientX;
    _fishCoordinates.y = event.clientY;
    this.draw();
  };

  proto.handleCanvasMouseDown = function (event) {
    _isMouseDown = true;
    _fishCoordinates.x = event.clientX;
    _fishCoordinates.y = event.clientY;
    this.draw();
  };

  proto.handleSaveClick = function () {
    console.log(this._canvas.toDataURL());
  };

  proto.createCanvas = function () {
    var parentDimensions = this._el.getBoundingClientRect();
    this._canvas = document.createElement('canvas');
    this._canvas.width = parentDimensions.width;
    this._canvas.height = parentDimensions.height;
  };

  proto.draw = function () {
    var context = this._canvas.getContext('2d');
    context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    context.drawImage(this._face, 0, 0);
    context.drawImage(this._fish, _fishCoordinates.x, _fishCoordinates.y, 100, 100);
  };

  // private functions

  function _createUploader() {
    var input = document.createElement('input');
    input.type = 'file';
    return input;
  }

  function _createFish(callback) {
    _createImageElement('assets/fish.png', function (image) {
      callback(image);
    });
  }

  function _createImageElement(src, callback) {
    var image = new Image();
    image.addEventListener('load', function () {
      callback(image)
    });
    image.src = src;
  }

  function _readAsDataUrl(file, callback) {
    var reader = new FileReader();
    reader.addEventListener('load', function () {
      callback(reader.result)
    });

    reader.readAsDataURL(file);
  }

  function _createSaveButton() {
    var button = document.createElement('button');
    button.type = 'button';
    button.innerHTML = 'Save Image';
    return button;
  }

  window.FishCanvas = FishCanvas;

})(window, document);
