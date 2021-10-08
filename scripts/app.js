var vertexShaderText = [
    'precision mediump float;',
    
    'attribute vec3 vertPosition;',
    
    'void main()',
    '{',
    '	gl_Position = vec4(vertPosition,1.0);',
    '}'
    ].join('\n');
    
    var fragmentShaderText =
    [
    'precision mediump float;',
    'uniform vec4 colorAttrib;',
    
    'void main()',
    '{',
        
    '	gl_FragColor = colorAttrib;',
    '}',
    ].join('\n')

	///////////////////////////////////
	//       Game Variables	         //
	///////////////////////////////////

	//radius and size for game circle
	var r = 0.8;
	var i = 0.5;

var initGame = function(){

    //////////////////////////////////
	//       initialize WebGL       //
	//////////////////////////////////
	console.log('this is working');

	var canvas = document.getElementById('gameSurface');
	var gl = canvas.getContext('webgl');

	if (!gl){
		console.log('webgl not supported, falling back on experimental-webgl');
		gl = canvas.getContext('experimental-webgl');
	}
	if (!gl){
		alert('your browser does not support webgl');
	}

	// canvas.width = window.innerWidth;
	// canvas.height = window.innerHeight;
	gl.viewport(0,0,canvas.width,canvas.height);

	

	//////////////////////////////////
	// create/compile/link shaders  //
	//////////////////////////////////
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader,vertexShaderText);
	gl.shaderSource(fragmentShader,fragmentShaderText);

	gl.compileShader(vertexShader);
	if(!gl.getShaderParameter(vertexShader,gl.COMPILE_STATUS)){
		console.error('Error compiling vertex shader!', gl.getShaderInfoLog(vertexShader))
		return;
	}
	gl.compileShader(fragmentShader);
		if(!gl.getShaderParameter(fragmentShader,gl.COMPILE_STATUS)){
		console.error('Error compiling vertex shader!', gl.getShaderInfoLog(fragmentShader))
		return;
	}

	var program = gl.createProgram();
	gl.attachShader(program,vertexShader);
	gl.attachShader(program,fragmentShader);

	gl.linkProgram(program);
	if(!gl.getProgramParameter(program,gl.LINK_STATUS)){
		console.error('Error linking program!', gl.getProgramInfo(program));
		return;
	}

    //////////////////////////////////
	//    create circle buffer    //
	//////////////////////////////////

    //all arrays in JS is Float64 by default

	var circleVertexBufferObject = gl.createBuffer();
	//set the active buffer to the triangle buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, circleVertexBufferObject);
	//gl expecting Float32 Array not Float64
	//gl.STATIC_DRAW means we send the data only once (the triangle vertex position
	//will not change over time)

	var positionAttribLocation = gl.getAttribLocation(program,'vertPosition');
	var colorAttrib = gl.getUniformLocation(program, 'colorAttrib')
	gl.vertexAttribPointer(
		positionAttribLocation, //attribute location
		3, //number of elements per attribute
		gl.FLOAT, 
		gl.FALSE,
		0*Float32Array.BYTES_PER_ELEMENT,//size of an individual vertex
		0*Float32Array.BYTES_PER_ELEMENT//offset from the beginning of a single vertex to this attribute
		);
	gl.enableVertexAttribArray(positionAttribLocation);

	gl.useProgram(program);

	//////////////////////////////////
	//			Functions			//
	//////////////////////////////////

	function drawCircle(x, y, r, color){

		//init array for storing vertices of circle
		var circleVertices = [];

		//generate vertices
		//circle is 360 degrees so 360 vertices
		//we will be using i so init at 1 and go to <=360
		for (let i = 1; i<=360; i++){
			//from x, y find x1, y1 and x2, y2
			var x1 = r*Math.cos(i)+x;
			var x2 = r*Math.cos(i+1)+x;

			var y1 = r*Math.sin(i)+y;
			var y2 = r*Math.sin(i+1)+y;

			circleVertices.push(x);
			circleVertices.push(y);
			circleVertices.push(0);

			circleVertices.push(x1);
			circleVertices.push(y1);
			circleVertices.push(0);

			circleVertices.push(x2);
			circleVertices.push(y2);
			circleVertices.push(0);
		}

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(circleVertices),gl.STATIC_DRAW);
		gl.uniform4f(colorAttrib, color[0], color[1], color[2], color[3]);

		// Drawing triangles
		gl.clearColor(0.0,0.0,0.0,1.0);
		// Draw the triangle 360*3, 3 layers of vertices (disk)
		gl.drawArrays(gl.TRIANGLES, 0, 360*3);

	}
	
	//////////////////////////////////
	//            Drawing           //
	//////////////////////////////////
	
	drawCircle(0,0,0.8,[0.2, 0.2, 0.2, 1.0]);

	//////////////////////////////////
	//            Clicking           //
	//////////////////////////////////

	canvas.onmousedown = function(e, canvas){click(e, gameSurface);};

	function click(e, canvas) {
		var x = (e.clientX / canvas.clientWidth) * 2 - 1;
		var y = (1 - (e.clientY / canvas.clientHeight)) * 2 - 1;

		console.log("Values are: " + x + " and " + y)

	}

	function distanceThreshold(x1, y1, r1, x2, y2, r2) {
		if ((Math.sqrt(Math.pow((x2-x1), 2) + Math.pow((y2-y1), 2))) - (r1+r2) < 0){
			return true;
		}
		return false;
	}

}