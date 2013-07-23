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
			else args = getArguments( options.position );

			
			console.log(getValues(args));
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
					console.log(i, cut[i]);
					regresult = $.jThumb.const.regexp.exec(cut[i]);
					console.log(regresult);
					if (regresult != undefined && regresult != null && regresult[1] != undefined)
					{
						args[n] = [(regresult[1]).toLowerCase()];
						if (regresult[4] != undefined)
							args[n][1] = regresult[4] + ((regresult[5] == undefined) ? options.standardUnit : regresult[5]);
						
						n += 1;
					}
					console.log(cut.length, args.length);
				}
				console.log("----------------");
			}
			return (args.length>0) ? args : false;
        }
		
		function getValues(args)
        {
			var cut = jQuery.trim($.jThumb.defaults.position).split(" ");
			var values = {
				positionX: cut[0],
				positionY: cut[1],
				allowScale: options.allowScale,
				allowZoom: options.allowZoom
			};
			
			var xsetted, ysetted = false;
			for (var i=0; i<args.length; ++i)
			{
				if (args[i][0] == "left" || args[i][0] == "right")
				{
					values.positionX = args[i][0];
					xsetted = true;
				}
				else if (args[i][0] == "top" || args[i][0] == "bottom")
				{
					values.positionY = args[i][0];
					ysetted = true;
				}
				else if (args[i][0] == "center")
				{
					if (!xsetted)
					{
						xsetted = true;
						values.positionX = args[i][0];
					}
					else (!ysetted)
						values.positionY = args[i][0];
				}
				else if (args[i][0] == "allowscale")
					values.allowScale = true;
				else if (args[i][0] == "allowzoom")
					values.allowZoom = true;
			}
			
			return values;
		}
    };


    $.jThumb.defaults = {
		img: "> img",
		position: "AAAA BBBB",
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
		regexp: /(center|left|top|right|bottom|allowscale|allowzoom)(\((([-0-9]+)(%|px|pt|em|cm|in)?)?\))?/gi
	};

})(jQuery);




$(document).ready(function() {
    $(".thumb").jThumb({position: "left(25px) center(-12%)", onError: function(a,b,c){alert(a)}});
});


