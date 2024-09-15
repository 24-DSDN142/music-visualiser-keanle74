let triImg;
let firstRun = true; // Variable to track if it's the first time running
let counterThreshold = 300; // Time threshold to control image scaling
let stars = []; // Array to hold star objects
let starCount = 200; // Total number of stars to generate
let minDistance = 50; // Minimum distance between stars to avoid overlap
let imageScale = 1; // Variable to control the scaling of the central image

function draw_one_frame(words, vocal, drum, bass, other, counter) {
  createCanvas(1920, 1080); // Create a canvas of 1920x1080 pixels

  // Background color transition setup
  let startColor = color(0, 0, 0); // Black color for the background start
  let midColor1 = color(0, 0, 50); // Darker blue color
  let midColor2 = color(60, 0, 60); // Darker purple color
  let endColor = color(150, 0, 80); // Darker pink color for the background end

  // Transition between colors based on vocal volume
  let bgColor;
  if (vocal <= 50) {
    bgColor = lerpColor(startColor, midColor1, vocal / 50); // Smooth transition from black to dark blue
  } else {
    bgColor = lerpColor(midColor1, midColor2, (vocal - 50) / 50); // Transition from dark blue to purple
    bgColor = lerpColor(bgColor, endColor, (vocal - 50) / 50); // Transition from purple to dark pink
  }

  // Flash effect for high vocal volume
  let flashThreshold = 75; // Threshold for flickering effect when vocals are high
  let flashIntensity = vocal > flashThreshold ? map(vocal, flashThreshold, 100, 0.2, 0.8) : 0; // Map vocal intensity to flash effect
  let flickerColor = lerpColor(bgColor, color(255, 255, 255), flashIntensity); // White flash effect based on vocal intensity

  background(flickerColor); // Set the background with the calculated flicker effect

  push();
  let bgShiftX = map(sin(frameCount * 0.001), -1, 1, -50, 50); // Horizontal background shift based on time
  let bgShiftY = map(cos(frameCount * 0.001), -1, 1, -50, 50); // Vertical background shift based on time
  translate(bgShiftX, bgShiftY); // Apply the shift to the background
  pop();

  // Load image and generate stars on the first run
  if (firstRun) {
    triImg = loadImage('Asset1.png'); // Load the image
    firstRun = false;
    generateStars(); // Call the function to generate the star positions
  }

  // Function to generate stars
  function generateStars() {
    let attempts = 0; // Attempt counter to avoid infinite loops

    // Generate stars until the desired number is reached or attempts exceed a limit
    while (stars.length < starCount && attempts < starCount * 10) {
      let starX = random(0, width); // Random x position
      let starY = random(0, height); // Random y position
      let starScale = random(0.1, 0.3); // Random scale for each star
      let starRadius = 25 * starScale; // Radius of the star based on scale

      let overlapping = false; // Check for overlap with other stars
      for (let i = 0; i < stars.length; i++) {
        let otherStar = stars[i];
        let distance = dist(starX, starY, otherStar.x, otherStar.y); // Distance between stars
        let combinedRadius = starRadius + (25 * otherStar.scale) + minDistance; // Combined radius with the minimum distance
        if (distance < combinedRadius) {
          overlapping = true; // If overlap is found, mark as overlapping
          break;
        }
      }

      // If no overlap, add the star to the array
      if (!overlapping) {
        stars.push({ x: starX, y: starY, scale: starScale, originalX: starX, originalY: starY });
      }

      attempts++; // Increment the attempt counter
    }
  }

  // Loop through all the stars and update their positions and colors
  for (let i = 0; i < stars.length; i++) {
    let star = stars[i];

    // Move stars based on the drum and other sound levels if counter exceeds the threshold
    if (counter > counterThreshold) {
      let xMoveAmount = map(drum, 0, 100, -50, 50); // Horizontal movement based on drum sound
      let yMoveAmount = map(other, 0, 100, -50, 50); // Vertical movement based on other sound

      // Apply the movement to the star's position
      star.x = star.originalX + sin(frameCount * 0.1) * xMoveAmount;
      star.y = star.originalY + sin(frameCount * 0.1) * yMoveAmount;
    }

  
    Star(star.x, star.y, star.scale, vocal); 
  }

  // Create a pulse effect in the center based on the bass level
  let pulse = map(bass, 0, 100, 0.8, 1.2); // Map bass level to pulse size
  push();
  translate(width / 2, height / 2); // Move to the center of the canvas
  scale(pulse); // Apply the scale based on bass
  noFill();
  stroke(255, 100); // Semi-transparent white stroke
  ellipse(0, 0, 600, 600); // Draw a pulsing circle
  pop();

  // Draw and scale the central image based on vocal and time
  push();
  translate(960, 540); // Move to the center of the canvas

  // Scale up the image during the chorus based on vocal level when the counter reaches 1 minute 20 seconds 
  if (counter >= 4860) { 
    imageScale = map(vocal, 50, 100, 1.25, 2.0); // Scale based on vocal intensity during the chorus
  } else if (counter < counterThreshold) {
    imageScale = map(counter, 0, counterThreshold, 0.01, 1.25); // Smooth scaling up at the start
  } else {
    imageScale = 1.25; // Default scale when neither condition is met
  }

  scale(imageScale); // Apply the scaling transformation
  imageMode(CENTER); // Set image mode to center
  image(triImg, 0, 0); // Draw the central image
  pop();
}

// Function to draw a star with lines at a specific position, scale, and color based on vocal level
function Star(starX = 0, starY = 0, starScale = 1, vocal) {
  push();
  translate(starX, starY); // Move to the star's position
  scale(starScale); // Apply the star's scale

  // Define color stops for the star based on vocal level
  let minColor = color(0); // Black for lowest vocal level
  let midColor = color(255, 255, 0); // Yellow for mid vocal levels
  let maxColor = color(255); // White for high vocal levels

  // Map vocal levels to the color range
  let starColor;
  if (vocal <= 33) {
    starColor = lerpColor(minColor, midColor, vocal / 33); // Transition from black to yellow
  } else if (vocal <= 66) {
    starColor = lerpColor(midColor, maxColor, (vocal - 33) / 33); // Transition from yellow to white
  } else {
    starColor = lerpColor(maxColor, color(255, 255, 255), (vocal - 66) / 34); // Fade to white at highest levels
  }

  fill(starColor); // Set the fill color
  stroke(starColor); // Set the stroke color
  ellipse(0, 0, 25, 25); // Draw the star (as a small ellipse)
  strokeWeight(4); // Set stroke weight for the cross lines
  line(0, -50, 0, 50); // Draw vertical line through the star
  line(-50, 0, 50, 0); // Draw horizontal line through the star
  line(25, -25, -25, 25); // Diagonal line from top-right to bottom-left
  line(-25, -25, 25, 25); // Diagonal line from top-left to bottom-right

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
