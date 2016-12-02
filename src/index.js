import fishImage from './assets/fish'

const anchorWidth = 10;
const halfAnchorWidth = anchorWidth / 2;
const _downloadFileName = 'fish-slap.png';

module.exports = class {
  constructor(el) {
    // bindings
    this.init = this.init.bind(this);
    this.draw = this.draw.bind(this);
    this.addResizeAnchor = this.addResizeAnchor.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this.onSaveClick = this.onSaveClick.bind(this);

    // dom stuff
    this._el = el;
    this._canvas = document.createElement('canvas');
    this._ctx = this._canvas.getContext('2d');
    this._background = null;
    this._offsetLeft = null; // set after mount
    this._offsetTop = null; // set after mount
    this._fileInput = document.createElement('input');
    this._saveButton = document.createElement('button');
    this._saveButton.innerText = 'Save';

    this._fileInput.type = 'file';

    // init canvas
    const elRect = el.getBoundingClientRect();
    this._canvas.width = elRect.width;
    this._canvas.height = elRect.height;
    this._canvas.style.border = '1px solid black';

    // flags
    this._isMouseDown = false;
    this._isSelected = false;
    this._resizeProp = null;
    this._isMoving = false;
    this._isImageSelected = false;
    this._selectedAnchor = null;
    this._isRotating = false;
    this._showAnchors = false;

    // variables
    this._image = null;
    this._width = 100;
    this._height = 100;
    this._clientX = 0;
    this._clientY = 0;
    this._right = 0;
    this._bottom = 0;
    this._x = -this._width / 2;
    this._y = -this._height / 2;
    this._r = 0 * Math.PI / 180;
    this._translation = [ this._width / 2, this._height / 2 ];
    this._oldWidth = this._width;
    this._oldHeight = this._height;

    this.init();
  }

  init() {
    this._el.appendChild(this._canvas);
    this._el.appendChild(this._fileInput);
    this._el.appendChild(this._saveButton);
    this._offsetLeft = this._canvas.offsetLeft;
    this._offsetTop = this._canvas.offsetTop;

    this._saveButton.addEventListener('click', this.onSaveClick);
    this._fileInput.addEventListener('change', this.onFileChange);
    this._canvas.addEventListener('mousedown', this.onMouseDown);
    this._canvas.addEventListener('mouseup', this.onMouseUp);
    this._canvas.addEventListener('mousemove', this.onMouseMove);
    this._image = new Image();
    this._image.addEventListener('load', () => {
      setInterval(this.draw, 20);
    });
    this._image.src = fishImage;
  }

  draw() {
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

    // draw bg
    if ( this._background !== null ) {
      this._ctx.drawImage(this._background, 0, 0, this._canvas.width, this._canvas.height);
    }

    this._ctx.save();
    this._ctx.translate(this._translation[ 0 ], this._translation[ 1 ]);
    this._ctx.rotate(this._r);
    this._ctx.fillRect(-3, -3, 6, 6);

    // draw rectangle and check if the mouse is within area
    this._ctx.drawImage(this._image, this._x, this._y, this._width, this._height);
    this._ctx.beginPath();
    this._ctx.rect(this._x, this._y, this._width, this._height);
    this._ctx.closePath();
    // this._ctx.strokeStyle = 'red';
    // this._ctx.stroke();
    this._isSelected = this._ctx.isPointInPath(this._clientX, this._clientY);

    // // add resize anchors
    if (this._showAnchors) {
      this._resizeProp = null;
      this.addResizeAnchor(this._x, this._y);
      if ( this._ctx.isPointInPath(this._clientX, this._clientY) )
        this._resizeProp = 'topLeft';
      this.addResizeAnchor(this._x + this._width, this._y);
      if ( this._ctx.isPointInPath(this._clientX, this._clientY) )
        this._resizeProp = 'topRight';
      this.addResizeAnchor(this._x, this._y + this._height);
      if ( this._ctx.isPointInPath(this._clientX, this._clientY) )
        this._resizeProp = 'bottomLeft';
      this.addResizeAnchor(this._x + this._width, this._y + this._height);
      if ( this._ctx.isPointInPath(this._clientX, this._clientY) )
        this._resizeProp = 'bottomRight';
      this.addResizeAnchor(this._x + this._width / 2, this._y + this._height);
      if ( this._ctx.isPointInPath(this._clientX, this._clientY) )
        this._resizeProp = 'rotate';
    }

    this._ctx.restore();
  }

  addResizeAnchor(aX, aY) {
    this._ctx.beginPath();
    this._ctx.rect(aX - halfAnchorWidth, aY - halfAnchorWidth, anchorWidth, anchorWidth);
    this._ctx.closePath();
    this._ctx.fillStyle = 'black';
    this._ctx.fill();
  }

  onMouseDown() {
    this._isMouseDown = true;
    this._isImageSelected = this._isSelected && this._resizeProp === null;
    this._selectedAnchor = this._resizeProp && !this._isImageSelected ? this._resizeProp : null;
    this._isRotating = this._resizeProp && this._resizeProp === 'rotate';
    this._showAnchors = (this._isImageSelected || this._selectedAnchor !== null);
  }

  onMouseUp() {
    this._isMouseDown = false;
    this._isMoving = false;
    this._isSelected = false;
    this._resizeProp = null;
    this._isImageSelected = false;
    this._selectedAnchor = null;
  }

  onMouseMove() {
    this._clientX = event.clientX - this._offsetLeft;
    this._clientY = event.clientY - this._offsetTop;
    const translateClientX = this._clientX - this._translation[ 0 ];
    const translateClientY = this._clientY - this._translation[ 1 ];
    const translatedX = translateClientX * Math.cos(-this._r) - translateClientY * Math.sin(-this._r);
    const translatedY = translateClientX * Math.sin(-this._r) + translateClientY * Math.cos(-this._r);

    const maxRight = this._right - 50;
    const maxBottom = this._bottom - 50;
    const maxLeft = this._x + 50;
    const maxTop = this._y + 50;
    let dW;
    let dH;

    if ( !this._isMouseDown ) return;

    if (this._isRotating){
      const cx = this._translation[0];
      const cy = this._translation[1];
      const dx = this._clientX - cx;
      const dy = this._clientY - cy;
      this._r = Math.atan2(dy, dx) - 1.5708;
      return;
    }

    if ( this._selectedAnchor !== null ) {
      switch ( this._selectedAnchor ) {
        case 'topLeft':
          this._x = translatedX > maxRight ? maxRight : translatedX;
          this._y = translatedY > maxBottom ? maxBottom : translatedY;
          this._width = this._right - this._x;
          this._height = this._bottom - this._y;

          dW = (this._width - this._oldWidth) / 2;
          dH = (this._height - this._oldHeight) / 2;

          this._translation[ 0 ] = this._translation[ 0 ] + (-1 * dW);
          this._translation[ 1 ] = this._translation[ 1 ] + (-1 * dH);

          // remove the difference from x and y values
          this._x += dW;
          this._y += dH;
          break;
        case 'topRight':
          this._y = translatedY > maxBottom ? maxBottom : translatedY;
          this._width = translatedX - this._x < maxLeft ? maxLeft : translatedX - this._x;
          this._height = this._bottom - this._y;

          dW = (this._width - this._oldWidth) / 2;
          dH = (this._height - this._oldHeight) / 2;

          // adds the difference to recenter box
          this._translation[ 0 ] = this._translation[ 0 ] + dW;
          this._translation[ 1 ] = this._translation[ 1 ] + (-1 * dH);

          // remove the difference from x and y values
          this._x -= dW;
          this._y += dH;
          break;
        case 'bottomLeft':
          this._x = translatedX > maxRight ? maxRight : translatedX;
          this._width = this._right - this._x;
          this._height = translatedY - this._y < maxTop ? maxTop : translatedY - this._y;

          dW = (this._width - this._oldWidth) / 2;
          dH = (this._height - this._oldHeight) / 2;

          this._translation[ 0 ] = this._translation[ 0 ] + (-1 * dW);
          this._translation[ 1 ] = this._translation[ 1 ] + dH;

          // remove the difference from x and y values
          this._x += dW;
          this._y -= dH;
          break;
        case 'bottomRight':
          this._width = translatedX - this._x < maxLeft ? maxLeft : translatedX - this._x;
          this._height = translatedY - this._y < maxTop ? maxTop : translatedY - this._y;

          dW = (this._width - this._oldWidth) / 2;
          dH = (this._height - this._oldHeight) / 2;

          this._translation[ 0 ] = this._translation[ 0 ] + dW;
          this._translation[ 1 ] = this._translation[ 1 ] + dH;

          // remove the difference from x and y values
          this._x -= dW;
          this._y -= dH;
          break;
      }

      this._right = this._x + this._width;
      this._bottom = this._y + this._height;
      this._oldWidth = this._width;
      this._oldHeight = this._height;
      return;
    }

    if ( this._isImageSelected ) {
      this._isMoving = true;
      this._translation = [ this._clientX, this._clientY ];
      this._x = translateClientX * Math.cos(-this._r) - translateClientY * Math.sin(-this._r) - (this._width / 2);
      this._y = translateClientX * Math.sin(-this._r) + translateClientY * Math.cos(-this._r) - (this._height / 2);
      this._right = this._x + this._width;
      this._bottom = this._y + this._height;
    }
  }

  onFileChange(event) {
    const { files } = event.target;
    if ( !files || files.length === 0 ) return;

    const fileReader = new FileReader();

    fileReader.addEventListener('load', () => {
      const bg = new Image();
      bg.addEventListener('load', () => {
        this._background = bg;
      });
      bg.src = fileReader.result;
    });

    fileReader.readAsDataURL(files[0]);
  }

  onSaveClick(){
    this._showAnchors = false;
    setTimeout(() => {
      const linkElement = document.createElement('a');
      linkElement.download = _downloadFileName;
      linkElement.href = this._canvas.toDataURL();
      linkElement.style.opacity = 0;
      document.body.appendChild(linkElement);
      linkElement.addEventListener('click', () => {
        linkElement.parentElement.removeChild(linkElement);
      });
      linkElement.click();
    }, 20);
  }
};