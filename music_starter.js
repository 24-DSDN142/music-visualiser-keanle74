let triImg
let firstRun = true
let counterThreshold = 320;
let stars = [];
let starCount = 200;
let minDistance = 50;
let imageScale = 1;

// vocal, drum, bass, and other are volumes ranging from 0 to 100
function draw_one_frame(words, vocal, drum, bass, other, counter) {
createCanvas(1920,1080);
background(0)
if(firstRun){
triImg = loadImage('Asset1.png');
firstRun = false
generateStars()
}

function generateStars() {
  let attempts = 0; // Keep track of attempts to prevent infinite loops

  while (stars.length < starCount && attempts < starCount * 10) {
    let starX = random(0, width);     // Random x position within canvas
    let starY = random(0, height);    // Random y position within canvas
    let starScale = random(0.1, 0.3); // Random scale for each star
    let starRadius = 25 * starScale;  // Radius of the star, considering its scale
    
    // Check if this new star is too close to any existing star
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
    
    // If the star isn't overlapping, add it to the list
    if (!overlapping) {
      stars.push({ x: starX, y: starY, scale: starScale, originalX: starX, originalY: starY });
    }

    attempts++;
  }
}

for (let i = 0; i < stars.length; i++) {
  let star = stars[i];
  
  // After counterThreshold is reached, stars start moving based on drum and bass
  if (counter > counterThreshold) {
    let xMoveAmount = map(drum, 0, 100, -50, 50);  
    let yMoveAmount = map(drum, 0, 100, -50, 50);  
    
    // Oscillate around the original x and y positions
    star.x = star.originalX + sin(frameCount * 0.1) * xMoveAmount;
    star.y = star.originalY + sin(frameCount * 0.1) * yMoveAmount;

    // Ensure stars stay within the canvas
    star.x = constrain(star.x, 0, width);
    star.y = constrain(star.y, 0, height);
  }

  // Draw the star
  Star(star.x, star.y, star.scale);
  
}


push();

  translate(960, 540)
  if (counter < counterThreshold){
    imageScale = map(counter, 0, counterThreshold, 0.01, 1.25); // Scale from 0.01 to 0.1
  } else {
    imageScale = 1.25; // Fixed size after threshold
  }
  scale(imageScale);
  imageMode(CENTER);
  image(triImg, 0, 0); // Draw the image centered on the canvas
  pop();
}





function Star(starX= 0,starY = 0,starScale = 1){
  push();
  translate(starX,starY);
  scale(starScale);
  fill(255)
  ellipse(0,0,25,25)
  
  strokeWeight(4)
  stroke(255)
  line(0,-50,0,50)
  line(-50,0,50,0)
  line(25,-25,-25,25)
  line(-25,-25,25,25)
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
