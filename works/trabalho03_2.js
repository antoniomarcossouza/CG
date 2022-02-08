import * as THREE from '../build/three.module.js';
import { ARjs } from '../libs/AR/ar.js';
import { GLTFLoader } from '../build/jsm/loaders/GLTFLoader.js';
import {
  getMaxSize,
  initDefaultSpotlight,
  degreesToRadians
} from "../libs/util/util.js";

var clock = new THREE.Clock();

var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(640, 480);
renderer.shadowMap.type = THREE.VSMShadowMap;
renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);
// init scene and camera
var scene = new THREE.Scene();
var camera = new THREE.Camera();
scene.add(camera);

// array of functions for the rendering loop
var onRenderFcts = [];

//----------------------------------------------------------------------------
// Handle arToolkitSource
// More info: https://ar-js-org.github.io/AR.js-Docs/marker-based/
//var arToolkitSource = new THREEx.ArToolkitSource({
var arToolkitSource = new ARjs.Source({
  // to read from the webcam
  // sourceType: 'webcam',

  // to read from an image
  sourceType : 'image',
  sourceUrl : '../assets/AR/kanjiScene.jpg',

  // to read from a video
  // sourceType : 'video',
  // sourceUrl : '../assets/AR/kanjiScene.mp4'
})

arToolkitSource.init(function onReady() {
  setTimeout(() => {
    onResize()
  }, 2000);
})

// handle resize
window.addEventListener('resize', function () {
  onResize()
})

function onResize() {
  arToolkitSource.onResizeElement()
  arToolkitSource.copyElementSizeTo(renderer.domElement)
  if (arToolkitContext.arController !== null) {
    arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas)
  }
}

//----------------------------------------------------------------------------
// initialize arToolkitContext
//
// create atToolkitContext
//var arToolkitContext = new THREEx.ArToolkitContext({
var arToolkitContext = new ARjs.Context({
  cameraParametersUrl: '../libs/AR/data/camera_para.dat',
  detectionMode: 'mono',
})

// initialize it
arToolkitContext.init(function onCompleted() {
  // copy projection matrix to camera
  camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
})

// update artoolkit on every frame
onRenderFcts.push(function () {
  if (arToolkitSource.ready === false) return
  arToolkitContext.update(arToolkitSource.domElement)
  // update scene.visible if the marker is seen
  scene.visible = camera.visible
})

//----------------------------------------------------------------------------
// Create a ArMarkerControls
//
// init controls for camera
//var markerControls = new THREEx.ArMarkerControls(arToolkitContext, camera, {
new ARjs.MarkerControls(arToolkitContext, camera, {
  type: 'pattern',
  patternUrl: '../libs/AR/data/patt.kanji',
  changeMatrixMode: 'cameraTransformMatrix' // as we controls the camera, set changeMatrixMode: 'cameraTransformMatrix'
})
// as we do changeMatrixMode: 'cameraTransformMatrix', start with invisible scene
scene.visible = false

//----------------------------------------------------------------------------
// Adding object to the scene

var mixer = new Array();
//loadGLTFFile('../assets/objects/', 'dachshund', 1.0, true);


/* CARRO - INICIO */

var roda1, roda2, roda3, roda4;
var calota1, calota2, calota3, calota4;
var car = createCar();
car.scale.set(0.1,0.1,0.1);
car.translateY(0.18);
scene.add(car);

/* CARRO - FIM */


var planeMaterial = new THREE.MeshBasicMaterial({
  opacity: 0.3,
  transparent: true,
  shininess: 1000,
});

var planeGeometry = new THREE.BoxGeometry(1.5, 0, 1.5);

var plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.set(0.00, -0.025, 0.00);
plane.receiveShadow = true;
scene.add(plane);

var light = initDefaultSpotlight(scene, new THREE.Vector3(2, 3, 2)); // Use default light
scene.add(light);

//----------------------------------------------------------------------------
// Render the whole thing on the page

// render the scene
onRenderFcts.push(function () {
  renderer.render(scene, camera);
})

