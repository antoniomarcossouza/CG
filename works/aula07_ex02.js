import * as THREE from '../build/three.module.js';

import { TrackballControls } from '../build/jsm/controls/TrackballControls.js';
import {
    initRenderer,
    initCamera,
    initDefaultBasicLight,
    onWindowResize
} from "../libs/util/util.js";

var scene = new THREE.Scene();
var renderer = initRenderer();
var camera = initCamera(new THREE.Vector3(0, -25, 30));
initDefaultBasicLight(scene);

var trackballControls = new TrackballControls(camera, renderer.domElement);

const ambientLight = new THREE.AmbientLight(0x5e5e5e);
scene.add(ambientLight);

const loader = new THREE.TextureLoader();
const woodTexture = loader.load('../assets/textures/wood.png');
const woodTopTexture = loader.load('../assets/textures/woodtop.png');
const woodMaterial = new THREE.MeshLambertMaterial({
    map: woodTexture
});

const woodTopMaterial = new THREE.MeshLambertMaterial({
    map: woodTopTexture
});

var troncoGeometry = new THREE.CylinderGeometry(2, 2, 5, 32, 32, true);
var tronco = new THREE.Mesh(troncoGeometry, woodMaterial);

var circleGeometry = new THREE.CircleGeometry(2, 32);
var topo = new THREE.Mesh(circleGeometry, woodTopMaterial);
var base = new THREE.Mesh(circleGeometry, woodTopMaterial);

tronco.position.set(0.0, 0.0, 5.0);
tronco.rotation.x = Math.PI / 2;
topo.position.set(0.0, 2.5, 0);
topo.rotation.x = -Math.PI / 2;
base.position.set(0.0, -2.5, 0);
base.rotation.x = Math.PI / 2;
tronco.add(topo);
tronco.add(base);

scene.add(tronco);

window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);
render();

function render() {
    trackballControls.update();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}