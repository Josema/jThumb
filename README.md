

# [What is](#) #
jThumb is **jQuery plugin** to make easier thumbs on html. Resize your images preserving the proportions, and align them with total flexibility.

[Live examples](http://josenzo.github.io/jThumb/)

# [How to use](#) #

# 1. Add your image under a container

```html
<div class="thumbContainer"><img src="tiger.jpg" /></div>
```


# 2. Add the CSS for the container.

```css
div.thumbContainer
{
	width:150px;
	height:150px;
	overflow:hidden
}
```
You have to add the overflow hidden to hide the remaining space of the image.


# 3. Add the javascript.

```js
$(document).ready(function() {
	$("div.thumbContainer").jThumb();
});
```



# [Documentation](#) #

## Optional Parameters ##


> ### `align` (string)

```js
$("div.thumbContainer").jThumb({ align: "right bottom" });
```
Default is: `"center center"`

---







> ### `img` (string)

This attributte is used when you have a complex layout on your html, for example:

```html
<div class="thumbContainer">
	<div>
		<span><img src="ico.gif" /></span>
		<a><img class="tothumb" src="image.jpg" /></a>
	</div>
</div>
```
Then you should use something like this:

```js
$("div.thumbContainer").jThumb({ img: "div a img.tothumb" });
```
Default is: `"> img"`

---









> ### `crop` (boolean)

If you set crop as false the picture never will have remaining space.

![Crop](https://raw.githubusercontent.com/Josenzo/jThumb/master/documentation/crop.jpg)

```js
$("div.thumbContainer").jThumb({ crop: false });
```

Default is: `true`

---








> ### `resize` (boolean)

If you set resize as false and the picture is higher than the container, the picture never will be resized.

![Resize](https://raw.githubusercontent.com/Josenzo/jThumb/master/documentation/resize.jpg)

```js
$("div.thumbContainer").jThumb({ resize: false });
```

Default is: `true`

---






> ### `zoom` (boolean)

If you set zoom as true and the original image is smaller than the container, the size of the picture will be resized. Default is false because this could cause distorsion of the picture.

![Zoom](https://raw.githubusercontent.com/Josenzo/jThumb/master/documentation/zoom.jpg)

```js
$("div.thumbContainer").jThumb({ zoom: true });
```

Default is: `false`

---




> ### `background` (boolean)

If you set this attribute as true, the image that has to be thumbed will be the background (CSS background-image) of the container defined by the img attribute instead of a <img> element.

```js
$("div.thumbContainer").jThumb({
	background: true,
	img: null
});
```

```html
<div class="thumbContainer" style="background-image:url('higher.jpg')"></div>
```

Inner container:

```js
$("div.thumbContainer").jThumb({
	background: true,
	img: "> div"
});
```

```html
<div class="thumbContainer"><div style="background-image:url('higher.jpg')"></div></div>
```

Default is: `false`

---





> ### `autoUpdate` (boolean)

If your container has a percent size this will change when the size of the browser window change. Then if you want to auto adjust the thumb you should set this parameter as true.

```js
$("div.thumbContainer").jThumb({
	autoUpdate:true
});
```

Default is: `false`

---








> ### `attrName` (string)

You can set the parameters on each element using the thumb attribute as html.


```js
$("div.thumbContainer").jThumb();
```

```html
<div class="thumbContainer"><img jthumb="right bottom zoom nocrop" src="yourimage.jpg"></div>
```


Your own name for the html attribute:

```js
$("div.thumbContainer").jThumb({
  attrName: "myOwnAttr"
});
```

```html
<div class="thumbContainer"><img myOwnAttr="right(25) bottom(-12) nozoom " src="yourimage.jpg"></div>
```

Default is: `"jthumb"`

See more examples here: [http://josenzo.github.io/jThumb/](http://josenzo.github.io/jThumb/) 

---







> ### `moveX` and `moveY` (string)

If your image is defined as a position: absolute or relative, maybe you need use left and top instead of margin-left and margin-top.


```html
div.thumbContainer > img.posrelative
{
	position:relative
}
```

Your own name for the html attribute:

```js
$("div.thumbContainer").jThumb({
  img: "> img.posrelative",
  moveX: "left",
  moveY: "top"
});
```

Default are: `moveX: "margin-left"` and `moveY: "margin-top"`

---





## Events Parameters ##

> ### Event `onError` (function)

It's dispatched when some error is occurred.

```js
$("div.thumbContainer").jThumb({ onError: 
	function(message, thumbObject){
		console.log(message, thumbObject.index);
	}
});
```

Default is: `null`

---



> ### Event `onLoadImage` (function)

To get the original size of the picture is necessary create a temporal image object and load the picture inside. So this event is dispatched when picture is loaded.

```js
$("div.thumbContainer").jThumb({ onLoadImage: 
	function(tempImage, thumbObject){
		console.log(tempImage, thumbObject.index);
	}
});
```

Default is: `null`

---





> ### Event `onBefore` (function)

This event is dispatched before to be changed the position or size.

```js
$("div.thumbContainer").jThumb({ onBefore: 
	function(thumbObject){
		console.log(thumbObject);
	}
});
```

Default is: `null`

---








> ### Event `onAfter` (function)

This event is dispatched after to be changed the position or size.

```js
$("div.thumbContainer").jThumb({ onAfter: 
	function(thumbObject){
		console.log(thumbObject);
	}
});
```

Default is: `null`

---








> ### Event `onFinish` (function)

This event is dispatched after be changed the new config of all pictures.

```js
$("div.thumbContainer").jThumb({ onFinish: 
	function(thumbObject){
		console.log(thumbObject);
	}
});
```

Default is: `null`

---




## Methods ##

> ### `set(optionsMethod:object [, useCache:boolean]) : void`

You can set the config after create the instance with the method set.

```js
var mythumbs = $("div.thumbContainer").jThumb({ align: "right top" });
```

```js
mythumbs.set({ align: "center center" });
```

If useCache is false the system will get the real size of the images again. If not will use the size when you created the instance.
This is useful when you change to another image with javascript.

Default optionsMethod: `null`
Default useCache: `true`

---









> ### `update() : void`

After created the instance. If your container it has been changed you can update to adapt the images to the new dimensions.

```js
mythumbs.update();
```

---




> ### `getThumbByIndex( index:int ) : object`

This method get the thumb properties with all the info saved inside the instance.

```js
mythumbs.getThumbByIndex( 2 );
```

---
