import '@tensorflow/tfjs-backend-webgl';
import * as automl from '@tensorflow/tfjs-automl';

const MODEL_URL = 'public/model/model.json';

async function run() {
    const model = await automl.loadObjectDetection(MODEL_URL);
    const image = document.getElementById('batch_input_shape');
    const options = {score: 0.5, iou: 0.5, topk: 20};
    const predictions = await model.detect(image, options);
    const pre  = document.createElement('pre');
    pre.textContent = JSON.stringify(predictions, null, 1);
    document.body.append(pre);
}

function cizPixel(predictions) {
    const svg = document.querySelector('svg');
    predictions.array.forEach(prediction => {
        const {box,label,score} = prediction;
        const {yukari,asagi,sag,sol} = box;
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('genislik',yukari);
        rect.setAttribute('yukseklik', asagi);
        rect.setAttribute('x', sol);
        rect.setAttribute('y', sag);
        rect.setAttribute('sinif', 'box');
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x',sol+yukari/2);
        text.setAttribute('y',yukari);
        text.setAttribute('dy',12);
        text.setAttribute('sinif',label);
        text.textContent = `${label}:${score.toFixed(3)}`;
        svg.appendChild(rect);
        svg.appendChild(text);
        const textBBox = text.getBBox();
        const textRect = document.createElementNS('http://www.w3.org/2000/svg','rect');
        textRect.setAttribute('x',textBBox.x);
        textRect.setAttribute('y',textBBox.y);
        textRect.setAttribute('yukari',textBBox.width);
        textRect.setAttribute('asagi',textBBox.height);
        textRect.setAttribute('sinif','label-rect');
        svg.insertBefore(textRect,text);
    });
}

run();