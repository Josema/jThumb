(function($) {

    $.fn.extend({
        jThumb: function( options )
		{
           options = $.extend( {}, $.jThumb.defaults, options );

            this.each(function() {
                $.jThumb(this, options );
            });
            return;
        }
    });


    $.jThumb = function( cElem, options )
	{
		var cWidth = $(cElem).width();
		var cHeight = $(cElem).height();
		var iWidth, iHeight;
		var iElem = $(cElem).find( options.img )[0];

		if (iElem != null && typeof iElem == "object" && $(iElem).is("img"))
			getRealSizeImage($(iElem).attr("src"));
		else if (options.onError)
			options.onError($.jThumb.error[0], cElem, iElem);


        function getRealSizeImage(src)
        {
			var img = new Image();
			img.src = src;
			img.onload = function() {
				iWidth = this.width;
				iHeight = this.height;
				if (options.onLoadImage)
					options.onLoadImage(img, cElem, iElem);
				keepGoing();
			}
        }


		function keepGoing()
        {		
			var args = [];
			args = args.concat(getArguments( options.align ));
			args = args.concat(getArguments( $(cElem).attr( options.attrName )));
			args = args.concat(getArguments( $(iElem).attr( options.attrName )))
			
			var config = getConfig(args);
			console.log(args)
			console.log(config)
			
			var wider = higher = false;
			if (iWidth > cWidth)
				wider = true;
			if (iHeight > cHeight)
				higher = true;
			
			console.log($(iElem).attr("src"))
			
			if (config.allowResize && (wider || higher))
				console.log(iWidth, iHeight, "resize")
			else if (config.allowZoom && (!wider || !higher) && !(wider && higher))
				console.log(iWidth, iHeight, "zoom")
			else
				console.log(iWidth, iHeight, "nothing")
        }
		
		
		function getArguments(str)
        {
			var args = [];
			var n = 0;
			if (str != null && str != undefined && typeof str == "string" && str.length>=3)
			{
				var cut = jQuery.trim(str).split(" ");
				var regresult;
				for (var i=0; i<cut.length; ++i)
				{
					regresult = $.jThumb.const.regexp.exec(cut[i]);

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


		function getConfig(args)
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
	

	$.jThumb.error = [
		"Image not found inside the container"
	];
	
	
	$.jThumb.const = {
		regexp: /(center|left|top|right|bottom|allowresize|allowzoom|noresize|nozoom)(\((([-0-9]+)(%|px|pt|em|cm|in)?)?\))?/i
	};

})(jQuery);

