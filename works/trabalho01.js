import * as THREE from '../build/three.module.js';
import Stats from '../build/jsm/libs/stats.module.js';
import { TrackballControls } from '../build/jsm/controls/TrackballControls.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import {
  initRenderer,
  InfoBox,
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
const maxSpeed = 3.4;
const incrementSpeed = 0.5;

const distance = 50;
const sensitivity = 10;

const track1 = 0;
const track2 = 1000;
const track3 = 2000;
const track4 = 3000;

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

var spotLight = new THREE.SpotLight(0xffffff);
spotLight.castShadow = true;
spotLight.angle = 60;
spotLight.penumbra = 0.2;
spotLight.decay = 0.4;
spotLight.shadowMapSize = 1024;
spotLight.distance = 0;
scene.add(spotLight)

var trackballControls = new TrackballControls(camera, renderer.domElement);

/* CAMERA - FIM */

/* MINIMAPA - INICIO */
const altura_minimap = 600;
const lookAtVec = new THREE.Vector3(0.0, 0.0, -180.0);
const camPosition = new THREE.Vector3(0.0, altura_minimap, -180.0);
const upVec = new THREE.Vector3(0.0, 1.0, 0.0);
const vcWidth = 200;
const vcHeidth = 200;

var virtualCamera = new THREE.PerspectiveCamera(45, vcWidth / vcHeidth, 1.0, altura_minimap + 2);
virtualCamera.position.copy(camPosition);
virtualCamera.up.copy(upVec);
virtualCamera.lookAt(lookAtVec);

/* MINIMAPA - FIM */

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

var planeGeometry1 = new THREE.PlaneGeometry(1000, 1000);
planeGeometry1.translate(track1, track1 + 190, -0.5);
var plane1 = new THREE.Mesh(planeGeometry1, planeMaterial);
planeGeometry1.rotateX(degreesToRadians(-90));

var planeGeometry2 = new THREE.PlaneGeometry(1000, 1000);
planeGeometry2.translate(track2, -(track2 - 190), -0.5);
var plane2 = new THREE.Mesh(planeGeometry2, planeMaterial);
planeGeometry2.rotateX(degreesToRadians(-90));

track.add(plane1);
track.add(plane2);


// Pista 1
for (var i = 0; i < 6; i++) {
  createFinishLine(-10, - 20 + track1 + i * 10, i);
}
for (var i = 0; i < 40; i++) {
  for (var j = 0; j < 6; j++) {
    createStreet(track1 + -200 + i * 10, track1 + -20 + j * 10);
  }

  for (var j = 0; j < 6; j++) {
    createStreet(track1 + -200 + 10 * j, track1 + -i * 10);
  }

  for (var j = 0; j < 6; j++) {
    createStreet(track1 + -200 + i * 10, track1 + -400 + 10 * j);
  }

  for (var j = 0; j < 6; j++) {
    createStreet(track1 + 190 - 10 * j, track1 + -i * 10);
  }
}

// Pista 2
for (var i = 0; i < 6; i++) {
  createFinishLine(track2 - 10, - 20 + track2 + i * 10, i);
}
for (var i = 0; i < 40; i++) {
  for (var j = 0; j < 6; j++) {
    createStreet(track2 + -200 + i * 10, track2 + -20 + j * 10);
  }
  for (var j = 0; j < 6; j++) {
    createStreet(track2 + -200 + 10 * j, track2 + -i * 10);
  }
}
for (var i = 0; i < 24; i++) {
  for (var j = 0; j < 6; j++) {
    createStreet(track2 + -200 + i * 10, track2 + -400 + j * 10);
  }

  for (var j = 0; j < 6; j++) {
    createStreet(track2 + -20 + 10 * j, track2 + -i * 10 - 160);
  }

  for (var j = 0; j < 6; j++) {
    createStreet(track2 + -20 + i * 10, track2 + -200 + 10 * j);
  }

  for (var j = 0; j < 6; j++) {
    createStreet(track2 + 210 - 10 * j, track2 + 30 - i * 10);
  }

}

