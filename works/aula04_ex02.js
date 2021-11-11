import * as THREE from '../build/three.module.js';
import { GUI } from '../build/jsm/libs/dat.gui.module.js';
import { TrackballControls } from '../build/jsm/controls/TrackballControls.js';
import {
  initRenderer,
  initDefaultBasicLight,
  onWindowResize
} from "../libs/util/util.js";

//Inspired by mrdoob / three.js
var scene = new THREE.Scene(); // Create main scene
var renderer = initRenderer(); // View function in util/utils
var camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
var trackballControls = new TrackballControls(camera, renderer.domElement);
initDefaultBasicLight(scene);

camera.lookAt(0, 0, 3);
camera.position.set(30, 50, 30);
camera.up.set(0, 0, 1);

var position_array = [0, 0, 0];
var in_motion = false;

// create the ground plane
var planeGeometry = new THREE.PlaneGeometry(25, 25);
planeGeometry.translate(0, 0, -0.02); // To avoid conflict with the axeshelper
var planeMaterial = new THREE.MeshBasicMaterial({
  color: "rgba(150, 150, 150)",
  side: THREE.DoubleSide,
});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);

// ESFERA GRANDE
var sphereGeometry = new THREE.SphereGeometry(1, 64, 64);
var sphereMaterial = new THREE.MeshNormalMaterial();
var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(0, 0, 1.0);
scene.add(sphere);

// ESFERA PEQUENA
var smallSphereGeometry = new THREE.SphereGeometry(0.25, 64, 64);
var smallSphereMaterial = new THREE.MeshBasicMaterial({ color: 0x40ffac });
var smallSphere = new THREE.Mesh(smallSphereGeometry, smallSphereMaterial);
smallSphere.position.set(0, 0, 1.0);
scene.add(smallSphere);

// Listen window size changes
window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

moveSphere();
buildInterface();
render();

function moveSphere() {
  if (in_motion == true) {
    var target_coordinates = new THREE.Vector3(position_array[0], position_array[1], position_array[2]);

    if (target_coordinates.equals(sphere.position) == false) {
      target_coordinates.sub(sphere.position); //Subtrai a posição da esfera maior da coordenada alvo caso ela não esteja lá, sem isso ela anda infinitamente para o infinito e além
    }

    var velocidade = 35;

    if (target_coordinates.length() > 0) {
      target_coordinates.divideScalar(velocidade); //Divide o vetor pelo escalar, fazendo o "vetor de deslocamento", assim a bola maior se aproxima do alvo em "passos", e não de uma vez
    }

    if (sphere.position.distanceTo(smallSphere.position) > 0.01) { //Tem que ser 0.01 se não ela fica constantemente perseguindo a bolinha menor
      sphere.position.add(target_coordinates);
    } else {
      sphere.position.set(position_array[0], position_array[1], position_array[2]);
      in_motion = false;
    }
    requestAnimationFrame(moveSphere);
  }
}

function buildInterface() {
  var controls = new function () {

    this.positionX = 0;
    this.positionY = 0;
    this.positionZ = 1;

    this.onChangeAnimation = function () {
      position_array[0] = this.positionX;
      position_array[1] = this.positionY;
      position_array[2] = this.positionZ;
      in_motion = true;
      moveSphere();
    };

    this.changePosition = function () {
      position_array[0] = this.positionX;
      position_array[1] = this.positionY;
      position_array[2] = this.positionZ;
      smallSphere.position.set(position_array[0], position_array[1], position_array[2]);
    };

  };

  var gui = new GUI();
  const targetFolder = gui.addFolder("Coordenadas");

  targetFolder.add(controls, 'positionX', -12, 12)
    .onChange(function (e) { controls.changePosition() })
    .name("X");
  targetFolder.add(controls, 'positionZ', 1, 12) //A bolinha fica flutuando pois se encostar no chão a maior sai do plano
    .onChange(function (e) { controls.changePosition() })
    .name("Y");
  targetFolder.add(controls, 'positionY', -12, 12)
    .onChange(function (e) { controls.changePosition() })
    .name("Z");
  targetFolder.open();
  gui.add(controls, 'onChangeAnimation', true).name("Mover");
}

function render() {
  trackballControls.update();
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}