function Tank(){
	var tan = {};
	tan.x = 0;
	tan.y = 0;
	tan.struct = [ 
						[0,1,0],
						[1,2,1],
						[2,0,2],
					];
	tan.STATE_INIT = 0;
	tan.state = tan.STATE_INIT;
	
	tan.draw = function(){
		var i, j;
		var row;
		for( j = 0; j < 3 ; j++ ){
			row = tan.struct[ j ];
			for( i = 0; i < 3 ; i++ ){
				miniconsole.video.plot( parseInt(tan.x) + i, j, row[ i ] );
			}
		}
	};
	
	tan.update = function(){
		if( miniconsole.input.istouch( 12,0,4,16 ) ){
			tan.x += 0.2;
		}
		if( miniconsole.input.istouch( 0,0,4,16 ) ){
			tan.x -= 0.2;
		}
	};
	
	return tan;
}

function Tanks(){
	var tanks = {};
	tanks.hero = new Tank();
	
	tanks.draw = function(){
		tanks.hero.draw();
	};
	
	tanks.update = function(){
		tanks.hero.update();
	};
	
	return tanks;
}