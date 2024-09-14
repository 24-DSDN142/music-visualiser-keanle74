let triImg;
let firstRun = true;
let counterThreshold = 320;
let stars = [];
let starCount = 200;
let minDistance = 50;
let imageScale = 1;

function draw_one_frame(words, vocal, drum, bass, other, counter) {
  createCanvas(1920, 1080);

  // Background color transition
  let startColor = color(0, 0, 0); // Black
  let midColor1 = color(0, 0, 50); // Darker blue
  let midColor2 = color(60, 0, 60); // Darker purple
  let endColor = color(150, 0, 80); // Darker pink

  // Transition between colors based on vocal volume
  let bgColor;
  if (vocal <= 50) {
    bgColor = lerpColor(startColor, midColor1, vocal / 50);
  } else {
    bgColor = lerpColor(midColor1, midColor2, (vocal - 50) / 50);
    bgColor = lerpColor(bgColor, endColor, (vocal - 50) / 50);
  }

  // Flash effect for high vocal volume
  let flashThreshold = 75; // Threshold for flickering effect
  let flashIntensity = vocal > flashThreshold ? map(vocal, flashThreshold, 100, 0.2, 0.8) : 0;
  let flickerColor = lerpColor(bgColor, color(255, 255, 255), flashIntensity); // White flash

  background(flickerColor);

  push();
  let bgShiftX = map(sin(frameCount * 0.001), -1, 1, -50, 50);
  let bgShiftY = map(cos(frameCount * 0.001), -1, 1, -50, 50);
  translate(bgShiftX, bgShiftY);
  pop();

  if (firstRun) {
    triImg = loadImage('Asset1.png');
    firstRun = false;
    generateStars();
  }

  function generateStars() {
    let attempts = 0;

    while (stars.length < starCount && attempts < starCount * 10) {
      let starX = random(0, width);
      let starY = random(0, height);
      let starScale = random(0.1, 0.3);
      let starRadius = 25 * starScale;

      let overlapping = false;
      for (let i = 0; i < stars.length; i++) {
        let otherStar = stars[i];
        let distance = dist(starX, starY, otherStar.x, otherStar.y);
        let combinedRadius = starRadius + (25 * otherStar.scale) + minDistance;
        if (distance < combinedRadius) {
          overlapping = true;
          break;
        }
      }

      if (!overlapping) {
        stars.push({ x: starX, y: starY, scale: starScale, originalX: starX, originalY: starY });
      }

      attempts++;
    }
  }

  for (let i = 0; i < stars.length; i++) {
    let star = stars[i];

    if (counter > counterThreshold) {
      let xMoveAmount = map(drum, 0, 100, -50, 50);
      let yMoveAmount = map(other, 0, 100, -50, 50);

      star.x = star.originalX + sin(frameCount * 0.1) * xMoveAmount;
      star.y = star.originalY + sin(frameCount * 0.1) * yMoveAmount;
    }

    // Update star color based on vocal volume
    let starColor = color(map(other, 0, 100, 0, 255), map(other, 0, 100, 0, 255), 255);

    Star(star.x, star.y, star.scale, vocal);
  }

  let pulse = map(bass, 0, 100, 0.9, 1.1);
  push();
  translate(width / 2, height / 2);
  scale(pulse);
  noFill();
  stroke(255, 100);
  ellipse(0, 0, 600, 600);
  pop();

  push();
  translate(960, 540);
  if (counter < counterThreshold) {
    imageScale = map(counter, 0, counterThreshold, 0.01, 1.25);
  } else {
    imageScale = 1.25;
  }
  scale(imageScale);
  imageMode(CENTER);
  image(triImg, 0, 0);
  pop();
}

function Star(starX = 0, starY = 0, starScale = 1, vocal) {
  push();
  translate(starX, starY);
  scale(starScale);

  let minColor = color(0); // Black
  let midColor = color(255, 255, 0); // Yellow
  let maxColor = color(255); // White

  // Map vocal levels to color range
  let starColor;
  if (vocal <= 33) {
    starColor = lerpColor(minColor, midColor, vocal / 33);
  } else if (vocal <= 66) {
    starColor = lerpColor(midColor, maxColor, (vocal - 33) / 33);
  } else {
    starColor = lerpColor(maxColor, color(255, 255, 255), (vocal - 66) / 34); // Fade to white at highest levels
  }

  fill(starColor);
  stroke(starColor);
  ellipse(0, 0, 25, 25);
  strokeWeight(4);
  line(0, -50, 0, 50);
  line(-50, 0, 50, 0);
  line(25, -25, -25, 25);
  line(-25, -25, 25, 25);

  pop();
}













 















  //  // vocal bar is red
  //  fill(200, 0, 0);
  //  rect(bar_pos_x, height / 2 + 1 * bar_spacing, 4 * vocal, bar_height);
  //  fill(0);
  //  text("vocals", bar_pos_x, height / 2 + 1 * bar_spacing + 8);
 
  //  // drum bar is green
  //  fill(0, 200, 0);
  //  rect(bar_pos_x, height / 2 + 2 * bar_spacing, 4 * drum, bar_height);
  //  fill(0);
  //  text("drums", bar_pos_x, height / 2 + 2 * bar_spacing + 8);
 
  //  // bass bar is blue
  //  fill(50, 50, 240);
  //  rect(bar_pos_x, height / 2 + 3 * bar_spacing, 4 * bass, bar_height);
  //  fill(0);
  //  text("bass", bar_pos_x, height / 2 + 3 * bar_spacing + 8);
 
  //  // other bar is white
  //  fill(200, 200, 200);
  //  rect(bar_pos_x, height / 2 + 4 * bar_spacing, 4 * other, bar_height);
  //  fill(0);
  //  text("other", bar_pos_x, height / 2 + 4 * bar_spacing + 8);
  //  fill(255, 255, 0);
 
  //  // display "words"
  //  textAlign(CENTER);
  //  textSize(vocal);
  //  text(words, width/2, height/3);