function loadGLTFFile(modelPath, modelFolder, desiredScale, visibility) {
  var loader = new GLTFLoader();
  loader.load(modelPath + modelFolder + '/scene.gltf', function (gltf) {
    var obj = gltf.scene;
    obj.visible = visibility;
    obj.name = modelFolder;
    obj.traverse(function (child) {
      if (child) {
        child.castShadow = true;
      }
    });
    obj.traverse(function (node) {
      if (node.material) node.material.side = THREE.DoubleSide;
    });

    var obj = normalizeAndRescale(obj, desiredScale);
    var obj = fixPosition(obj);
    obj.scale.multiplyScalar(1.5);
    obj.castShadow = true;
      scene.add(obj);

    // Create animationMixer and push it in the array of mixers
    var mixerLocal = new THREE.AnimationMixer(obj);
    mixerLocal.clipAction(gltf.animations[0]).play();
    mixer.push(mixerLocal);
  }, onProgress, onError);

}

function onError() { };

function onProgress(xhr, model) {
  if (xhr.lengthComputable) {
    var percentComplete = xhr.loaded / xhr.total * 100;
    //infoBox.changeMessage("Loading... " + Math.round( percentComplete, 2 ) + '% processed' );
  }
}

// Normalize scale and multiple by the newScale
function normalizeAndRescale(obj, newScale) {
  var scale = getMaxSize(obj); // Available in 'utils.js'
  obj.scale.set(newScale * (1.0 / scale),
    newScale * (1.0 / scale),
    newScale * (1.0 / scale));
  return obj;
}

function fixPosition(obj) {
  // Fix position of the object over the ground plane
  var box = new THREE.Box3().setFromObject(obj);
  if (box.min.y > 0)
    obj.translateY(-box.min.y);
  else
    obj.translateY(-1 * box.min.y);
  return obj;
}

// run the rendering loop
requestAnimationFrame(function animate(nowMsec) {
  var delta = clock.getDelta();

  var lastTimeMsec = null;
  // keep looping
  requestAnimationFrame(animate);
  // measure time
  lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60
  var deltaMsec = Math.min(200, nowMsec - lastTimeMsec)
  lastTimeMsec = nowMsec
  // call each update function
  onRenderFcts.forEach(function (onRenderFct) {
    onRenderFct(deltaMsec / 1000, nowMsec / 1000)
  })

  for (var i = 0; i < mixer.length; i++)
    mixer[i].update(delta);

})


