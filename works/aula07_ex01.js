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
var camera = initCamera(new THREE.Vector3(0, -30, 40)); 
initDefaultBasicLight(scene);

var trackballControls = new TrackballControls(camera, renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xd9d9d9);
scene.add(ambientLight);

var planeGeometry = new THREE.PlaneGeometry(10, 10);
planeGeometry.translate(0, 0.0, 0);

const loader = new THREE.TextureLoader();
const marbleTexture = loader.load('../assets/textures/marble.png');
const marbleMaterial = new THREE.MeshLambertMaterial({
    map: marbleTexture
});

var face = [];

for (let i = 0; i < 5; i++) {
    face[i] = new THREE.Mesh(planeGeometry, marbleMaterial);
    face[i].material.side = THREE.DoubleSide;
}

face[1].position.set(0, 5, 5);
face[1].rotation.x = Math.PI / 2;
face[2].position.set(0, -5, 5);
face[2].rotation.x = Math.PI / 2;
face[3].position.set(5, 0, 5);
face[3].rotation.x = Math.PI / 2;
face[3].rotation.y = Math.PI / 2;
face[4].position.set(-5, 0, 5);
face[4].rotation.x = Math.PI / 2;
face[4].rotation.y = Math.PI / 2;

for (let i = 1; i < 5; i++) {
    face[0].add(face[i]);
}

scene.add(face[0]);

// Listen window size changes
window.addEventListener('resize', function() { onWindowResize(camera, renderer) }, false);

render();

function render() {
    trackballControls.update(); // Enable mouse movements
    requestAnimationFrame(render);
    renderer.render(scene, camera) // Render scene
}