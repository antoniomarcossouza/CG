import * as THREE from '../build/three.module.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import {
  initRenderer,
  InfoBox,
  onWindowResize,
  createGroundPlaneWired,
  degreesToRadians
} from "../libs/util/util.js";

var scene = new THREE.Scene();
var renderer = initRenderer();

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.lookAt(0, 0, 0);
camera.position.set(0.0, 2.0, 0.0);
camera.up.set(0, 1, 0);

var cameraHolder = new THREE.Object3D();
cameraHolder.add(camera);
scene.add(cameraHolder);

var keyboard = new KeyboardState();

var groundPlaneWired = createGroundPlaneWired(200, 200, 200, 200, "rgb(79, 18, 110)");
scene.add(groundPlaneWired);

scene.add(new THREE.HemisphereLight());

window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

showInformation();
render();

function keyboardUpdate() {

  keyboard.update();
  var angle = degreesToRadians(0.7);
  var rotX = new THREE.Vector3(1, 0, 0);
  var rotY = new THREE.Vector3(0, 1, 0);
  var rotZ = new THREE.Vector3(0, 0, 1);

  if (keyboard.pressed("left")) cameraHolder.rotateOnAxis(rotY, angle);
  if (keyboard.pressed("right")) cameraHolder.rotateOnAxis(rotY, -angle);
  if (keyboard.pressed("up")) cameraHolder.rotateOnAxis(rotX, -angle);
  if (keyboard.pressed("down")) cameraHolder.rotateOnAxis(rotX, angle);
  if (keyboard.pressed("<")) cameraHolder.rotateOnAxis(rotZ, angle);
  if (keyboard.pressed(">")) cameraHolder.rotateOnAxis(rotZ, -angle);
  if (keyboard.pressed(",")) cameraHolder.rotateOnAxis(rotZ, angle);
  if (keyboard.pressed(".")) cameraHolder.rotateOnAxis(rotZ, -angle);
  if (keyboard.pressed("space")) cameraHolder.translateZ(-0.2) //positivo ele anda pra trás
}

function showInformation() {
  var controls = new InfoBox();
  controls.add("Controles:");
  controls.addParagraph();
  controls.add("Pressione ESPAÇO para mover-se para frente");
  controls.add("Pressione < e > para rotacionar a câmera no eixo Z");
  controls.add("Pressione ↓, ↑ e ←, → para rotacionar a câmera nos eixos X e Y, respectivamente");
  controls.infoBox.style.backgroundColor = "rgba(0, 0, 0, 0.65)";
  controls.infoBox.style.color = "rgb(242, 242, 242)";
  controls.show();
}

function render() {
  requestAnimationFrame(render);
  keyboardUpdate();
  renderer.setClearColor("rgb(86, 189, 191)");
  renderer.clear();
  renderer.render(scene, camera);
}