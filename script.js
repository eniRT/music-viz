var pieces, radius, fft, mapMouseX, mapMouseY, toggleBtn, audio, uploadBtn, uploadedAudio, uploadAnim;
// background, inner (bass), middle (mid), outer (treble)
var colorPalette1 = ["#000", "#561637", "#753456", "#b34c75" ]; //pink
var colorPalette2 = ["#000", "#CF8963", "#F2A164", "#F1822D"];  //orange
var colorPalette3 = ["#000", "#799985", "#4c956c", "#1a9a6d"];  //green
var colorPalette4 = ["#000", "#739EAD", "#87CEFA", "#1E90FF"];  //blue
var colorPalette5 = ["#000", "#372549", "#532CBE", "#4e0250"];  //purple
var palettes = [colorPalette1, colorPalette2, colorPalette3, colorPalette4, colorPalette5];
var state = 0;
var colorPalette = palettes[state];
var uploadLoading = false;

function preload() {
	audio = loadSound("JackInAA.mp3");
}


function uploaded(file) {
	uploadLoading = true;
	uploadedAudio = loadSound(file.data, uploadedAudioPlay);
}


function uploadedAudioPlay(audioFile) {

	uploadLoading = false;

	if (audio.isPlaying()) {
		audio.pause();
	}

	audio = audioFile;
	audio.loop();
}


function setup() {

	uploadAnim = select('#uploading-animation');
	createCanvas(windowWidth, windowHeight);
	toggleBtn = createButton("Play / Pause");
	uploadBtn = createFileInput(uploaded);
	uploadBtn.addClass("upload-btn");
	toggleBtn.addClass("toggle-btn");
	toggleBtn.mousePressed(toggleAudio);
	fft = new p5.FFT();
	audio.pause();
}

function draw() {

	// Add a loading animation for the uploaded track
	if (uploadLoading) {
		uploadAnim.addClass('is-visible');
	} else {
		uploadAnim.removeClass('is-visible');
	}


	background(colorPalette[0]);
	noFill();
	fft.analyze();
	var bass = fft.getEnergy("bass");
	var treble = fft.getEnergy("treble");
	var mid = fft.getEnergy("mid");

	var mapMid = map(mid, 0, 255, -radius, radius);
	var scaleMid = map(mid, 0, 255, 1, 1.5);

	var mapTreble = map(treble, 0, 255, -radius, radius);
	var scaleTreble = map(treble, 0, 255, 1, 1.5);

	var mapbass = map(bass, 0, 255, -100, 800);
	var scalebass = map(bass, 0, 255, 0, 0.8);

	mapMouseX = map(mouseX, 0, width, 4, 8);
	mapMouseY = map(mouseY, 0, height, windowHeight / 4, windowHeight/2);

	pieces = mapMouseX;
	radius = mapMouseY;

	translate(windowWidth / 2, windowHeight / 2);

	strokeWeight(1);

	for (i = 0; i < pieces; i += 0.5) {

		rotate(TWO_PI / pieces);


		/*----------  BASS  ----------*/
		push();
		strokeWeight(5);
		stroke(colorPalette[1]);
		scale(scalebass);
		rotate(frameCount * -0.5);
		line(mapbass, radius / 2, radius, radius);
		line(-mapbass, -radius / 2, radius, radius);
		pop();



		/*----------  MID  ----------*/
		push();
		strokeWeight(0.5);
		stroke(colorPalette[2]);
		scale(scaleMid);
		line(mapMid, radius / 2, radius, radius);
		line(-mapMid, -radius / 2, radius, radius);
		pop();


		/*----------  TREBLE  ----------*/
		push();
		stroke(colorPalette[3]);
		scale(scaleTreble);
		line(mapTreble, radius / 2, radius, radius);
		line(-mapTreble, -radius / 2, radius, radius);
		pop();

	}

}


function toggleAudio() {
	if (audio.isPlaying()) {
		console.log("playing");
		audio.pause();
	} else {
		console.log("not playing");
		audio.play();
	}
}


function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}


window.addEventListener('keypress', function(e) {
	var keyCode = e.keyCode;
	if (keyCode > 48 && keyCode <= 57) {
		state = keyCode - 49;
	}
	else if (keyCode == 13) {
		if (state < 4)
			state += 1;
		else
			state = 0;
	}
	else if (keyCode == 32) {
		toggleAudio();
	}
	
	colorPalette = palettes[state];
});