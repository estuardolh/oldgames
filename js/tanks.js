/*
	tank
	  enemy( auto ) or hero
*/
function Tank( options ){
	var tan = {};
	tan.pad = options.pad;
	tan.is_auto = options.is_auto; // auto = self driven
	
	tan.x = ( options == null || options.x == null ? ( miniconsole.video.w / 2 ) - 1 : options.x );
	tan.y = ( options == null || options.y == null ? ( miniconsole.video.h / 2 ) - 1 : options.y );
	tan.struct_up =
	[ [0,1,0],
	  [1,2,1],
	  [2,0,2] ];
	tan.struct_down =
	[ [2,0,2],
  	  [1,2,1],
	  [0,1,0] ];
	tan.struct_right =
	[ [2,1,0],
	  [0,2,1],
	  [2,1,0] ];
	tan.struct_left =
	[ [0,1,2],
      [1,2,0],
	  [0,1,2] ];

	tan.struct = tan.struct_down;
	tan.width = 3;
	tan.height = 3;
	tan.vx = 0.08;
	tan.vy = 0.08;
	
	tan.states = { STATE_INIT: 0, STATE_PATROL: 1, STATE_PARALYZED: 2 };
	tan.state = tan.states.STATE_INIT;

	tan.positions = { DOWN: 0, RIGHT: 1, UP: 2, LEFT: 3 };
	tan.pos = ( options == null || options.pos == null ? tan.positions.DOWN : options.pos );;
	
	tan.rip = false;
	tan.next_orientation = new CountDown({ "count": 28, "loop" : true });	
	
	tan.bullet = null;
	
	tan.shot = function(){
		var vx = 0.5, vy, di, dj;
		vy = vx;
		
		switch( tan.pos ){
			case tan.positions.RIGHT:{
				vx *= 1;
				vy *= 0;
				
				di = 2;
				dj = 1;
			} break;
			case tan.positions.DOWN:{
				vx *= 0;
				vy *= 1;
				
				di = 1;
				dj = 2;
			} break;
			case tan.positions.LEFT:{
				vx *= -1;
				vy *= 0;
				
				di = 0;
				dj = 1;
			} break;
			case tan.positions.UP:{
				vx *= 0;
				vy *= -1;
				
				di = 1;
				dj = 0;
			} break;
		}
		
		tan.bullet = { "x":parseInt(tan.x) + di, "y":parseInt(tan.y) + dj, "vx":vx, "vy":vy, "collide":false };
	}
	
	tan.draw = function(){
		var i, j;
		var row;
		
		miniconsole.video.set( parseInt( tan.x ), parseInt( tan.y ), tan.struct );
			
		if( tan.bullet != null ) miniconsole.video.plot( tan.bullet.x, tan.bullet.y, miniconsole.video.PIXEL_HOT );
	};
	
	tan.should_move = function(x, y){
		var res = !( tan.x + tan.width + x > (miniconsole.video.w + 1)
			|| tan.x + x < 0 
			|| tan.y + tan.height + y > (miniconsole.video.h + 1)
			|| tan.y + y < 0 );

		return res;
	};
	
	tan.rotate_to = function( to ){
		// rotate struct. And Switchs are cute.  For cicle instead this?.
		switch( to ){
			case tan.positions.DOWN :{
				if( tan.pos == tan.positions.DOWN ){
					// Nothing
				}else if( tan.pos == tan.positions.RIGHT ){
					tan.struct = miniconsole.array.rotate( tan.struct, 1 );
				}else if( tan.pos == tan.positions.LEFT ){
					tan.struct = miniconsole.array.rotate( tan.struct, -1 );
				}else if( tan.pos == tan.positions.UP ){
					// implement miniconsole.array.MIRROR( [X/Y] ) ?
					tan.struct = miniconsole.array.rotate( tan.struct, -1 );
					tan.struct = miniconsole.array.rotate( tan.struct, -1 );
				}
			}; break;
			case tan.positions.LEFT :{
				if( tan.pos == tan.positions.DOWN ){
					tan.struct = miniconsole.array.rotate( tan.struct, 1 );
				}else if( tan.pos == tan.positions.RIGHT ){
					tan.struct = miniconsole.array.rotate( tan.struct, 1 );
					tan.struct = miniconsole.array.rotate( tan.struct, 1 );
				}else if( tan.pos == tan.positions.LEFT ){
					// Nothing
				}else if( tan.pos == tan.positions.UP ){
					tan.struct = miniconsole.array.rotate( tan.struct, -1 );
				}
			}; break;
			case tan.positions.RIGHT :{
				if( tan.pos == tan.positions.DOWN ){
					tan.struct = miniconsole.array.rotate( tan.struct, -1 );
				}else if( tan.pos == tan.positions.RIGHT ){
					// Nothing
				}else if( tan.pos == tan.positions.LEFT ){
					tan.struct = miniconsole.array.rotate( tan.struct, -1 );
					tan.struct = miniconsole.array.rotate( tan.struct, -1 );
				}else if( tan.pos == tan.positions.UP ){
					tan.struct = miniconsole.array.rotate( tan.struct, 1 );
				}
			}; break;
			case tan.positions.UP :{
				if( tan.pos == tan.positions.DOWN ){
					tan.struct = miniconsole.array.rotate( tan.struct, 1 );
					tan.struct = miniconsole.array.rotate( tan.struct, 1 );
				}else if( tan.pos == tan.positions.RIGHT ){
					tan.struct = miniconsole.array.rotate( tan.struct, -1 );
				}else if( tan.pos == tan.positions.LEFT ){
					tan.struct = miniconsole.array.rotate( tan.struct, 1 );
				}else if( tan.pos == tan.positions.UP ){
					// Nothing
				}
			}
		}// end switch
		
		// change or consevate position
		tan.pos = ( tan.pos == to ? tan.pos : to );
	};
	
	tan.move = function( x, y ){
		tan.x += x * tan.vx;
		tan.y += y * tan.vy;
		
		if( x > 0 ){
			//tan.struct = tan.struct_right;
			tan.rotate_to( tan.positions.RIGHT );
		}else if( y > 0 ){
			//tan.struct = tan.struct_down;
			tan.rotate_to( tan.positions.DOWN );
		}else if( x < 0 ){
			//tan.struct = tan.struct_left;
			tan.rotate_to( tan.positions.LEFT );
		}else if( y < 0 ){
			//tan.struct = tan.struct_up;
			tan.rotate_to( tan.positions.UP );
		}
	};
	
	tan.update = function(){
		if( tan.is_auto ){
			if( tan.state == tan.states.STATE_INIT ){
				tan.state = tan.states.STATE_PATROL;
			}else if( tan.state == tan.states.STATE_PATROL ){
				var ll_can = false;
				
				tan.next_orientation.ini(1);
				while( ll_can == false && tan.next_orientation.now() == false ){
					var x = 0;
					var y = 0;
					
					if( ll_can == false ){
						if( tan.pos == tan.positions.DOWN ){
							y = 1;
							ll_can = tan.should_move(0 , y);
						}else if( tan.pos == tan.positions.RIGHT ){
							x = 1;
							ll_can = tan.should_move(x , 0);
						}else if( tan.pos == tan.positions.UP ){
							y = -1;
							ll_can = tan.should_move(0 , y);
						}else if( tan.pos == tan.positions.LEFT ){
							x = -1;
							ll_can = tan.should_move(x , 0);
						}
						
						if( ll_can == true ) tan.move( x, y );
						
						if( !ll_can ){
							tan.pos++; // xd
						
							if( tan.pos == 4 ) tan.pos = tan.positions.DOWN;
						}
					}
				}
			}
		}else{
			if( tan.pad.right() ){
				tan.x += tan.vx;

				tan.rotate_to( tan.positions.RIGHT );
			}
			if( tan.pad.left() ){
				tan.x -= tan.vx;
				
				tan.rotate_to( tan.positions.LEFT );
			}
			if( tan.pad.up() ){
				tan.y -= tan.vy;
				
				tan.rotate_to( tan.positions.UP );
			}
			if( tan.pad.down() ){
				tan.y += tan.vy;
				
				tan.rotate_to( tan.positions.DOWN );
			}
			
			if( tan.bullet != null ){
				// update existent bullet
				tan.bullet.x += tan.bullet.vx;
				tan.bullet.y += tan.bullet.vy;
				tan.bullet.collide = (tan.bullet.x > miniconsole.video.w || tan.bullet.x < 0 || tan.bullet.y > miniconsole.video.h || tan.bullet.y < 0);
				
				// you can press A only if existent bullet collide
				if( tan.pad.a() && tan.bullet.collide ){
					tan.shot();
				}
			}else{
				if( tan.pad.a() ){
					tan.shot();
				}
			}
		}
	};
	
	tan.stop_go = function(){
		if( ! tan.is_auto ) return;
		
		tan.state = ( tan.state == tan.states.STATE_PARALYZED ? tan.states.STATE_PATROL : tan.states.STATE_PARALYZED );
	};
	
	return tan;
}

