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
			var args;
			if (args = getArguments( $(iElem).attr( options.attrName ) )) {}
			else if (args = getArguments( $(cElem).attr( options.attrName ) )) {}
			else args = getArguments( options.align );

			var config = getConfig(args);
			console.log(args);
			console.log(config);
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
							args[n][1] = regresult[4] + ((regresult[5] == undefined) ? options.standardUnit : regresult[5]);
						
						n += 1;
					}
				}
			}
			return (args.length>0) ? args : false;
        }


		function getConfig(args)
        {
			var cut = jQuery.trim($.jThumb.defaults.align).split(" ");
			var values = {
				alignX: cut[0],
				alignY: cut[1],
				allowScale: options.allowScale,
				allowZoom: options.allowZoom
			};
			
			var alignX, alignY;
			var centeri = 0;
			var center = [];
			for (var i=0; i<args.length; ++i)
			{
				if (args[i][0] == "left" || args[i][0] == "right")
				{
					alignX = [args[i][0], i];
				}
				else if (args[i][0] == "top" || args[i][0] == "bottom")
				{
					alignY = [args[i][0], i];
				}
				else if (args[i][0] == "center")
				{
					center[centeri++] = i;
				}
			}
			
			if (alignX != undefined)
				values.alignX = alignX[0];
			if (alignY != undefined)
				values.alignY = alignY[0];
				
			if ((alignX == undefined && center.length > 0) || (alignX != undefined && checkCenterPriority(alignX[1], center, 0)))
				values.alignX = "center";
			if ((alignY == undefined && ((center.length==1 && alignX!=undefined) || center.length>1)) || (alignX != undefined && center.length>1 && checkCenterPriority(alignY[1], center, 1)))
				values.alignY = "center";
			
			return values;
		}
		
		function checkCenterPriority(pri, centers, start)
		{
        	var is = 0;
        	for (var i=((centers.length-1)-start); i>=0 && is==0; --i)
        		if (centers[i] > pri)
        			is = centers[i];

        	return is;
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

