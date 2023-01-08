

/* window.$fxhashFeatures = {
  "Palette": getPalette(fxrand()),
  "StrokeWeight": getStrokeWeight(fxrand()),
  "Transform": getTransform(fxrand())
}; */

// Variable initialization
const ppi = 96; // pixels per inch
// const width_mm = 210; // width in millimeters (multiple of 96ppi = 96*8*24,4/96)
// const height_mm = 297; // height in millimeters

// let w = mm2px(width_mm, ppi);
// let h = mm2px(height_mm, ppi);

let w, h; // width and height of canvas

let strokeW_mm = 0.1 // stroke weigth in mm
let sw = mm2px(strokeW_mm, ppi);

const radiusDelta_mm = 7; // variables related to the size of the flowers
const radiusMin_mm = 14;
let radiusDelta = mm2px(radiusDelta_mm, ppi);
let radiusMin = mm2px(radiusMin_mm, ppi);


let scale; // scale flower size according to window size
let radiusDeltaScaled;
let radiusMinScaled;
// let minWH;

const nStroke = 200; // number of strokes in a flower and angle between each stroke
const angleDelta = Math.PI * 2 / nStroke;

const nflowers = 50; // number of flowers and array of flowers
let flowers;

let xCenter, yCenter; // center of the canvas
let angleDirection; // angle between starting point and center of canvas
let xStartPoint, yStartPoint; // starting point for growing flowers

// Perlin noise initialization
const nSeed = 1000;
const dNoise = 2;
// let fxr = fxrand();
// noise.seed(fxrand() * nSeed);

let draw; // SVG canvas

let selectSingularity = false; // has the Singularity been identified ?
let isSingularity = false; // is the current Shape the Singularity ?

let click = function () {
  let svg = draw.svg();
  let blob = new Blob([svg], { type: "image/svg+xml" });

  let dl = document.createElement("a");
  dl.download = "Flowers-" + getTimeStamp() + ".svg";
  dl.href = URL.createObjectURL(blob);
  dl.dataset.downloadurl = ["image/svg+xml", dl.download, dl.href].join(':');
  dl.style.display = "none";
  document.body.appendChild(dl);

  dl.click();

  document.body.removeChild(dl);
}

init();

window.addEventListener('resize', windowResized);

function windowResized() {
  let elements = document.body.getElementsByTagName("svg");
  document.body.removeChild(elements[0]);
  selectSingularity = false;
  isSingularity = false;
  init();
}

function init() {
  flowers = [];
  noise.seed(fxrand() * nSeed);

  w = h = Math.min(document.body.clientWidth, document.body.clientHeight);

  draw = SVG().addTo('body').size(w, h);
  // w = draw.width();
  // h = draw.height();

  // scale flowers to canvas size
  // minWH = Math.min(w, h);
  scale = w / 900;

  radiusDeltaScaled = radiusDelta * scale;
  radiusMinScaled = radiusMin * scale;

  let groups = [draw.group().addClass('singularity'), draw.group().addClass('other')]; // groups to handle Singularity and the rest

  calculateStartPoint();

  let cX = xStartPoint; // center of next flower
  let cY = yStartPoint; 

  for (let f = 0; f < nflowers; f++) {
    let c = false;

    while (!c) {
      // cX = radiusMinScaled + fxrand() * (w - 2 * radiusMinScaled); // avoid center too close to canvas borders
      // cY = radiusMinScaled + fxrand() * (h - 2 * radiusMinScaled);

      cX += Math.cos(angleDirection + getRandomAngle()) * radiusMinScaled;
      cY += Math.sin(angleDirection + getRandomAngle()) * radiusMinScaled;

      c = true;
      for (let flo = 0; flo < flowers.length; flo++) {
        if (Math.dist(cX, cY, flowers[flo].center[0], flowers[flo].center[1]) < radiusMinScaled*1.2) c = false;
      }
    }

    if (!selectSingularity) { // selection of Singularity
      isSingularity = fxrand() > 0.85 ? true : false;
      if (isSingularity) selectSingularity = true;
    }

    let flower = new Flower(cX, cY, isSingularity);
    flowers.push(flower);
    flower.draw(draw, groups);
    isSingularity = false;
    angleDirection = Math.angleRadians(cX, cY, w/2 + offsetCenter(w/2), h/2+offsetCenter(h/2));
  }

  let rect = draw.rect(w, h).stroke({ color: '#000000' }).back();

  // Clipping
  // let clipForm = draw.circle(w*0.8).center(w/2, h/2);
  // let clip = draw.clip().add(clipForm);
  // groups[0].clipWith(clip);
  // groups[1].clipWith(clip);
  // rect.clipWith(clip);

  draw.on('click', click);
}

function calculateStartPoint() {
  let startEdge = Math.round(fxrand() * 3.5); // 0 North, 1 East, 2 South, 3 West
  // console.log(startEdge);

  xStartPoint = fxrand() * w;
  yStartPoint = fxrand() * h;

  switch (startEdge) {
    case 0:
      yStartPoint = 0;
      break;
    case 1:
      xStartPoint = w;
      break;
    case 2:
      yStartPoint = h;
      break;
    default:
      xStartPoint = 0;
  }

  angleDirection = Math.angleRadians(xStartPoint, yStartPoint, w/2 + offsetCenter(w/2), h/2+offsetCenter(h/2));

  // console.log(xStartPoint, yStartPoint, angleDirection);
}

function getRandomAngle() { // intelligence à ajouter ici
  return Math.map((fxrand() * Math.PI / 2), 0, Math.PI/2, -Math.PI/4, Math.PI/4);
}

function offsetCenter(val) {
  let valb = val * 0.20;
  return Math.map(fxrand() * valb, 0, valb, -valb/2, valb/2); // offset by -10%/+10% of val
}

/* group.front(); // beating hexagone on top of the rest
window.$fxhashFeatures['Singularity'] = getBeating();
console.log("Color: "+window.$fxhashFeatures.Palette);
console.log("StrokeWeight: "+window.$fxhashFeatures.StrokeWeight);
console.log("Transform: "+window.$fxhashFeatures.Transform);
console.log("Singularity: "+window.$fxhashFeatures.Singularity); */