/*
	controls
	  up, down, left, right, shot!
*/
function Pad(){
	var pad = {};
	pad.used = false;
	pad.STATE_ANIMATE = 0;
	pad.STATE_INVISIBLE = 1;
	pad.state = pad.STATE_ANIMATE;
	
	pad.SHOW_NONE = -1;
	pad.SHOW_RIGHT = 0;
	pad.SHOW_DOWN = 1;
	pad.SHOW_LEFT = 2;
	pad.SHOW_UP = 3;
	
	pad.show_index = pad.SHOW_RIGHT;
	
	pad.v = 
				[ [1,1,1,1]
				, [1,1,1,1]
				, [1,1,1,1]
				, [1,1,1,1]
				, [1,1,1,1]
				, [1,1,1,1]
				, [1,1,1,1]
				, [1,1,1,1] ];
	pad.h = 
			[ [1,1,1,1,1,1,1,1]
			, [1,1,1,1,1,1,1,1]
			, [1,1,1,1,1,1,1,1]
			, [1,1,1,1,1,1,1,1] ];
	
	pad.draw = function(){
		var di, dj;
		
		if( pad.state == pad.STATE_ANIMATE ){
			if( pad.show_index == pad.SHOW_RIGHT ){
				di = 12;
				dj = 4;
				
				miniconsole.video.set( di, dj, pad.v );
			}
			if( pad.show_index == pad.SHOW_DOWN ){
				di = 4;
				dj = 12;
				
				miniconsole.video.set( di, dj, pad.h );
			}
			if( pad.show_index == pad.SHOW_LEFT ){
				di = 0;
				dj = 4;
				
				miniconsole.video.set( di, dj, pad.v );
			}
			if( pad.show_index == pad.SHOW_UP ){
				di = 4;
				dj = 0;
				
				miniconsole.video.set( di, dj, pad.h );
			}
			
			di = 12;
			dj = 12;
			miniconsole.video.set( di, dj
			, [
			[0,1,1,0],
			[1,1,1,1],
			[1,1,1,1],
			[0,1,1,0]
			] );
		}
	};
	pad.update = function(){
		if( pad.state == pad.STATE_ANIMATE ){
			pad.show_index = pad.SHOW_NONE;
			
			if( pad.right() ) pad.show_index = pad.SHOW_RIGHT;
			if( pad.left() ) pad.show_index = pad.SHOW_LEFT;
			if( pad.up() ) pad.show_index = pad.SHOW_UP;
			if( pad.down() ) pad.show_index = pad.SHOW_DOWN;
		}else if( pad.state == pad.STATE_INVISIBLE ){
			// asdfasd
		}
	};
	
	pad.down = function(){
		return miniconsole.input.click_touch( 4,12,8,4 );
	};
	pad.up = function(){
		return miniconsole.input.click_touch( 4,0,8,4 );
	};
	pad.left = function(){
		return miniconsole.input.click_touch( 0,4,4,8 );
	};
	pad.right = function(){
		return miniconsole.input.click_touch( 12,4,4,8 );
	};
	pad.a = function(){
		return miniconsole.input.click_touch( 12,12,4,4 );
	}
	
	return pad;
}

