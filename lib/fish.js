(function(window, document) {

    var proto = FishCanvas.prototype;
    
   	function FishCanvas (el) {
        this._el = el;
        this._canvas = _createCanvas();
        this._uploader = _createUploader();//this.createUploader();

        this.initialize();
    }

    proto.initialize = function(){
    	this._el.appendChild(this._canvas);
    	this._el.appendChild(this._uploader);

        this.initializeUploader();
    }

    proto.initializeUploader = function (){
    	this._uploader.addEventListener('change', function(event){
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
    }

    // private functions
    function _createCanvas(){
    	var canvas = document.createElement('canvas');
    	canvas.style.width = '100%';
    	canvas.style.height = '100%';
    	return canvas;
    }

    function _createUploader(){
        var input = document.createElement('input');
        input.type = 'file';
        return input;
    }

    window.FishCanvas = FishCanvas;

})(window, document);
