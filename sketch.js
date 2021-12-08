// Declaring a "SerialPort" object
let serial;

// SerialPort name:
let portName = "/dev/tty.usbmodem14201";
let varMode = "none";

let smiley1, smiley2, smiley3;
let buttonSmiley1, buttonSmiley2, buttonSmiley3;
let happy, meh, sad;

let instructions;
let button;

let music;

let myFont;
let grabbed = false;
let shapeX;
let shapeY;

let startedAt;

const radius = 30;
const diameter = radius * 2;

let begin, middle, end;

let textXpos = 10;
let targettextXpos = 10;

let state = 0;
let mood = 0;

//Load images and background sound
function preload() {
  smiley1 = loadImage('Smiley1.png');
  smiley2 = loadImage('Smiley2.png');
  smiley3 = loadImage('Smiley3.png');

  happy = loadImage('happy.png');
  meh = loadImage('meh.png');
  sad = loadImage('sad.png');
  instructions = loadImage('mindcise.png');
  music = loadSound('music.mp3');
  myFont = loadFont('Myanmar.ttf');
}

//Runs one time initially 
function setup() {
  serial = new p5.SerialPort();
  createCanvas(1200, 800);
  // Frames displayed per second
  frameRate(30);
  // Start button
  button = createButton('START');
  button.style('color', '#bd5b00');
  button.style('background-color', 'transparent');
  button.position(545, 680);
  button.style('font-size', '30px');
  button.mousePressed(changeButtonState);
  //Image resizing
  smiley1.resize(100, 100); smiley2.resize(100, 100); smiley3.resize(100, 100);
  happy.resize(1200, 1000); meh.resize(1200, 1000); sad.resize(1200, 1000);
  instructions.resize(1200, 1000);

  //Bezier
  begin = createVector(100, 250);
  middle = createVector(300, 200);
  end = createVector(500, 150);

  shapeX = begin.x;
  shapeY = begin.y;

  //Mood buttons
  buttonSmiley1 = createButton('Great');
  buttonSmiley1.style('color', '#bd5b00');
  buttonSmiley1.style('background-color', 'transparent');
  buttonSmiley1.position(745, 270);
  buttonSmiley1.style('font-size', '20px');
  buttonSmiley1.mousePressed(function () { feelingTapped(1); });
  buttonSmiley1.hide();

  buttonSmiley2 = createButton('Neutral');
  buttonSmiley2.style('color', '#bd5b00');
  buttonSmiley2.style('background-color', 'transparent');
  buttonSmiley2.position(860, 270);
  buttonSmiley2.style('font-size', '20px');
  buttonSmiley2.mousePressed(function () { feelingTapped(2); });
  buttonSmiley2.hide();

  buttonSmiley3 = createButton('Bad');
  buttonSmiley3.style('color', '#bd5b00');
  buttonSmiley3.style('background-color', 'transparent');
  buttonSmiley3.position(993, 270);
  buttonSmiley3.style('font-size', '20px');
  buttonSmiley3.mousePressed(function () { feelingTapped(3); });
  buttonSmiley3.hide();

  //Supporting parameters for bezier ball
  t1 = createVector(150, 175);
  t2 = createVector(275, 175);
  t3 = createVector(325, 225);
  t4 = createVector(450, 225);

  //Code setup from Professor Cotter's example 
  // Get a list the ports available
  serial.list();

  // Assuming our Arduino is connected, open the connection to it
  serial.open(portName);

  // When you get a list of serial ports that are available
  serial.on("list", gotList);

  // When you some data from the serial port
  serial.on("data", gotData);

}

// Got the list of ports
function gotList(thelist) {
  print("List of Serial Ports:");
  // theList is an array of their names
  for (let i = 0; i < thelist.length; i++) {
    // Display in the console
    print(i + " " + thelist[i]);
  }
}

