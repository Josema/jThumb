# [What is](#) #
jThumb is **jQuery plugin** to make easier thumbs on html. Resize your images preserving the proportions, and align them with total flexibility.

* * *
* * *
* * *


# [How to use](#) #

# 1. Add your image under a container

```html
<div class="thumbContainer"><img src="tiger.jpg" /></div>
```


# 2. Add the CSS for the container.

```html
div.thumbContainer
{
	width:150px;
	height:150px;
	overflow:hidden
}
```
You have to add the overflow hidden to hide the remaining space of the image.


# 3. Add the javascript.

```javascript
$(document).ready(function() {
	$("div.thumbContainer").jThumb();
});
```

* * *
* * *
* * *

# [Documentation](#) #

## Optional Parameters ##


> ### `align` (string)

```javascript
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

```javascript
$("div.thumbContainer").jThumb({ img: "div a img.tothumb" });
```
Default is: `"> img"`

---









> ### `crop` (boolean)

If you set crop as false the picture never will have remaining space.

![Crop](https://bitbucket.org/josema/jthumb/raw/3b3e69dac8b0cb77869e68a916819b2a52865786/documentation/crop.jpg)

```javascript
$("div.thumbContainer").jThumb({ crop: false });
```

Default is: `true`

---








> ### `resize` (boolean)

If you set resize as false and the picture is higher than the container, the picture never will be resized.

![Resize](https://bitbucket.org/josema/jthumb/raw/3b3e69dac8b0cb77869e68a916819b2a52865786/documentation/resize.jpg)

```javascript
$("div.thumbContainer").jThumb({ resize: false });
```

Default is: `true`

---






> ### `zoom` (boolean)

If you set zoom as true and the original image is smaller than the container, the size of the picture will be resized. Default is false because this could cause distorsion of the picture.

![Zoom](https://bitbucket.org/josema/jthumb/raw/3b3e69dac8b0cb77869e68a916819b2a52865786/documentation/zoom.jpg)

```javascript
$("div.thumbContainer").jThumb({ zoom: true });
```

Default is: `false`

---




> ### Event `onError` (function)

It's dispatched when some error is occurred.

```javascript
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

```javascript
$("div.thumbContainer").jThumb({ onLoadImage: 
	function(message, thumbObject){
		console.log(message, thumbObject.index);
	}
});
```

Default is: `null`

---





> ### Event `onBefore` (function)

This event is dispatched before to be changed the position or size.

```javascript
$("div.thumbContainer").jThumb({ onBefore: 
	function(message, thumbObject){
		console.log(message, thumbObject.index);
	}
});
```

Default is: `null`

---








> ### Event `onAfter` (function)

This event is dispatched after to be changed the position or size.

```javascript
$("div.thumbContainer").jThumb({ onAfter: 
	function(message, thumbObject){
		console.log(message, thumbObject.index);
	}
});
```

Default is: `null`

---








> ### Event `onFinish` (function)

This event is dispatched after be changed the new config of all pictures.

```javascript
$("div.thumbContainer").jThumb({ onFinish: 
	function(message, thumbObject){
		console.log(message, thumbObject.index);
	}
});
```

Default is: `null`

---
