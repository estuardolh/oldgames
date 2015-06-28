function Tank( options ){
	var tan = {};
	tan.pad = options.pad;
	tan.x = ( miniconsole.video.w / 2 ) - 1;
	tan.y = ( miniconsole.video.h / 2 ) - 1;
	tan.struct_up = [   [0,1,0],
						[1,2,1],
						[2,0,2] ];
	tan.struct_down = [ [2,0,2],
						[1,2,1],
						[0,1,0] ];				
	tan.struct_right = [ [2,1,0],
						 [0,2,1],
						 [2,1,0] ];
	tan.struct_left = [  [0,1,2],
						 [1,2,0],
						 [0,1,2] ];			
	tan.struct = tan.struct_up;
	tan.width = 3;
	tan.height = 3;
	
	tan.STATE_INIT = 0;
	tan.state = tan.STATE_INIT;
	tan.POS_RIGHT = 0;
	tan.POS_DOWN = 1;
	tan.POS_LEFT = 2;
	tan.POS_UP = 3;
	tan.pos = tan.POS_UP;
	
	tan.touch_right = function(){
		return tan.pad.right();
	}
	tan.touch_down = function(){
		return tan.pad.down();
	}
	tan.touch_left = function(){
		return tan.pad.left();
	}
	tan.touch_up = function(){
		return tan.pad.up();
	}
	
	tan.draw = function(){
		var i, j;
		var row;
		for( j = 0; j < 3 ; j++ ){
			row = tan.struct[ j ];
			for( i = 0; i < 3 ; i++ ){
				miniconsole.video.plot( parseInt(tan.x) + i, parseInt(tan.y) + j, row[ i ] );
			}
		}
	};
	
	tan.update = function(){
		if( tan.touch_right() ){
			tan.x += 0.2;
			tan.struct = tan.struct_right;
		}
		if( tan.touch_left() ){
			tan.x -= 0.2;
			tan.struct = tan.struct_left;
		}
		if( tan.touch_up() ){
			tan.y -= 0.2;
			tan.struct = tan.struct_up;
		}
		if( tan.touch_down() ){
			tan.y += 0.2;
			tan.struct = tan.struct_down;
		}
	};
	
	return tan;
}

function Pad(){
	var pad = {};
	pad.used = false;
	pad.STATE_ANIMATE = 0;
	pad.STATE_INVISIBLE = 1;
	pad.state = pad.STATE_ANIMATE;
	pad.count = 0;
	pad.count_max = 4;
	pad.SHOW_RIGHT = 0;
	pad.SHOW_DOWN = 1;
	pad.SHOW_LEFT = 2;
	pad.SHOW_UP = 3;
	pad.show_index = pad.SHOW_RIGHT;
	
	pad.draw = function(){
		if( pad.state == pad.STATE_ANIMATE ){
			var di, dj;
			
			if( pad.show_index == pad.SHOW_RIGHT ){
				di = 12;
				dj = 4;
				for( var i = 0; i< 4; i++ ){
					for( var j = 0; j< 8; j++ ){
						miniconsole.video.plot( di+i, dj+j, miniconsole.video.PIXEL_WARM );
					}
				}
			}
			if( pad.show_index == pad.SHOW_DOWN ){
				di = 4;
				dj = 12;
				for( var i = 0; i< 8; i++ ){
					for( var j = 0; j< 4; j++ ){
						miniconsole.video.plot( di+i, dj+j, miniconsole.video.PIXEL_WARM );
					}
				}
			}
			if( pad.show_index == pad.SHOW_LEFT ){
				di = 0;
				dj = 4;
				for( var i = 0; i< 4; i++ ){
					for( var j = 0; j< 8; j++ ){
						miniconsole.video.plot( di+i, dj+j, miniconsole.video.PIXEL_WARM );
					}
				}
			}
			if( pad.show_index == pad.SHOW_UP ){
				di = 4;
				dj = 0;
				for( var i = 0; i< 8; i++ ){
					for( var j = 0; j< 4; j++ ){
						miniconsole.video.plot( di+i, dj+j, miniconsole.video.PIXEL_WARM );
					}
				}
			}
		}
	};
	pad.update = function(){
		if( pad.state == pad.STATE_ANIMATE ){
			pad.count++;
			if( pad.count > pad.count_max ){
				pad.count = 0;
				
				pad.show_index ++;
				if( pad.show_index > pad.SHOW_UP ){
					pad.show_index = pad.SHOW_RIGHT;
				}
			}
			
			if( miniconsole.input.istouch( 0,0,miniconsole.video.w,miniconsole.video.h ) 
				|| miniconsole.input.click( 0,0,miniconsole.video.w,miniconsole.video.h ) ){
				pad.state = pad.STATE_INVISIBLE;
				pad.count = 0;
			}
		}
		if( pad.state == pad.STATE_INVISIBLE ){
			
		}
	};
	
	pad.down = function(){
		return miniconsole.input.istouch( 4,12,8,4 ) || miniconsole.input.click( 4,12,8,4 );
	};
	pad.up = function(){
		return miniconsole.input.istouch( 4,0,8,4 ) || miniconsole.input.click( 4,0,8,4 );
	};
	pad.left = function(){
		return miniconsole.input.istouch( 0,4,4,8 ) || miniconsole.input.click( 0,4,4,8 );
	};
	pad.right = function(){
		return miniconsole.input.istouch( 12,4,4,8 ) || miniconsole.input.click( 12,4,4,8 );
	};
	
	return pad;
}

function Tanks(){
	var tanks = {};
	tanks.pad = new Pad();
	tanks.hero = new Tank({ "pad": tanks.pad });
	
	tanks.draw = function(){
		tanks.pad.draw();
		tanks.hero.draw();
	};
	
	tanks.update = function(){
		tanks.pad.update();
		tanks.hero.update();
	};
	
	return tanks;
}