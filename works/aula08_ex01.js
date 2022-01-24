import * as THREE from '../libs/other/three.module.r82.js';
import { RaytracingRenderer } from '../libs/other/raytracingRenderer.js';
import { degreesToRadians } from "../libs/util/util.js";

var scene, renderer;

var container = document.createElement('div');
document.body.appendChild(container);

var scene = new THREE.Scene();

// The canvas is in the XY plane.
// Hint: put the camera in the positive side of the Z axis and the
// objects in the negative side
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.z = 6;
camera.position.y = 2.5;

// light
var intensity = 0.5;
var light = new THREE.PointLight(0xffffff, intensity);
light.position.set(0, 2.50, 0);
scene.add(light);

var light = new THREE.PointLight(0x55aaff, intensity);
light.position.set(-1.00, 1.50, 2.00);
scene.add(light);

var light = new THREE.PointLight(0xffffff, intensity);
light.position.set(1.00, 1.50, 2.00);
scene.add(light);

renderer = new RaytracingRenderer(window.innerWidth, window.innerHeight, 32, camera);
container.appendChild(renderer.domElement);

// materials
var phongMaterialBox = new THREE.MeshLambertMaterial({
    color: "rgb(240, 240, 240)",
});

var phongMaterialBoxBottom = new THREE.MeshLambertMaterial({
    color: "rgb(120, 120, 120)",
});

var phongMaterialBoxSides = new THREE.MeshLambertMaterial({
    color: "rgb(35, 109, 173)",
});

var pedestalMaterial = new THREE.MeshPhongMaterial({
    color: "rgb(134, 152, 166)",
    specular: "rgb(255,255,255)",
    shininess: 1000,
});

var cilindoVermelhoMaterial = new THREE.MeshPhongMaterial({
    color: "rgb(176, 40, 40)",
    specular: "rgb(255,255,255)",
    shininess: 1000,
});

var mirrorMaterial = new THREE.MeshPhongMaterial({
    color: "rgb(0,0,0)",
    specular: "rgb(255,255,255)",
    shininess: 1000,
});
mirrorMaterial.mirror = true;
mirrorMaterial.reflectivity = 1;

var mirrorMaterialSmooth = new THREE.MeshPhongMaterial({
    color: "rgb(255,170,0)",
    specular: "rgb(34,34,34)",
    shininess: 10000,
});
mirrorMaterialSmooth.mirror = true;
mirrorMaterialSmooth.reflectivity = 0.1;

// geometries
var sphereGeometry = new THREE.SphereGeometry(0.6, 24, 24);
var planeGeometry = new THREE.BoxGeometry(12.00, 0.05, 6.00);
var planeGeometrySides = new THREE.BoxGeometry(6.00, 0.05, 6.00);
var pedestalGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1.0, 80);
var cilindroGeometry = new THREE.CylinderGeometry(0.35, 0.25, 1.0, 80);
const torusKnotGeometry = new THREE.TorusKnotGeometry(0.35, 0.1, 64, 16);

// Pedestais
var pedestalRight = new THREE.Mesh(pedestalGeometry, pedestalMaterial);
pedestalRight.position.set(3, 0, -0.75);
scene.add(pedestalRight);

var pedestalLeft = new THREE.Mesh(pedestalGeometry, pedestalMaterial);
pedestalLeft.position.set(-3, 0, -0.75);
scene.add(pedestalLeft);

var pedestalMiddle = new THREE.Mesh(pedestalGeometry, pedestalMaterial);
pedestalMiddle.position.set(0, 0, -2);
scene.add(pedestalMiddle);

// Torus Knot
var torusKnot = new THREE.Mesh(torusKnotGeometry, mirrorMaterialSmooth);
torusKnot.position.set(0, 1.125, 0);
pedestalLeft.add(torusKnot);

// Bola Esperlho
var sphere = new THREE.Mesh(sphereGeometry, mirrorMaterial);
sphere.position.set(0, 1.125, 0);
sphere.rotation.y = degreesToRadians(37);
pedestalMiddle.add(sphere);

// Funil Vermelho
var cylinder = new THREE.Mesh(cilindroGeometry, cilindoVermelhoMaterial);
cylinder.position.set(0, 1, 0);
pedestalRight.add(cylinder);

// Top 10 Gambiarras
pedestalRight.scale.multiplyScalar(1.125);
pedestalLeft.scale.multiplyScalar(1.125);
pedestalMiddle.scale.multiplyScalar(1.125);
torusKnot.scale.multiplyScalar(1.125);
sphere.scale.multiplyScalar(1.125);
cylinder.scale.multiplyScalar(1.125);

// bottom
var plane = new THREE.Mesh(planeGeometry, phongMaterialBoxBottom);
plane.position.set(0, -.5, -3.00);
scene.add(plane);

// top
var plane = new THREE.Mesh(planeGeometry, phongMaterialBox);
plane.position.set(0, 5.5, -3.00);
scene.add(plane);

// back
var plane = new THREE.Mesh(planeGeometry, phongMaterialBox);
plane.rotation.x = 1.57;
plane.position.set(0, 2.50, -3.00);
scene.add(plane);

// left
var plane = new THREE.Mesh(planeGeometrySides, phongMaterialBoxSides);
plane.rotation.z = 1.57;
plane.position.set(-6.00, 2.50, -3.00)
scene.add(plane);

// right
var plane = new THREE.Mesh(planeGeometrySides, phongMaterialBoxSides);
plane.rotation.z = 1.57;
plane.position.set(6.00, 2.50, -3.00)
scene.add(plane);

render();

function render() {
    renderer.render(scene, camera);
}
