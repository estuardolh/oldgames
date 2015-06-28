var canvas = document.getElementById('screen');
var context = canvas.getContext('2d');
canvas.addEventListener("touchstart", doTouchStart, false);
canvas.addEventListener("touchend", doTouchEnd, false);
canvas.addEventListener("mousedown", doClickStart, false);
canvas.addEventListener("mouseup", doClickEnd, false);

var miniconsole = {};
miniconsole.paused = false;
miniconsole.interval = null;
miniconsole.act = null;
miniconsole.ini = true;

miniconsole.matrix = [];
miniconsole.matrix_w = 10;
miniconsole.matrix_h = 10;
miniconsole.cell_w = 10;
miniconsole.cell_h = 10;

miniconsole.video = {};
miniconsole.input = {};

miniconsole.video.w = 10;
miniconsole.video.h = 10;
miniconsole.video.cell_w = 10;
miniconsole.video.cell_h = 10;
miniconsole.video.PIXEL_COLD = 0;
miniconsole.video.PIXEL_WARM = 1;
miniconsole.video.PIXEL_HOT = 2;

miniconsole.input.actual_key_down = -1;
miniconsole.input.KEY_ENTER = 13;
miniconsole.input.KEY_LEFT = 37;
miniconsole.input.KEY_RIGHT = 39;
miniconsole.input.KEY_UP = 38;
miniconsole.input.KEY_DOWN = 40;
miniconsole.input.touch_x = -1;
miniconsole.input.touch_y = -1;
miniconsole.input.click_x = -1;
miniconsole.input.click_y = -1;

function doTouchStart( event ){
	event.preventDefault();
	miniconsole.input.touch_x = event.targetTouches[0].pageX;
	miniconsole.input.touch_y = event.targetTouches[0].pageY;
}
function doTouchEnd( event ){
	event.preventDefault();
	miniconsole.input.touch_x = -1;
	miniconsole.input.touch_y = -1;
}
function doClickStart( event ){
	miniconsole.input.click_x = event.clientX;
	miniconsole.input.click_y = event.clientY;
}
function doClickEnd( event ){
	miniconsole.input.click_x = -1;
	miniconsole.input.click_y = -1;
}

document.onkeydown =  function( event ){
	event = event || window.event;
	
	miniconsole.input.actual_key_down = event.keyCode;
};
document.onkeyup = function( event ){
	event = event || window.event;
	if( miniconsole.input.actual_key_down == event.keyCode ) miniconsole.input.actual_key_down = -1;
};

document.getElementsByTagName("body")[0].onresize = function(){
	miniconsole.onresize();
};

miniconsole.onresize = function(){};

miniconsole.draw = function(){
	canvas.width += 1;
	canvas.width += -1;
	
	if( miniconsole.act == null ){
		return;
	}

	if( !miniconsole.paused ){
		miniconsole.matrix.forEach( function( column ){
			column.forEach( function( cell ){
					miniconsole.video.plot( cell.x, cell.y, 0 );
				}
			);
		});
		
		miniconsole.act.draw();
	}
};

miniconsole.update = function(){
	if( miniconsole.act == null ){
		return;
	}
	
	if( miniconsole.ini ){
		for( var i = 0; i < miniconsole.video.w; i++ ){
			var column = [];
			for( var j = 0; j < miniconsole.video.h; j++ ){
				column[ j ] = { x: i, y: j, value: 0 };
			}
			miniconsole.matrix[ i ] = column;
		}
	
		miniconsole.ini = false;
	}
	if( !miniconsole.paused ) miniconsole.act.update();
};

miniconsole.interval = setInterval( function(){
	miniconsole.update();
	miniconsole.draw();
}, 60/1000 );

miniconsole.show = function( act ){
	miniconsole.act = act;
	miniconsole.paused = false;
};

miniconsole.video.plot = function( x, y, intensity ){
	var percent = 8;
	var cell_w_percent = miniconsole.video.cell_w * percent/100;
	var cell_h_percent = miniconsole.video.cell_h * percent/100;
	
	context.beginPath();
	context.rect( x * miniconsole.video.cell_w + cell_w_percent , y * miniconsole.video.cell_h + cell_h_percent, miniconsole.video.cell_w - 2 * cell_w_percent, miniconsole.video.cell_h - 2 * cell_h_percent );
	context.lineWidth = 1;
	context.fillStyle = (intensity == 0)?'#F8F8F8':(intensity == 1)? '#AAAAAA': '#333333';
	context.fill();
	context.strokeStyle = '#D8D8D8';
	context.stroke();
};

miniconsole.input.iskeydown = function( key ){
	return ( miniconsole.input.actual_key_down == key );
};
miniconsole.input.istouch = function( x, y, w, h ){
	return ( miniconsole.input.touch_x >= x * miniconsole.video.cell_w && miniconsole.input.touch_x <= ( x+w )*miniconsole.video.cell_w ) && ( miniconsole.input.touch_y >= y*miniconsole.video.cell_h && miniconsole.input.touch_y <= ( y+h )*miniconsole.video.cell_h );
};
miniconsole.input.click = function( x, y, w, h ){
	return ( miniconsole.input.click_x >= x * miniconsole.video.cell_w && miniconsole.input.click_x <= ( x+w )*miniconsole.video.cell_w ) && ( miniconsole.input.click_y >= y*miniconsole.video.cell_h && miniconsole.input.click_y <= ( y+h )*miniconsole.video.cell_h );
};