(function(window, document) {

	var background = 'http://www.w3schools.com/css/img_fjords.jpg';
    
   	function FishCanvas (el) {
        this._el = el;
        this._canvas = _createCanvas();
        this._uploader = this.createUploader();
        this._uploadedFile = null;

        this.initialize();
    }

    FishCanvas.prototype.initialize = function(){
    	this._el.appendChild(this._canvas);
    	this._el.appendChild(this._uploader);
    }

    FishCanvas.prototype.createUploader = function (){
    	var input = document.createElement('input');
    	input.type = 'file';
    	input.addEventListener('change', function(event){
    		var file = event.target.files[0];
    		var imageObj = new Image();
    		var reader  = new FileReader();
    		var context = this._canvas.getContext('2d');

    		imageObj.addEventListener('load', function(){
    			context.drawImage(imageObj, 0, 0)
    		});

    		reader.addEventListener('load', function(){
    			imageObj.src = reader.result;
    		});

    		if (file){
    			reader.readAsDataURL(file);
    		}

    	}.bind(this));
    	return input;
    }

    // private functions
    function _createCanvas(){
    	var canvas = document.createElement('canvas');
    	canvas.style.background = 'url(' + background + ')';
    	canvas.style.backgroundSize = 'cover';
    	canvas.style.width = '100%';
    	canvas.style.height = '100%';
    	return canvas;
    }

    window.FishCanvas = FishCanvas;

})(window, document);
