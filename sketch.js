let capture;
let overlay;
let hearts = []; // 儲存愛心物件的陣列
let saveBtn; // 儲存按鈕物件

function setup() {
  createCanvas(windowWidth, windowHeight);
  capture = createCapture(VIDEO);
  capture.hide(); // 隱藏預設在畫布下方產生的 video 標籤

  saveBtn = createButton('擷取圖片');
  saveBtn.position(20, 20); // 設定按鈕在視窗左上角
  saveBtn.mousePressed(takeScreenshot);
}

function draw() {
  background('#e7c6ff');

  // 當攝影機準備好且 overlay 尚未建立時，建立一個與攝影機同寬高的畫布
  if (!overlay && capture.width > 0) {
    overlay = createGraphics(capture.width, capture.height);
  }

  if (overlay) {
    overlay.clear(); // 清除上一幀內容，保持透明背景
    
    // 每隔幾幀產生一個新愛心
    if (frameCount % 6 === 0) {
      hearts.push({
        x: random(overlay.width),
        y: overlay.height + 20,
        size: random(15, 30),
        speed: random(1, 3),
        opacity: 255,
        color: [random(200, 255), random(180, 230), random(200, 255)] // 隨機粉彩色系 (RGB)
      });
    }

    // 更新並繪製所有愛心
    for (let i = hearts.length - 1; i >= 0; i--) {
      let h = hearts[i];
      h.y -= h.speed;     // 往上升
      h.opacity -= 2;     // 逐漸透明
      drawHeart(overlay, h.x, h.y, h.size, h.opacity, h.color);
      
      // 移除完全透明的愛心，優化效能
      if (h.opacity <= 0) hearts.splice(i, 1);
    }
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

  // 製作黑白馬賽克效果
  let stepSize = 20; // 設定單位大小為 20x20
  capture.loadPixels();

  // 確保攝影機像素資料已載入
  if (capture.pixels.length > 0) {
    for (let cy = 0; cy < capture.height; cy += stepSize) {
      for (let cx = 0; cx < capture.width; cx += stepSize) {
        // 取得該單位起始點的像素索引
        let i = (cx + cy * capture.width) * 4;
        let r = capture.pixels[i];
        let g = capture.pixels[i + 1];
        let b = capture.pixels[i + 2];

        // 根據需求計算：(R+G+B)/3 取得黑白數值
        let grayValue = (r + g + b) / 3;

        fill(grayValue);
        noStroke();

        // 將視訊原始座標映射到畫布上顯示的比例與位置
        let drawX = map(cx, 0, capture.width, 0, videoW);
        let drawY = map(cy, 0, capture.height, 0, videoH);
        let drawW = map(stepSize, 0, capture.width, 0, videoW);
        let drawH = map(stepSize, 0, capture.height, 0, videoH);

        rect(drawX, drawY, drawW, drawH);
      }
    }
  }
  
  // 將 overlay 顯示在視訊畫面的上方
  if (overlay) {
    image(overlay, 0, 0, videoW, videoH);
  }
  pop();
}

// 擷取畫面並儲存的函式
function takeScreenshot() {
  // 重新計算視訊區域的座標與大小（需與 draw 函式中的邏輯一致）
  let videoW = width * 0.6;
  let videoH = height * 0.6;
  let x = (width - videoW) / 2;
  let y = (height - videoH) / 2;

  // 使用 get 取得畫布上特定區域的影像
  let snapshot = get(x, y, videoW, videoH);
  
  // 儲存為 jpg 檔案
  snapshot.save('my_capture', 'jpg');
}

// 繪製愛心的輔助函式
function drawHeart(pg, x, y, size, opacity, col) {
  pg.push();
  pg.fill(col[0], col[1], col[2], opacity);
  pg.noStroke();
  pg.beginShape();
  pg.vertex(x, y);
  pg.bezierVertex(x - size, y - size, x - size * 1.5, y + size / 2, x, y + size);
  pg.bezierVertex(x + size * 1.5, y + size / 2, x + size, y - size, x, y);
  pg.endShape(CLOSE);
  pg.pop();
}
