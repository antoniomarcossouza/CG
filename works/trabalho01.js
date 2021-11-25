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
  degreesToRadians,
} from '../libs/util/util.js';

/* TIMER - INICIO */
var timerInicio = new Date().getTime();
var timerVoltas = [];
timerVoltas[0] = new Date().getTime();
/* TIMER - FIM */

/* CONFIGURAÇÕES - INICIO */

var inspecionar = false;

var speed = 0;
const maxSpeed = 2.2;
const incrementSpeed = 0.02;

const distance = 50;
const sensitivity = 10;

const track1 = 0;
const track2 = 1000;

/* CONFIGURAÇÕES - FIM */

var scene = new THREE.Scene();
var stats = new Stats();

var renderer = initRenderer();
renderer.setClearColor('rgb(30, 30, 40)');

/* CAMERA - INICIO */
var camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Utilizado para visualizar a camera 20px na frente do carro
var camera_look = new THREE.Group();
camera_look.rotateY(degreesToRadians(-90));

var trackballControls = new TrackballControls(camera, renderer.domElement);

initDefaultBasicLight(scene);

/* CAMERA - FIM */

var keyboard = new KeyboardState();
window.addEventListener(
  'resize',
  function () {
    onWindowResize(camera, renderer);
  },
  false
);

/* PISTA - INICIO */

var trackArray = new Array();

var track = new THREE.Group();

var planeMaterial = new THREE.MeshBasicMaterial({
  color: 'rgba(75, 122, 55)',
  side: THREE.DoubleSide,
});

var planeGeometry1 = new THREE.PlaneGeometry(300, 300);
planeGeometry1.translate(track1, track1 + 100, -0.5);
var plane1 = new THREE.Mesh(planeGeometry1, planeMaterial);
planeGeometry1.rotateX(degreesToRadians(-90));

var planeGeometry2 = new THREE.PlaneGeometry(300, 300);
planeGeometry2.translate(track2, -(track2 - 100), -0.5);
var plane2 = new THREE.Mesh(planeGeometry2, planeMaterial);
planeGeometry2.rotateX(degreesToRadians(-90));

track.add(plane1);
track.add(plane2);


// Pista 1
for (var i = 0; i < 20; i++) {
  for (var j = 0; j < 4; j++) {
    createPlane(track1 + -90 + i * 10, track1 + -20 + j * 10);
  }

  for (var j = 0; j < 4; j++) {
    createPlane(track1 + -90 + 10 * j, track1 + -i * 10);
  }

  for (var j = 0; j < 4; j++) {
    createPlane(track1 + -90 + i * 10, track1 + -200 + 10 * j);
  }

  for (var j = 0; j < 4; j++) {
    createPlane(track1 + 100 - 10 * j, track1 + -i * 10);
  }
}

// Pista 2
for (var i = 0; i < 20; i++) {
  for (var j = 0; j < 4; j++) {
    createPlane(track2 + -90 + i * 10, track2 + -20 + j * 10);
  }
  for (var j = 0; j < 4; j++) {
    createPlane(track2 + -90 + 10 * j, track2 + -i * 10);
  }
}
for (var i = 0; i < 12; i++) {
  for (var j = 0; j < 4; j++) {
    createPlane(track2 + -90 + i * 10, track2 + -20 + j * 10);
  }

  for (var j = 0; j < 4; j++) {
    createPlane(track2 + -90 + 10 * j, track2 + -i * 10);
  }

  for (var j = 0; j < 4; j++) {
    createPlane(track2 + -90 + i * 10, track2 + -200 + 10 * j);
  }

  for (var j = 0; j < 4; j++) {
    createPlane(track2 + 20 - 10 * j, track2 + -80 - i * 10);
  }

  for (var j = 0; j < 4; j++) {
    createPlane(track2 + -10 + i * 10, track2 + -110 + 10 * j);
  }

  for (var j = 0; j < 4; j++) {
    createPlane(track2 + 100 - 10 * j, track2 + -i * 10);
  }

}

scene.add(track);

/* PISTA - FIM */

/* CARRO - INICIO */

var carro = new THREE.Group();

var corpo = createBox(5.5, 13, 3, 'rgb(22, 148, 186)');
corpo.rotateX(degreesToRadians(90));
corpo.position.set(0.0, 1, 0.0);
carro.add(corpo);

