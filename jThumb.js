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
		optionsInstance = $.extend( {}, $.jThumb.defaults, optionsInstance );


		/*public*/ this.set = function( optionsMethod, useCache )
		{
			options = $.extend( {}, optionsInstance, optionsMethod );
			if (typeof(useCache) == 'undefined') useCache = true;
			
			var t, iElem;
			if (!useCache)
			{
				t = 0;
				elements.each(function()
				{
					thumbs[t] = {};
					thumbs[t].index = t;
					thumbs[t].cElem = this;
					thumbs[t].cWidth = $(thumbs[t].cElem).width();
					thumbs[t].cHeight = $(thumbs[t].cElem).height();
					iElem = $(thumbs[t].cElem).find( options.img )[0];
					
					if (iElem != null && typeof(iElem) == "object" && $(iElem).is("img"))
						thumbs[t].iElem = iElem;
					else if (typeof(options.onError) == "function")
						options.onError($.jThumb.error[0], thumbs[t]);

					t += 1;
				});
			}

			for (t in thumbs)
				if (thumbs[t].iElem != null)
					getRealSizeImage($(thumbs[t].iElem).attr("src"), afterLoadRealSizeImage, t);
		}
		this.set(null, false);
		
		
		/*public*/ this.getThumbByIndex = function( index )
		{
			return thumbs[index];
		}


		/*private*/ function afterLoadRealSizeImage( iW, iH, t )
		{
			thumbs[t].iWidth = iW;
			thumbs[t].iHeight = iH;


			//Getting the config
			var args = [];
			args = args.concat(getArguments( options.align ));
			args = args.concat(getArguments( $(thumbs[t].cElem).attr( options.attrName )));
			args = args.concat(getArguments( $(thumbs[t].iElem).attr( options.attrName )));
			var config = getConfig(args);


			//Resizing
			var wider = higher = false;
			if (thumbs[t].iWidth > thumbs[t].cWidth)
				wider = true;
			if (thumbs[t].iHeight > thumbs[t].cHeight)
				higher = true;

			var newSize;
			if ((config.allowResize && (wider && higher)) || (config.allowZoom && (!wider || !higher)))
				newSize = getSize(thumbs[t].cWidth, thumbs[t].cHeight, thumbs[t].iWidth, thumbs[t].iHeight);
			else
				newSize = [thumbs[t].iWidth, thumbs[t].iHeight];
			$(thumbs[t].iElem).width(newSize[0]);
			$(thumbs[t].iElem).height(newSize[1]);


			//Positioning
			var newPos = getPosition(config.alignX, config.alignY, thumbs[t].cWidth, thumbs[t].cHeight, newSize[0], newSize[1]);
			$(thumbs[t].iElem).css(options.moveX, newPos[0]);
			$(thumbs[t].iElem).css(options.moveY, newPos[1]);
		}


		/*private*/ function getRealSizeImage( src, callback, t )
		{
			var tempImg = new Image();
			tempImg.src = src;
			tempImg.onload = function()
			{
				if (typeof options.onLoadImage == "function")
					options.onLoadImage(tempImg, thumbs[t]);

				callback(this.width, this.height, t);
			};
		}


		/*private*/ function getArguments( str )
		{
			var args = [];
			var n = 0;
			if (str != null && str != undefined && typeof str == "string" && str.length>=3)
			{
				var cut = jQuery.trim(str).split(" ");
				var regresult;
				for (var i=0; i<cut.length; ++i)
				{
					regresult = $.jThumb.consts.regexp.exec(cut[i]);

					if (regresult != undefined && regresult != null && regresult[1] != undefined)
					{
						args[n] = [(regresult[1]).toLowerCase()];
						if (regresult[4] != undefined)
							args[n][1] = [regresult[4], ((regresult[5] == undefined) ? options.standardUnit : regresult[5])];
						
						n += 1;
					}
				}
			}
			return args;
		}


		/*private*/ function getConfig( args )
		{
			var cut = jQuery.trim($.jThumb.defaults.align).split(" ");
			var values = {
				alignX: cut[0],
				alignY: cut[1],
				paddingX: 0+options.standardUnit,
				paddingY: 0+options.standardUnit,
				allowResize: options.allowResize,
				allowZoom: options.allowZoom
			};
			
			var i, alignX, alignY;
			var resize, zoom;
			for (i=(args.length-1); i>=0 && (alignX==null || alignY==null); --i)
			{
				if (args[i][0] == "left" || args[i][0] == "right" || args[i][0] == "center")
				{
					if (alignX != null && (args[i][0]=="center" || alignX[0] == "center"))
					{
						alignY = alignX;
						alignX = args[i];
					}
					else if (alignX == null)
						alignX = args[i];
				}
				else if (alignY == null && (args[i][0]=="top" || args[i][0]=="bottom"))
					alignY = args[i];
					
				else if (resize == null && args[i][0] == "allowresize")
				{
					values.allowResize = true;
					resize = true;
				}
				else if (zoom == null && args[i][0] == "allowzoom")
				{
					values.allowZoom = true;
					zoom = true;
				}
				else if (resize == null && args[i][0] == "noresize")
				{
					values.allowResize = false;
					resize = true;
				}
				else if (zoom == null && args[i][0] == "nozoom")
				{
					values.allowZoom = false;
					zoom = true;
				}
			}

			if (alignX != undefined)
			{
				values.alignX = alignX[0];
				if (alignX[1] != undefined)
					values.paddingX = alignX[1][0] + (((alignX[1][1] != undefined)) ? alignX[1][1] : options.standardUnit);
			}
			if (alignY != undefined)
			{
				values.alignY = alignY[0];
				if (alignY[1] != undefined)
					values.paddingY = alignY[1][0] + (((alignY[1][1] != undefined)) ? alignY[1][1] : options.standardUnit);
			}

			return values;
		}

		/*private*/ function getSize( cW, cH, iW, iH )
		{
			var scaleW = Math.round((iW*cH)/iH);
			var scaleH = Math.round((iH*cW)/iW);
			return (scaleH<cH) ? [scaleW, cH] : [cW, scaleH];
		}
		
		/*private*/ function getPosition( x, y, cW, cH, iW, iH )
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
		allowResize: false,
		allowZoom: false,
		onError: null,
		onLoadImage: null,
		attrName: "jthumb",
		moveX: "margin-left",
		moveY: "margin-top",
		standardUnit: "px"
	};


	$.jThumb.consts = {
		regexp: /(center|left|top|right|bottom|allowresize|allowzoom|noresize|nozoom)(\((([-0-9]+)(%|px|pt|em|cm|in)?)?\))?/i
	};


	$.jThumb.error = [
		"Image not found inside the container"
	];


})(jQuery);

