// 全域變數
let shapes = [];
let song;
let amplitude;
// 外部定義的二維陣列，做為多邊形頂點的基礎座標
let points = [
  [-2, -4],
  [2, -4],
  [4, 0],
  [2, 4],
  [-2, 4],
  [-4, 0]
];

function preload() {
  // 在程式開始前預載入外部音樂資源
  song = loadSound('midnight-quirk-255361.mp3');
}

function setup() {
  // 初始化畫布
  createCanvas(windowWidth, windowHeight);

  // 初始化 Amplitude 物件
  amplitude = new p5.Amplitude();

  // 播放音樂 (根據描述：載入音樂並循環播放)
  // 注意：現代瀏覽器可能需要使用者互動才能播放音訊，因此也加入了 mousePressed
  if (song.isLoaded()) {
    song.loop();
  }

  // 產生 10 個形狀物件
  for (let i = 0; i < 10; i++) {
    // 透過 map() 讀取全域陣列 points，將每個頂點的 x 與 y 分別乘上 10 到 30 之間的隨機倍率來產生變形
    let shapePoints = points.map(pt => {
      return [
        pt[0] * random(10, 30),
        pt[1] * random(10, 30)
      ];
    });

    let shape = {
      x: random(0, windowWidth),
      y: random(0, windowHeight),
      dx: random(-3, 3),
      dy: random(-3, 3),
      scale: random(1, 10),
      color: color(random(255), random(255), random(255)),
      points: shapePoints
    };

    shapes.push(shape);
  }
}

function draw() {
  // 設定背景顏色
  background('#ffcdb2');

  // 設定邊框粗細
  strokeWeight(2);

  // 取得當前音量大小（數值介於 0 到 1）
  let level = amplitude.getLevel();

  // 映射音量到縮放倍率
  let sizeFactor = map(level, 0, 1, 0.5, 2);

  // 更新與繪製每個 shape
  for (let shape of shapes) {
    // 位置更新
    shape.x += shape.dx;
    shape.y += shape.dy;

    // 邊緣反彈檢查
    if (shape.x < 0 || shape.x > windowWidth) {
      shape.dx *= -1;
    }
    if (shape.y < 0 || shape.y > windowHeight) {
      shape.dy *= -1;
    }

    // 設定外觀
    fill(shape.color);
    stroke(shape.color);

    // 座標轉換與縮放
    push();
    translate(shape.x, shape.y);
    scale(sizeFactor);

    // 繪製多邊形
    beginShape();
    for (let pt of shape.points) {
      vertex(pt[0], pt[1]);
    }
    endShape(CLOSE);

    // 狀態還原
    pop();
  }
}

// 點擊滑鼠以確保音訊在瀏覽器限制下能開始播放
function mousePressed() {
  userStartAudio(); // 確保瀏覽器音訊環境已啟動
  if (song.isLoaded() && !song.isPlaying()) {
    song.loop();
  }
}
