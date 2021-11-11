import * as THREE from '../build/three.module.js';
import { GUI } from '../build/jsm/libs/dat.gui.module.js';
import { TrackballControls } from '../build/jsm/controls/TrackballControls.js';
import {
  initRenderer,
  initCamera,
  InfoBox,
  onWindowResize
} from "../libs/util/util.js";
// To show FPS information
var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils
var camera = initCamera(new THREE.Vector3(0, -30, 15)); // Init camera in this position

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls(camera, renderer.domElement);

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper(12);
scene.add(axesHelper);

// create the ground plane
var planeGeometry = new THREE.PlaneGeometry(25, 25);
planeGeometry.translate(0.0, 0.0, -0.02); // To avoid conflict with the axeshelper
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
sphere.position.set(0.0, 0.0, 1.0);
scene.add(sphere);

// ESFERA PEQUENA
var smallSphereGeometry = new THREE.SphereGeometry(0.5, 64, 64);
var smallSphereMaterial = new THREE.MeshBasicMaterial({ color: 0x40ffac });
var smallSphere = new THREE.Mesh(smallSphereGeometry, smallSphereMaterial);
smallSphere.position.set(0.0, 0.0, 1.0);
scene.add(smallSphere);

render()

// Listen window size changes
window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

function render() {
  trackballControls.update();
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}