scene.add(track);

/* ELEVAÇÕES - INICIO */

var trackElevationArray = new Array();

var elevacao1 = createBox(20, 60, 3, 'rgb(150, 150, 150)');
elevacao1.rotateX(degreesToRadians(-65));
elevacao1.rotateZ(degreesToRadians(90));
elevacao1.position.set(-175.0, 2, -180.0);
track.add(elevacao1);
trackElevationArray.push(elevacao1);

var elevacao2 = createBox(20, 60, 3, 'rgb(150, 150, 150)');
elevacao2.rotateX(degreesToRadians(90));
elevacao2.rotateY(degreesToRadians(25));
elevacao2.position.set(0.0, 2, -375.0);
track.add(elevacao2);
trackElevationArray.push(elevacao2);

var elevacao3 = createBox(20, 60, 3, 'rgb(150, 150, 150)');
elevacao3.rotateX(degreesToRadians(65));
elevacao3.rotateZ(degreesToRadians(90));
elevacao3.position.set(165.0, 2, -180.0);
track.add(elevacao3);
trackElevationArray.push(elevacao3);



/* ELEVAÇÕES - FIM */


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

  if (e.keyCode === 51) {
    resetCar(track3, track3);
  }

  if (e.keyCode === 52) {
    resetCar(track4, track4);
  }

});

// Atualiza o timer
timerUpdate();

render();

