// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let circleX, circleY; // 圓的初始位置
let circleRadius = 50; // 圓的半徑
let isTrackingIndex = false; // 是否追蹤食指
let isTrackingThumb = false; // 是否追蹤大拇指
let trails = []; // 用於存儲圓心的軌跡

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
  createCanvas(640, 480); // 產生一個畫布，640*480
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // 圓的初始位置設置在畫布中央
  circleX = width / 2;
  circleY = height / 2;

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  image(video, 0, 0);

  // 繪製保留的軌跡
  for (let trail of trails) {
    stroke(trail.color);
    strokeWeight(2);
    line(trail.x1, trail.y1, trail.x2, trail.y2);
  }

  // 繪製圓
  fill(0, 0, 255, 150); // 半透明藍色
  noStroke();
  ellipse(circleX, circleY, circleRadius * 2, circleRadius * 2);

  // 確保至少檢測到一隻手
  if (hands.length > 0) {
    isTrackingIndex = false; // 重置追蹤狀態
    isTrackingThumb = false;

    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // 繪製手部關鍵點
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];

          // 根據左右手設置顏色
          if (hand.handedness == "Left") {
            fill(255, 0, 255);
          } else {
            fill(255, 255, 0);
          }

          noStroke();
          circle(keypoint.x, keypoint.y, 16);
        }

        // 繪製關鍵點之間的連線
        drawLines(hand.keypoints, 0, 4);
        drawLines(hand.keypoints, 5, 8);
        drawLines(hand.keypoints, 9, 12);
        drawLines(hand.keypoints, 13, 16);
        drawLines(hand.keypoints, 17, 20);

        // 檢測食指（keypoint 8）是否碰觸圓
        let indexFinger = hand.keypoints[8];
        let dIndex = dist(indexFinger.x, indexFinger.y, circleX, circleY);
        if (dIndex < circleRadius) {
          // 如果碰觸，讓圓跟隨食指移動，並畫紅色軌跡
          trails.push({
            x1: circleX,
            y1: circleY,
            x2: indexFinger.x,
            y2: indexFinger.y,
            color: [255, 0, 0], // 紅色
          });
          circleX = indexFinger.x;
          circleY = indexFinger.y;
          isTrackingIndex = true;
        }

        // 檢測大拇指（keypoint 4）是否碰觸圓
        let thumb = hand.keypoints[4];
        let dThumb = dist(thumb.x, thumb.y, circleX, circleY);
        if (dThumb < circleRadius) {
          // 如果碰觸，讓圓跟隨大拇指移動，並畫綠色軌跡
          trails.push({
            x1: circleX,
            y1: circleY,
            x2: thumb.x,
            y2: thumb.y,
            color: [0, 255, 0], // 綠色
          });
          circleX = thumb.x;
          circleY = thumb.y;
          isTrackingThumb = true;
        }
      }
    }
  }

  // 如果手指未接觸圓，停止畫軌跡
  if (!isTrackingIndex && !isTrackingThumb) {
    noStroke();
  }
}

// Helper function to draw lines between keypoints
function drawLines(keypoints, startIdx, endIdx) {
  stroke(0, 255, 0); // 設置線條顏色
  strokeWeight(2);   // 設置線條粗細
  for (let i = startIdx; i < endIdx; i++) {
    let kp1 = keypoints[i];
    let kp2 = keypoints[i + 1];
    line(kp1.x, kp1.y, kp2.x, kp2.y);
  }
}