var corpo2 = createBox(5.5, 5, 3, 'rgb(22, 148, 186)');
corpo2.rotateX(degreesToRadians(90));
corpo2.position.set(0.0, 4, 0.0);
carro.add(corpo2);

var janela1 = createBox(5, 5.1, 2.5, 'rgb(41, 43, 43)');
janela1.rotateX(degreesToRadians(90));
janela1.position.set(0.0, 4, 0.0);
carro.add(janela1);

var janela2 = createBox(5.6, 4.5, 2.5, 'rgb(41, 43, 43)');
janela2.rotateX(degreesToRadians(90));
janela2.position.set(0.0, 4, 0.0);
carro.add(janela2);

var divisor_janela = createBox(5.7, 0.30, 2.5, 'rgb(22, 148, 186)');
divisor_janela.rotateX(degreesToRadians(90));
divisor_janela.position.set(0.0, 4, -0.5);
carro.add(divisor_janela);

var para_choque1 = createBox(6.25, 0.5, 0.5, 'rgb(168, 173, 173)');
para_choque1.rotateX(degreesToRadians(90));
para_choque1.position.set(0.0, -0.25, 6.5);
carro.add(para_choque1);

var para_choque2 = createBox(6.25, 0.5, 0.5, 'rgb(168, 173, 173)');
para_choque2.rotateX(degreesToRadians(90));
para_choque2.position.set(0.0, -0.25, -6.5);
carro.add(para_choque2);

var farol_frente1 = createBox(1, 0.5, 0.5, 'rgb(255,255,50)');
farol_frente1.rotateX(degreesToRadians(90));
farol_frente1.position.set(2.0, 1.75, 6.5);
carro.add(farol_frente1);

var farol_frente2 = createBox(1, 0.5, 0.5, 'rgb(255,255,50)');
farol_frente2.rotateX(degreesToRadians(90));
farol_frente2.position.set(-2.0, 1.75, 6.5);
carro.add(farol_frente2);

var farol_tras1 = createBox(1, 0.5, 0.5, 'rgb(196, 35, 35)');
farol_tras1.rotateX(degreesToRadians(90));
farol_tras1.position.set(2.0, 1.75, -6.5);
carro.add(farol_tras1);

var farol_tras2 = createBox(1, 0.5, 0.5, 'rgb(196, 35, 35)');
farol_tras2.rotateX(degreesToRadians(90));
farol_tras2.position.set(-2.0, 1.75, -6.5);
carro.add(farol_tras2);

var eixo1 = createCylinder(0.3, 0.3, 7.0, 10, 10, false, 'rgb(132, 142, 156)');
eixo1.rotateZ(degreesToRadians(90));
eixo1.position.set(0.0, -1.0, 4.0);
carro.add(eixo1);

var eixo2 = createCylinder(0.3, 0.3, 7.0, 10, 10, false, 'rgb(132, 142, 156)');
eixo2.rotateZ(degreesToRadians(90));
eixo2.position.set(0.0, -1.0, -4.0);
carro.add(eixo2);

var roda1 = createTorus(1.0, 0.35, 20, 20, Math.PI * 2);
roda1.position.set(3.5, -1.0, 4.0);
carro.add(roda1);

var roda2 = createTorus(1.0, 0.35, 20, 20, Math.PI * 2);
roda2.position.set(-3.5, -1.0, 4.0);
carro.add(roda2);

var roda3 = createTorus(1.0, 0.35, 20, 20, Math.PI * 2);
roda3.position.set(3.5, -1.0, -4.0);
carro.add(roda3);

var roda4 = createTorus(1.0, 0.35, 20, 20, Math.PI * 2);
roda4.position.set(-3.5, -1.0, -4.0);
carro.add(roda4);

scene.add(carro);

carro.translateY(2.2);
carro.rotateY(degreesToRadians(-90));

/* CARRO - FIM */

