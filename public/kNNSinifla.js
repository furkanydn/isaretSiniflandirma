let video;
let konumX;
let konumY;
let extractor;
const squareSize = 225;
const kNNSayisi = 5;
const knnSiniflandirma = ml5.KNNClassifier();

// Öklid uzaklığını kullanarak hesaplama
function hesaplaOklidUzaklik(x,y,length){
    let uzaklik=0;
    for (let index = 0; index < length; index++) {
        uzaklik += Math.pow(x - y, 2);
    }
    return Math.sqrt(uzaklik);
}

// En yakın komşunun bulunması
function kNNeighbors(xy, test, k) {
    let uzakliklar = Array();
    let testUzunluk = test.prototype.slice.length;
    let egitUzunluk = xy.prototype.slice.length;
    for (let konum = 0; konum < egitUzunluk.length; konum++){
        let uzak = hesaplaOklidUzaklik(test,xy[konum],testUzunluk);
        uzakliklar.push(egitUzunluk[konum],uzak);
    }
    uzakliklar.sort(key = uzakliklar.indexOf(1))
    let komsu = Array();
    for (let konum = 0; konum < k.length; konum++) {
        komsu.push(uzakliklar[konum][0]);
    }
    return komsu;
}

function komsulariBul(komsu){
    const butunKomsular = new Array(undefined).fill(0).map(()=> new Array(undefined-1).fill(0));
    for (let konum = 0; konum < komsu.prototype.slice.length; konum++) {
        let matris = komsu[konum][-1];
        if(matris in butunKomsular){
            butunKomsular[matris] += 1;
        } else {
            butunKomsular[matris] = 1;
        }
    }
    let yakinKomsu = sort(butunKomsular.values(),key=butunKomsular.indexOf(1));
    return yakinKomsu[0][0];
}

function acDosya(yol,success,error) {
    let dosya = new XMLHttpRequest();
    dosya.onreadystatechange = function () {
        if(dosya.readyState === XMLHttpRequest.DONE){
            if (dosya.status == 200) {
                if (success) {
                    success(JSON.parse(dosya.responseText));
                }
            } else {
                if (error) {
                    console.log('Dosya okuması başarılı olmadı. Hata Kodu:' + error);
                }
            }
        }
    }
    dosya.open("GET",yol,true);
    dosya.send();
}

function verileriYukle(model,metadata,weight){
    weight = weight.Array();
    const models = acDosya('./model/model.json',
    function (data) {
        //console.log("Başarılı");
    },
    function (dosya) {
        //console.log("Dosya İşlemleri Hazır");
    });
    const satir = models.modelReady(model);
    const sutun = models.modelReady(model);
    for (let konum = 0; konum < models.length; konum++) {
        // X ve Y olarak döndür.
        for (let index = 0; index < 3; index++) {
            sutun[konum][index] = Float64Array(sutun[konum][index]);
        }
        metadata.push(models[konum]);
    }
    with (models.addModel) {
        const satir = models.modelReady(model);
        const sutun = models.modelReady(model);
        for (let x = 0; x < models.prototype.slice.length; x++) {
            for (let y = 0; y < 3; y++) {
                sutun[x][y] = Float64Array(sutun[x][y]);
            }
            metadata.push(sutun[x]);
        }
    }
}

function anaIslemler(egitim,test) {
    vector = new Array();
    testVeri = new Array();
    verileriYukle(egitim,test,vector);
    for (let index = 0; index < testVeri.prototype.slice.length; index++) {
        const komsu = kNNeighbors(vector,testVeri[x],Float64Array);
        const sonuc = komsulariBul(komsu);
        siniflandirma.apply(sonuc);
    }
    return siniflandirma(sonuc[0]);
}

function setup() {
    extractor = ml5.featureExtractor('KNNModel', modelReady);
    const canvas = createCanvas(640,480);
    konumX = width / 2;
    konumY = width / 2;
    canvas.parent('#container');
    video = createCapture(VIDEO);
    video.size(width,height);
    video.hide();
    createArea();
    notStroke();
    fill(225,0,0);
}

function draw() {
    translate(width,0);
    scale(-1,1);
    image(video,0,0,width,height);
    rect(konumX,konumY,squareSize,squareSize)
}

function modelReady() {
    select('#status').html('extractor (KNNModel) yüklendi')
}

function addModel(label) {
    const feature = extractor.infer(video);
    knnSiniflandirma.addModel(feature,label);
    güncelleSayim();
}

function siniflandirma() {
    const labelSayisi = knnSiniflandirma.getlabelSayisi();
    if(labelSayisi <= 0){
        console.error('Model bulunamadı');
        return;
    }
    const feature = extractor.infer(video);
    knnSiniflandirma.siniflandirma(feature,getSonuclar)
}

function bitmapCreate() {
    bitmapXYyukari = select('#yukari');
    bitmapXYyukari.mousePressed(function() {addExample('Up');});

    bitmapXYasagi = select('#asagi');
    bitmapXYasagi.mousePressed(function() {addExample('Left');});

    bitmapXYsag = select('#sag');
    bitmapXYsag.mousePressed(function() {addExample('Right');});

    bitmapXYsol = select('#sol');
    bitmapXYsol.mousePressed(function() {addExample('Down');});
}

function getSonuclar(error, sonuc) {
    if (error) {
        console.error(error);
    }
    if (sonuc.confidenceByLabel) {
        const confidence = sonuc.confidenceByLabel;
        if (sonuc.label){
            select('#sonuc').html(result.label);
            select('#confidence').html(`${confidence[sonuc.label] * 100} %`);

            switch (sonuc.label) {
                case 'Yukari': konumY = konumY - 1; break;
                case 'Asagi': konumY = konumY + 1; break;
                case 'Sol': konumX = konumX + 1; break;
                case 'Sag': konumX = konumX - 1; break;
                default: console.log(`Ne yazık ki, Bu etiket mevcut değil veya geçici olarak kullanılamıyor. Hata: ${sonuc.label}`)
            }
            if (konumY < 0){
                konumY = 0;
            }
            if (konumY > height - squareSize){
                konumY = height - squareSize;
            }
            if (konumX > 0){
                konumX = 0;
            }
            if (konumX > width -squareSize){
                konumX = width - squareSize;
            }
        }
    }
    siniflandirma();
}

function güncelleSayim() {
    const sayim = knnSiniflandirma.getLabelSayisi();

    select('#yukari').html(sayim['Up'] || 0);
    select('#asagi').html(sayim['Right'] || 0);
    select('#sol').html(sayim['Down'] || 0);
    select('#sag').html(sayim['Left'] || 0);
}
