(function (window, document) {

  var proto = FishCanvas.prototype;

  function FishCanvas(el) {
    this._el = el;
    this._canvas = _createCanvas();
    this._uploader = _createUploader();
    this._fish = null;
    this._saveButton = _createSaveButton();
    this._mouseDown = false;

    _createFish(function (image) {
      this._fish = image;
      this.initialize();
    }.bind(this));
  }

  proto.initialize = function () {
    this._el.appendChild(this._canvas);
    this._el.appendChild(this._uploader);
    this._el.appendChild(this._saveButton);

    this.bindEvents();
  };

  proto.handleUploadChange = function (event) {
    var self = this;
    var file = event.target.files[ 0 ];
    var context = self._canvas.getContext('2d');

    if (!file) {
      return;
    }

    _readAsDataUrl(file, function (data) {
      _createImageElement(data, function (image) {
        context.drawImage(image, 0, 0);
        context.drawImage(self._fish, 0, 0, 300, 300, 0, 0, 300, 300);
      });
    });
  };

  proto.bindEvents = function () {
    this._uploader.addEventListener('change', this.handleUploadChange.bind(this));
    this._saveButton.addEventListener('click', this.handleSaveClick);

  };

  proto.handleSaveClick = function () {
    console.log(this._canvas.toDataURL());
  };

  // private functions
  function _createCanvas() {
    var canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    return canvas;
  }

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
