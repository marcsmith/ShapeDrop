//testes
ShapeDrop = (function() {
	var page1Shapes = { },
		shapeDropCanvas,
        CANVAS_WIDTH  = 768,
        CANVAS_HEIGHT = 1024;


    return {
		init: function() {
			this.shapeDropCanvas = Raphael("shapeDrop", CANVAS_WIDTH, CANVAS_HEIGHT);
		},
		addShape: function(shape) {
			page1Shapes[shape.id] = new Shape( null, shape );
		},
		shapeForId: function(id) {
			return page1Shapes[id];
		},
        randRGB: function() {
             return 'rgb(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ')';
        },

        validatePlacements: function() {
             var i = page1Shapes.keys().length-1;
             while(i>=0) {
                //check position
//                console.log(page1Shapes[page1Shapes.keys()[i]]);
                i--;
             }
        },

        shapeDropCanvas: shapeDropCanvas
	}
})();

var Shape = function(props, rjsShape) {
	jQuery.extend(this, props);

    // local store of orig shape
	this._shape = rjsShape;

    // when a Shape is *home*, this turns true.  when all are true, do something totally awesome!
	this.homeBase = false;

    // clone orig shape for it's *home*
	this._home = rjsShape.clone().attr({fill: "#ccc", stroke: "none", opacity: "0.3"});

    // give shape unique id & bring it to front
	this.id = "rjs" + this._shape.id;
	rjsShape.toFront();

	//	this.type;
	//	this.name;
	//	this.color;

    // debug
    this._shape.translate(55, 55);
    if(rjsShape.attr('path') !== undefined) {
/*        console.log(rjsShape.attr('path'));
        var paths = rjsShape.attr('path').length-1;
        while(paths>=0) {
            var path = rjsShape.attr('path')[paths];
            console.log(path);
            if(path[0] === "M" || path[0] === "L") {
                path[1] = path[1]+20;
                path[2] = path[2]+20;
            }
            paths--;
        }
*/    }
    // set the home x/y coords of our shape - different way to go about it depending on what type it is (cirlce, rect, path, etc)
	this.homeX = this._home.attr('cx') || this._home.attr('x') || this._home.attr('path')[0][1];
	this.homeY = this._home.attr('cy') || this._home.attr('y') || this._home.attr('path')[0][2];

    // define our drag methods - start (mousedown on shape), move, & up (mouseup to *drop* shape on canvas)
	this._shape.drag(this.move, this.start, this.up);

};

Shape.prototype.start = function () {
    // storing original coordinates
//	if(!this.attr("cx")) this.attr("cx", this.attr("x"));
//	if(!this.attr("cy")) this.attr("cy", this.attr("y"));
//    console.log(this);

    // store x/y for shape each time one is clicked
    this.ox = this.attr("cx") || this.attr("x") || this.attr('path')[0][1];
    this.oy = this.attr("cy") || this.attr("y") || this.attr('path')[0][2];
    console.log("OX->" + this.ox);
    console.log("OY->" + this.oy);

    // set 50% opactiy on shape when clicked on (it's about to be moved)
    this.attr({opacity: 0.5});
};
Shape.prototype.move = function (dx, dy) {
//    console.log(this);
    // for recatangles & ???
	if(this.type==='rect') {
		var trans_x = dx-this.ox;
		var trans_y = dy-this.oy;
    	this.attr({x: this.ox + dx, y: this.oy + dy});
    // for paths
    } else if(this.type==='path') {
		var trans_x = dx-this.ox;
		var trans_y = dy-this.oy;
		this.translate(trans_x, trans_y);
		this.ox = dx;
		this.oy = dy;
    //for circles/ellipes (roundys)
	} else {
    	this.attr({cx: this.ox + dx, cy: this.oy + dy});
	}

	var origShape = ShapeDrop.shapeForId(this.id);
    var origx = origShape.homeX,
		origy = origShape.homeY;
//	console.log("ox: " + this.ox + ", oy: " + this.oy + ", origx: " + origx + ", origy: " + origy);
	if( (Math.abs(this.ox+dx-origx) < 20) && (Math.abs(this.oy+dy-origy) < 20) ) {
        this.homeBase = true;
		if(this.attr('cx')) {
			this.attr({cx: origx, cy: origy});
		} else {
			this.attr({x: origx, y: origy});
		}
//		this.attr("fill", "rgba(0, 0, 0, 0.4)");
	} else {
	//	console.log(this.ox, dx);
        this.homeBase = false;
	}
};
Shape.prototype.up = function () {
    // restoring state
    this.attr({opacity: 1.0});

    // if shape is *home* on mouseup, let's validate all of them to see if user *wins*
    if(this.homeBase) {
        ShapeDrop.validatePlacements();
    }
};
