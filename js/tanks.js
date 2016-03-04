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
	
	tan.bullet = null;
	
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
	tan.touch_a = function(){
		return tan.pad.a();
	}
	
	tan.shot = function(){
		var vx, vy, di, dj;
		switch( tan.pos ){
			case tan.POS_RIGHT:{
				vx = 1;
				vy = 0;
				di = 2;
				dj = 1;
			} break;
			case tan.POS_DOWN:{
				vx = 0;
				vy = 1;
				di = 1;
				dj = 2;
			} break;
			case tan.POS_LEFT:{
				vx = -1;
				vy = 0;
				di = 0;
				dj = 1;
			} break;
			case tan.POS_UP:{
				vx = 0;
				vy = -1;
				di = 1;
				dj = 0;
			} break;
		}
		
		tan.bullet = { "x":parseInt(tan.x) + di, "y":parseInt(tan.y) + dj, "vx":vx, "vy":vy, "collide":false };
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
		
		if( tan.bullet != null ) miniconsole.video.plot( tan.bullet.x, tan.bullet.y, miniconsole.video.PIXEL_HOT );
	};
	
	tan.update = function(){
		if( tan.touch_right() ){
			tan.x += 0.2;
			tan.pos = tan.POS_RIGHT;
			tan.struct = tan.struct_right;
		}
		if( tan.touch_left() ){
			tan.x -= 0.2;
			tan.pos = tan.POS_LEFT;
			tan.struct = tan.struct_left;
		}
		if( tan.touch_up() ){
			tan.y -= 0.2;
			tan.pos = tan.POS_UP;
			tan.struct = tan.struct_up;
		}
		if( tan.touch_down() ){
			tan.y += 0.2;
			tan.pos = tan.POS_DOWN;
			tan.struct = tan.struct_down;
		}
		
		// bullet
		if( tan.bullet != null ){
			tan.bullet.x += tan.bullet.vx;
			tan.bullet.y += tan.bullet.vy;
			tan.bullet.collide = (tan.bullet.x > miniconsole.video.w || tan.bullet.x < 0 || tan.bullet.y > miniconsole.video.h || tan.bullet.y < 0);
			
			if( tan.touch_a() && tan.bullet.collide ){
				tan.shot();
			}
		}else{
			if( tan.touch_a() ){
				tan.shot();
			}
		}
	};
	
	return tan;
}