function createCar() {
  var car = new THREE.Group();

  /* Corpo do Carro */
  var corpo = createBox(5.5, 12.57, 3, 'rgb(168, 173, 173)');
  corpo.rotateX(degreesToRadians(90));
  corpo.position.set(0.0, 1, 0.0);
  car.add(corpo);

  var corpo2 = createBox(5.5, 6.5, 2, 'rgb(168, 173, 173)');
  corpo2.rotateX(degreesToRadians(-75));
  corpo2.position.set(0.0, 2.35, 2.9);
  car.add(corpo2);

  var corpo3 = createBox(5.5, 6.5, 2, 'rgb(168, 173, 173)');
  corpo3.rotateX(degreesToRadians(75));
  corpo3.position.set(0.0, 2.35, -2.9);
  car.add(corpo3);

  /* Janelas */
  var janela_frontal = createBox(5, 4.5, 2, 'rgb(28, 28, 28)');
  janela_frontal.rotateX(degreesToRadians(-75));
  janela_frontal.position.set(0.0, 2.4, 2.9);
  car.add(janela_frontal);

  var janela_traseira = createBox(3.5, 4.5, 2, 'rgb(28, 28, 28)');
  janela_traseira.rotateX(degreesToRadians(75));
  janela_traseira.position.set(0.0, 2.4, -2.9);
  car.add(janela_traseira);

  /* Maçanetas */

  var macaneta_esquerda = createBox(0.6, 0.3, 0.5, 'rgb(64, 68, 74)');
  macaneta_esquerda.rotateY(degreesToRadians(90));
  macaneta_esquerda.position.set(2.6, 1.9, 0.5);
  car.add(macaneta_esquerda);

  var macaneta_direita = createBox(0.6, 0.3, 0.5, 'rgb(64, 68, 74)');
  macaneta_direita.rotateY(degreesToRadians(90));
  macaneta_direita.position.set(-2.6, 1.9, 0.5);
  car.add(macaneta_direita);

  /* Para-choques */
  var para_choque_frontal = createBox(6.25, 0.5, 0.5, 'rgb(30, 30, 31)');
  para_choque_frontal.rotateX(degreesToRadians(90));
  para_choque_frontal.position.set(0.0, -0.25, 6.5);
  car.add(para_choque_frontal);

  var para_choque_lateral_esquerdo1 = createBox(5, 0.5, 0.5, 'rgb(30, 30, 31)');
  para_choque_lateral_esquerdo1.rotateY(degreesToRadians(90));
  para_choque_lateral_esquerdo1.position.set(3, -0.25, 0);
  car.add(para_choque_lateral_esquerdo1);

  var para_choque_lateral_esquerdo2 = createBox(
    1.25,
    0.5,
    0.5,
    'rgb(30, 30, 31)'
  );
  para_choque_lateral_esquerdo2.rotateY(degreesToRadians(90));
  para_choque_lateral_esquerdo2.position.set(3, -0.25, 6.125);
  car.add(para_choque_lateral_esquerdo2);

  var para_choque_lateral_esquerdo3 = createBox(
    1.25,
    0.5,
    0.5,
    'rgb(30, 30, 31)'
  );
  para_choque_lateral_esquerdo3.rotateY(degreesToRadians(90));
  para_choque_lateral_esquerdo3.position.set(3, -0.25, -6.125);
  car.add(para_choque_lateral_esquerdo3);

  var para_choque_roda_traseira_esquerda1 = createBox(
    1.5,
    0.5,
    0.5,
    'rgb(30, 30, 31)'
  );
  para_choque_roda_traseira_esquerda1.rotateY(degreesToRadians(90));
  para_choque_roda_traseira_esquerda1.rotateZ(degreesToRadians(-45));
  para_choque_roda_traseira_esquerda1.position.set(3, 0.21, -5.15);
  car.add(para_choque_roda_traseira_esquerda1);

  var para_choque_roda_traseira_esquerda2 = createBox(
    1.5,
    0.5,
    0.5,
    'rgb(30, 30, 31)'
  );
  para_choque_roda_traseira_esquerda2.rotateY(degreesToRadians(90));
  para_choque_roda_traseira_esquerda2.rotateZ(degreesToRadians(45));
  para_choque_roda_traseira_esquerda2.position.set(3, 0.21, -2.85);
  car.add(para_choque_roda_traseira_esquerda2);

  var para_choque_roda_traseira_esquerda3 = createBox(
    1.6,
    0.5,
    0.5,
    'rgb(30, 30, 31)'
  );
  para_choque_roda_traseira_esquerda3.rotateY(degreesToRadians(90));
  para_choque_roda_traseira_esquerda3.position.set(3, 0.67, -4);
  car.add(para_choque_roda_traseira_esquerda3);

  var para_choque_roda_dianteira_esquerda1 = createBox(
    1.5,
    0.5,
    0.5,
    'rgb(30, 30, 31)'
  );
  para_choque_roda_dianteira_esquerda1.rotateY(degreesToRadians(90));
  para_choque_roda_dianteira_esquerda1.rotateZ(degreesToRadians(-45));
  para_choque_roda_dianteira_esquerda1.position.set(3, 0.21, 2.85);
  car.add(para_choque_roda_dianteira_esquerda1);

  var para_choque_roda_dianteira_esquerda2 = createBox(
    1.5,
    0.5,
    0.5,
    'rgb(30, 30, 31)'
  );
  para_choque_roda_dianteira_esquerda2.rotateY(degreesToRadians(90));
  para_choque_roda_dianteira_esquerda2.rotateZ(degreesToRadians(45));
  para_choque_roda_dianteira_esquerda2.position.set(3, 0.21, 5.15);
  car.add(para_choque_roda_dianteira_esquerda2);

  var para_choque_roda_dianteira_esquerda3 = createBox(
    1.6,
    0.5,
    0.5,
    'rgb(30, 30, 31)'
  );
  para_choque_roda_dianteira_esquerda3.rotateY(degreesToRadians(90));
  para_choque_roda_dianteira_esquerda3.position.set(3, 0.67, 4);
  car.add(para_choque_roda_dianteira_esquerda3);

  var para_choque_lateral_direito1 = createBox(5, 0.5, 0.5, 'rgb(30, 30, 31)');
  para_choque_lateral_direito1.rotateY(degreesToRadians(90));
  para_choque_lateral_direito1.position.set(-3, -0.25, 0);
  car.add(para_choque_lateral_direito1);

  var para_choque_lateral_direito2 = createBox(
    1.25,
    0.5,
    0.5,
    'rgb(30, 30, 31)'
  );
  para_choque_lateral_direito2.rotateY(degreesToRadians(90));
  para_choque_lateral_direito2.position.set(-3, -0.25, 6.125);
  car.add(para_choque_lateral_direito2);

  var para_choque_lateral_direito3 = createBox(
    1.25,
    0.5,
    0.5,
    'rgb(30, 30, 31)'
  );
  para_choque_lateral_direito3.rotateY(degreesToRadians(90));
  para_choque_lateral_direito3.position.set(-3, -0.25, -6.125);
  car.add(para_choque_lateral_direito3);

  var para_choque_roda_traseira_direita1 = createBox(
    1.5,
    0.5,
    0.5,
    'rgb(30, 30, 31)'
  );
  para_choque_roda_traseira_direita1.rotateY(degreesToRadians(90));
  para_choque_roda_traseira_direita1.rotateZ(degreesToRadians(-45));
  para_choque_roda_traseira_direita1.position.set(-3, 0.21, -5.15);
  car.add(para_choque_roda_traseira_direita1);

  var para_choque_roda_traseira_direita2 = createBox(
    1.5,
    0.5,
    0.5,
    'rgb(30, 30, 31)'
  );
  para_choque_roda_traseira_direita2.rotateY(degreesToRadians(90));
  para_choque_roda_traseira_direita2.rotateZ(degreesToRadians(45));
  para_choque_roda_traseira_direita2.position.set(-3, 0.21, -2.85);
  car.add(para_choque_roda_traseira_direita2);

  var para_choque_roda_traseira_direita3 = createBox(
    1.6,
    0.5,
    0.5,
    'rgb(30, 30, 31)'
  );
  para_choque_roda_traseira_direita3.rotateY(degreesToRadians(90));
  para_choque_roda_traseira_direita3.position.set(-3, 0.67, -4);
  car.add(para_choque_roda_traseira_direita3);

  var para_choque_roda_dianteira_direita1 = createBox(
    1.5,
    0.5,
    0.5,
    'rgb(30, 30, 31)'
  );
  para_choque_roda_dianteira_direita1.rotateY(degreesToRadians(90));
  para_choque_roda_dianteira_direita1.rotateZ(degreesToRadians(-45));
  para_choque_roda_dianteira_direita1.position.set(-3, 0.21, 2.85);
  car.add(para_choque_roda_dianteira_direita1);

  var para_choque_roda_dianteira_direita2 = createBox(
    1.5,
    0.5,
    0.5,
    'rgb(30, 30, 31)'
  );
  para_choque_roda_dianteira_direita2.rotateY(degreesToRadians(90));
  para_choque_roda_dianteira_direita2.rotateZ(degreesToRadians(45));
  para_choque_roda_dianteira_direita2.position.set(-3, 0.21, 5.15);
  car.add(para_choque_roda_dianteira_direita2);

  var para_choque_roda_dianteira_direita3 = createBox(
    1.6,
    0.5,
    0.5,
    'rgb(30, 30, 31)'
  );
  para_choque_roda_dianteira_direita3.rotateY(degreesToRadians(90));
  para_choque_roda_dianteira_direita3.position.set(-3, 0.67, 4);
  car.add(para_choque_roda_dianteira_direita3);

  var para_choque_traseiro = createBox(6.25, 0.5, 0.5, 'rgb(30, 30, 31)');
  para_choque_traseiro.rotateX(degreesToRadians(90));
  para_choque_traseiro.position.set(0.0, -0.25, -6.5);
  car.add(para_choque_traseiro);

  /* Faróis */

  var farol_frontal = createBox(5, 0.5, 0.15, 'rgb(255, 255, 255)');
  farol_frontal.rotateX(degreesToRadians(90));
  farol_frontal.position.set(0.0, 2.25, 6.125);
  car.add(farol_frontal);

  var farol_traseiro1 = createBox(1, 0.5, 0.25, 'rgb(196, 35, 35)');
  farol_traseiro1.rotateX(degreesToRadians(90));
  farol_traseiro1.position.set(2.0, 2, -6.125);
  car.add(farol_traseiro1);

  var farol_traseiro2 = createBox(1, 0.5, 0.25, 'rgb(196, 35, 35)');
  farol_traseiro2.rotateX(degreesToRadians(90));
  farol_traseiro2.position.set(-2.0, 2, -6.125);
  car.add(farol_traseiro2);

  /*
  const farol_frontal_light = new THREE.PointLight(0xffffff, 0.3, 20);
  farol_frontal_light.position.set(0.0, 2.25, 8);
 
  const farol_frontal_light2 = new THREE.PointLight(0xffffff, 0.3, 20);
  farol_frontal_light2.position.set(1, 2.25, 8);
 
  const farol_frontal_light3 = new THREE.PointLight(0xffffff, 0.3, 20);
  farol_frontal_light3.position.set(-1, 2.25, 8);
 
  const farol_traseiro_light = new THREE.PointLight(0xff0000, 0.5, 15);
  farol_traseiro_light.position.set(0, 2, -8);
*/

  /* Eixos */
  var eixo1 = createCylinder(
    0.3,
    0.3,
    7.0,
    10,
    10,
    false,
    'rgb(132, 142, 156)'
  );
  eixo1.rotateZ(degreesToRadians(90));
  eixo1.position.set(0.0, -1.0, 4.0);
  car.add(eixo1);

  var eixo2 = createCylinder(
    0.3,
    0.3,
    7.0,
    10,
    10,
    false,
    'rgb(132, 142, 156)'
  );
  eixo2.rotateZ(degreesToRadians(90));
  eixo2.position.set(0.0, -1.0, -4.0);
  car.add(eixo2);

  /* Rodas */
  roda1 = createTorus(1.0, 0.35, 20, 20, Math.PI * 2, 'rgb(30, 30, 31)');
  roda1.position.set(3.25, -1.0, 4.0);
  car.add(roda1);

  calota1 = createTorus(0.9, 0.35, 20, 20, Math.PI * 15, 'rgb(93, 101, 112)');
  calota1.position.set(3.2, -1.0, 4.0);
  car.add(calota1);

  roda2 = createTorus(1.0, 0.35, 20, 20, Math.PI * 2, 'rgb(30, 30, 31)');
  roda2.position.set(-3.25, -1.0, 4.0);
  car.add(roda2);

  calota2 = createTorus(0.9, 0.35, 20, 20, Math.PI * 15, 'rgb(93, 101, 112)');
  calota2.position.set(-3.2, -1.0, 4.0);
  car.add(calota2);

  roda3 = createTorus(1.0, 0.35, 20, 20, Math.PI * 2, 'rgb(30, 30, 31)');
  roda3.position.set(3.25, -1.0, -4.0);
  car.add(roda3);

  calota3 = createTorus(0.9, 0.35, 20, 20, Math.PI * 15, 'rgb(93, 101, 112)');
  calota3.position.set(3.2, -1.0, -4.0);
  car.add(calota3);

  roda4 = createTorus(1.0, 0.35, 20, 20, Math.PI * 2, 'rgb(30, 30, 31)');
  roda4.position.set(-3.25, -1.0, -4.0);
  car.add(roda4);

  calota4 = createTorus(0.9, 0.35, 20, 20, Math.PI * 15, 'rgb(93, 101, 112)');
  calota4.position.set(-3.2, -1.0, -4.0);
  car.add(calota4);

  return car;
}

function createBox(width, height, depth, color) {
  var geometry = new THREE.BoxGeometry(width, height, depth);
  var material = new THREE.MeshPhongMaterial({ color: color });
  var object = new THREE.Mesh(geometry, material);
  object.castShadow = true;
  return object;
}

function createCylinder(
  radiusTop,
  radiusBottom,
  height,
  radialSegments,
  heightSegments,
  openEnded,
  color
) {
  var geometry = new THREE.CylinderGeometry(
    radiusTop,
    radiusBottom,
    height,
    radialSegments,
    heightSegments,
    openEnded
  );
  var material;
  material = new THREE.MeshPhongMaterial({ color: color });
  var object = new THREE.Mesh(geometry, material);
  object.castShadow = true;
  return object;
}

function createTorus(
  radius,
  tube,
  radialSegments,
  tubularSegments,
  arc,
  color
) {
  var geometry = new THREE.TorusGeometry(
    radius,
    tube,
    radialSegments,
    tubularSegments,
    arc
  );
  var material = new THREE.MeshPhongMaterial({ color: color });
  var object = new THREE.Mesh(geometry, material);
  object.castShadow = true;
  object.rotateY(degreesToRadians(90));
  return object;
}