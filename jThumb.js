(function($) {

	$.fn.extend({
		jThumb: function( options )
		{
			return new $.jThumb(this, options);
		}
	});


	$.jThumb = function( elements, optionsInstance )
	{
		//var $this = this;
		var thumbs = [];
		var options;
		var loadeds = 0;
		optionsInstance = $.extend( {}, $.jThumb.defaults, optionsInstance );


		this.set = function( optionsMethod, useCache ) // public
		{
			options = $.extend( {}, optionsInstance, optionsMethod );
			if (typeof useCache == 'undefined') useCache = true;
			
			var index, iElem;
			if (!useCache)
			{
				index = 0;
				elements.each(function()
				{
					thumbs[index] = {};
					thumbs[index].index = index;
					thumbs[index].cElem = this;
					thumbs[index].cWidth = $(thumbs[index].cElem).width();
					thumbs[index].cHeight = $(thumbs[index].cElem).height();
					iElem = $(thumbs[index].cElem).find( options.img )[0];
					
					if (iElem != null && typeof iElem == "object" && $(iElem).is("img"))
						getRealSizeImage(iElem, index);
					else if (typeof options.onError == "function")
						options.onError($.jThumb.error[0], thumbs[index]);

					index += 1;
				});
			}
			else
			{
				for (index in thumbs)
					if (thumbs[index].iElem != null && thumbs[index].iWidth>0 && thumbs[index].iHeight)
						afterLoadRealSizeImage(index);
			}
		}
		this.set(null, false);
		
		
		this.getThumbByIndex = function( index ) // public
		{
			return thumbs[index];
		}


		function afterLoadRealSizeImage( index ) // private
		{
			if (typeof options.onBefore == "function")
				options.onBefore(thumbs[index]);
			
			// Getting the config
			var args = [];
			args = args.concat(getArguments( options.align ));
			args = args.concat(getArguments( $(thumbs[index].cElem).attr( options.attrName )));
			args = args.concat(getArguments( $(thumbs[index].iElem).attr( options.attrName )));
			var config = getConfig(args);


			// Resizing
			var newSize = getSize(thumbs[index].cWidth, thumbs[index].cHeight, thumbs[index].iWidth, thumbs[index].iHeight, config.crop, config.resize, config.zoom);
			$(thumbs[index].iElem).width(newSize[0]);
			$(thumbs[index].iElem).height(newSize[1]);


			// Padding
			var padding = [];
			padding[0] = (config.paddingX[1] == '%') ? Math.round((config.paddingX[0]*thumbs[index].cWidth)/100) : config.paddingX[0];
			padding[1] = (config.paddingY[1] == '%') ? Math.round((config.paddingY[0]*thumbs[index].cHeight)/100) : config.paddingY[0];


			// Alignment
			var newPos = getPosition(config.alignX, config.alignY, thumbs[index].cWidth, thumbs[index].cHeight, newSize[0], newSize[1]);
			$(thumbs[index].iElem).css(options.moveX, (newPos[0]+padding[0]));
			$(thumbs[index].iElem).css(options.moveY, (newPos[1]+padding[1]));


			// Events
			if (typeof options.onAfter == "function")
				options.onAfter(thumbs[index]);
			if (loadeds == elements.length && typeof options.onFinish == "function")
				options.onFinish(thumbs[index]);
		}


		function getRealSizeImage( iElem, index ) // private
		{		
			var img = $( document.createElement('img') );
			img.bind( "load", { img: this }, function()
			{
				loadeds += 1; 
				thumbs[index].iElem = iElem;
				thumbs[index].iWidth = this.width;
				thumbs[index].iHeight = this.height;
				if (typeof options.onLoadImage == "function")
					options.onLoadImage(tempImg, thumbs[index]);
				
				afterLoadRealSizeImage(index);
			});
			img.attr( "src", $(iElem).attr("src") );
		}


		function getArguments( str ) // private
		{
			var args = [];
			var n = 0;
			if (str != null && str != undefined && typeof str == "string" && str.length>=3)
			{
				var crop = jQuery.trim(str).split(" ");
				var regresult;
				for (var i=0; i<crop.length; ++i)
				{
					regresult = $.jThumb.consts.regexp.exec(crop[i]);

					if (regresult != undefined && regresult != null && regresult[1] != undefined)
					{
						args[n] = [(regresult[1]).toLowerCase()];
						if (regresult[4] != undefined)
							args[n][1] = [regresult[4]];	
						if (regresult[5] != undefined)
							args[n][1][1] = regresult[5];
						
						n += 1;
					}
				}
			}
			return args;
		}


		function getConfig( args ) // private
		{
			var i, alignX, alignY, crop, resize, zoom, cut = jQuery.trim($.jThumb.defaults.align).split(" ");
			var values = {
				alignX: cut[0],
				alignY: cut[1],
				paddingX: [0],
				paddingY: [0],
				crop: options.crop,
				resize: options.resize,
				zoom: options.zoom
			};

			for (i=(args.length-1); i>=0; --i)
			{
				if ((alignX==null || alignY==null) && (args[i][0] == "left" || args[i][0] == "right" || args[i][0] == "center"))
				{
					if (alignX != null && args[i][0] != "center" && alignX[0] == "center")
					{
						alignY = alignX;
						alignX = args[i];
					}
					else if (alignX == null)
						alignX = args[i];
				}
				else if (alignY == null && (args[i][0]=="top" || args[i][0]=="bottom"))
					alignY = args[i];

				else if (crop == null && args[i][0] == "crop")
				{
					values.crop = true;
					crop = true;
				}
				else if (resize == null && args[i][0] == "resize")
				{
					values.resize = true;
					resize = true;
				}
				else if (zoom == null && args[i][0] == "zoom")
				{
					values.zoom = true;
					zoom = true;
				}
				else if (crop == null && args[i][0] == "nocrop")
				{
					values.crop = false;
					crop = true;
				}
				else if (resize == null && args[i][0] == "noresize")
				{
					values.resize = false;
					resize = true;
				}
				else if (zoom == null && args[i][0] == "nozoom")
				{
					values.zoom = false;
					zoom = true;
				}
			}

			if (alignX != null)
			{
				values.alignX = alignX[0];
				if (alignX[1] != null && alignX[1][0].length>0)
				{
					values.paddingX[0] = parseInt(alignX[1][0]);
					if (alignX[1][1] != null)
						values.paddingX[1] = alignX[1][1];
				}
			}
			if (alignY != null)
			{
				values.alignY = alignY[0];
				if (alignY[1] != null && alignY[1][0].length>0)
				{
					values.paddingY[0] = parseInt(alignY[1][0]);
					if (alignY[1][1] != null)
						values.paddingY[1] = alignY[1][1];
				}
			}

			return values;
		}

		function getSize( cW, cH, iW, iH, crop, resize, zoom ) // private
		{
			var size = [iW, iH];
			if (!crop || (resize && iW>cW && iH>cH) || (zoom && (iW<cW || iH<cH)))
			{
				var scaleH = Math.round((iH*cW)/iW);
				size = ((!crop && scaleH>cH) || (crop && scaleH<cH && (resize || zoom))) ? [Math.round((iW*cH)/iH), cH] : [cW, scaleH];
			}
			return size;
		}
		
		function getPosition( x, y, cW, cH, iW, iH ) // private
		{
			var newX = newY = 0;
			if (x == "right")
				newX = (cW-iW);
			else if (x == "center")
				newX = Math.round((cW-iW)/2);
				
			if (y == "bottom")
				newY = (cH-iH);
			else if (y == "center")
				newY = Math.round((cH-iH)/2);

			return [newX, newY];
		}
	};



	$.jThumb.defaults = {
		img: "> img",
		align: "center center",
		crop: true,
		resize: true,
		zoom: false,
		onError: null,
		onLoadImage: null,
		onBefore: null,
		onAfter: null,
		onFinish: null,
		attrName: "jthumb",
		moveX: "margin-left",
		moveY: "margin-top"
	};


	$.jThumb.consts = {
		regexp: /(center|left|top|right|bottom|resize|noresize|zoom|nozoom|crop|nocrop)(\((([-0-9]+)(%|px)?)?\))?/i
	};


	$.jThumb.error = [
		"Image not found inside the container"
	];


})(jQuery);
