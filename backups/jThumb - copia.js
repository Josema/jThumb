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
			var args = [
				getArguments( options.align ),
				getArguments( $(cElem).attr( options.attrName )),
				getArguments( $(iElem).attr( options.attrName ))
			];

			var config = getConfig(args);
			console.log(args);
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
			return (args.length>0) ? args : false;
        }


		function getConfig(argslist)
        {
			var cut = jQuery.trim($.jThumb.defaults.align).split(" ");
			var values = {
				alignX: cut[0],
				alignY: cut[1],
				paddingX: 0+options.standardUnit,
				paddingY: 0+options.standardUnit,
				allowScale: options.allowScale,
				allowZoom: options.allowZoom
			};
			
			
			var j, i, args, alignX, alignY, centeri, center;
			for (j=0; j<argslist.length; ++j)
			{
				alignX = alignY = null;
				centeri = 0;
				center = [];
				args = argslist[j];

				for (i=0; i<args.length; ++i)
				{
					if (args[i][0] == "left" || args[i][0] == "right")
						alignX = args[i];
	
					else if (args[i][0] == "top" || args[i][0] == "bottom")
						alignY = args[i];
	
					else if (args[i][0] == "center")
						center[centeri++] = args[i];
	
					else if (args[i][0] == "allowscale")
						values.allowScale = true;
	
					else if (args[i][0] == "allowzoom")
						values.allowZoom = true;
				}
				
				if (alignX != undefined)
					values.alignX = alignX;
				if (alignY != undefined)
					values.alignY = alignY;
	
				if (alignX == undefined && center.length > 0)
					values.alignX = center[center.length-1];
				if (alignY == undefined)
				{
				 	if ((center.length==1 && alignX!=undefined) || (center.length>1))
				 	{
						values.alignY = center[center.length-1];
						if (values.alignX[0] == "center" && (center.length>1))
							values.alignY = center[center.length-2];
					}
				}
				
				if (typeof values.alignX != "string" && values.alignX[0] != undefined)
				{
					if (values.alignX[1] != undefined)
						values.paddingX = values.alignX[1][0] + (((values.alignX[1][1] != undefined)) ? values.alignX[1][1] : options.standardUnit);
	
					values.alignX = values.alignX[0];
				}
				if (typeof values.alignY != "string" && values.alignY[0] != undefined)
				{
					if (values.alignY[1] != undefined)
						values.paddingY = values.alignY[1][0] + (((values.alignY[1][1] != undefined)) ? values.alignY[1][1] : options.standardUnit);
	
					values.alignY = values.alignY[0];
				}
				console.log(values);
			}

			return values;
		}
    };


    $.jThumb.defaults = {
		img: "> img",
		align: "AAAA BBBB",
		allowScale: false,
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
		regexp: /(center|left|top|right|bottom|allowscale|allowzoom)(\((([-0-9]+)(%|px|pt|em|cm|in)?)?\))?/i
	};

})(jQuery);

