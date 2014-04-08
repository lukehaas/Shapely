## Shapely.js is a JavaScript library for the HTML5 Canvas element. ##

It drastically reduces the code necessary for drawing shapes on the canvas.

To invoke shapely, start by parsing it the id or classname of the canvas element(s) you want to work with

shapely('#example')

From there you can start adding shapes

shapely('#example').circle({ x:20, y:20, radius:200, style:{fill:"#000000"} }).star({ x:100, y:200, radius:100, style:{strokeColor:"#000000"} }).rect({ x:400, y:500, width:100, height:200, style:{fill:"#FF0000"} });

This example draws a circle, star, and rectangle on the canvas. Each shape instance receives basic size, position rotation, and opacity parameters, as well as a style object which includes parameters for fill and stroke colour and patterns, shadows, and gradients

Shapely can also animate shapes by adding .animate() to the end of a shape declaration, for example:

shapely('#example').circle({ x:20, y:20, radius:200, style:{fill:"#000000"} }).animate({ x:50, radius:100 })

This can be used to animate multiple shapes:

shapely('#example').circle({ x:20, y:20, radius:200, style:{fill:"#000000"} }).animate({ x:50, radius:100 }).rectangle({ x:20, y:20, width:200, height:200, style:{fill:"#000000"} }).animate({ x:50, y:90, width:600 });


## Usage ##


star()
	- x
	- y
	- radius
	- rotation - degrees
	
triangle()
	- x
	- y
	- radius
	- rotation - degrees
	
line()
	- x
	- y
	- width or height - (depending on if vertical or horizontal)
	- dashWidth
	- dashGap
	- rotation - degrees
	
rect()
	- x
	- y
	- width
	- height
	- rotation (degrees)
	- cornerRadius
	
circle()
	- x
	- y
	- radius
	- rotation (degrees)
	
polygon()
	- x
	- y
	- sides
	- radius
	- rotation (degrees)
	
text()
	- x
	- y
	- value
	- rotation - degrees
	
image()
	- x
	- y
	- src
	- width
	- height
	- rotation - degrees
	
### Style ###

The style object is a property within a shape object. It can recieve the following values:

- fill - (hex or rgba)
- strokeColor - (hex or rgba)
- strokeWidth
- strokeStyle - only relevant for lines (solid or dashed)
- opacity: (0 - 1)
- pattern - (image)

##### shadow #####

- offsetX
- offsetY
- blur
- color - (hex or rgba)

##### fillGradient #####

- type - linear or radial
- positions (object) - for linear - x1,y1,x2,y2
				   - for radial - x1,y1,r1,x2,y2,r2
- colors (array) - each array element takes the format [colorStop,color], the color stop is a number between 0 and 1. the color values are in hex or rgba format.
As many color stops can be added as needed.

##### strokeGradient #####

- type - linear or radial
- positions (object) - for linear - x1,y1,x2,y2
				   - for radial - x1,y1,r1,x2,y2,r2
- colors (array) - each array element takes the format [colorStop,color], the color stop is a number between 0 and 1. the color values are in hex or rgba format.
As many color stops can be added as needed.


### Animation ###

All basic shape properties can be animated.
The animation method recieves an object of shape properties to be animated, followed by the following additional options:
- duration - (default 1000)
- easing - (default easeInOutSine)
- callback - (on complete)

### Easing ###
The following easing functions are available within the library

- linear
- easeInQuad
- easeOutQuad
- easeInOutQuad
- easeInCubic
- easeOutCubic
- easeInOutCubic
- easeInQuart
- easeOutQuart
- easeInOutQuart
- easeInQuint
- easeOutQuint
- easeInOutQuint
- easeInSine
- easeOutSine
- easeInOutSine
- easeInExpo
- easeOutExpo
- easeInOutExpo
- easeInCirc
- easeOutCirc
- easeInOutCirc
- easeInElastic
- easeOutElastic
- easeInOutElastic
- easeInBack
- easeOutBack
- easeInOutBack
- easeInBounce
- easeOutBounce
- easeInOutBounce


