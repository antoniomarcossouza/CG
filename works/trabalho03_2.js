import * as THREE from '../build/three.module.js';
import { ARjs } from '../libs/AR/ar.js';
import {
    degreesToRadians,
    initDefaultSpotlight
} from "../libs/util/util.js";

var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(640, 480);
//renderer.shadowMap.type = THREE.VSMShadowMap;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);
// init scene and camera
var scene = new THREE.Scene();
var camera = new THREE.Camera();
scene.add(camera);

var clock = new THREE.Clock();

// array of functions for the rendering loop
var onRenderFcts = [];

//----------------------------------------------------------------------------
var arToolkitSource = new ARjs.Source({
    // to read from the webcam
    //sourceType : 'webcam',

    // to read from an image
    sourceType: 'image',
    sourceUrl: '../assets/AR/kanjiScene.jpg',

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
window.addEventListener('resize', function() {
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
onRenderFcts.push(function() {
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
var markerControls = new ARjs.MarkerControls(arToolkitContext, camera, {
        type: 'pattern',
        patternUrl: '../libs/AR/data/patt.kanji',
        changeMatrixMode: 'cameraTransformMatrix' // as we controls the camera, set changeMatrixMode: 'cameraTransformMatrix'
    })
    // as we do changeMatrixMode: 'cameraTransformMatrix', start with invisible scene
scene.visible = false

//----------------------------------------------------------------------------
// Adding object to the scene
var light = initDefaultSpotlight(scene, new THREE.Vector3(-5, 5, 5));
light.castShadow = true;

var geometry = new THREE.PlaneGeometry(2, 2);
var material = new THREE.MeshLambertMaterial({
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide
});
var plano = new THREE.Mesh(geometry, material);
plano.rotateX(degreesToRadians(-90));
plano.receiveShadow = true;
scene.add(plano);

/* CARRO - INICIO */

var roda1, roda2, roda3, roda4;
var calota1, calota2, calota3, calota4;
var car = createCar();
car.scale.set(0.1,0.1,0.1);
car.translateY(0.2);
car.castShadow = true;
car.receiveShadow = true;
scene.add(car);

/* CARRO - FIM */

//----------------------------------------------------------------------------
// Render the whole thing on the page

// render the scene
onRenderFcts.push(function() {
    renderer.render(scene, camera);
})

// run the rendering loop
requestAnimationFrame(function animate(nowMsec) {
    var lastTimeMsec = null;
    // keep looping
    requestAnimationFrame(animate);
    // measure time
    lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60
    var deltaMsec = Math.min(200, nowMsec - lastTimeMsec)
    lastTimeMsec = nowMsec
        // call each update function
    onRenderFcts.forEach(function(onRenderFct) {
        onRenderFct(deltaMsec / 1000, nowMsec / 1000)
    })

    light.position.copy(camera.position);
})


function createCar() {
  const loader = new THREE.TextureLoader();
  
  let textura_metal_claro = loader.load("../assets/textures/metal.png");
  textura_metal_claro.wrapS = THREE.RepeatWrapping;
  textura_metal_claro.wrapT = THREE.RepeatWrapping;
  textura_metal_claro.repeat.set(1, 1);
  var material_metal_claro = new THREE.MeshPhongMaterial({
    map: textura_metal_claro,
    color: "rgb(255, 255, 255)",
  });

  let textura_vidro_escuro = loader.load("../assets/textures/dark_glass.jpg");
  textura_vidro_escuro.wrapS = THREE.RepeatWrapping;
  textura_vidro_escuro.wrapT = THREE.RepeatWrapping;
  textura_vidro_escuro.repeat.set(1, 1);
  var material_vidro_escuro = new THREE.MeshPhongMaterial({
    map: textura_vidro_escuro,
    color: "rgb(255, 255, 255)",
  });

  let textura_metal_escuro = loader.load("../assets/textures/dark_metal.png");
  textura_metal_escuro.wrapS = THREE.RepeatWrapping;
  textura_metal_escuro.wrapT = THREE.RepeatWrapping;
  textura_metal_escuro.repeat.set(1, 1);
  var material_metal_escuro = new THREE.MeshPhongMaterial({
    map: textura_metal_escuro,
    color: "rgb(255, 255, 255)",
  });

  let textura_pneu = loader.load("../assets/textures/rubber.jpg");
  textura_pneu.wrapS = THREE.RepeatWrapping;
  textura_pneu.wrapT = THREE.RepeatWrapping;
  textura_pneu.repeat.set(1, 1);
  var material_pneu = new THREE.MeshPhongMaterial({
    map: textura_pneu,
    color: "rgb(255, 255, 255)",
  });

  var car = new THREE.Group();

  /* Corpo do Carro */
  var corpo = createBox(
    5.5,
    12.57,
    3,
    "rgb(168, 173, 173)",
    material_metal_claro
  );
  corpo.rotateX(degreesToRadians(90));
  corpo.position.set(0.0, 1, 0.0);
  car.add(corpo);

  var corpo2 = createBox(
    5.5,
    6.5,
    2,
    "rgb(168, 173, 173)",
    material_metal_claro
  );
  corpo2.rotateX(degreesToRadians(-75));
  corpo2.position.set(0.0, 2.35, 2.9);
  car.add(corpo2);

  var corpo3 = createBox(
    5.5,
    6.5,
    2,
    "rgb(168, 173, 173)",
    material_metal_claro
  );
  corpo3.rotateX(degreesToRadians(75));
  corpo3.position.set(0.0, 2.35, -2.9);
  car.add(corpo3);

  /* Janelas */
  var janela_frontal = createBox(
    5,
    4.5,
    2,
    "rgb(28, 28, 28)",
    material_vidro_escuro
  );
  janela_frontal.rotateX(degreesToRadians(-75));
  janela_frontal.position.set(0.0, 2.4, 2.9);
  car.add(janela_frontal);

  var janela_traseira = createBox(
    3.5,
    4.5,
    2,
    "rgb(28, 28, 28)",
    material_vidro_escuro
  );
  janela_traseira.rotateX(degreesToRadians(75));
  janela_traseira.position.set(0.0, 2.4, -2.9);
  car.add(janela_traseira);

  /* Maçanetas */

  var macaneta_esquerda = createBox(
    0.6,
    0.3,
    0.5,
    "rgb(64, 68, 74)",
    material_metal_escuro
  );
  macaneta_esquerda.rotateY(degreesToRadians(90));
  macaneta_esquerda.position.set(2.6, 1.9, 0.5);
  car.add(macaneta_esquerda);

  var macaneta_direita = createBox(
    0.6,
    0.3,
    0.5,
    "rgb(64, 68, 74)",
    material_metal_escuro
  );
  macaneta_direita.rotateY(degreesToRadians(90));
  macaneta_direita.position.set(-2.6, 1.9, 0.5);
  car.add(macaneta_direita);

  /* Para-choques */
  var para_choque_frontal = createBox(
    6.25,
    0.5,
    0.5,
    "rgb(30, 30, 31)",
    material_metal_escuro
  );
  para_choque_frontal.rotateX(degreesToRadians(90));
  para_choque_frontal.position.set(0.0, -0.25, 6.5);
  car.add(para_choque_frontal);

  var para_choque_lateral_esquerdo1 = createBox(
    5,
    0.5,
    0.5,
    "rgb(30, 30, 31)",
    material_metal_escuro
  );
  para_choque_lateral_esquerdo1.rotateY(degreesToRadians(90));
  para_choque_lateral_esquerdo1.position.set(3, -0.25, 0);
  car.add(para_choque_lateral_esquerdo1);

  var para_choque_lateral_esquerdo2 = createBox(
    1.25,
    0.5,
    0.5,
    "rgb(30, 30, 31)",
    material_metal_escuro
  );
  para_choque_lateral_esquerdo2.rotateY(degreesToRadians(90));
  para_choque_lateral_esquerdo2.position.set(3, -0.25, 6.125);
  car.add(para_choque_lateral_esquerdo2);

  var para_choque_lateral_esquerdo3 = createBox(
    1.25,
    0.5,
    0.5,
    "rgb(30, 30, 31)",
    material_metal_escuro
  );
  para_choque_lateral_esquerdo3.rotateY(degreesToRadians(90));
  para_choque_lateral_esquerdo3.position.set(3, -0.25, -6.125);
  car.add(para_choque_lateral_esquerdo3);

  var para_choque_roda_traseira_esquerda1 = createBox(
    1.5,
    0.5,
    0.5,
    "rgb(30, 30, 31)",
    material_metal_escuro
  );
  para_choque_roda_traseira_esquerda1.rotateY(degreesToRadians(90));
  para_choque_roda_traseira_esquerda1.rotateZ(degreesToRadians(-45));
  para_choque_roda_traseira_esquerda1.position.set(3, 0.21, -5.15);
  car.add(para_choque_roda_traseira_esquerda1);

  var para_choque_roda_traseira_esquerda2 = createBox(
    1.5,
    0.5,
    0.5,
    "rgb(30, 30, 31)",
    material_metal_escuro
  );
  para_choque_roda_traseira_esquerda2.rotateY(degreesToRadians(90));
  para_choque_roda_traseira_esquerda2.rotateZ(degreesToRadians(45));
  para_choque_roda_traseira_esquerda2.position.set(3, 0.21, -2.85);
  car.add(para_choque_roda_traseira_esquerda2);

  var para_choque_roda_traseira_esquerda3 = createBox(
    1.6,
    0.5,
    0.5,
    "rgb(30, 30, 31)",
    material_metal_escuro
  );
  para_choque_roda_traseira_esquerda3.rotateY(degreesToRadians(90));
  para_choque_roda_traseira_esquerda3.position.set(3, 0.67, -4);
  car.add(para_choque_roda_traseira_esquerda3);

  var para_choque_roda_dianteira_esquerda1 = createBox(
    1.5,
    0.5,
    0.5,
    "rgb(30, 30, 31)",
    material_metal_escuro
  );
  para_choque_roda_dianteira_esquerda1.rotateY(degreesToRadians(90));
  para_choque_roda_dianteira_esquerda1.rotateZ(degreesToRadians(-45));
  para_choque_roda_dianteira_esquerda1.position.set(3, 0.21, 2.85);
  car.add(para_choque_roda_dianteira_esquerda1);

  var para_choque_roda_dianteira_esquerda2 = createBox(
    1.5,
    0.5,
    0.5,
    "rgb(30, 30, 31)",
    material_metal_escuro
  );
  para_choque_roda_dianteira_esquerda2.rotateY(degreesToRadians(90));
  para_choque_roda_dianteira_esquerda2.rotateZ(degreesToRadians(45));
  para_choque_roda_dianteira_esquerda2.position.set(3, 0.21, 5.15);
  car.add(para_choque_roda_dianteira_esquerda2);

  var para_choque_roda_dianteira_esquerda3 = createBox(
    1.6,
    0.5,
    0.5,
    "rgb(30, 30, 31)",
    material_metal_escuro
  );
  para_choque_roda_dianteira_esquerda3.rotateY(degreesToRadians(90));
  para_choque_roda_dianteira_esquerda3.position.set(3, 0.67, 4);
  car.add(para_choque_roda_dianteira_esquerda3);

  var para_choque_lateral_direito1 = createBox(5, 0.5, 0.5, "rgb(30, 30, 31)");
  para_choque_lateral_direito1.rotateY(degreesToRadians(90));
  para_choque_lateral_direito1.position.set(-3, -0.25, 0);
  car.add(para_choque_lateral_direito1);

  var para_choque_lateral_direito2 = createBox(
    1.25,
    0.5,
    0.5,
    "rgb(30, 30, 31)",
    material_metal_escuro
  );
  para_choque_lateral_direito2.rotateY(degreesToRadians(90));
  para_choque_lateral_direito2.position.set(-3, -0.25, 6.125);
  car.add(para_choque_lateral_direito2);

  var para_choque_lateral_direito3 = createBox(
    1.25,
    0.5,
    0.5,
    "rgb(30, 30, 31)",
    material_metal_escuro
  );
  para_choque_lateral_direito3.rotateY(degreesToRadians(90));
  para_choque_lateral_direito3.position.set(-3, -0.25, -6.125);
  car.add(para_choque_lateral_direito3);

  var para_choque_roda_traseira_direita1 = createBox(
    1.5,
    0.5,
    0.5,
    "rgb(30, 30, 31)",
    material_metal_escuro
  );
  para_choque_roda_traseira_direita1.rotateY(degreesToRadians(90));
  para_choque_roda_traseira_direita1.rotateZ(degreesToRadians(-45));
  para_choque_roda_traseira_direita1.position.set(-3, 0.21, -5.15);
  car.add(para_choque_roda_traseira_direita1);

  var para_choque_roda_traseira_direita2 = createBox(
    1.5,
    0.5,
    0.5,
    "rgb(30, 30, 31)",
    material_metal_escuro
  );
  para_choque_roda_traseira_direita2.rotateY(degreesToRadians(90));
  para_choque_roda_traseira_direita2.rotateZ(degreesToRadians(45));
  para_choque_roda_traseira_direita2.position.set(-3, 0.21, -2.85);
  car.add(para_choque_roda_traseira_direita2);

  var para_choque_roda_traseira_direita3 = createBox(
    1.6,
    0.5,
    0.5,
    "rgb(30, 30, 31)",
    material_metal_escuro
  );
  para_choque_roda_traseira_direita3.rotateY(degreesToRadians(90));
  para_choque_roda_traseira_direita3.position.set(-3, 0.67, -4);
  car.add(para_choque_roda_traseira_direita3);

  var para_choque_roda_dianteira_direita1 = createBox(
    1.5,
    0.5,
    0.5,
    "rgb(30, 30, 31)",
    material_metal_escuro
  );
  para_choque_roda_dianteira_direita1.rotateY(degreesToRadians(90));
  para_choque_roda_dianteira_direita1.rotateZ(degreesToRadians(-45));
  para_choque_roda_dianteira_direita1.position.set(-3, 0.21, 2.85);
  car.add(para_choque_roda_dianteira_direita1);

  var para_choque_roda_dianteira_direita2 = createBox(
    1.5,
    0.5,
    0.5,
    "rgb(30, 30, 31)",
    material_metal_escuro
  );
  para_choque_roda_dianteira_direita2.rotateY(degreesToRadians(90));
  para_choque_roda_dianteira_direita2.rotateZ(degreesToRadians(45));
  para_choque_roda_dianteira_direita2.position.set(-3, 0.21, 5.15);
  car.add(para_choque_roda_dianteira_direita2);

  var para_choque_roda_dianteira_direita3 = createBox(
    1.6,
    0.5,
    0.5,
    "rgb(30, 30, 31)",
    material_metal_escuro
  );
  para_choque_roda_dianteira_direita3.rotateY(degreesToRadians(90));
  para_choque_roda_dianteira_direita3.position.set(-3, 0.67, 4);
  car.add(para_choque_roda_dianteira_direita3);

  var para_choque_traseiro = createBox(
    6.25,
    0.5,
    0.5,
    "rgb(30, 30, 31)",
    material_metal_escuro
  );
  para_choque_traseiro.rotateX(degreesToRadians(90));
  para_choque_traseiro.position.set(0.0, -0.25, -6.5);
  car.add(para_choque_traseiro);

  /* Faróis */

  var farol_frontal = createBox(5, 0.5, 0.15, "rgb(255, 255, 255)");
  farol_frontal.rotateX(degreesToRadians(90));
  farol_frontal.position.set(0.0, 2.25, 6.125);
  car.add(farol_frontal);

  var farol_traseiro1 = createBox(1, 0.5, 0.25, "rgb(196, 35, 35)");
  farol_traseiro1.rotateX(degreesToRadians(90));
  farol_traseiro1.position.set(2.0, 2, -6.125);
  car.add(farol_traseiro1);

  var farol_traseiro2 = createBox(1, 0.5, 0.25, "rgb(196, 35, 35)");
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
    "rgb(132, 142, 156)",
    material_metal_escuro
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
    "rgb(132, 142, 156)",
    material_metal_escuro
  );
  eixo2.rotateZ(degreesToRadians(90));
  eixo2.position.set(0.0, -1.0, -4.0);
  car.add(eixo2);

  /* Rodas */
  roda1 = createTorus(
    1.0,
    0.35,
    20,
    20,
    Math.PI * 2,
    "rgb(30, 30, 31)",
    material_pneu
  );
  roda1.position.set(3.25, -1.0, 4.0);
  car.add(roda1);

  calota1 = createTorus(
    0.9,
    0.35,
    20,
    20,
    Math.PI * 15,
    "rgb(93, 101, 112)",
    material_metal_claro
  );
  calota1.position.set(3.2, -1.0, 4.0);
  car.add(calota1);

  roda2 = createTorus(
    1.0,
    0.35,
    20,
    20,
    Math.PI * 2,
    "rgb(30, 30, 31)",
    material_pneu
  );
  roda2.position.set(-3.25, -1.0, 4.0);
  car.add(roda2);

  calota2 = createTorus(
    0.9,
    0.35,
    20,
    20,
    Math.PI * 15,
    "rgb(93, 101, 112)",
    material_metal_claro
  );
  calota2.position.set(-3.2, -1.0, 4.0);
  car.add(calota2);

  roda3 = createTorus(
    1.0,
    0.35,
    20,
    20,
    Math.PI * 2,
    "rgb(30, 30, 31)",
    material_pneu
  );
  roda3.position.set(3.25, -1.0, -4.0);
  car.add(roda3);

  calota3 = createTorus(
    0.9,
    0.35,
    20,
    20,
    Math.PI * 15,
    "rgb(93, 101, 112)",
    material_metal_claro
  );
  calota3.position.set(3.2, -1.0, -4.0);
  car.add(calota3);

  roda4 = createTorus(
    1.0,
    0.35,
    20,
    20,
    Math.PI * 2,
    "rgb(30, 30, 31)",
    material_pneu
  );
  roda4.position.set(-3.25, -1.0, -4.0);
  car.add(roda4);

  calota4 = createTorus(
    0.9,
    0.35,
    20,
    20,
    Math.PI * 15,
    "rgb(93, 101, 112)",
    material_metal_claro
  );
  calota4.position.set(-3.2, -1.0, -4.0);
  car.add(calota4);

  return car;
}

function createBox(width, height, depth, color, material) {
  var geometry = new THREE.BoxGeometry(width, height, depth);
  if (material == null) {
    var material = new THREE.MeshPhongMaterial({ color: color });
  } else {
    var material = material
  }
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