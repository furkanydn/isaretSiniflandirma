const epochs = 125;
const batch = 64;
const learnable = 0.001;
const training = 64.52;
var express = require('express');
var app = express();
var executed = false;

var server = app.listen(process.env.PORT || 3000, sunucu);

function logs() {
  console.log('Eğitim Tur Sayısı(Epoch): '+epochs);
  console.log('Parçalanmış Girdi Sayısı(Batch): '+batch);
  console.log('Öğrenim Değeri (Learning Rate): ' +learnable);
  console.log('Eğitim Süresi (Training Time): '+training);
}

function sunucu() {
  var url = 'localhost';
  var port = server.address().port;
  if(!executed){
    executed = true;
    setTimeout(function(){
      console.log('Uygulama http://'+url+ ':' + port + ' da başlatıldı');
    },1500);
    logs();
  }
}

app.use(express.static('public'));