miniconsole.video.w = 16;
miniconsole.video.h = 16;
miniconsole.video.cell_w = 16;
miniconsole.video.cell_h = 16;
miniconsole.setFPS( 1000/35 );

window.onload = function(){
	miniconsole.show( new Tanks() );
};
