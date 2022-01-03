import * as THREE from '../build/three.module.js';
import Stats from '../build/jsm/libs/stats.module.js';
import { GUI } from '../build/jsm/libs/dat.gui.module.js';
import { TrackballControls } from '../build/jsm/controls/TrackballControls.js';
import {
  initRenderer,
  initDefaultSpotlight,
  createGroundPlane,
  onWindowResize,
  degreesToRadians
} from "../libs/util/util.js";

var scene = new THREE.Scene();    // Create main scene
var stats = new Stats();          // To show FPS information
//var clock = new THREE.Clock();  
initDefaultSpotlight(scene, new THREE.Vector3(50, 60, 40)); // Use default light
var renderer = initRenderer();    // View function in util/utils
renderer.setClearColor("rgb(30, 30, 42)");
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.lookAt(0, 0, 0);
camera.position.set(5, 30, 60);
camera.up.set(0, 1, 0);

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls(camera, renderer.domElement);

// Listen window size changes
window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

var groundPlane = createGroundPlane(30, 30); // width and height
groundPlane.rotateX(degreesToRadians(-90));
scene.add(groundPlane);

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper(12);
axesHelper.visible = false;
scene.add(axesHelper);

buildInterface();
render();

var turbina = new THREE.Group();
var pa = new THREE.Group();

var pe = createBox(6, 6, 1.5, 'rgb(155, 155, 155)');
pe.rotateX(degreesToRadians(90));
pe.position.set(0.0, 0.75, 0.0);
turbina.add(pe);

var corpo = createCylinder(0.8, 1, 20, 10, 10, false, 'rgb(255, 255, 255)');
corpo.position.set(0.0, 10, 0.0);
turbina.add(corpo);

var motor = createBox(2, 5, 1.5, 'rgb(34, 98, 186)');
motor.rotateX(degreesToRadians(90));
motor.position.set(0.0, 20.75, -1.0);
turbina.add(motor);

var motor2 = createSphere(1.3, 5, 3, 'rgb(34, 98, 186)');
motor2.rotateX(degreesToRadians(90));
motor2.position.set(0.0, 20.75, 2.5);
turbina.add(motor2);

/* Pás */
var points = [];
for (var i = 0; i < 12; i++) {
  points.push(new THREE.Vector2(Math.sin(i * 1.2 / 4) + 0.2, i));
}

var latheGeometry = new THREE.LatheGeometry(points, 10, 0, 2 * Math.PI);

createPa(0, 20.75, 2.5, 0, 'rgb(255,255,255)');
createPa(0, 20.75, 2.5, 120, 'rgb(255,255,255)');
createPa(0, 20.75, 2.5, 240, 'rgb(255,255,255)');

scene.add(turbina);
scene.add(pa);

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

function createSphere(
  radiusTop,
  radiusBottom,
  height,
  color
) {
  var geometry = new THREE.SphereGeometry(
    radiusTop,
    radiusBottom,
    height,
  );
  var material;
  material = new THREE.MeshPhongMaterial({ color: color });
  var object = new THREE.Mesh(geometry, material);
  object.castShadow = true;
  return object;
}

function createPa(x, y, z, angulo, color) {

  var material;
  material = new THREE.MeshPhongMaterial({ color: color });
  var pa1 = new THREE.Mesh(latheGeometry, material);
  pa1.castShadow = true;
  pa1.rotateZ(degreesToRadians(angulo));
  pa1.position.set(x, y, z);
  pa.add(pa1);
}

var animation = true;
var speed = 3;

function buildInterface() {
  var controls = new function () {
    this.animation = true;
    this.speed = 3;

    this.onAnimation = function () {
      animation = this.animation;
    };
    this.onSpeed = function () {
      speed = this.speed;
    };
  };

  // GUI interface
  var gui = new GUI();
  gui.add(controls, 'animation', true)
    .name("Ativar Rotação")
    .onChange(function (e) { controls.onAnimation() });
  gui.add(controls, 'speed', 1, 10)
    .onChange(function () { controls.onSpeed() })
    .name("Velocidade de Rotação");
}

function updateAnimation() {
  if (animation == true) {

    pa.children.forEach(function(element) {
      element.rotateZ(degreesToRadians(speed));
    });
    
  }
}

function render() {
  stats.update();
  trackballControls.update();
  updateAnimation();
  requestAnimationFrame(render);
  renderer.render(scene, camera)
}
