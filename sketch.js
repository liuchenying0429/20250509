// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480); //產生一個畫布，640*480
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  image(video, 0, 0);

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // Loop through keypoints and draw circles
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];

          // Color-code based on left or right hand
          if (hand.handedness == "Left") {
            fill(255, 0, 255);
          } else {
            fill(255, 255, 0);
          }

          noStroke();
          circle(keypoint.x, keypoint.y, 16);
        }

        // Draw lines connecting keypoints in groups
        drawLines(hand.keypoints, 0, 4);  // Connect keypoints 0 to 4
        drawLines(hand.keypoints, 5, 8);  // Connect keypoints 5 to 8
        drawLines(hand.keypoints, 9, 12); // Connect keypoints 9 to 12
        drawLines(hand.keypoints, 13, 16); // Connect keypoints 13 to 16
        drawLines(hand.keypoints, 17, 20); // Connect keypoints 17 to 20
      }
    }
  }
}

// Helper function to draw lines between keypoints
function drawLines(keypoints, startIdx, endIdx) {
  stroke(0, 255, 0); // Set line color
  strokeWeight(2);   // Set line thickness
  for (let i = startIdx; i < endIdx; i++) {
    let kp1 = keypoints[i];
    let kp2 = keypoints[i + 1];
    line(kp1.x, kp1.y, kp2.x, kp2.y);
  }
}
