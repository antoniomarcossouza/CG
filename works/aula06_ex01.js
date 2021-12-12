import * as THREE from '../build/three.module.js';
import Stats from '../build/jsm/libs/stats.module.js';
import { GUI } from '../build/jsm/libs/dat.gui.module.js';
import { TrackballControls } from '../build/jsm/controls/TrackballControls.js';
import {
  initRenderer,
  initCamera,
  InfoBox,
  onWindowResize,
  degreesToRadians,
  initDefaultBasicLight
} from "../libs/util/util.js";

var stats = new Stats(); // To show FPS information
var scene = new THREE.Scene(); // Create main scene
var renderer = initRenderer(); // View function in util/utils
var camera = initCamera(new THREE.Vector3(0, -50, 35)); // Init camera in this position
initDefaultBasicLight(scene, 1, new THREE.Vector3(10, -10, 25));

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls(camera, renderer.domElement);

// create the ground plane
var planeGeometry = new THREE.PlaneGeometry(30, 30);
planeGeometry.translate(0.0, 0.0, -0.02); // To avoid conflict with the axeshelper
var planeMaterial = new THREE.MeshBasicMaterial({
  color: "rgba(150, 150, 150)",
  side: THREE.DoubleSide,
});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
// add the plane to the scene
scene.add(plane);

// Base
var baseGeometry = new THREE.BoxGeometry(4, 1, 0.20);
var baseMaterial = new THREE.MeshPhongMaterial({ color: "#f7f7f7" });
var base2Geometry = new THREE.BoxGeometry(2.75, 2.75, 0.10);
var base = [];
base[0] = new THREE.Mesh(baseGeometry, baseMaterial);
base[1] = new THREE.Mesh(baseGeometry, baseMaterial);
base[3] = new THREE.Mesh(base2Geometry, baseMaterial);
base[0].rotation.z = degreesToRadians(45);
base[1].rotation.z = degreesToRadians(-45);

// "Tronco"
var troncoGeometry = new THREE.CylinderGeometry(0.3, 0.5, 15, 32);
var troncoMaterial = new THREE.MeshPhongMaterial({ color: "#f7f7f7" });
var tronco = new THREE.Mesh(troncoGeometry, troncoMaterial);

// Motor
var motorGeometry = new THREE.CylinderGeometry(0.75, 0.75, 1.5, 32);
var motorMaterial = new THREE.MeshPhongMaterial({ color: "#3a47de" });
var motor = new THREE.Mesh(motorGeometry, motorMaterial);

// Motor2
var geometryMotor2 = new THREE.SphereGeometry(0.75, 32, 32);
var motor2Material = new THREE.MeshPhongMaterial({ color: "#3a47de" });
var motor2 = new THREE.Mesh(geometryMotor2, motor2Material);

// Helice
var heliceGeometry = new THREE.BoxGeometry(3.5, 0.1, 0.75);
var heliceMaterial = new THREE.MeshPhongMaterial({ color: "#f7f7f7" });
var helice = []
for (var i = 0; i < 3; i++) {
  helice[i] = new THREE.Mesh(heliceGeometry, heliceMaterial);
  motor2.add(helice[i]);
}

// Posicionando coisas
base[0].position.set(0.0, 0.0, 0.25);
base[1].position.set(0.0, 0.0, 0.25);
base[3].position.set(0.0, 0.0, 0.20);
tronco.position.set(0.0, 0.0, 7.5);
tronco.rotation.x = degreesToRadians(90);

motor.position.set(0.0, 8.0, 0.0);
motor.rotation.z = degreesToRadians(90);
motor2.position.set(0, 0.75, 0);

helice[0].position.set(1.5, 0.0, 0.0);
helice[0].rotation.y = degreesToRadians(0);

helice[1].position.set(-0.9, 0.0, -1.5);
helice[1].rotation.y = degreesToRadians(120);

helice[2].position.set(-0.9, 0.0, 1.5);
helice[2].rotation.y = degreesToRadians(240);

// Adicionando itens na cena
scene.add(base[0]);
scene.add(base[1]);
scene.add(base[3]);
base[0].add(tronco);
tronco.add(motor);
motor.add(motor2);

// Listen window size changes
window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);
render();

function render() {
  stats.update(); // Update FPS
  trackballControls.update(); // Enable mouse movements
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}