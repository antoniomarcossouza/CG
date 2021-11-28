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
var lap = 0;
var timerVoltas = [];
var canFinish = 2;
var totalLap = 4;
/* TIMER - FIM */

/* CONFIGURAÇÕES - INICIO */

var inspecionar = false;
var finalizou = false;

var speed = 0;
const maxSpeed = 2.6;
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
var finishLineArray = new Array();

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
for (var i = 0; i < 4; i++) {
  createFinishLine(-10, - 20 + track1 + i * 10, i);
}
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
for (var i = 0; i < 4; i++) {
  createFinishLine(track2 - 10, - 20 + track2 + i * 10, i);
}
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

var car = new THREE.Group();

var corpo = createBox(5.5, 13, 3, 'rgb(22, 148, 186)');
corpo.rotateX(degreesToRadians(90));
corpo.position.set(0.0, 1, 0.0);
car.add(corpo);

var corpo2 = createBox(5.5, 5, 3, 'rgb(22, 148, 186)');
corpo2.rotateX(degreesToRadians(90));
corpo2.position.set(0.0, 4, 0.0);
car.add(corpo2);

var janela1 = createBox(5, 5.1, 2.5, 'rgb(41, 43, 43)');
janela1.rotateX(degreesToRadians(90));
janela1.position.set(0.0, 4, 0.0);
car.add(janela1);

var janela2 = createBox(5.6, 4.5, 2.5, 'rgb(41, 43, 43)');
janela2.rotateX(degreesToRadians(90));
janela2.position.set(0.0, 4, 0.0);
car.add(janela2);

var divisor_janela = createBox(5.7, 0.30, 2.5, 'rgb(22, 148, 186)');
divisor_janela.rotateX(degreesToRadians(90));
divisor_janela.position.set(0.0, 4, -0.5);
car.add(divisor_janela);

var para_choque1 = createBox(6.25, 0.5, 0.5, 'rgb(168, 173, 173)');
para_choque1.rotateX(degreesToRadians(90));
para_choque1.position.set(0.0, -0.25, 6.5);
car.add(para_choque1);

var para_choque2 = createBox(6.25, 0.5, 0.5, 'rgb(168, 173, 173)');
para_choque2.rotateX(degreesToRadians(90));
para_choque2.position.set(0.0, -0.25, -6.5);
car.add(para_choque2);

var farol_frente1 = createBox(1, 0.5, 0.5, 'rgb(255,255,50)');
farol_frente1.rotateX(degreesToRadians(90));
farol_frente1.position.set(2.0, 1.75, 6.5);
car.add(farol_frente1);

var farol_frente2 = createBox(1, 0.5, 0.5, 'rgb(255,255,50)');
farol_frente2.rotateX(degreesToRadians(90));
farol_frente2.position.set(-2.0, 1.75, 6.5);
car.add(farol_frente2);

var farol_tras1 = createBox(1, 0.5, 0.5, 'rgb(196, 35, 35)');
farol_tras1.rotateX(degreesToRadians(90));
farol_tras1.position.set(2.0, 1.75, -6.5);
car.add(farol_tras1);

var farol_tras2 = createBox(1, 0.5, 0.5, 'rgb(196, 35, 35)');
farol_tras2.rotateX(degreesToRadians(90));
farol_tras2.position.set(-2.0, 1.75, -6.5);
car.add(farol_tras2);

var eixo1 = createCylinder(0.3, 0.3, 7.0, 10, 10, false, 'rgb(132, 142, 156)');
eixo1.rotateZ(degreesToRadians(90));
eixo1.position.set(0.0, -1.0, 4.0);
car.add(eixo1);

var eixo2 = createCylinder(0.3, 0.3, 7.0, 10, 10, false, 'rgb(132, 142, 156)');
eixo2.rotateZ(degreesToRadians(90));
eixo2.position.set(0.0, -1.0, -4.0);
car.add(eixo2);

var roda1 = createTorus(1.0, 0.35, 20, 20, Math.PI * 2);
roda1.position.set(3.5, -1.0, 4.0);
car.add(roda1);

var roda2 = createTorus(1.0, 0.35, 20, 20, Math.PI * 2);
roda2.position.set(-3.5, -1.0, 4.0);
car.add(roda2);

var roda3 = createTorus(1.0, 0.35, 20, 20, Math.PI * 2);
roda3.position.set(3.5, -1.0, -4.0);
car.add(roda3);

var roda4 = createTorus(1.0, 0.35, 20, 20, Math.PI * 2);
roda4.position.set(-3.5, -1.0, -4.0);
car.add(roda4);

scene.add(car);

car.translateY(2.2);
car.rotateY(degreesToRadians(-90));

/* CARRO - FIM */

// Mudar o modo da camera
document.addEventListener('keypress', function (e) {
  if (e.keyCode === 32) {
    track.visible = inspecionar;
    inspecionar == true ? (inspecionar = false) : (inspecionar = true);

    resetCar(track1, track1);
  }

  if (e.keyCode === 49) {
    resetCar(track1, track1);
  }

  if (e.keyCode === 50) {
    resetCar(track2, track2);
  }

});

// Atualiza o timer
timerUpdate();

render();

function resetCar(x, y) {
  car.position.x = x;
  car.position.y = 2.3;
  car.position.z = y;

  camera.up.set(0, 1, 0);

  speed = 0;
  canFinish = 2;
  lap = 0;

  finalizou = false;
 }

