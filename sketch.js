let capture;
let overlay;
let hearts = []; // 儲存愛心物件的陣列

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
  image(capture, 0, 0, videoW, videoH);
  
  // 將 overlay 顯示在視訊畫面的上方
  if (overlay) {
    image(overlay, 0, 0, videoW, videoH);
  }
  pop();
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
