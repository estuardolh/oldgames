function CountDown( options ){
	var co = {};
	co.count = ( options == null || options.count == null ? 0 : options.count );
	co.loop = ( options == null || options.loop == null ? false : options.loop );
	co.is_end = false;
	
	co.ini = function( ini ){ co.count = ini; };
	co.now = function(){
		if( --co.count < 0 ){ 
			co.count = ( co.loop ? -1 : 0 );
		}else{
			co.is_end = false;
		}
		if( co.loop ){
			co.is_end = ( co.count == -1 );
			if( co.is_end ) co.count = options.count;
		}else{
			co.is_end = ( co.count == 0 );
		}
		
		return co.is_end;
	};
	co.getCount = function(){ return co.count; };
	
	return co;
}