function timerUpdate() {

  if (finalizou == false) {
    if (document.getElementById("InfoxBox") == null) {
      information = new InfoBox();
      information.infoBox.style.backgroundColor = "rgba(0, 0, 0, 0.65)";
      information.infoBox.style.color = "rgb(242, 242, 242)";
      information.show();
    }

    var information = document.getElementById("InfoxBox");

    if (lap > 0) {

      information.style.width = '180px';
      information.style.height = '110px';
      information.style.display = 'block';

      var seconds = timerVoltas[lap] % 60;
      var minutes = (timerVoltas[lap] - seconds) / 60;

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      var total = 0;
      for (var i = 1; i <= lap; i++) {
        total += timerVoltas[i];
      }

      var secondsTotal = total % 60;
      var minutesTotal = (total - secondsTotal) / 60;

      minutesTotal = minutesTotal < 10 ? "0" + minutesTotal : minutesTotal;
      secondsTotal = secondsTotal < 10 ? "0" + secondsTotal : secondsTotal;

      information.innerHTML = "Volta (" + lap + "/" + totalLap + ")<br><br>Tempo da volta: " + minutes + ":" + seconds + "<br>Tempo total: " + minutesTotal + ":" + secondsTotal + "<br><br>Velocidade: " + Math.round(speed * 10) + " KM/h";

      timerVoltas[lap]++;

    } else {
      information.innerHTML = "";

      information.style.display = 'none';
    }
  }
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

function createFinishLine(x, z, i) {
  var color = i % 2 == 0 ? "rgb(255,255,255)" : "rgb(0,0,0)";
  var groundPlane = createGroundPlane(5, 10, 1, 1, color);
  groundPlane.rotateX(degreesToRadians(-90));
  groundPlane.position.set(x, 0.1, z);
  track.add(groundPlane);

  finishLineArray.push({ x: x, z: z });
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
      car.rotateY(rotateAngle);
      camera_look.rotateY(rotateAngle);
    } else if (keyboard.pressed('right')) {
      car.rotateY(-rotateAngle);
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

  if (inspecionar == true || finalizou == true) {
    speed = 0;
  }

  // Verifica se o carro ta dentro da pista
  if (!(trackArray.some(e => ((e.x === Math.ceil(car.position.x / 10) * 10) && (e.z === Math.ceil(car.position.z / 10) * 10))))) {
    if (speed > maxSpeed / 2) {
      speed -= (2.4 * incrementSpeed);
    }
  }

  // Verifica se o carro passou na linha de chegada
  if (finishLineArray.some(e => ((e.x === Math.ceil(car.position.x / 10) * 10) && (e.z === Math.ceil(car.position.z / 10) * 10)))) {
    if (canFinish == 2) {

      if (lap == totalLap) {
        track.visible = true;

        var information = document.getElementById("InfoxBox");

        var total = 0;
        var texto = "";

        for (var i = 1; i <= lap; i++) {
          var seconds = timerVoltas[i] % 60;
          var minutes = (timerVoltas[i] - seconds) / 60;

          minutes = minutes < 10 ? "0" + minutes : minutes;
          seconds = seconds < 10 ? "0" + seconds : seconds;

          total += timerVoltas[i];

          texto += "<br>Volta " + i + " - " + minutes + ":" + seconds;
        }

        var secondsTotal = total % 60;
        var minutesTotal = (total - secondsTotal) / 60;

        minutesTotal = minutesTotal < 10 ? "0" + minutesTotal : minutesTotal;
        secondsTotal = secondsTotal < 10 ? "0" + secondsTotal : secondsTotal;

        information.innerHTML = "<div id='fim'> <h1>Parábens, você concluiu a corrida</h1> <h2>" + texto + "</h2> <br> <h3>Tempo total: " + minutesTotal + ":" + secondsTotal + "</h3> </div>";
        
        information.style.width = '100%';
        information.style.height = '100%';

        var fim = document.getElementById("fim");

        fim.style.color = "rgb(0, 0, 0)";
        fim.style.bottom = '0';
        fim.style.textAlign = 'center';
        fim.style.color = '#FFF';
        fim.style.fontSize = '42px';

        //resetCar(track1, track1);
        finalizou = true;

      }

      lap++;
      timerVoltas[lap] = 0;
      canFinish = 0;

    }
  }

  // Verifica se o carro deu a volta na pista (Passou em cima)
  if (canFinish == 0 && (Math.abs(car.position.z) > track1 + 150 && Math.abs(car.position.z) < track1 + 250) || Math.abs(car.position.z) < track2 - 150 && Math.abs(car.position.z) > track2 - 250) {
    canFinish = 1;
  }
  // Verifica se o carro deu a volta na pista (Passou do lado direito)
  if (canFinish == 1 && (car.position.x > -track1 + 60 && car.position.x < -track1 + 120) || car.position.x > track2 + 60 && car.position.z < track2 + 120) {
    canFinish = 2;
  }

  // Para o carro em velocidades muito baixas
  if (
    (speed < incrementSpeed && speed > 0) ||
    (speed > incrementSpeed && speed < 0)
  ) {
    speed = 0;
  }

  car.translateZ(speed);

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
    camera_look.position.x = car.position.x;
    camera_look.position.y = car.position.y;
    camera_look.position.z = car.position.z;

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
