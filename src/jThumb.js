/*                              
                                        ys`
                                        -Md
                                         hM+
                                         -MN`
                                          yMs
                                          .MM-
                                           sMd
                                           .NM/
                                            sMm`
         +dmmh                              `NMo
        sMMMMh                               oMN.
       `MMMMMs                               `NMy
       :MMMMM+                                +MM:
       sMMMMM:                                 mMm 
       dMMMMM.                                 /MM+
      `MMMMMM`                                  mMN`
      /MMMMMm                                   /MMs
      sMMMMMh                                    dMM-
      mMMMMMy                     /:             :MMh
     `MMMMMMy                    :MMs             mMM/
     /MMMMMMd                    /MMM:            yMMm`
     sMMMMMMM/                   :MMMd  ``...--::+NMMMo
     mMMMMMMMMh+::://++oossyyyhhdmMMMMNMMMMMMMMMMMMMMMm
     MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMh
     MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMNmdhyyso+/:-`
     hMMMMMMMMMMMMMMMMMMMMMNmdhyso+/:-.`
     `odNMMMNmdhyso+/:-.``


            https://bitbucket.org/EnZo/jthumb

*/

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
		var thumbs = [], options, loadeds, errors;
		optionsInstance = $.extend( {}, $.jThumb.defaults, optionsInstance );


		this.set = function( optionsMethod, useCache ) // public
		{
			loadeds = 0;
			options = $.extend( {}, optionsInstance, optionsMethod );
			if (typeof useCache == 'undefined') useCache = true;
			
			if (options.background && typeof options.onError == "function" && !("backgroundSize" in document.body.style))
			{
				options.resize = options.zoom = false, options.crop = true;
				options.onError($.jThumb.error[2]);
			}
			
			var index;
			if (!useCache)
			{
				errors = 0;
				index = 0;
				elements.each(function()
				{
					thumbs[index] = {};
					thumbs[index].index = index;
					thumbs[index].cElem = this;
					thumbs[index].cWidth = $(thumbs[index].cElem).width();
					thumbs[index].cHeight = $(thumbs[index].cElem).height();
					
					var iElem = (options.img==null || options.img=='') ? this : $(thumbs[index].cElem).find( options.img )[0];
					thumbs[index].iElem = iElem;

					if (iElem != null && typeof iElem == "object" && ($(iElem).is("img") || options.background))
						getRealSizeImage(iElem, index);
					else if (typeof options.onError == "function")
						options.onError($.jThumb.error[0], thumbs[index]);

					index += 1;
				});
			}
			else
			{
				for (index in thumbs)
					if (thumbs[index].iElem != null && thumbs[index].iWidth>0 && thumbs[index].iHeight>0)
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
			loadeds += 1;
			
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
			if (options.background)
				$(thumbs[index].iElem).css("backgroundSize", newSize[0] + "px " + newSize[1] + "px");
			else
			{
				$(thumbs[index].iElem).width(newSize[0]);
				$(thumbs[index].iElem).height(newSize[1]);
			}


			// Padding
			var padding = [];
			padding[0] = (config.paddingX[1] == '%') ? Math.round((config.paddingX[0]*thumbs[index].cWidth)/100) : config.paddingX[0];
			padding[1] = (config.paddingY[1] == '%') ? Math.round((config.paddingY[0]*thumbs[index].cHeight)/100) : config.paddingY[0];


			// Alignment
			var newPos = getPosition(config.alignX, config.alignY, thumbs[index].cWidth, thumbs[index].cHeight, newSize[0], newSize[1]);
			if (options.background)
				$(thumbs[index].iElem).css("backgroundPosition", newPos[0] + "px " + newPos[1] + "px");
			else
			{
				$(thumbs[index].iElem).css(options.moveX, (newPos[0]+padding[0]));
				$(thumbs[index].iElem).css(options.moveY, (newPos[1]+padding[1]));
			}


			// Events
			if (typeof options.onAfter == "function")
				options.onAfter(thumbs[index]);
			if (loadeds == (thumbs.length-errors) && typeof options.onFinish == "function")
				options.onFinish(thumbs[index]);
		}


		function getRealSizeImage( iElem, index ) // private
		{
			var src = (options.background) ? $(iElem).css("backgroundImage").replace($.jThumb.consts.clean, "$1") : $(iElem).attr("src"),
				img = $( document.createElement('img') );

			thumbs[index].tempImg = img;
			img.bind( "load", { img: this }, function()
			{
				thumbs[index].iWidth = this.width;
				thumbs[index].iHeight = this.height;
				if (typeof options.onLoadImage == "function")
					options.onLoadImage(tempImg, thumbs[index]);
				
				afterLoadRealSizeImage(index);
			});
			img.bind( "error", { img: this }, function()
			{
				errors += 1;
				if (typeof options.onError == "function")
					options.onError($.jThumb.error[1] + ': ' + src, thumbs[index]);
			});
			img.attr( "src", src );
		}


		function getArguments( str ) // private
		{
			var args = [],
				n = 0;
			if (str != null && str != undefined && typeof str == "string" && str.length>=3)
			{
				var i, regresult, crop = jQuery.trim(str).split(" ");
				for (i=0; i<crop.length; ++i)
				{
					regresult = $.jThumb.consts.args.exec(crop[i]);

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
			if ((!(!zoom && (iW<cW || iH<cH))) && (!crop || (resize && iW>cW && iH>cH) || (zoom && (iW<cW || iH<cH))))
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
		background: false,
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
		moveX: "marginLeft",
		moveY: "marginTop"
	};


	$.jThumb.consts = {
		args: /(center|left|top|right|bottom|resize|noresize|zoom|nozoom|crop|nocrop)(\((([-0-9]+)(%|px)?)?\))?/i,
		clean: /url\("?([^")]+).*/i
	};


	$.jThumb.error = [
		"Image not found inside the container",
		"The image could not be loaded",
		"This browser doesn't support CSS3 for background-size"
	];


})(jQuery);
