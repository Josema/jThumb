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
					
					if (iElem != null && typeof iElem == "object" && $(iElem).is("img"))
						getRealSizeImage(iElem, t);
					else if (typeof options.onError == "function")
						options.onError($.jThumb.error[0], thumbs[t]);

					t += 1;
				});
			}
			else
			{
				for (t in thumbs)
					if (thumbs[t].iElem != null && thumbs[t].iWidth>0 && thumbs[t].iHeight)
						afterLoadRealSizeImage(t);
			}
		}
		this.set(null, false);
		
		
		this.getThumbByIndex = function( index ) // public
		{
			return thumbs[index];
		}


		function afterLoadRealSizeImage( t ) // private
		{
			if (typeof options.onBefore == "function")
				options.onBefore(thumbs[t]);
			
			// Getting the config
			var args = [];
			args = args.concat(getArguments( options.align ));
			args = args.concat(getArguments( $(thumbs[t].cElem).attr( options.attrName )));
			args = args.concat(getArguments( $(thumbs[t].iElem).attr( options.attrName )));
			var config = getConfig(args);


			// Resizing
			var wider = higher = false;
			if (thumbs[t].iWidth > thumbs[t].cWidth)
				wider = true;
			if (thumbs[t].iHeight > thumbs[t].cHeight)
				higher = true;

			var newSize;
			if ((config.resize && (wider && higher)) || (config.zoom && (!wider || !higher)))
				newSize = getSize(thumbs[t].cWidth, thumbs[t].cHeight, thumbs[t].iWidth, thumbs[t].iHeight);
			else
				newSize = [thumbs[t].iWidth, thumbs[t].iHeight];

			$(thumbs[t].iElem).width(newSize[0]);
			$(thumbs[t].iElem).height(newSize[1]);


			// Padding
			var padding = [];
			padding[0] = (config.paddingX[1] == '%') ? Math.round((config.paddingX[0]*thumbs[t].cWidth)/100) : config.paddingX[0];
			padding[1] = (config.paddingY[1] == '%') ? Math.round((config.paddingY[0]*thumbs[t].cHeight)/100) : config.paddingY[0];


			// Positioning
			var newPos = getPosition(config.alignX, config.alignY, thumbs[t].cWidth, thumbs[t].cHeight, newSize[0], newSize[1]);
			$(thumbs[t].iElem).css(options.moveX, (newPos[0]+padding[0]));
			$(thumbs[t].iElem).css(options.moveY, (newPos[1]+padding[1]));
			
			if (typeof options.onAfter == "function")
				options.onAfter(thumbs[t]);
				
			if (loadeds == elements.length && typeof options.onFinish == "function")
				options.onFinish(thumbs[t]);
		}


		function getRealSizeImage( iElem, t ) // private
		{		
			var img = $( document.createElement('img') );
			img.bind( "load", { img: this }, function()
			{
				loadeds += 1; 
				thumbs[t].iElem = iElem;
				thumbs[t].iWidth = this.width;
				thumbs[t].iHeight = this.height;
				if (typeof options.onLoadImage == "function")
					options.onLoadImage(tempImg, thumbs[t]);
				
				afterLoadRealSizeImage(t);
			});
			img.attr( "src", $(iElem).attr("src") );
		}


		function getArguments( str ) // private
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
							args[n][1] = [regresult[4], ((regresult[5] == undefined) ? $.jThumb.consts.standardUnit : regresult[5])];
						
						n += 1;
					}
				}
			}
			return args;
		}


		function getConfig( args ) // private
		{
			var cut = jQuery.trim($.jThumb.defaults.align).split(" ");
			var values = {
				alignX: cut[0],
				alignY: cut[1],
				paddingX: [0, $.jThumb.consts.standardUnit],
				paddingY: [0, $.jThumb.consts.standardUnit],
				resize: options.resize,
				zoom: options.zoom
			};
			
			var i, alignX, alignY;
			var resize, zoom;
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
					values.paddingX = [parseInt(alignX[1][0]), ((alignX[1][1] != null && alignX[1][1].length>0)) ? alignX[1][1] : $.jThumb.consts.standardUnit];
			}
			if (alignY != null)
			{
				values.alignY = alignY[0];
				if (alignY[1] != null && alignY[1][0].length>0)
					values.paddingY = [parseInt(alignY[1][0]), ((alignY[1][1] != null && alignY[1][1].length>0)) ? alignY[1][1] : $.jThumb.consts.standardUnit];
			}

			return values;
		}

		function getSize( cW, cH, iW, iH ) // private
		{
			var scaleW = Math.round((iW*cH)/iH);
			var scaleH = Math.round((iH*cW)/iW);
			return (scaleH<cH) ? [scaleW, cH] : [cW, scaleH];
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
		resize: false,
		zoom: false,
		overflow: true,
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
		regexp: /(center|left|top|right|bottom|resize|noresize|zoom|nozoom|overflow|nooverflow)(\((([-0-9]+)(%|px)?)?\))?/i,
		standardUnit: "px"
	};


	$.jThumb.error = [
		"Image not found inside the container"
	];


})(jQuery);

