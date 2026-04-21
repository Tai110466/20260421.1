let capture;
let overlay;

function setup() {
  createCanvas(windowWidth, windowHeight);
  capture = createCapture(VIDEO);
  capture.hide(); // 隱藏預設在畫布下方產生的 video 標籤
}

function draw() {
  background('#e7c6ff');

  // 當攝影機準備好且 overlay 尚未建立時，建立一個與攝影機同寬高的畫布
  if (!overlay && capture.width > 0) {
    overlay = createGraphics(capture.width, capture.height);
  }

  if (overlay) {
    overlay.clear(); // 清除上一幀內容，保持透明背景
    // 你可以在這裡繪製任何想顯示在視訊上方的內容
  }

  // 計算影像的大小（畫布寬高的 60%）
  let videoW = width * 0.6;
  let videoH = height * 0.6;

  // 計算置中座標
  let x = (width - videoW) / 2;
  let y = (height - videoH) / 2;

  // 繪製影像並修正左右顛倒（鏡像處理）
  push();
  translate(x + videoW, y); 
  scale(-1, 1);
  image(capture, 0, 0, videoW, videoH);
  
  // 將 overlay 顯示在視訊畫面的上方
  if (overlay) {
    image(overlay, 0, 0, videoW, videoH);
  }
  pop();
}