// Mudar o modo da camera
document.addEventListener('keypress', function (e) {
  if (e.keyCode === 32) {
    track.visible = inspecionar;
    inspecionar == true ? (inspecionar = false) : (inspecionar = true);

    if (inspecionar == true) {
      carro.position.x = 0;
      carro.position.y = 2.3;
      carro.position.z = 0;
    }

    camera.up.set(0, 1, 0);
  }

  if (e.keyCode === 49) {
    carro.position.x = track1;
    carro.position.y = 2.3;
    carro.position.z = track1;

    camera.up.set(0, 1, 0);
  }

  if (e.keyCode === 50) {
    carro.position.x = track2;
    carro.position.y = 2.3;
    carro.position.z = track2;

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

function createBox(
  width,
  height,
  depth,
  color
) {
  var geometry = new THREE.BoxGeometry(
    width,
    height,
    depth,
  );
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

function createTorus(radius, tube, radialSegments, tubularSegments, arc) {
  var geometry = new THREE.TorusGeometry(
    radius,
    tube,
    radialSegments,
    tubularSegments,
    arc
  );
  var material = new THREE.MeshPhongMaterial({ color: 'rgb(30, 30, 31)' });
  var object = new THREE.Mesh(geometry, material);
  object.castShadow = true;
  object.rotateY(degreesToRadians(90));
  return object;
}

function createPlane(x, z) {
  var groundPlane = createGroundPlane(10, 10, 1, 1);
  groundPlane.rotateX(degreesToRadians(-90));
  groundPlane.position.set(x, 0.0, z);
  track.add(groundPlane);

  trackArray.push({ x: x, z: z });
}

function keyboardUpdate() {
  keyboard.update();
  var rotateAngle = (Math.PI / 2) * 0.0025 * sensitivity;

  if (keyboard.pressed('X') || keyboard.pressed('up')) {
    if (speed < maxSpeed) {
      speed += incrementSpeed;
    }
  }
  if (keyboard.pressed('down') || keyboard.pressed('Z')) {
    if (speed > -maxSpeed) {
      speed -= incrementSpeed;
    }
  }

  if (speed != 0) {
    if (keyboard.pressed('left')) {
      carro.rotateY(rotateAngle);
      camera_look.rotateY(rotateAngle);
    } else if (keyboard.pressed('right')) {
      carro.rotateY(-rotateAngle);
      camera_look.rotateY(-rotateAngle);
    }
  }

  if (keyboard.pressed('left')) {
    if (roda1.rotation._y > 0.9) {
      roda1.rotateY(rotateAngle / 2);
      roda2.rotateY(rotateAngle / 2);
    }
  } else if (keyboard.pressed('right')) {
    if (roda1.rotation._y > 0.9) {
      roda1.rotateY(-rotateAngle / 2);
      roda2.rotateY(-rotateAngle / 2);
    }
  }

  if (!keyboard.pressed('right') && !keyboard.pressed('left')) {
    roda1.setRotationFromEuler(
      new THREE.Euler(roda1.rotation._x, 1.57, roda1.rotation._z, 'XYZ')
    );
    roda2.setRotationFromEuler(
      new THREE.Euler(roda1.rotation._x, 1.57, roda2.rotation._z, 'XYZ')
    );
  }
}


function movimentCar() {

  if (!(trackArray.some(e => ((e.x === Math.ceil(carro.position.x / 10) * 10) && (e.z === Math.ceil(carro.position.z / 10) * 10))))) {
    if (speed > 1) {
      speed = speed / 2;
    }
  }

  // Para o carro em velocidades muito baixas
  if (
    (speed < incrementSpeed && speed > 0) ||
    (speed > incrementSpeed && speed < 0)
  ) {
    speed = 0;
  }

  carro.translateZ(speed);

  keyboard.update();
  // Desacelera o carro se não precionar nenhum botão
  if (!(keyboard.pressed('X') || keyboard.pressed('down') || keyboard.pressed('X') || keyboard.pressed('up'))) {
    if (speed != 0 && speed > 0) {
      speed -= incrementSpeed;
    }
    if (speed != 0 && speed < 0) {
      speed += incrementSpeed;
    }
  }

  // Desacelera mais o carro caso aperte o botão oposto
  if (speed < 0 && keyboard.pressed('X')) {
    speed += incrementSpeed * 2;
  }

  if (speed > 0 && keyboard.pressed('down')) {
    speed -= incrementSpeed * 2;
  }

}

function moveCamera() {
  if (inspecionar == false) {
    camera_look.position.x = carro.position.x;
    camera_look.position.y = carro.position.y;
    camera_look.position.z = carro.position.z;

    camera_look.translateZ(20);

    camera.position.x = camera_look.position.x + distance;
    camera.position.y = 35;
    camera.position.z = camera_look.position.z + distance;

    camera.lookAt(
      camera_look.position.x,
      camera_look.position.y,
      camera_look.position.z
    );
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
