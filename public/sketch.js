let video;
let classifier;
let modelURL = './model/';
let label = "hazırlanıyor...";
let sonucBir,sonucIki,sonucUc,sonucDort,sonucBes;

function preload() {
  classifier = ml5.imageClassifier('./model/model.json');
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  classifyVideo();
  sonucBir = createP('Yukleme baslatiliyor...');
  sonucIki = createP('Yukleme baslatiliyor...');
  sonucUc = createP('Yukleme baslatiliyor...');
  sonucDort = createP('Yukleme baslatiliyor...');
  sonucBes = createP('Yukleme baslatiliyor...');
}

function classifyVideo() {
  classifier.classify(video, gotResults);
}

function draw() {
  background(0);
  image(video, 0, 0);
  textSize(2);
  fill(255);
  text(label, width / 2, height - 16);
}

function gotResults(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  label = results[0].label;
  console.log('En Yakın Komşu : '+label);
  sonucBir.html(`Benzerlik Tahmin Oranı: ${results[0].label} Harfi için ${nf(results[0].confidence,0,5)}`);
  sonucIki.html(`Benzerlik Tahmin Oranı: ${results[1].label} Harfi için  ${nf(results[1].confidence,0,5)}`);
  sonucUc.html(`Benzerlik Tahmin Oranı: ${results[2].label} Harfi için ${nf(results[2].confidence,0,5)}`);
  sonucDort.html(`Benzerlik Tahmin Oranı: ${results[3].label} Harfi için ${nf(results[3].confidence,0,5)}`);
  sonucBes.html(`Benzerlik Tahmin Oranı: ${results[4].label} Harfi için ${nf(results[4].confidence,0,5)}`);
  classifyVideo();
}
