const pi = Math.PI;

var width = 300, height = 150;
var start_time = 0;


class Queue {
  constructor() {
    this.items = [];
    this.max_length = 100;
    this.length = 0;
  }

  enqueue(element) {
    this.items.unshift(element);
    this.length += 1;
  }

  dequeue() {
    if(this.isEmpty()) {
      return "Underflow";
    }
    this.length -= 1;
    return this.items.pop();
  }

  isEmpty() {
    return this.items.length == 0;
  }

  getItem(i) {
    return this.items[i];
  }
}


class Wave {
  constructor(freq, weight, phase) {
    this.freq = freq / 3000;
    this.weight = weight;
    this.phase = phase;
  }
}

var wave_points = new Queue();
var waves = [];
var draw_wave_interval;

$(document).ready(function() {
  console.log( "ready!" );
  start_time = new Date();

  let canvas = $('#visuals')[0];

  canvas.style.width = 0.8 * parseInt($('#container').css('width'));
  canvas.style.height = canvas.style.width / 1.6;

  canvas.width = 0.8 * parseInt($('#container').css('width'));
  canvas.height = canvas.width / 1.6;

  width = canvas.width;
  height = canvas.height;

  updateWaves('sin');

  wave_points.max_length = width//3;

  startDraw();

});

function startDraw() {
  stopDraw();
  draw_wave_interval = setInterval(draw, 1000 / 30);
}

function stopDraw() {
  clearInterval(draw_wave_interval);
}

function updateWaves(preset) {
  waves = [];
  startDraw();

  if (preset == 'sin') {
    waves.push(new Wave(1, 1, 1));
  }

  if (preset == 'st') {
    for (i=1; i<6; i++) {
      let weight = (-2/(pi*i)) * ((-1)**i);
      waves.push(new Wave(i, weight, 1));
    }
  }

  if (preset == 'sq') {
    for (i=1; i<6; i++) {
      let n = ((2 * i) - 1);
      let weight = 4/(pi * n);
      waves.push(new Wave(n, weight, 1));
    }
  }

  if (preset == 'tri') {
    for (i=1; i<35; i++) {
      let n = ((2 * i) - 1);
      let weight = (4 * (1 - (-1)**n))/((pi * n)**2);
      waves.push(new Wave(n, weight, 1));
      console.log(n, weight);
    }
  }
 
}

function draw() {
  let canvas = $('#visuals');
  canvas.clearCanvas();

  let time = new Date() - start_time;

  let prevx = width/6, prevy = height/2, curx = 0, cury = 0;

  for (i=0; i<waves.length; i++) {
    let wave = waves[i];

    canvas.drawArc({
      strokeStyle: 'blue',
      strokeWidth: 2,
      x: prevx, y: prevy,
      radius: Math.abs(wave.weight * height/10),
      start:0,end:360
    })

    let angle = (time * 2 * pi * wave.freq) % (2*pi);

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

    canvas.drawArc({
      strokeStyle: "black",
      fillStyle: "black",
      x: prevx, y: prevy,
      radius: 2
    })
  }

  canvas.drawLine({
    strokeStyle: "black",
    strokeWidth: 1,
    rounded: true,
    x1: prevx, y1: prevy,
    x2: width/3, y2: prevy
  })

  if (wave_points.length >= wave_points.max_length) {
    wave_points.dequeue();
  }
  wave_points.enqueue(prevy);

//  let rad = (canvas[0].width * 2)/(3 * wave_points.max_length);
  let start_y_coor = wave_points.getItem(0);
  let start_x_coor = width/3;

  for (i=0; i<wave_points.length; i++) {
    let y_coor = wave_points.getItem(i);
    let x_coor = (width/3) + (i*2.5);
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
