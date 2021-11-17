import * as THREE from '../build/three.module.js';
import Stats from '../build/jsm/libs/stats.module.js';
import { TrackballControls } from '../build/jsm/controls/TrackballControls.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import {
  initRenderer,
  initDefaultBasicLight,
  createGroundPlane,
  onWindowResize,
  degreesToRadians
} from "../libs/util/util.js";

var speed = 0;
var maxSpeed = 2.5;
var incrementSpeed = 0.024;

var sensitivity = 15;

var scene = new THREE.Scene();
var stats = new Stats();

var renderer = initRenderer();
renderer.setClearColor("rgb(30, 30, 40)");

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.lookAt(0, 0, 0);
camera.position.set(0, 0, 0);
camera.up.set(0, 1, 0);

initDefaultBasicLight(scene);

window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

var planeGeometry = new THREE.PlaneGeometry(300, 300);
planeGeometry.translate(0.0, 100, -0.5);
var planeMaterial = new THREE.MeshBasicMaterial({
  color: "rgba(86, 125, 70)",
  side: THREE.DoubleSide,
});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
planeGeometry.rotateX(degreesToRadians(-90));
scene.add(plane);


for (var i = 0; i < 20; i++) {
  for (var j = 0; j < 4; j++) {
    createPlane(-90 + i * 10, -20 + (j * 10));
  }

  for (var j = 0; j < 4; j++) {
    createPlane(-90 + 10 * j, -i * 10);
  }

  for (var j = 0; j < 4; j++) {
    createPlane(-90 + i * 10, -200 + 10 * j);
  }

  for (var j = 0; j < 4; j++) {
    createPlane(100 - 10 * j, -i * 10);
  }
}

// To use the keyboard
var keyboard = new KeyboardState();

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls(camera, renderer.domElement);

//-------------------------------------------------------------------
// Start setting the group

var group = new THREE.Group();
var camera_look = new THREE.Group();

// Set the parts of the pseudo-car
var body = createCylinder(1.3, 2.75, 10.0, 20, 20, false);
body.rotateX(degreesToRadians(90));
body.position.set(0.0, 0.5, 0.0)

var eixo1 = createCylinder(0.3, 0.3, 7.0, 10, 10, false);
eixo1.rotateZ(degreesToRadians(90));
eixo1.position.set(0.0, -1.0, 4.0);

var eixo2 = createCylinder(0.3, 0.3, 7.0, 10, 10, false);
eixo2.rotateZ(degreesToRadians(90));
eixo2.position.set(0.0, -1.0, -4.0);

var roda1 = createTorus(1.0, 0.3, 20, 20, Math.PI * 2);
roda1.position.set(3.5, -1.0, 4.0);

var roda2 = createTorus(1.0, 0.3, 20, 20, Math.PI * 2);
roda2.position.set(-3.5, -1.0, 4.0);

var roda3 = createTorus(1.0, 0.3, 20, 20, Math.PI * 2);
roda3.position.set(3.5, -1.0, -4.0);

var roda4 = createTorus(1.0, 0.3, 20, 20, Math.PI * 2);
roda4.position.set(-3.5, -1.0, -4.0);

// Add objects to the group
group.add(body);
group.add(eixo1);
group.add(eixo2);
group.add(roda1);
group.add(roda2);
group.add(roda3);
group.add(roda4);

// Add group to the scene
scene.add(group);

// Move all to the start position
group.translateY(2.3);
group.rotateY(degreesToRadians(-90));

camera_look.translateY(2.3);
camera_look.rotateY(degreesToRadians(-90));
camera_look.translateZ(20);

render();


function createCylinder(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded) {
  var geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded);
  var material;
  material = new THREE.MeshPhongMaterial({ color: "rgb(255,255,50)" });
  var object = new THREE.Mesh(geometry, material);
  object.castShadow = true;
  return object;
}

function createTorus(radius, tube, radialSegments, tubularSegments, arc) {
  var geometry = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments, arc);
  var material = new THREE.MeshPhongMaterial({ color: "rgb(0,0,0)" });
  var object = new THREE.Mesh(geometry, material);
  object.castShadow = true;
  object.rotateY(degreesToRadians(90));
  return object;
}

function createPlane(x, z) {
  var groundPlane = createGroundPlane(10, 10, 1, 1);
  groundPlane.rotateX(degreesToRadians(-90));
  groundPlane.position.set(x, 0.0, z)
  scene.add(groundPlane);
}


function keyboardUpdate() {

  keyboard.update();
  var rotateAngle = Math.PI / 2 * 0.0025 * sensitivity;

  if (keyboard.pressed("X")) {
    if (speed < maxSpeed) {
      speed += incrementSpeed;
    }
  }
  if (keyboard.pressed("down")) {

    if (speed > -maxSpeed) {
      speed -= incrementSpeed;
    }
  }

  if (speed != 0) {
    if (keyboard.pressed("left")) {
      group.rotateY(rotateAngle);
      camera_look.rotateY(rotateAngle);
    };
    if (keyboard.pressed("right")) {
      group.rotateY(-rotateAngle);
      camera_look.rotateY(-rotateAngle);
    };
  }
}

function movimentCar() {

  // Para o carro em velocidades muito baixas
  if ((speed < incrementSpeed && speed > 0) || speed > incrementSpeed && speed < 0) {
    speed = 0;
  }

  group.translateZ(speed);

  keyboard.update();
  // Desacelera o carro se não precionar nenhum botão
  if (!(keyboard.pressed("X") || keyboard.pressed("down"))) {
    if (speed != 0 && speed > 0) {
      speed -= incrementSpeed;
    }
    if (speed != 0 && speed < 0) {
      speed += incrementSpeed;
    }
  }

  // Desacelera mais o carro caso aperte o botão oposto
  if (speed < 0 && keyboard.pressed("X")) {
    speed += incrementSpeed * 2;
  }

  if (speed > 0 && keyboard.pressed("down")) {
    speed -= incrementSpeed * 2;
  }

  /*roda1.matrixAutoUpdate = false;
  roda2.matrixAutoUpdate = false;
  roda3.matrixAutoUpdate = false;
  roda4.matrixAutoUpdate = false;
  var mat4 = new THREE.Matrix4();
  roda1.matrix.identity();
  roda2.matrix.identity();
  roda3.matrix.identity();
  roda4.matrix.identity();
  roda1.matrix.multiply(mat4.makeRotationZ(angle));
  roda2.matrix.multiply(mat4.makeRotationZ(angle));
  roda3.matrix.multiply(mat4.makeRotationZ(angle));
  roda4.matrix.multiply(mat4.makeRotationZ(angle));*/
}

function moveCamera() {

  var distance = 50;

  camera_look.position.x  = group.position.x;
  camera_look.position.y  = group.position.y;
  camera_look.position.z  = group.position.z;

  camera_look.translateZ(20);

  camera.position.x = camera_look.position.x + distance;
  camera.position.y = 35;
  camera.position.z = camera_look.position.z + distance;

  camera.lookAt(camera_look.position.x, camera_look.position.y, camera_look.position.z);
}

function render() {
  stats.update();
  //trackballControls.update();
  keyboardUpdate();
  movimentCar();
  requestAnimationFrame(render);
  moveCamera();
  renderer.render(scene, camera);
}