function resetCar(x, y) {
  car.position.x = x;
  car.position.y = 2.3;
  car.position.z = y;

  car.rotation.y = -Math.PI / 2;
  camera_look.rotation.y = -Math.PI / 2;

  camera.up.set(0, 1, 0);

  speed = 0;
  canFinish = 2;
  lap = 0;

  finalizou = false;

  virtualCamera.position.x = x;
  virtualCamera.position.z = y - 180;
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

      information.innerHTML = "Volta (" + lap + "/" + totalLap + ")<br><br>Tempo da volta: " + minutes + ":" + seconds + "<br>Tempo total: " + minutesTotal + ":" + secondsTotal + "<br><br>Velocidade: " + Math.abs(Math.round(speed * 10)) + " KM/h";

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

function createStreet(x, z) {
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
  var rotateAngle = (Math.PI / 2) * (speed / 2 * 0.0024) * sensitivity;
  var rotateAngleRoda = (Math.PI / 2) * 0.0024 * sensitivity;

  // Acrecenta velocidade ao carro
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

  // Faz o carro virar
  if (speed != 0) {
    if (keyboard.pressed('left')) {
      car.rotateY(rotateAngle);
      camera_look.rotateY(rotateAngle);
    } else if (keyboard.pressed('right')) {
      car.rotateY(-rotateAngle);
      camera_look.rotateY(-rotateAngle);
    }
  }

  // Movimentação das rodas
  if (speed >= 0) {
    if (keyboard.pressed('left')) {
      if (roda1.rotation._y > 0.9) {
        roda1.rotateY(rotateAngleRoda / 2);
        roda2.rotateY(rotateAngleRoda / 2);
      }
    } else if (keyboard.pressed('right')) {
      if (roda1.rotation._y > 0.9) {
        roda1.rotateY(-rotateAngleRoda / 2);
        roda2.rotateY(-rotateAngleRoda / 2);
      }
    }
  } else {
    if (keyboard.pressed('left')) {
      if (roda1.rotation._y > 0.9) {
        roda1.rotateY(-rotateAngleRoda / 2);
        roda2.rotateY(-rotateAngleRoda / 2);
      }
    } else if (keyboard.pressed('right')) {
      if (roda1.rotation._y > 0.9) {
        roda1.rotateY(rotateAngleRoda / 2);
        roda2.rotateY(rotateAngleRoda / 2);
      }
    }
  }

  // Faz as rodas ficarem retas novamentas
  if (!keyboard.pressed('right') && !keyboard.pressed('left')) {
    roda1.setRotationFromEuler(
      new THREE.Euler(roda1.rotation._x, 1.57, roda1.rotation._z, 'XYZ')
    );
    roda2.setRotationFromEuler(
      new THREE.Euler(roda1.rotation._x, 1.57, roda2.rotation._z, 'XYZ')
    );
  }
}

function detectCollisionCubes(object1, object2) {
  object1.geometry.computeBoundingBox(); //not needed if its already calculated
  object2.geometry.computeBoundingBox();
  object1.updateMatrixWorld();
  object2.updateMatrixWorld();

  var box1 = object1.geometry.boundingBox.clone();
  box1.applyMatrix4(object1.matrixWorld);

  var box2 = object2.geometry.boundingBox.clone();
  box2.applyMatrix4(object2.matrixWorld);

  return box1.intersectsBox(box2);
}


function movimentCar() {

  if (inspecionar == true || finalizou == true) {
    speed = 0;
  }

  // Verifica se o carro ta dentro da pista
  if (!(trackArray.some(e => ((e.x === Math.ceil(car.position.x / 10) * 10) && (e.z === Math.ceil(car.position.z / 10) * 10))))) {
    if (speed > 0 && speed > maxSpeed / 2) {
      speed -= (2.4 * incrementSpeed);
    }
    if (speed < 0 && speed < -(maxSpeed / 2)) {
      speed += (2.4 * incrementSpeed);
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
  if (canFinish == 0 && (Math.abs(car.position.z) > track1 + 340 && Math.abs(car.position.z) < track1 + 400) || Math.abs(car.position.z) < track2 - 340 && Math.abs(car.position.z) > track2 - 400) {
    canFinish = 1;
  }
  // Verifica se o carro deu a volta na pista (Passou do lado direito)
  if (canFinish == 1 && (car.position.x > -track1 + 150 && car.position.x < -track1 + 200) || car.position.x > track2 + 150 && car.position.z < track2 + 200) {
    canFinish = 2;
  }

  // Para o carro em velocidades muito baixas
  if (
    (speed < incrementSpeed && speed > 0) ||
    (speed > incrementSpeed && speed < 0)
  ) {
    speed = 0;
  }

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

  car.translateZ(speed);

  if (speed > 0) {
    var rotateAngle = Math.PI / 2 * (0.022 * speed);
    var rampa = false;

    trackElevationArray.forEach(function (te) {

      if (detectCollisionCubes(roda1, te)) {
        car.rotateX(-rotateAngle);
        rampa = true;
      }

    });


    if (rampa == false) {

      /*if (car.position.y <= 2.2 && car.position.y != 2.2) {
        car.setRotationFromEuler(
          new THREE.Euler(car.rotation._x, 1.57, car.rotation._z, 'XYZ')
        );
  
      }*/

      if (car.position.y > 3) {
        car.rotateX(rotateAngle);
      }
    }
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


    spotLight.position.set(camera_look.position.x + distance, 50, camera_look.position.z)
    spotLight.target.position.set(car.position.x, car.position.y, car.position.zF);


  }
}

function controlledRender() {
  var width = window.innerWidth;
  var height = window.innerHeight;

  // Set main viewport
  renderer.setViewport(0, 0, width, height);
  renderer.setScissorTest(false);
  renderer.setClearColor("rgb(80, 70, 170)");
  renderer.clear();
  renderer.render(scene, camera);

  // Set virtual camera viewport 
  renderer.setViewport(0, height - vcHeidth, vcWidth, vcHeidth);
  renderer.setScissor(0, height - vcHeidth, vcWidth, vcHeidth);
  renderer.setScissorTest(true);
  renderer.setClearColor("rgb(60, 50, 150)");
  renderer.clear();
  renderer.render(scene, virtualCamera);
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

  controlledRender();
}
