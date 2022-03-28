const pi = Math.PI;

var width = 300, height = 150;
var start_time = 0;

var colors = [
 "#213d05",
 "#35c7e2",
 "#5704e7",
 "#8cccc9",
 "#e3d1b0"
];

class Queue {
  constructor(size) {
    this.items = new Array(size);
    this.max_length = size;
    this.length = 0;
    this.front_pointer = 0;
    this.end_pointer = 0;
  }

  enqueue(element) {
    if (this.isFull()) {
      return "Overflow";
    }
    else {
      this.front_pointer -= 1;
      this.normalizePointers();
      this.items[this.front_pointer] = element;
      this.length += 1;
    }
  }

  dequeue() {
    if(this.isEmpty()) {
      return "Underflow";
    }

    this.end_pointer -= 1;
    this.normalizePointers();
    this.items[this.end_pointer] = null;
    this.length -= 1;
  }

  isEmpty() {
    return this.length == 0;
  }

  isFull() {
    return this.length == this.items.length;
  }

  getItem(i) {
    return this.items[i];
  }

  normalizePointers() {
    if (this.front_pointer < 0) {
      this.front_pointer += this.items.length;
    }
    if (this.end_pointer < 0) {
      this.end_pointer += this.items.length;
    }
  }

  clearQueue() {
    this.items = new Array(this.max_length);
  }
}


class Wave {
  constructor(freq, weight, phase) {
    this.freq = freq / 5000;
    this.weight = weight;
    this.phase = phase;
  }
}

var wave_points;
var waves = [];
var draw_wave_interval;

$(document).ready(function() {
  console.log( "ready!" );
  start_time = performance.now();

  let canvas = $('#visuals')[0];

  canvas.style.width = 0.8 * parseInt($('#container').css('width'));
  canvas.style.height = canvas.style.width / 1.6;

  canvas.width = 0.8 * parseInt($('#container').css('width'));
  canvas.height = canvas.width / 1.6;

  width = canvas.width;
  height = canvas.height;

  wave_points = new Queue(Math.floor(width/3));

  presetWaves('sin');

//  startDraw();

});

function startDraw() {
  stopDraw();
  draw_wave_interval = setInterval(draw, 1000 / 30);
}

function stopDraw() {
  clearInterval(draw_wave_interval);
}

function presetWaves(preset) {
  waves = [];
  wave_points.clearQueue();
  startDraw();

  if (preset == 'sin') {
    waves.push(new Wave(1, 1, 0));
  }

  if (preset == 'st') {
    for (i=1; i<6; i++) {
      let weight = (-2/(pi*i)) * ((-1)**i);
      waves.push(new Wave(i, weight, 0));
    }
  }

  if (preset == 'sq') {
    for (i=1; i<6; i++) {
      let n = ((2 * i) - 1);
      let weight = 4/(pi * n);
      waves.push(new Wave(n, weight, 0));
    }
  }

  if (preset == 'tri') {
    for (i=1; i<6; i++) {
      let n = ((2 * i) - 1);
      let weight = (4 * (1 - (-1)**n))/((pi * n)**2);
      waves.push(new Wave(n, weight, pi/2));
      console.log(n, weight);
    }
  }

  updateUI();
 
}

function draw() {
  let canvas = $('#visuals');
  canvas.clearCanvas();

  let time = performance.now() - start_time;

  // Draw the Circles and radii

  let prevx = width/6, prevy = height/2, curx = 0, cury = 0;

  for (i=0; i<waves.length; i++) {
    let wave = waves[i];

    canvas.drawArc({
      strokeStyle: colors[i%colors.length],
      strokeWidth: 2,
      x: prevx, y: prevy,
      radius: Math.abs(wave.weight * height/10),
      start:0,end:360
    })

    let angle = (time * 2 * pi * wave.freq) % (2*pi) + wave.phase;

    curx = prevx + (Math.cos(angle) * wave.weight * height/10);
    cury = prevy + (Math.sin(angle) * wave.weight * height/10);

    canvas.drawLine({
      strokeStyle: 'steelblue',
      strokeWidth: 2,
      rounded: true,
      x1: prevx, y1: prevy,
      x2: curx, y2: cury,
    })

    prevx = curx;
    prevy = cury;

  }
  canvas.drawArc({
    strokeStyle: "black",
    fillStyle: "black",
    x: prevx, y: prevy,
    radius: 2
  })

  // Draw horizontal line connecting end of cicles and wavefront

  canvas.drawLine({
    strokeStyle: "black",
    strokeWidth: 1,
    rounded: true,
    x1: prevx, y1: prevy,
    x2: width/3, y2: prevy
  })

  // Update the wave_points array

  if (wave_points.isFull()) {
    wave_points.dequeue();
  }
  wave_points.enqueue(prevy);

  // Draw wave

//  let rad = (canvas[0].width * 2)/(3 * wave_points.max_length);
  let start = wave_points.front_pointer;

  let start_y_coor = wave_points.getItem(start);
  let start_x_coor = Math.floor(width/3);

  for (i=0; i<wave_points.length; i++) {
    n = (start + i) % wave_points.items.length;
    let y_coor = wave_points.getItem(n);
    let x_coor = start_x_coor + ((width*2/3)/wave_points.max_length);
//    let x_coor = (width/3) + (rad/2) + (i*2);

    canvas.drawLine({
      strokeStyle: "black",
      strokeWidth: 1,
      rounded: true,
      x1: start_x_coor, y1: start_y_coor,
      x2: x_coor, y2: y_coor
    })


    start_y_coor = y_coor;
    start_x_coor = x_coor;

/*
    canvas.drawArc({
      strokeStyle: "black",
      fillStyle: "black",
      x: x_coor, y: y_coor,
      radius: rad
    })
*/
  }

//  window.requestAnimationFrame(draw);
}


function updateUI() {
  console.log(waves[0]);
}