function Tanks(){
	var tanks = {};
	tanks.pad = new Pad();
	tanks.hero = new Tank({ "pad": tanks.pad, is_auto: false });
	tanks.enemies = [];
	tanks.ini = true;
	
	tanks.process_bullets = function( hero, enemies ){
		if( enemies != null && hero != null ){
			if( hero.bullet != null && ! hero.bullet.collide ){
				enemies.forEach(function( enemy ){
					if( (hero.bullet.x >= parseInt(enemy.x) && hero.bullet.x < parseInt(enemy.x)+enemy.width)
						&& (hero.bullet.y >= parseInt(enemy.y) && hero.bullet.y < parseInt(enemy.y)+enemy.height) ){
						enemy.rip = true;
					}
				});
				
				// remove destroyed tanks
				for( var i = 0 ; i < enemies.length ; i++ ){
					if( enemies[ i ].rip == true ){
						enemies.splice( i, 1 );
					}
				}
			}
		}else{
			console.log("ERROR: hero or enemies are null.");
		}
	};
	
	tanks.process_enemies = function(){
		var x, y;
		
		x = 0;
		y = 0;
		tanks.enemies.push( new Tank({ "x": x, "y": y, "is_auto": true })  );
		
		x = miniconsole.video.w - 3 ;
		tanks.enemies.push( new Tank({ "x": x, "y": y, "is_auto": true })  );
	}
	
	tanks.draw = function(){
		tanks.pad.draw();
		tanks.hero.draw();
		
		tanks.enemies.forEach( function( enemy ){
			enemy.draw();
		} );
	};
	
	tanks.update = function(){
		tanks.pad.update();
		tanks.hero.update();
		
		if( tanks.ini ){
			tanks.process_enemies();
			tanks.ini = false;
		}
		tanks.process_bullets( tanks.hero, tanks.enemies );
		tanks.enemies.forEach( function( enemy ){
			enemy.update();
		} );
	};
	
	return tanks;
}