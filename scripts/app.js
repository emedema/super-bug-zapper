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
		let r = 0.8;
		let generatedBacteria = [];
		let genBact = 0;
		let parts = [];
		let arcCheck = (2*Math.PI*r)*(15/360);
		let destroyedBacteria = 0;
		let score = 0;

let initGame = function(){

    //////////////////////////////////
	//       initialize WebGL       //
	//////////////////////////////////
	console.log('this is working');

	var canvas = document.getElementById('gameSurface');
	var gl = canvas.getContext('webgl');
	var particlesCanvas = document.getElementById('particles');
	var partCanvas = particlesCanvas.getContext('2d')

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
		//gl.clear(gl.COLOR_BUFFER_BIT);
		// Draw the triangle 360*3, 3 layers of vertices (disk)
		gl.drawArrays(gl.TRIANGLES, 0, 360*3);

	}

	//check if bacteria is colliding via radius
	function isColliding(x1, y1, r1, x2, y2, r2){
		/*
			In order to check if the two bacteria are colliding we must:
				1. Calculate the distance between (x1, y1) and (x2, y2)
					a) this is done through the equation
						sqrt(pow((x2-x1), 2) + pow((y2-y1), 2))
				2. Consider the radius of the circles. In order to tell if the circles are touching we:
					a) add the two radius together
					b) subtract the added radius from the distance.
				If distance is < 0 the bacteria are colliding.
		*/
		if((Math.sqrt(Math.pow((x2-x1), 2)+Math.pow((y2-y1), 2))-(r1+r2)) < 0){
			return true;
		}else{
			return false;
		}
	}

	function createExplosion(bacteria){
		//convert bacteria data to canvas data so we can know where things are
		/*
			I cannot figure out these equations
			X_clip = -1 + (2*x_canvas)/w
			Y_clip = -1 + 2(h-y_canvas)/h
		*/
		let bacteriaX = (bacteria.x + 2/75 + 1)*300;
		let bacteriaY = -1 * (bacteria.y-1) * 300 - 8; 
		let r = (((bacteria.x + bacteria.r) + 2/75 + 1) * 300) - bacteriaX;
		let num = 0;
		let partColor = bacteria.color;

		for(let x = 0; x < r; x++){
			for(let y = 0; y < r; y++){
				if(num % 2 == 0){
					let partX = bacteriaX + x;
					let partY = bacteriaY + y;
					let partX2 = bacteriaX - x;
					let partY2 = bacteriaY - y;

					//create a particle for each quarter of the bacteria
					let part = new Particle(partX, partY, 5, partColor);
					parts.push(part);
					part = new Particle(partX2, partY2, 5, partColor);
					parts.push(part);
					part = new Particle(partX, partY2, 5, partColor);
					parts.push(part);
					part = new Particle(partX2, partY, 5, partColor);
					parts.push(part);

				}
				num++;
			}
		}

	}

	//////////////////////////////////
	//		   Bacteria Class		//
	//////////////////////////////////

	class Bacteria {

		//constructor for when id is specified
		constructor(id){
			this.id = id;
			this.active = true;
			this.buffer = 0; 
		}

		//method to randomly decide if int is positive or negative
		randomizeInteger(num){
			if(Math.random() >= 0.5){
				num = num*-1;
			}
			return num;
		}

		//method for generating new random x and y values
		newPointValues(){
			this.angle = Math.random();
			this.genX = this.randomizeInteger(r);
			this.genY = this.randomizeInteger(r);
			//determine which angle randomly
			if(Math.random() >= 0.5){
				this.trig = "cos";
			}else{
				this.trig = "sin";
			}
		}

		genCircleValue(){
			if (this.trig == "cos") {
				this.x = this.genX*Math.cos(this.angle);
				this.y = this.genY*Math.sin(this.angle);
			} else {
				this.x = this.genX*Math.sin(this.angle);
				this.y = this.genY*Math.cos(this.angle);
			}
		}

		//method for generating new bacteria circles
		generate(){
			this.r = 0.05;
			//new random data for x and y
			this.newPointValues();
			//new x and y values along the game circle
			this.genCircleValue();

			//TODO: add in check for collision
			//check to avoid infinite loops, if too many bacteria to generate new one -> skip
			let attempt = 0;
			//iterate through bacteria already generated
			for(let i = 0; i<generatedBacteria.length; i++){
				//check to avoid infinite loop
				if(attempt > 500){
					console.log("Not enough area for new bacteria");
					break;
				}

				//if there is a collision we need to generate new data again
				//ensure it will loop through all the bacteria again
				if(isColliding(this.x, this.y, this.r, generatedBacteria[i].x, generatedBacteria[i].y, generatedBacteria[i].r)){
					this.newPointValues();
					this.genCircleValue();
					attempt++;
					//ensure it will loop through all bacteria again
					i = -1;
				}
			}

			
			//generate new colours
			this.color = [Math.random() * (0.45), Math.random() * (0.45), Math.random() * (0.45), 0.8];
			this.poisoned = false;
			genBact++;

		}

		show(){
			var smooth = this.buffer / 50;
			if (this.active) this.r = this.r + 0.0001 + (smooth);
			this.buffer -= smooth;
			
			for (i in generatedBacteria) {
				if (this.id == generatedBacteria[i].id);
				else{
					if (isColliding(this.x, this.y, this.r, generatedBacteria[i].x, generatedBacteria[i].y, generatedBacteria[i].r)) {
						this.buffer = generatedBacteria[i].r;
						generatedBacteria[i].delete();
					}
				}
				
			}
			

			if (this.r >= arcCheck) {
				lives--; 
				this.delete();
			}

			drawCircle(this.x, this.y, this.r, this.color);
		}

		delete(){
			this.r = 0;
			this.x = 0;
			this.y = 0;
			this.active = false;
			destroyedBacteria++;
			console.log("You sunk the battleship!");
		}

	}

	//////////////////////////////////
	//         Particle Class       //
	//////////////////////////////////


	class Particle{
		constructor(x, y, r, color){
			this.x = x;
			this.y = y;
			this.r = r + Math.random() * 5;
			//using traditional javascript animation -> colour needs to be rgba
			this.color ="rgba(" + Math.round((1*color[0]) * 255) + "," + Math.round((1*color[1]) * 255) + "," + Math.round((1*color[2]) * 255) + "," + Math.random()*0.95 + ")"
			this.speed = {x: -1 + Math.random() *5, y: -1 + Math.random() * 2}
			this.life = 20 + Math.random() * 10;
		}
		show(){
			//draw if != life and its not too small
			if(this.life > 0 && this.r > 0){
				partCanvas.beginPath();
				partCanvas.rect(this.x, this.y, this.r, Math.PI * 2);
				partCanvas.fillStyle = this.color;
				partCanvas.fill();

				// Update data
				this.life--;
				this.r -= 0.60;
				this.x += this.speed.x;
				this.y += this.speed.y;
			}
		}
	}

	//////////////////////////////////
	//            Clicking          //
	//////////////////////////////////

	canvas.onmousedown = function(e, canvas){click(e, gameSurface);};

	function click(e, canvas) {

		var x = (e.clientX / canvas.clientWidth) * 2 - 1;
		var y = (1 - (e.clientY / canvas.clientHeight)) * 2 - 1;

		for (i in generatedBacteria) {
			k = generatedBacteria[i]

			console.log("Values are: " + x + " and " + y);

			if (isColliding(x,y,0,k.x,k.y,k.r)) {
				//increase score by factor of time -> radius
				//the longer the amount of time the larger the points.
				//1/radius of circle since radius is bigger over time will work.
				console.log("score before: " + score);
				console.log("radius: " + generatedBacteria[i].r)
				console.log("difference: " + (score + Math.round(1/generatedBacteria[i].r)));
				score += Math.round(1/generatedBacteria[i].r);
				console.log("score after: " + score);
				createExplosion(k);
				k.delete();
				break;
			}
			
		}
	}
	
	//////////////////////////////////
	//       Initalize Game         //
	//////////////////////////////////
	let lifeCounter = document.getElementById("lives");
	let scoreCounter = document.getElementById("score");
	let lives = 2;

	for (i = 0; i < 10; i++) {
		generatedBacteria.push(new Bacteria(genBact))
		generatedBacteria[i].generate();
	}

	//////////////////////////////////
	//            Drawing           //
	//////////////////////////////////	

	function gameplay() {
		if (destroyedBacteria >= 10) {
			document.getElementById("gameOver").style.color = "green";
			document.getElementById("gameOver").innerHTML = "You win! Congrats!";
		}
		if (lives > 0) {			
			// Draw game surface
			drawCircle(0,0,r,[0.0, 0.0, 0.0, 1.0]);
			for (i in generatedBacteria) {
				generatedBacteria[i].show();
				lifeCounter.innerHTML = lives;
				scoreCounter.innerHTML = score;
			}
			// Loop through all particles to draw
			partCanvas.clearRect(0, 0, canvas.width, canvas.height);
			for(i in parts) {
				parts[i].show();
			}
			requestAnimationFrame(gameplay);
		}
		else if (lives <= 0) {
			document.getElementById("gameOver").innerHTML = "Game over! Try again!";
		}
	}
	requestAnimationFrame(gameplay);
}