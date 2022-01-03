import * as THREE from '../build/three.module.js';
import Stats from '../build/jsm/libs/stats.module.js';
import { TrackballControls } from '../build/jsm/controls/TrackballControls.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import { TeapotGeometry } from '../build/jsm/geometries/TeapotGeometry.js';
import {
  initRenderer,
  createGroundPlane,
  onWindowResize,
  degreesToRadians
} from "../libs/util/util.js";

var scene = new THREE.Scene();    // Create main scene
var stats = new Stats();          // To show FPS information

var renderer = initRenderer();    // View function in util/utils
renderer.setClearColor("rgb(30, 30, 42)");
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.lookAt(0, 0, 0);
camera.position.set(2.18, 1.62, 3.31);
camera.up.set(0, 1, 0);

// To use the keyboard
var keyboard = new KeyboardState();

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls(camera, renderer.domElement);

// Listen window size changes
window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

var groundPlane = createGroundPlane(4.0, 2.5, 50, 50); // width and height
groundPlane.rotateX(degreesToRadians(-90));
scene.add(groundPlane);

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper(1.5);
axesHelper.visible = false;
scene.add(axesHelper);

// Teapot
var objColor = "rgb(255,255,255)";
var geometry = new TeapotGeometry(0.5);
var material = new THREE.MeshPhongMaterial({ color: objColor, shininess: "200" });
material.side = THREE.DoubleSide;
var obj = new THREE.Mesh(geometry, material);
obj.castShadow = true;
obj.position.set(0.0, 0.5, 0.0);
scene.add(obj);

// Torus
var objColor = "rgb(152,152,152)";
var torus = new THREE.TorusGeometry(1, 0.025, 30, 30, Math.PI * 2);
var material = new THREE.MeshPhongMaterial({ color: objColor });
material.side = THREE.DoubleSide;
var obj = new THREE.Mesh(torus, material);
obj.castShadow = true;
obj.position.set(0.0, 1.2, 0.0);
obj.rotateX(degreesToRadians(90));
scene.add(obj);

//Spheres

var ObjSphere = [];

var objColor = "rgb(255,0,0)";
var sphere1 = new THREE.SphereGeometry(0.15);
var material = new THREE.MeshPhongMaterial({ color: objColor });
material.side = THREE.DoubleSide;
ObjSphere[0] = new THREE.Mesh(sphere1, material);
ObjSphere[0].castShadow = true;
ObjSphere[0].position.set(1.0, 1.2, 0.0);
ObjSphere[0].rotateX(degreesToRadians(90));
scene.add(ObjSphere[0]);

var objColor = "rgb(0,225,0)";
var sphere2 = new THREE.SphereGeometry(0.15);
var material = new THREE.MeshPhongMaterial({ color: objColor });
material.side = THREE.DoubleSide;
ObjSphere[1] = new THREE.Mesh(sphere2, material);
ObjSphere[1].castShadow = true;
ObjSphere[1].position.set(1.0, 1.2, 0.0);
ObjSphere[1].rotateX(degreesToRadians(90));
scene.add(ObjSphere[1]);

var objColor = "rgb(0,0,255)";
var sphere3 = new THREE.SphereGeometry(0.15);
var material = new THREE.MeshPhongMaterial({ color: objColor });
material.side = THREE.DoubleSide;
ObjSphere[2] = new THREE.Mesh(sphere3, material);
ObjSphere[2].castShadow = true;
ObjSphere[2].position.set(1.0, 1.2, 0.0);
ObjSphere[2].rotateX(degreesToRadians(90));
scene.add(ObjSphere[2]);

var lightArray = new Array();
var visibleArray = [];
var lightPosition = [];
var lightColor = [];

// Luz vermelha
lightPosition[0] = new THREE.Vector3(ObjSphere[0].position.x, ObjSphere[0].position.y, ObjSphere[0].position.z);
lightColor[0] = "rgb(255,0,0)";

var spotLight = new THREE.SpotLight(lightColor[0]);
setSpotLight(lightPosition[0]);

// Luz verde

lightPosition[1] = new THREE.Vector3(ObjSphere[1].position.x, ObjSphere[1].position.y, ObjSphere[1].position.z);
lightColor[1] = "rgb(0,255,0)";

var spotLight = new THREE.SpotLight(lightColor[1]);
setSpotLight(lightPosition[1]);

// Luz azul

lightPosition[2] = new THREE.Vector3(ObjSphere[2].position.x, ObjSphere[2].position.y, ObjSphere[2].position.z);
lightColor[2] = "rgb(0,0,255)";

var spotLight = new THREE.SpotLight(lightColor[2]);
setSpotLight(lightPosition[2]);


var ambientColor = "rgb(80,80,80)";
var ambientLight = new THREE.AmbientLight(ambientColor);
scene.add(ambientLight);

render();

function setSpotLight(position) {
  spotLight.position.copy(position);
  spotLight.shadow.mapSize.width = 512;
  spotLight.shadow.mapSize.height = 512;
  spotLight.angle = degreesToRadians(40);
  spotLight.castShadow = true;
  spotLight.decay = 2;
  spotLight.penumbra = 0.5;
  spotLight.name = "Spot Light"

  scene.add(spotLight);
  lightArray.push(spotLight);
}


var radiusPorTick = 6;
var bal_radius = [];
var position = [];

for (var i = 0; i < 3; i++) {
  bal_radius[i] = 0;

  position[(0 * 2) * i] = ObjSphere[0].position.x;
  position[(0 * 2) * i + 1] = ObjSphere[0].position.z;

  visibleArray[i] = true;
}

function moveLight(index) {
  var radians = bal_radius[index] * (Math.PI / 180) * 1.5;
  var x = Math.cos(radians);
  var z = Math.sin(radians);

  position[(0 * 2) * index] += x;
  position[(0 * 2) * index + 1] += z;

  ObjSphere[index].position.x = x;
  ObjSphere[index].position.z = z;

  position[(0 * 2) * index] -= x;
  position[(0 * 2) * index + 1] -= z;

  bal_radius[index] += radiusPorTick;

  lightArray[index].position.x = x;
  lightArray[index].position.z = z;

}

function keyboardUpdate() {
  keyboard.update();

  if (keyboard.pressed("Q")) {
    moveLight(0);
  }

  if (keyboard.pressed("W")) {
    moveLight(1);
  }

  if (keyboard.pressed("E")) {
    moveLight(2);
  }

  if (keyboard.down("A")) {
    lightArray[0].visible = !lightArray[0].visible;
  }

  if (keyboard.down("S")) {
    lightArray[1].visible = !lightArray[1].visible;
  }

  if (keyboard.down("D")) {
    lightArray[2].visible = !lightArray[2].visible;
  }

}

function render() {
  stats.update();
  trackballControls.update();
  keyboardUpdate();
  requestAnimationFrame(render);
  renderer.render(scene, camera)
}
