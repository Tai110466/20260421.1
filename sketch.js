let capture;

function setup() {
  createCanvas(windowWidth, windowHeight);
  capture = createCapture(VIDEO);
  capture.hide(); // 隱藏預設在畫布下方產生的 video 標籤
}

function draw() {
  background('#e7c6ff');

  // 計算影像的大小（畫布寬高的 60%）
  let videoW = width * 0.6;
  let videoH = height * 0.6;

  // 計算置中座標
  let x = (width - videoW) / 2;
  let y = (height - videoH) / 2;

  // 繪製影像
  image(capture, x, y, videoW, videoH);
}
