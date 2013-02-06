// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Shapely 0.1 - JavaScript Canvas Library                          	│ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2013 Luke Haas (http://lukehaas.me)    				│ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Licensed under the MIT license.									| \\
// └────────────────────────────────────────────────────────────────────┘ \\


	(function(window,undefined) {
		var
		document = window.document,
		rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
		version = "0.1",
		shapely = function( selector, context ) {
			return new shapely.fun.init( selector, context );
		};
		
		shapely.fun = shapely.prototype = {
			shapely_version: version,
			constructor: shapely,
			init: function( selector, context ) {
				var match,elem,ctx,res;
				
				if ( !selector ) {
					return this;
				}

				if ( typeof selector === "string" ) {
					
					match = rquickExpr.exec( selector );

					if(match && match[1]) {

						elem = document.getElementById(match[1]);
						try {
							ctx = elem.getContext("2d");
							this.length = 1;
							this[0] = ctx;
						} catch(e) {}

						return this;
					} else {
						res = get(selector,document);

						return merge( this.constructor(), res );
					}
				}
				return this;
			},
			length:0,
			splice: [].slice
		};
		shapely.fun.init.prototype = shapely.fun;
		
		function get(selector,context) {
			var match = rquickExpr.exec( selector ),
			col = ret = [],
			i = 0,
			ctx;
			if(match[3] && context.getElementsByClassName) {
				
				col = [].slice.call(context.getElementsByClassName( match[3] ), 0)

			} else if(match[2]) {
				col = [].slice.call( context.getElementsByTagName(selector), 0);
			}
			i = col.length;
			while(i--) {
				try {
					ctx = col[i].getContext("2d");
					ret.push(ctx);
				} catch(e) {}
			}
			return ret;
		}
		function merge(first,second) {
			var l = second.length,
				i = first.length,
				j = 0;
	
			if ( typeof l === "number" ) {
				for ( ; j < l; j++ ) {
					first[ i++ ] = second[ j ];
				}
			} else {
				while ( second[j] !== undefined ) {
					first[ i++ ] = second[ j++ ];
				}
			}
			first.length = i;
	
			return first;
		}

		function hexToRgb(hex) {

		    var rgb;
		    if(hex.substr(0,3)=="rgb") {
		    	hex = hex.match(/[1-9]+/g);
		    	rgb = {
		    		r:hex[0],
		    		g:[1],
		    		b:[2]
		    	}
		    } else {
		    
			    hex = hex.replace(/#/,'');
			    
			    var bigint = parseInt(hex, 16);
			    rgb = {
				    r:(bigint >> 16) & 255,
				    g:(bigint >> 8) & 255,
				    b:bigint & 255
			    };
		    }
		
		    return rgb;
		}
		function Shape() {
			this.x = 0;
		    this.y = 0;
		    // 4 * ((√(2) - 1) / 3)
		    this.kappa = 0.5522847498;
		    //pi/180
		    this.radian = 0.01745329251;
		    //(2 * Math.PI) / 10
		    this.alpha = 0.6283185307179586;
		    this.width = 1;
		    this.height = 1;
		    this.sides = 1;
		    this.dashWidth = 10;
		    this.dashGap = 5;
		    this.radius = 0;
		    this.style = {
		    	strokeStyle:"solid",
		    	strokeWidth:1
		    }
		}
		Shape.prototype.extend = function(options) {
			var key;
			for(key in options) {
	          if(options.hasOwnProperty(key)) {
	              if(key=="style" || !isNaN(options[key])) {
	              	
	              	this[key] = options[key];
	              }
	          }
	        }

	        if(this.radius==0) {
		        this.yrad = this.height/2;
				this.xrad = this.width/2;
			}
			else if(options.polygon) {
				this.yrad = this.xrad = this.radius/2;
			}
			else {
				this.yrad = this.xrad = this.radius;
			}
			if(options.circle) {
				this.ydis = this.yrad*this.kappa;
				this.xdis = this.xrad*this.kappa;
			}
			
			if(options.style) {
				if(options.style.fill) {
					if(options.style.opacity) {
						
						this.rgb = hexToRgb(options.style.fill);
						
						options.style.fill = "rgba(" + this.rgb.r + "," + this.rgb.g + "," + this.rgb.b + "," + options.style.opacity + ")";
					}
	
				}
				if(options.style.strokeColor) {
					if(options.style.opacity) {
						this.rgb = hexToRgb(options.style.strokeColor);
						options.style.strokeColor = "rgba(" + this.rgb.r + "," + this.rgb.g + "," + this.rgb.b + "," + options.style.opacity + ")";
					}	
				}
				if(options.style.pattern) {
					this.img = new Image();
					this.img.src = options.style.pattern;
				}
			}
			if(options.rotation) {
				
				
				this.x -= this.tranx = this.x + (this.xrad/2);
				this.y -= this.trany = this.y + (this.yrad/2);


			}
			if(options.cornerRadius) {
				this.radFactor = options.cornerRadius*0.449;
				
			}
		}
		function applyStyle(elem,style,shape) {
			if(style.shadow) {
				elem.shadowOffsetX = style.shadow.offsetX;
				elem.shadowOffsetY = style.shadow.offsetY;
				elem.shadowBlur = style.shadow.blur;
				elem.shadowColor = style.shadow.color;
			}
			if(style.fillGradient) {

				style.fill = initGradient(elem,style.fillGradient);
			}
			if(style.strokeGradient) {
				style.strokeColor = initGradient(elem,style.strokeGradient);
				
			}
			if(style.pattern) {
				var ptrn = elem.createPattern(shape.img,'repeat');
				style.fill = ptrn;
			}
			if(style.fill) {
				elem.fillStyle = style.fill;
				elem.fill();
			}
			if(style.strokeColor) {
				elem.strokeStyle = style.strokeColor;
				elem.lineWidth = style.strokeWidth;
				elem.stroke();
			}
		}
		function initGradient(elem,gradient) {
			var grad,
				i = l = 0;
			if(gradient.type=="linear") {
				grad = elem.createLinearGradient(gradient.positions.x1,
					gradient.positions.y1,
					gradient.positions.x2,
					gradient.positions.y2);

			} else if(gradient.type=="radial") {
				grad = elem.createRadialGradient(gradient.positions.x1,
					gradient.positions.y1,
					gradient.positions.r1,
					gradient.positions.x2,
					gradient.positions.y2,
					gradient.positions.r2);
			}
			l = gradient.colors.length;
			for(;i<l;i++) {
				grad.addColorStop(gradient.colors[i][0],gradient.colors[i][1]);
			}
			
			return grad;
		}
		function customShape(shape,elem) {
			var k = 0,
				angle = (360/shape.sides);

			elem.moveTo(shape.x,shape.y);

			for (; k <shape.sides; k++) {
				elem.lineTo(shape.x+=Math.cos( ( angle * k )*shape.radian) * shape.radius, shape.y+=Math.sin( ( angle * k )*shape.radian) * shape.radius);
			}
		}

		shapely.fun.circle = function() {
			var i = 0,
				l = this.length,
				shape,
				elem,
				options = arguments[0] || {};
			
			options.circle = 1;	
			shape = new Shape();
			shape.extend(options);


			for(;i<l;i++) {
				elem = this[i] || {};
				
				elem.save();
				
				if(options.rotation) {
					
					elem.translate(shape.tranx,shape.trany);
					elem.rotate(options.rotation*shape.radian);
					
				}
      			elem.beginPath();
     			elem.moveTo(shape.width+shape.x, shape.yrad+shape.y);
     			
     			elem.bezierCurveTo(shape.width+shape.x, shape.yrad + shape.ydis + shape.y, shape.xrad + shape.xdis + shape.x, shape.height+shape.y, shape.xrad+shape.x, shape.height+shape.y);

				elem.bezierCurveTo(shape.xrad-shape.xdis+shape.x, shape.height+shape.y, shape.x, shape.yrad + shape.ydis + shape.y, shape.x, shape.yrad+shape.y);

				elem.bezierCurveTo(shape.x, shape.yrad-shape.ydis+shape.y, shape.xrad-shape.xdis+shape.x, shape.y, shape.xrad+shape.x, shape.y);

				elem.bezierCurveTo(shape.xrad + shape.xdis + shape.x, shape.y, shape.width+shape.x, shape.yrad-shape.ydis+shape.y, shape.width+shape.x, shape.yrad+shape.y);

				
				elem.closePath();

				if(options.style) {
					applyStyle(elem,options.style,shape);
				}
				
				elem.restore();
			}
			return this;

		}


		shapely.fun.star = function() {
			var i = k = 0,
				r_point,
				ra,
				omega,
				l = this.length,
				shape,
				elem,
				options = arguments[0] || {};
			
				
			shape = new Shape();
			shape.extend(options);
			r_point = shape.radius * 2; // r_point is the radius to the external point

			for(;i<l;i++) {
				elem = this[i] || {};
				
				elem.save();
				
				if(options.rotation) {
					elem.translate(shape.tranx,shape.trany);
					elem.rotate(options.rotation*shape.radian);
					
				}
				elem.beginPath();
				
				elem.moveTo(shape.x+(r_point * Math.sin(shape.alpha*11)),shape.y+ (r_point * Math.cos(shape.alpha*11)));
				for(k = 11; k != 0; k--) {
					ra = k % 2 == 1 ? r_point: shape.radius;

					omega = shape.alpha * k; //omega is the angle of the current point
						//cx and cy are the center point of the star.
		
					elem.lineTo(shape.x + (ra * Math.sin(omega)), shape.y + (ra * Math.cos(omega)));
		
				}
				
				elem.closePath();

				if(options.style) {
					applyStyle(elem,options.style,shape);
				}
				elem.restore();
			}
			return this;
		}
		shapely.fun.triangle = function() {
			var i = 0,
				l = this.length,
				shape,
				elem,
				options = arguments[0] || {};
			
			options.sides = 3;
			options.polygon = 1;
			shape = new Shape();
			shape.extend(options);
			

			for(;i<l;i++) {
				elem = this[i] || {};
				
				elem.save();
				
				if(options.rotation) {
					elem.translate(shape.tranx,shape.trany);
					elem.rotate(options.rotation*shape.radian);
				}

      			elem.beginPath();

				customShape(shape,elem);

      			elem.closePath();

				if(options.style) {
					applyStyle(elem,options.style,shape);
				}
				elem.restore();
      		}
			return this;
		}
		shapely.fun.line = function() {
			var i = 0,
				l = this.length,
				space,
				end,
				dashPosition,
				shape,
				elem,
				vertical = true;
				options = arguments[0] || {};
				
			shape = new Shape();
			shape.extend(options);
			shape.length = Math.max(shape.width,shape.height);
			if(shape.width>shape.height) {
				vertical = false;
			}
			for(;i<l;i++) {
				elem = this[i] || {};

				elem.save();
				
				if(options.rotation) {
					
					elem.translate(shape.tranx,shape.trany);
					elem.rotate(options.rotation*shape.radian);
				}
      			elem.beginPath();
     			elem.moveTo(shape.x, shape.y);
     			
				if(options.style.strokeStyle=="dashed") {
					space = false;
					if(vertical) {
						dashPosition = shape.y;
						end = shape.length + shape.y;
						while(dashPosition<end) {
							if(space) {
								elem.moveTo(shape.x,dashPosition+=shape.dashGap);
							} else {
								
								if((dashPosition+=shape.dashWidth)>end) {

									elem.lineTo(shape.x,end);
								} else {
									elem.lineTo(shape.x,dashPosition);
								}
								
							}
							space = !space;
						}
					} else {
						dashPosition = shape.x;
						end = shape.length + shape.x;
						while(dashPosition<end) {
							if(space) {
								elem.moveTo(dashPosition+=shape.dashGap,shape.y);
							} else {
								if((dashPosition+=shape.dashWidth)>end) {
									elem.lineTo(end,shape.y);
								} else {
									elem.lineTo(dashPosition,shape.y);
								}
								
							}
							space = !space;
						}
					}
				} else {
					
					if(vertical) {
						elem.lineTo(shape.x,shape.y+shape.length);
					} else {
						elem.lineTo(shape.x+shape.length,shape.y);
					}
				}
				
				elem.closePath();
				if(options.style) {
					applyStyle(elem,options.style,shape);
				}
				
				elem.restore();
				
			}
			return this;
		}
		shapely.fun.polygon = function() {
			var i = 0,
				k,
				l = this.length,
				shape,
				elem,
				options = arguments[0] || {};
			
			options.polygon = 1;
			shape = new Shape();
			shape.extend(options);
			

			for(;i<l;i++) {
				elem = this[i] || {};
				
				elem.save();
				
				if(options.rotation) {
					elem.translate(shape.tranx,shape.trany);
					elem.rotate(options.rotation*shape.radian);
				}

      			elem.beginPath();
      			
      			customShape(shape,elem);
      			
      			elem.closePath();

				if(options.style) {
					applyStyle(elem,options.style,shape);
				}
				elem.restore();
      		}
			return this;
		}
		shapely.fun.text = function() {
			var i = 0,
			l = this.length,
			elem,
			options = arguments[0] || {},
			shape = new Shape();
			shape.extend(options);
			
			for(;i<l;i++) {
				elem = this[i] || {};
				
				elem.save();
				
				if(options.rotation) {
					
					elem.translate(shape.tranx,shape.trany);
					elem.rotate(options.rotation*shape.radian);
				}

				if(options.align) {
					elem.textAlign = options.align;
				}
				if(options.baseline) {
					elem.textBaseline = options.baseline;
				}
				if(options.style) {
					applyStyle(elem,options.style,shape);
					if(options.style.font) {
	
						elem.font = options.style.font;
					}
					if(options.style.fill) {
	
						elem.fillText(options.value,shape.x,shape.y);
					}
					if(options.style.strokeColor) {
	
						elem.strokeText(options.value,shape.x,shape.y);
					}
				}
				elem.restore();
				
			}
			return this;
		}
		shapely.fun.image = function() {
			var i = 0,
				l = this.length,
				elem,
				img = new Image(),
				options = arguments[0] || {},
				shape = new Shape();
			shape.extend(options);

			for(;i<l;i++) {
				elem = this[i] || {};
				elem.save();
				if(options.rotation) {
					
					elem.translate(shape.tranx,shape.trany);
					elem.rotate(options.rotation*shape.radian);
				}
				if(options.src) {
					img.src = options.src;
				}
				if(options.sx && options.sy && options.swidth && options.sheight) {
					elem.drawImage(img,options.sx,options.sy,options.swidth,options.sheight,shape.x,shape.y,shape.width,shape.height);
				} else {
					elem.drawImage(img,shape.x,shape.y,shape.width,shape.height);
				}
				if(options.style) {
					applyStyle(elem,options.style,shape);
				}
				
				elem.restore();
				
			}
			
			return this;
		}
		function drawRectangle(elem,shape,options) {
				elem.save();
				
				if(options.rotation) {
					
					elem.translate(shape.tranx,shape.trany);
					elem.rotate(options.rotation*shape.radian);
					
				}
      			elem.beginPath();
      			
      			if(options.cornerRadius) {
      				
					elem.moveTo(shape.width+shape.x, shape.height+shape.y-options.cornerRadius);
		  
					elem.bezierCurveTo(shape.width+shape.x, shape.height+shape.y-shape.radFactor, shape.width+shape.x-shape.radFactor, shape.height+shape.y, shape.width+shape.x-options.cornerRadius, shape.height+shape.y);
					
					elem.lineTo(shape.x+options.cornerRadius, shape.height+shape.y);
					  
					elem.bezierCurveTo(shape.x+shape.radFactor, shape.height+shape.y, shape.x, shape.height+shape.y-shape.radFactor, shape.x, shape.height+shape.y-options.cornerRadius);
					
					elem.lineTo(shape.x, shape.y+options.cornerRadius);
					
					elem.bezierCurveTo(shape.x, shape.y+shape.radFactor, shape.x+shape.radFactor, shape.y, shape.x+options.cornerRadius, shape.y);
					
					elem.lineTo(shape.width+shape.x-options.cornerRadius, shape.y);
					  
					elem.bezierCurveTo(shape.width+shape.x-shape.radFactor, shape.y, shape.width+shape.x, shape.y+shape.radFactor, shape.width+shape.x, shape.y+options.cornerRadius);
					  
					elem.lineTo(shape.width+shape.x, shape.height+shape.y-options.cornerRadius);
      				
      				
      			} else {
      				elem.rect(shape.x,shape.y,shape.width,shape.height);
      			}
      			
      			
      			elem.closePath();

				if(options.style) {
					applyStyle(elem,options.style,shape);
				}
				
				elem.restore();
		}
		var animation_q = [];
		shapely.fun.rect = shapely.fun.rectangle = function() {
			var i = 0,
				l = this.length,
				shape,
				elem,
				options = arguments[0] || {};
					
			shape = new Shape();
			shape.extend(options);

			animation_q.push({shape:shape,method:drawRectangle,options:options});
			
			for(;i<l;i++) {
				elem = this[i] || {};
				
				drawRectangle(elem,shape,options);
      		}
			
			
			return this;
		}
		var animation_count = 0;
		shapely.fun.animate = function() {
			//animation is a work in progress
			var i = 0,
				l = this.length,
				elem,
				diff_options = {},
				shape = animation_q[animation_count].shape,
				orig_options = animation_q[animation_count].options,
				options = arguments[0] || {},
				duration = arguments[1] || 1000;
				callback = arguments[2] || false;
			

			options.delay = options.delay || 0;
			if(options.x) {
				diff_options.x = shape.x += options.x - shape.x;
			}
			if(options.y) {
				diff_options.y = shape.y += options.y - shape.y;
			}
			shape.extend(diff_options);
			//animation_q[animation_count].method();
			for(;i<l;i++) {
				elem = this[i] || {};
				tick(elem,shape,orig_options);
				
			}
			
			
			animation_count++;
			return this;
		}

		function tick(elem,shape,options) {
			//animation is a work in progress

			animation_q[animation_count].method(elem,shape,options);

		}

		window.shapely = shapely;

	})(window);