function Enemy( options ){
	var enemy = {};
	enemy.x = ( options.x == null ? 0 : options.x );
	enemy.y = ( options.y == null ? 0 : options.y );
	enemy.struct_up = [ [0,1,0],
						[1,2,1],
						[2,0,2] ];
	enemy.struct_down =[[2,0,2],
						[1,2,1],
						[0,1,0] ];				
	enemy.struct_right =[[2,1,0],
						 [0,2,1],
						 [2,1,0] ];
	enemy.struct_left = [[0,1,2],
						 [1,2,0],
						 [0,1,2] ];				
	enemy.struct = enemy.struct_down;
	enemy.width = 3;
	enemy.height = 3;
	
	enemy.STATE_INIT = 0;
	enemy.STATE_PATROL = 1;
	enemy.state = enemy.STATE_INIT;
	enemy.POS_DOWN = 0;
	enemy.POS_RIGHT = 1;
	enemy.POS_UP = 2;
	enemy.POS_LEFT = 3;
	enemy.pos = ( options == null || options.pos == null ? enemy.POS_DOWN : options.pos );
	
	enemy.rip = false;
	enemy.next_orientation = new CountDown({ "count": 14, "loop" : true });
	
	enemy.draw = function(){
		var i, j;
		var row;
		for( j = 0; j < 3 ; j++ ){
			row = enemy.struct[ j ];
			for( i = 0; i < 3 ; i++ ){
				miniconsole.video.plot( parseInt(enemy.x) + i, parseInt(enemy.y) + j, row[ i ] );
			}
		}
	};
	
	enemy.ll_can_move = function( x, y){
		var res = !( enemy.x + enemy.width + x > miniconsole.video.w || enemy.x + x < 0 || enemy.y + enemy.height + y > miniconsole.video.h || enemy.y + y < 0);
		
		if(!res) console.log("can't move to x "+x+" y "+y+"? "+res);
		
		return res;
	};
	enemy.move = function( x, y ){
		enemy.x += x;
		enemy.y += y;
		
		if( x > 0 ){
			enemy.struct = enemy.struct_right;
		}else if( y > 0 ){
			enemy.struct = enemy.struct_down;
		}else if( x < 0 ){
			enemy.struct = enemy.struct_left;
		}else if( y < 0 ){
			enemy.struct = enemy.struct_up;
		}
		
		//console.log("move to x "+x+" y "+y);
	};
	
	
	enemy.update = function(){
		if( enemy.state == enemy.STATE_INIT ){
			enemy.state = enemy.STATE_PATROL;
		}else if( enemy.state == enemy.STATE_PATROL ){
			
			var ll_can = false;
			
			// WARNING> revisar este loop!
			while( ll_can == false && enemy.next_orientation.isEnd() && /*provicional*/ false ){
				var x = 0;
				var y = 0;
				
				if( enemy.pos == enemy.POS_DOWN ){
					y = 1;
					ll_can = enemy.ll_can_move(0 , y);
				}else if( enemy.pos == enemy.POS_RIGHT ){
					x = 1;
					ll_can = enemy.ll_can_move(x , 0);
				}else if( enemy.pos == enemy.POS_UP ){
					y = -1;
					ll_can = enemy.ll_can_move(0 , y);
				}else if( enemy.pos == enemy.POS_LEFT ){
					x = -1;
					ll_can = enemy.ll_can_move(x , 0);
				}
				if( ll_can == true ){
					enemy.move( x, y );
				}else{
					enemy.pos++;
					
					if( enemy.pos == 4 ) enemy.pos = enemy.POS_DOWN;
				}
			}
		}
		
		enemy.next_orientation.update();
	};
	
	return enemy;
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
		var di, dj;
		
		if( pad.state == pad.STATE_ANIMATE ){
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
			if( pad.show_index == pad.SHOW_UP 
				|| pad.show_index == pad.SHOW_RIGHT
				|| pad.show_index == pad.SHOW_DOWN
				|| pad.show_index == pad.SHOW_LEFT ){
				// A
				di = 12;
				dj = 12;
				for( var i = 0; i<4 ; i++ ){
					for( var j = 0; j< 4 ; j++ ){
						if( !((i == 0 || i == 3) && ( j == 0 || j == 3 )) ) miniconsole.video.plot( di+i, dj+j, miniconsole.video.PIXEL_WARM );
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
	pad.a = function(){
		return miniconsole.input.istouch( 12,12,4,4 ) || miniconsole.input.click( 12,12,4,4 );
	}
	
	return pad;
}

function Tanks(){
	var tanks = {};
	tanks.pad = new Pad();
	tanks.hero = new Tank({ "pad": tanks.pad });
	tanks.enemies = [];
	
	tanks.process_bullets = function( hero, enemies ){
		if( enemies != null && hero != null ){
			if( hero.bullet != null ){
				enemies.forEach(function( enemy ){
					if( (hero.bullet.x >= enemy.x && hero.bullet.x <= enemy.x+enemy.width)
						&& (hero.bullet.y >= enemy.y && hero.bullet.y <= enemy.y+enemy.height) ){
						console.log("ok!");
					}
				});	
			}
		}else{
			console.log("ERROR: hero or enemies are null.");
		}
	};
	
	tanks.process_enemies = function(){
		if( tanks.enemies.length < 3 /* max enemies */ ){
			var x, y;
			if( Math.random() <= 0.5 ){
				x = 0;
				y = 0;
			}else{
				x = miniconsole.video.w;
				y = 0;
			}
			tanks.enemies.push( new Enemy({ "x": x, "y": y })  ); // enemy can't move! >:[
		}
	}
	
	tanks.draw = function(){
		//tanks.pad.draw();
		//tanks.hero.draw();
		
	miniconsole.video.set( 5, 5,
		[
		[0,2,0],
		[2,2,2],
		[1,0,1],
		] );
		
	miniconsole.video.set( 10, 5,
		[
		[2],
		[0],
		[1],
		] );
	
	miniconsole.video.set( 2, 2, [1,0,2] );
	
	miniconsole.video.set( 1, 1, [1] );
	
	miniconsole.video.set( 0, 0, [2] );
		
		/*tanks.enemies.forEach( function( enemy ){
			enemy.draw();
		} );
		*/
	};
	
	tanks.update = function(){
		tanks.pad.update();
		tanks.hero.update();
		
		tanks.process_enemies(  );
		tanks.process_bullets( tanks.hero, tanks.enemies );
		tanks.enemies.forEach( function( enemy ){
			enemy.update();
		} );
	};
	
	return tanks;
}