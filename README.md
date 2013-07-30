# jThumb #
* * *

## What is ##
jThumb is **jQuery plugin** to make easier thumbs on html. Resize your images preserving the proportions, and align them with total flexibility.

* * *

## How to use ##
> 1) Add your image with his container

```html
<div class="mythumb"><img src="tiger.jpg" /></div>
```


> 2) Add the CSS for the container.

```html
div.mythumb
{
	width:150px;
	height:150px;
	overflow:hidden
}
```
You have to add the overflow hidden to hide the remaining space of the image.


> 3) Add the javascript.

```javascript
$("div.mythumb").jThumb();
```


