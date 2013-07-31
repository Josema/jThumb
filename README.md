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

![Crop](https://bitbucket.org/EnZo/jthumb/raw/6846ddf628be7d2d6be0c2437fe82a85ecd9c2a8/documentation/crop.jpg)

```javascript
$("div.thumbContainer").jThumb({ crop: false });
```

Default is: `true`
