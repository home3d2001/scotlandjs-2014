var onMouseDownMouseX = 0, onMouseDownMouseY = 0,
fov = 70, nfov = fov,
lon = 90, nlon = 110, onMouseDownLon = 0,
lat = 0, nlat = 17, onMouseDownLat = 0,
phi = 0, theta = 0,
isUserInteracting = false, isUserPinching = false,
onPointerDownPointerX, onPointerDownPointerY, onPointerDownLon, onPointerDownLat;

var isInit = false;

function initEvents(){

	isInit = true;

	container.addEventListener( 'mousedown', onMouseDown, false );
	container.addEventListener( 'mousemove', onMouseMove, false );
	container.addEventListener( 'mouseup', onMouseUp, false );
	container.addEventListener( 'mousewheel', onMouseWheel, false );
	container.addEventListener( 'DOMMouseScroll', onMouseWheel, false);
	container.addEventListener( 'touchstart', onTouchStart, false );
	container.addEventListener( 'touchmove', onTouchMove, false );
	container.addEventListener( 'touchend', onTouchEnd, false );
	container.addEventListener( 'touchcancel', onTouchEnd, false );

	window.addEventListener( 'resize', onWindowResize, false );

	onWindowResize();

}

function onWindowResize() {
	var s = 1;
	renderer.setSize( s * window.innerWidth, s * window.innerHeight );
	camera.projectionMatrix.makePerspective( fov, window.innerWidth / window.innerHeight, camera.near, camera.far );
}

function onMouseWheel( event ) {

	// WebKit

	if ( event.wheelDeltaY ) {

		nfov -= event.wheelDeltaY * 0.01;

	// Opera / Explorer 9

	} else if ( event.wheelDelta ) {

		nfov -= event.wheelDelta * 0.05;

	// Firefox

	} else if ( event.detail ) {

		nfov += event.detail * 1.0;

	}
	
}

function onMouseDown( event ) {

	event.preventDefault();

	isUserInteracting = true;

	onPointerDownPointerX = event.clientX;
	onPointerDownPointerY = event.clientY;

	onPointerDownLon = lon;
	onPointerDownLat = lat;
	
}

function onMouseMove( event ) {

	if ( isUserInteracting ) {
	
		nlon = ( event.clientX - onPointerDownPointerX ) * 0.1 + onPointerDownLon;
		nlat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;
		
	}

}

function onMouseUp( event ) {
	
	isUserInteracting = false;
	
}

var oDist = 0, oFov;

function onTouchStart( event ) {

	uiElements.forEach( function( e ) { e.classList.add( 'hidden' ); } );

	event.preventDefault();

	if( event.touches.length == 2 ) {

		var t = event.touches;
		oDist = Math.sqrt(
				Math.pow( t[ 0 ].clientX - t[ 1 ].clientX, 2 ) +
				Math.pow( t[ 0 ].clientY - t[ 1 ].clientY, 2 ) );
		oFov = nfov;
		
		isUserPinching = true;

	} else {

		var t = event.touches[ 0 ];
		isUserInteracting = true;

		onPointerDownPointerX = t.clientX;
		onPointerDownPointerY = t.clientY;

		onPointerDownLon = lon;
		onPointerDownLat = lat;
	
	}

}

function onTouchMove( event ) {

	if( event.touches.length == 2 ) {

		var t = event.touches;
		var dist = Math.sqrt(
				Math.pow( t[ 0 ].clientX - t[ 1 ].clientX, 2 ) +
				Math.pow( t[ 0 ].clientY - t[ 1 ].clientY, 2 ) );

		nfov = oFov + .1 * ( oDist - dist );

	} else {

		var t = event.touches[ 0 ];
		nlon = ( t.clientX - onPointerDownPointerX ) * 0.1 + onPointerDownLon;
		nlat = ( t.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;

	}

}

function onTouchEnd( event ) {

	uiElements.forEach( function( e ) { e.classList.remove( 'hidden' ); } );

	isUserInteracting = false;
	isUserPinching = false;
	
}

function updateCamera() {

	if( !isInit ) initEvents();

	if( nfov < 10 ) nfov = 10;
	if( nfov > 100 ) nfov = 100;

	lon += ( nlon - lon ) * .2;
	lat += ( nlat - lat ) * .2;
	fov += ( nfov - fov ) * .2;

	camera.projectionMatrix.makePerspective( fov, window.innerWidth / window.innerHeight, camera.near, camera.far );
	
	lat = Math.max( - 85, Math.min( 85, lat ) );
	phi = ( 90 - lat ) * Math.PI / 180;
	theta = lon * Math.PI / 180;

	camera.position.x = 100 * Math.sin( phi ) * Math.cos( theta );
	camera.position.y = 100 * Math.cos( phi );
	camera.position.z = 100 * Math.sin( phi ) * Math.sin( theta );

	camera.lookAt( scene.position );

}

var oldUpdate = render;
render = function() { updateCamera(); oldUpdate(); }

