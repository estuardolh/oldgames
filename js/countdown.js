function CountDown( options ){
	var co = {};
	co.count = ( options == null || options.count == null ? 0 : options.count );
	co.loop = ( options == null || options.loop == null ? false : options.loop );
	
	co.ini = function( ini ){ co.count = ini; };
	co.update = function( ){ if( --co.count < 0 ){ co.count = ( co.loop ? -1 : 0 ); } if( co.loop && co.count == -1 ){ co.count = options.count; } };
	co.getCount = function(){ return co.count; };
	co.isEnd = function(){ return co.count == 0; };
	
	return co;
}