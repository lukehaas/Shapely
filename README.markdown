Shapely.js is a JavaScript library for the HTML5 Canvas element.

It drastically reduces the code necessary for drawing shapes on the canvas.

To invoke shapely, start by parsing it the id or classname of the canvas element(s) you want to work with

shapely('#example')

From there you can start adding shapes

shapely('#example').circle({
	x:20,
	y:20,
	radius:200,
	style:{fill:"#000000"}
}).star({
	x:100,
	y:200,
	radius:100,
	style:{strokeColor:"#000000"}
}).rect({
	x:400,
	y:500,
	width:100,
	height:200,
	style:{fill:"#FF0000"}
});

This draws a circle, star, and rectangle on the canvas. Each shape instance receives basic size, position rotaion, and opacity parameters, as well as a style object which includes parameters for fill and stroke colour and patterns, shadows, and gradients

Shapely can also animate shapes by adding .animate() to the end of a shape declaration


shapely('#example').circle({
	x:20,
	y:20,
	radius:200,
	style:{fill:"#000000"}
}).animate({
	x:50,
	radius:100
})

This can be used to animate miltiple shapes

shapely('#example').circle({
	x:20,
	y:20,
	radius:200,
	style:{fill:"#000000"}
}).animate({
	x:50,
	radius:100
}).rectangle({
	x:20,
	y:20,
	width:200,
	height:200,
	style:{fill:"#000000"}
}).animate({
	x:50,
	y:90,
	width:600
});