// Called when there is data available from the serial port
function gotData() {
  // read the incoming data
  let currentString = serial.readLine();

  // trim off trailing whitespace
  trim(currentString);

  // if the incoming string is empty, do no more
  if (!currentString) return;

  console.log(currentString);

  if (isNaN(currentString)) {
    if (currentString == "xpos") {
      varMode = "xpos";
    }
  } else {
    targettextXpos = currentString;
  }
}

function changeButtonState() {
  state = 1
  buttonSmiley1.show();
  buttonSmiley2.show();
  buttonSmiley3.show();
  button.hide();
  music.loop();
}

function draw() {
  if (state == 1) {
    if (!startedAt) {
      startedAt = int(millis() / 1000);
    }
    textXpos = ease(textXpos, targettextXpos, 0.03)
    background(220);
    //Converting time to seconds
    let currentTime = int(millis() / 1000) - startedAt;

    // Four rectangles
    noStroke();
    fill(216, 223, 213);
    rect(0, 0, 600, 400);
    fill(236, 204, 156);
    rect(600, 0, 600, 400);
    fill(216, 223, 213);
    rect(600, 400, 600, 650);
    fill(236, 204, 156);
    rect(0, 400, 600, 500);

    //Details for timer
    textSize(50);
    fill(44, 110, 73);
    textFont(myFont);
    text("MINDFUL TIME SPENT: " + currentTime, 680, 600);

    //Rectangle 1 - Bezier curve w/ball
    noFill();
    stroke(254, 254, 227);

    strokeWeight(10);
    beginShape();
    bezier(begin.x, begin.y, middle.x, middle.y - 300, middle.x, middle.y + 300, end.x, end.y);
    endShape();
    noStroke();
    fill(44, 110, 73);
    ellipse(shapeX, shapeY, diameter, diameter);
    noStroke();
    textSize(35);
    fill(44, 110, 73);
    textFont(myFont);
    text("Breathe in/out", 130, 70);
    text("Breathe out/in", 300, 350);

    //Rectangle 2 - Mood button selection
    textSize(35);
    fill(44, 110, 73);
    textFont(myFont);
    text("How did this make you feel?", 720, 70);

    image(smiley1, 730, 150);
    image(smiley2, 850, 150);
    image(smiley3, 970, 150);

    //Rectangle 3 - Arduino potentiometer to inhale and exhale
    fill(44, 110, 73);
    ellipse(300, 600, textXpos, textXpos);
    noStroke();
    textSize(35);
    fill(44, 110, 73);
    textFont(myFont);
    text("Inhale", 100, 450);
    text("Exhale", 400, 770);

  }
  else if (state == 2) {
    if (mood == 1) {
      image(happy, 0, 0);
    } else if (mood == 2) {
      image(meh, 0, 0);
    } else {
      image(sad, 0, 0);
    }
  }
  else {
    image(instructions, 0, 0);
  }
}

//Smooth and ease the potentiometer expanding and contracting the ellipse
function ease(a, b, pct) {
  return a * (1 - pct) + (b * pct);
}

//Grabbing and dropping the ball along the bezier curve
function mousePressed() {
  grabbed = true
  let d = dist(mouseX, mouseY, shapeX, shapeY);
  if (d < radius) {
    grabbed = true;
  } else {
    grabbed = false;
  }
}

function mouseReleased() {
  grabbed = false
}

function mouseDragged() {
  if (grabbed && checkBoundary() && checkCurve()) {
    shapeX = mouseX;
    shapeY = mouseY;
  }
}

//Limiting ball to move too far off of the bezier curve
function checkCurve() {
  if (mouseX > t1.x && mouseX < t2.x && mouseY > t1.y) {
    return false;
  }

  if (mouseX > t3.x && mouseX < t4.x && mouseY < t3.y - 5) {
    return false;
  }
  return true;
}

function checkBoundary() {
  return mouseX > begin.x && mouseX < end.x && mouseY > end.y - 50 && mouseY < begin.y + 50;
}

// Mood buttons tapped
function feelingTapped(moodTapped) {
  state = 2;
  mood = moodTapped;
  buttonSmiley1.hide();
  buttonSmiley2.hide();
  buttonSmiley3.hide();
}