import * as THREE from '../build/three.module.js';
import Stats from '../build/jsm/libs/stats.module.js';
import { TrackballControls } from '../build/jsm/controls/TrackballControls.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import {
  initRenderer,
  InfoBox,
  initDefaultBasicLight,
  createGroundPlane,
  onWindowResize,
  degreesToRadians
} from "../libs/util/util.js";

/* TIMER - INICIO */
var timerInicio = new Date().getTime();
var timerVoltas = [];
timerVoltas[0] = new Date().getTime();
/* TIMER - FIM */

/* CONFIGURAÇÕES - INICIO */

var inspecionar = false;

var speed = 0;
const maxSpeed = 2.5;
const incrementSpeed = 0.024;

const distance = 50;
const sensitivity = 15;

/* CONFIGURAÇÕES - FIM */

var scene = new THREE.Scene();
var stats = new Stats();

var renderer = initRenderer();
renderer.setClearColor("rgb(30, 30, 40)");

/* CAMERA - INICIO */
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

// Utilizado para visualizar a camera 20px na frente do carro
var camera_look = new THREE.Group();
camera_look.rotateY(degreesToRadians(-90));

var trackballControls = new TrackballControls(camera, renderer.domElement);

initDefaultBasicLight(scene);

/* CAMERA - FIM */

var keyboard = new KeyboardState();
window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

/* PISTA - INICIO */

var track = new THREE.Group();

var planeGeometry = new THREE.PlaneGeometry(300, 300);
planeGeometry.translate(0.0, 100, -0.5);
var planeMaterial = new THREE.MeshBasicMaterial({
  color: "rgba(86, 125, 70)",
  side: THREE.DoubleSide,
});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
planeGeometry.rotateX(degreesToRadians(-90));

track.add(plane);

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

scene.add(track);

/* PISTA - FIM */

/* CARRO - INICIO */

var car = new THREE.Group();

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

car.add(body);
car.add(eixo1);
car.add(eixo2);
car.add(roda1);
car.add(roda2);
car.add(roda3);
car.add(roda4);

scene.add(car);

car.translateY(2.3);
car.rotateY(degreesToRadians(-90));

/* CARRO - FIM */

// Mudar o modo da camera
document.addEventListener("keypress", function (e) {
  if (e.keyCode === 32) {
    track.visible = inspecionar;
    inspecionar == true ? inspecionar = false : inspecionar = true;

    if (inspecionar == true) {

      car.position.x = 0;
      car.position.y = 2.3;
      car.position.z = 0;
    }

    camera.up.set(0, 1, 0);

  }
});

// Atualiza o timer
timerUpdate();

render();


function timerUpdate() {
  var timer = new Date().getTime() - timerInicio;

  var minutes = Math.floor((timer % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((timer % (1000 * 60)) / 1000);

  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  if (document.getElementById("InfoxBox") == null) {
    information = new InfoBox();
    information.infoBox.style.backgroundColor = "rgba(0, 0, 0, 0.65)";
    information.infoBox.style.color = "rgb(242, 242, 242)";
    information.show();
  }

  var information = document.getElementById("InfoxBox");
  information.innerHTML = "Volta (?/?)<br><br>Tempo da volta: " + minutes + ":" + seconds + "<br>Tempo total: " + minutes + ":" + seconds

  setTimeout(function () {
    timerUpdate();
  }, 1000);
}

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
  track.add(groundPlane);
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
      car.rotateY(rotateAngle);
      camera_look.rotateY(rotateAngle);
    }
    if (keyboard.pressed("right")) {
      car.rotateY(-rotateAngle);
      camera_look.rotateY(-rotateAngle);
    }
  }

}
function movimentCar() {

  // Para o carro em velocidades muito baixas
  if ((speed < incrementSpeed && speed > 0) || speed > incrementSpeed && speed < 0) {
    speed = 0;
  }

  car.translateZ(speed);

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

  if (inspecionar == false) {

    camera_look.position.x = car.position.x;
    camera_look.position.y = car.position.y;
    camera_look.position.z = car.position.z;

    camera_look.translateZ(20);

    camera.position.x = camera_look.position.x + distance;
    camera.position.y = 35;
    camera.position.z = camera_look.position.z + distance;

    camera.lookAt(camera_look.position.x, camera_look.position.y, camera_look.position.z);
  }

}

function render() {
  stats.update();

  // Modo de inspeção
  if (inspecionar == true) {
    trackballControls.update();
  }

  // Faz a verificação do botões que estão sendo apertados
  keyboardUpdate();

  // Movimenta o carro 
  movimentCar();

  // Faz a animação da camera
  moveCamera();

  requestAnimationFrame(render);
  renderer.render(scene, camera);
}