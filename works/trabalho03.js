import * as THREE from "../build/three.module.js";
import Stats from "../build/jsm/libs/stats.module.js";
import { TrackballControls } from "../build/jsm/controls/TrackballControls.js";
import KeyboardState from "../libs/util/KeyboardState.js";
import {
  initRenderer,
  InfoBox,
  createGroundPlane,
  onWindowResize,
  degreesToRadians,
  initDefaultSpotlight,
} from "../libs/util/util.js";

/* TIMER - INICIO */
var lap = 0;
var timerVoltas = [];
var bestLap = 1;
var canFinish = 2;
var totalLap = 4;
/* TIMER - FIM */

/* CONFIGURAÇÕES - INICIO */

var bateu = false;
var modoCamera = 0;
var finalizou = false;

var speed = 0;
const maxSpeed = 5.4;
const incrementSpeed = 0.08;

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
renderer.setClearColor("rgb(30, 30, 40)");

/* CAMERA - INICIO */
var camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);

const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
ambientLight.intensity = 0.5;
scene.add(ambientLight);

var light = new THREE.PointLight(0xffffff, 1, 500);
light.castShadow = true;
scene.add(light);

// Utilizado para visualizar a camera 20px na frente do carro
var camera_look = new THREE.Group();
camera_look.rotateY(degreesToRadians(-90));

var camera_position = new THREE.Group();
camera_position.rotateY(degreesToRadians(-90));

var trackballControls = new TrackballControls(camera, renderer.domElement);
trackballControls.maxDistance = 700;

/* CAMERA - FIM */

/* MINIMAPA - INICIO */
const altura_minimap = 600;
const lookAtVec = new THREE.Vector3(0.0, 0.0, -180.0);
const camPosition = new THREE.Vector3(0.0, altura_minimap, -180.0);
const upVec = new THREE.Vector3(0.0, 1.0, 0.0);
const vcWidth = 200;
const vcHeidth = 200;

var virtualCamera = new THREE.PerspectiveCamera(
  45,
  vcWidth / vcHeidth,
  1.0,
  altura_minimap + 2
);
virtualCamera.position.copy(camPosition);
virtualCamera.up.copy(upVec);
virtualCamera.lookAt(lookAtVec);

/* MINIMAPA - FIM */

var keyboard = new KeyboardState();
window.addEventListener(
  "resize",
  function () {
    onWindowResize(camera, renderer);
  },
  false
);

/* PISTA - INICIO */

var trackArray = new Array();
var trackArray0 = new Array();
var trackArray1 = new Array();
var trackArray2 = new Array();
var trackArray3 = new Array();
var finishLineArray = new Array();

var track = new THREE.Group();

var lightExp = initDefaultSpotlight(scene, new THREE.Vector3(-5, 5, 5));
lightExp.castShadow = true;
lightExp.visible = false;

const loader = new THREE.TextureLoader();
let textura_pista1 = loader.load("../assets/textures/ladrilho.jpg");
textura_pista1.wrapS = THREE.RepeatWrapping;
textura_pista1.wrapT = THREE.RepeatWrapping;
textura_pista1.repeat.set(1, 1);
var material_pista1 = new THREE.MeshPhongMaterial({
  map: textura_pista1,
  color: "rgb(255, 255, 255)",
});

let textura_pista2 = loader.load("../assets/textures/sand.jpg");
textura_pista2.wrapS = THREE.RepeatWrapping;
textura_pista2.wrapT = THREE.RepeatWrapping;
textura_pista2.repeat.set(1, 1);
var material_pista2 = new THREE.MeshPhongMaterial({
  map: textura_pista2,
  color: "rgb(255, 255, 255)",
});

let textura_pista3 = loader.load("../assets/textures/asphalt.png");
textura_pista3.wrapS = THREE.RepeatWrapping;
textura_pista3.wrapT = THREE.RepeatWrapping;
textura_pista3.repeat.set(1, 1);
var material_pista3 = new THREE.MeshPhongMaterial({
  map: textura_pista3,
  color: "rgb(255, 255, 255)",
});

let textura_pista4 = loader.load("../assets/textures/dirt.png");
textura_pista4.wrapS = THREE.RepeatWrapping;
textura_pista4.wrapT = THREE.RepeatWrapping;
textura_pista4.repeat.set(1, 1);
var material_pista4 = new THREE.MeshPhongMaterial({
  map: textura_pista4,
  color: "rgb(255, 255, 255)",
});

let textura_plano1 = loader.load("../assets/textures/terracotta.jpg");
textura_plano1.wrapS = THREE.RepeatWrapping;
textura_plano1.wrapT = THREE.RepeatWrapping;
textura_plano1.repeat.set(32, 32);
var material_plano1 = new THREE.MeshPhongMaterial({
  map: textura_plano1,
  color: "rgb(255, 255, 255)",
});

let textura_plano2 = loader.load("../assets/textures/water.jpg");
textura_plano2.wrapS = THREE.RepeatWrapping;
textura_plano2.wrapT = THREE.RepeatWrapping;
textura_plano2.repeat.set(32, 32);
var material_plano2 = new THREE.MeshPhongMaterial({
  map: textura_plano2,
  color: "rgb(255, 255, 255)",
});

let textura_plano3 = loader.load("../assets/textures/cobble.png");
textura_plano3.wrapS = THREE.RepeatWrapping;
textura_plano3.wrapT = THREE.RepeatWrapping;
textura_plano3.repeat.set(32, 32);
var material_plano3 = new THREE.MeshPhongMaterial({
  map: textura_plano3,
  color: "rgb(255, 255, 255)",
});

let textura_plano4 = loader.load("../assets/textures/grass1.png");
textura_plano4.wrapS = THREE.RepeatWrapping;
textura_plano4.wrapT = THREE.RepeatWrapping;
textura_plano4.repeat.set(32, 32);
var material_plano4 = new THREE.MeshPhongMaterial({
  map: textura_plano4,
  color: "rgb(255, 255, 255)",
});

var planeGeometry1 = new THREE.PlaneGeometry(1000, 1000);
planeGeometry1.translate(track1, track1 + 190, -0.5);
var plane1 = new THREE.Mesh(planeGeometry1, material_plano1);
planeGeometry1.rotateX(degreesToRadians(-90));

var planeGeometry2 = new THREE.PlaneGeometry(1000, 1000);
planeGeometry2.translate(track2, -(track2 - 190), -0.5);
var plane2 = new THREE.Mesh(planeGeometry2, material_plano2);
planeGeometry2.rotateX(degreesToRadians(-90));

var planeGeometry3 = new THREE.PlaneGeometry(1000, 1000);
planeGeometry3.translate(track3, -(track3 - 190), -0.5);
var plane3 = new THREE.Mesh(planeGeometry3, material_plano3);
planeGeometry3.rotateX(degreesToRadians(-90));

var planeGeometry2 = new THREE.PlaneGeometry(1000, 1000);
planeGeometry2.translate(track4, -(track4 - 190), -0.5);
var plane4 = new THREE.Mesh(planeGeometry2, material_plano4);
planeGeometry2.rotateX(degreesToRadians(-90));

track.add(plane1);
track.add(plane2);
track.add(plane3);
track.add(plane4);

// Pista 1
for (var i = 0; i < 6; i++) {
  createFinishLine(-10, -20 + track1 + i * 10, i);
}
for (var i = 0; i < 40; i++) {
  for (var j = 0; j < 6; j++) {
    createStreet(
      track1 + -200 + i * 10,
      track1 + -20 + j * 10,
      material_pista1,
      0
    );
  }

  for (var j = 0; j < 6; j++) {
    createStreet(track1 + -200 + 10 * j, track1 + -i * 10, material_pista1, 0);
  }

  for (var j = 0; j < 6; j++) {
    createStreet(
      track1 + -200 + i * 10,
      track1 + -400 + 10 * j,
      material_pista1,
      0
    );
  }

  for (var j = 0; j < 6; j++) {
    createStreet(track1 + 190 - 10 * j, track1 + -i * 10, material_pista1, 0);
  }
}

// Pista 2
for (var i = 0; i < 6; i++) {
  createFinishLine(track2 - 10, -20 + track2 + i * 10, i);
}

for (var i = 0; i < 40; i++) {
  for (var j = 0; j < 6; j++) {
    createStreet(
      track2 + -200 + i * 10,
      track2 + -20 + j * 10,
      material_pista2,
      1
    );
  }
  for (var j = 0; j < 6; j++) {
    createStreet(track2 + -200 + 10 * j, track2 + -i * 10, material_pista2, 1);
  }
}

for (var i = 0; i < 24; i++) {
  for (var j = 0; j < 6; j++) {
    createStreet(
      track2 + -200 + i * 10,
      track2 + -400 + j * 10,
      material_pista2,
      1
    );
  }

  for (var j = 0; j < 6; j++) {
    createStreet(
      track2 + -20 + 10 * j,
      track2 + -i * 10 - 160,
      material_pista2,
      1
    );
  }

  for (var j = 0; j < 6; j++) {
    createStreet(
      track2 + -20 + i * 10,
      track2 + -200 + 10 * j,
      material_pista2,
      1
    );
  }

  for (var j = 0; j < 6; j++) {
    createStreet(
      track2 + 210 - 10 * j,
      track2 + 30 - i * 10,
      material_pista2,
      1
    );
  }
}

// Pista 3
for (var i = 0; i < 6; i++) {
  createFinishLine(track3 - 10, -20 + track3 + i * 10, i);
}

for (var i = 0; i < 40; i++) {
  for (var j = 0; j < 6; j++) {
    createStreet(
      track3 + -200 + i * 6,
      track3 + -20 + j * 10,
      material_pista3,
      2
    );
  }
  for (var j = 0; j < 6; j++) {
    createStreet(track3 + -200 + 10 * j, track3 + -i * 10, material_pista3, 2);
  }
}

for (var i = 0; i < 30; i++) {
  for (var j = 0; j < 6; j++) {
    createStreet(
      track3 + 100 + 10 * j,
      track3 + -i * 10 - 100,
      material_pista3,
      2
    );
  }
}

for (var i = 0; i < 15; i++) {
  for (var j = 0; j < 6; j++) {
    createStreet(
      track3 + i * 8 + 37,
      track3 + -20 + j * 10 - 80,
      material_pista3,
      2
    );
  }
  for (var j = 0; j < 6; j++) {
    createStreet(
      track3 + -20 + j * 10 + 57,
      track3 + -i * 5 + 30,
      material_pista3,
      2
    );
  }
}

for (var i = 0; i < 20; i++) {
  for (var j = 0; j < 6; j++) {
    createStreet(
      track3 + -i * 10 - 10,
      track3 + -200 + j * 10,
      material_pista3,
      2
    );
  }
  for (var j = 0; j < 6; j++) {
    createStreet(
      track3 + -i * 10 - 10,
      track3 + -400 + j * 10,
      material_pista3,
      2
    );
  }
}

for (var i = 0; i < 25; i++) {
  for (var j = 0; j < 6; j++) {
    createStreet(
      track3 + -60 + j * 10,
      track3 + -i * 10 - 150,
      material_pista3,
      2
    );
  }
}

for (var i = 0; i < 30; i++) {
  for (var j = 0; j < 6; j++) {
    createStreet(
      track3 + -i * 10 + 150,
      track3 + -400 + j * 10,
      material_pista3,
      2
    );
  }
}

// Pista 4
for (var i = 0; i < 6; i++) {
  createFinishLine(track4 - 25, -20 + track4 + i * 10, i);
}

for (var i = 0; i < 40; i++) {
  for (var j = 0; j < 6; j++) {
    createStreet(
      track4 + -200 + i * 6,
      track4 + -20 + j * 10,
      material_pista4,
      3
    );
  }
  for (var j = 0; j < 6; j++) {
    createStreet(track4 + -200 + 10 * j, track4 + -i * 4, material_pista4, 3);
  }
  for (var j = 0; j < 6; j++) {
    createStreet(
      track4 + -200 + i * 4,
      track4 + j * 10 - 157,
      material_pista4,
      3
    );
  }
  for (var j = 0; j < 6; j++) {
    createStreet(track4 + 10 * j - 16, track4 + -i * 4, material_pista4, 3);
  }
  for (var j = 0; j < 6; j++) {
    createStreet(track4 + i * 4, track4 + j * 10 - 157, material_pista4, 3);
  }
  for (var j = 0; j < 6; j++) {
    createStreet(
      track4 - 15 + 10 * j,
      track4 + -i * 4 - 150,
      material_pista4,
      3
    );
  }
  for (var j = 0; j < 6; j++) {
    createStreet(
      track4 + i * 5 + 40,
      track4 + j * 10 - 306,
      material_pista4,
      3
    );
  }
  for (var j = 0; j < 6; j++) {
    createStreet(
      track4 + i * 3 + 110,
      track4 + j * 10 - 422,
      material_pista4,
      3
    );
  }
}

for (var i = 0; i < 30; i++) {
  for (var j = 0; j < 6; j++) {
    createStreet(
      track4 + 106 + 10 * j,
      track4 + -i * 4 - 120,
      material_pista4,
      3
    );
  }
  for (var j = 0; j < 6; j++) {
    createStreet(
      track4 + 106 + 10 * j,
      track4 + -i * 4 - 306,
      material_pista4,
      3
    );
  }
  for (var j = 0; j < 6; j++) {
    createStreet(
      track4 - 15 + 10 * j + 200,
      track4 + -i * 4 - 306,
      material_pista4,
      3
    );
  }
}

scene.add(track);

/* ELEVAÇÕES - INICIO */

var trackElevationArray = new Array();
var itensArray = new Array();

/* Pista 1 - INICIO */

var elevacao1 = createBox(20, 60, 3, "rgb(150, 150, 150)", material_pista1);
elevacao1.rotateX(degreesToRadians(-65));
elevacao1.rotateZ(degreesToRadians(90));
elevacao1.position.set(track1 + -175.0, 3, track1 + -180.0);
track.add(elevacao1);
trackElevationArray.push(elevacao1);

var elevacao12 = createBox(20, 60, 3, "rgb(150, 150, 150)", material_pista1);
elevacao12.rotateX(degreesToRadians(65));
elevacao12.rotateZ(degreesToRadians(90));
elevacao12.position.set(track1 + -175.0, 3, track1 + -197.0);
track.add(elevacao12);
trackElevationArray.push(elevacao12);

var elevacao2 = createBox(20, 60, 3, "rgb(150, 150, 150)", material_pista1);
elevacao2.rotateX(degreesToRadians(90));
elevacao2.rotateY(degreesToRadians(25));
elevacao2.position.set(track1 + 0.0, 3, track1 + -375.0);
track.add(elevacao2);
trackElevationArray.push(elevacao2);

var elevacao22 = createBox(20, 60, 3, "rgb(150, 150, 150)", material_pista1);
elevacao22.rotateX(degreesToRadians(-90));
elevacao22.rotateY(degreesToRadians(25));
elevacao22.position.set(track1 + 17.0, 3, track1 + -375.0);
track.add(elevacao22);
trackElevationArray.push(elevacao22);

var elevacao3 = createBox(20, 60, 3, "rgb(150, 150, 150)", material_pista1);
elevacao3.rotateX(degreesToRadians(-65));
elevacao3.rotateZ(degreesToRadians(90));
elevacao3.position.set(track1 + 165.0, 3, track1 + -180.0);
track.add(elevacao3);
trackElevationArray.push(elevacao3);

var elevacao32 = createBox(20, 60, 3, "rgb(150, 150, 150)", material_pista1);
elevacao32.rotateX(degreesToRadians(65));
elevacao32.rotateZ(degreesToRadians(90));
elevacao32.position.set(track1 + 165.0, 3, track1 + -197.0);
track.add(elevacao32);
trackElevationArray.push(elevacao32);
/* Pista 1 - FIM */

/* Pista 2 - INICIO */

var elevacao4 = createBox(20, 60, 3, "rgb(150, 150, 150)", material_pista2);
elevacao4.rotateX(degreesToRadians(-65));
elevacao4.rotateZ(degreesToRadians(90));
elevacao4.position.set(track2 + -175.0, 3, track2 + -180.0);
track.add(elevacao4);
trackElevationArray.push(elevacao4);

var elevacao42 = createBox(20, 60, 3, "rgb(150, 150, 150)", material_pista2);
elevacao42.rotateX(degreesToRadians(65));
elevacao42.rotateZ(degreesToRadians(90));
elevacao42.position.set(track2 + -175.0, 3, track2 + -197.0);
track.add(elevacao42);
trackElevationArray.push(elevacao42);

var elevacao5 = createBox(20, 60, 3, "rgb(150, 150, 150)", material_pista2);
elevacao5.rotateX(degreesToRadians(90));
elevacao5.rotateY(degreesToRadians(25));
elevacao5.position.set(track2 - 104.5, 3, track2 + -375.0);
track.add(elevacao5);
trackElevationArray.push(elevacao5);

var elevacao52 = createBox(20, 60, 3, "rgb(150, 150, 150)", material_pista2);
elevacao52.rotateX(degreesToRadians(-90));
elevacao52.rotateY(degreesToRadians(25));
elevacao52.position.set(track2 - 87.5, 3, track2 + -375.0);
track.add(elevacao52);
trackElevationArray.push(elevacao52);

var elevacao6 = createBox(20, 60, 3, "rgb(150, 150, 150)", material_pista2);
elevacao6.rotateX(degreesToRadians(-65));
elevacao6.rotateZ(degreesToRadians(90));
elevacao6.position.set(track2 + 185.0, 3, track2 + -90.0);
track.add(elevacao6);
trackElevationArray.push(elevacao6);

var elevacao62 = createBox(20, 60, 3, "rgb(150, 150, 150)", material_pista2);
elevacao62.rotateX(degreesToRadians(65));
elevacao62.rotateZ(degreesToRadians(90));
elevacao62.position.set(track2 + 185.0, 3, track2 + -107.0);
track.add(elevacao62);
trackElevationArray.push(elevacao62);
/* Pista 2 - FIM */

/* Pista 3 - INICIO */
var elevacao31 = createBox(20, 60, 3, "rgb(150, 150, 150)", material_pista3);
elevacao31.rotateX(degreesToRadians(-65));
elevacao31.rotateZ(degreesToRadians(90));
elevacao31.position.set(track3 + -175, 3, track3 + -100.0);
track.add(elevacao31);
trackElevationArray.push(elevacao31);
var elevacao31 = createBox(20, 60, 3, "rgb(150, 150, 150)", material_pista3);
elevacao31.rotateX(degreesToRadians(65));
elevacao31.rotateZ(degreesToRadians(90));
elevacao31.position.set(track3 + -175, 3, track3 + -117.0);
track.add(elevacao31);
trackElevationArray.push(elevacao31);

var elevacao31 = createBox(20, 60, 3, "rgb(150, 150, 150)", material_pista3);
elevacao31.rotateX(degreesToRadians(-65));
elevacao31.rotateZ(degreesToRadians(90));
elevacao31.position.set(track3 + 124, 3, track3 + -130.0);
track.add(elevacao31);
trackElevationArray.push(elevacao31);
var elevacao31 = createBox(20, 60, 3, "rgb(150, 150, 150)", material_pista3);
elevacao31.rotateX(degreesToRadians(65));
elevacao31.rotateZ(degreesToRadians(90));
elevacao31.position.set(track3 + 124, 3, track3 + -147.0);
track.add(elevacao31);
trackElevationArray.push(elevacao31);

var elevacao32 = createBox(20, 60, 3, "rgb(150, 150, 150)", material_pista3);
elevacao32.rotateX(degreesToRadians(90));
elevacao32.rotateY(degreesToRadians(25));
elevacao32.position.set(track3 + -70, 3, track3 + 5);
track.add(elevacao32);
trackElevationArray.push(elevacao32);

var elevacao322 = createBox(20, 60, 3, "rgb(150, 150, 150)", material_pista3);
elevacao322.rotateX(degreesToRadians(-90));
elevacao322.rotateY(degreesToRadians(25));
elevacao322.position.set(track3 + -53, 3, track3 + 5);
track.add(elevacao322);
trackElevationArray.push(elevacao322);

var elevacao32 = createBox(20, 60, 3, "rgb(150, 150, 150)", material_pista3);
elevacao32.rotateX(degreesToRadians(90));
elevacao32.rotateY(degreesToRadians(25));
elevacao32.position.set(track3 + 18, 3, track3 + 5);
track.add(elevacao32);
trackElevationArray.push(elevacao32);

var elevacao322 = createBox(20, 60, 3, "rgb(150, 150, 150)", material_pista3);
elevacao322.rotateX(degreesToRadians(-90));
elevacao322.rotateY(degreesToRadians(25));
elevacao322.position.set(track3 + 35, 3, track3 + 5);
track.add(elevacao322);
trackElevationArray.push(elevacao322);
/* Pista 3 - FIM */

/* Pista 4 - INICIO */
var elevacao41 = createBox(20, 60, 3, "rgb(150, 150, 150)", material_pista4);
elevacao41.rotateX(degreesToRadians(-65));
elevacao41.rotateZ(degreesToRadians(90));
elevacao41.position.set(track4 + 130, 3, track4 + -240.0);
track.add(elevacao41);
trackElevationArray.push(elevacao41);

var elevacao42 = createBox(20, 60, 3, "rgb(150, 150, 150)", material_pista4);
elevacao42.rotateX(degreesToRadians(90));
elevacao42.rotateY(degreesToRadians(25));
elevacao42.position.set(track4 + -40, 3, track4 + -135.0);
track.add(elevacao42);
trackElevationArray.push(elevacao42);

/* Pista 4 - FIM */

/* ELEVAÇÕES - FIM */

/* PISTA - FIM */

/* CARRO - INICIO */

var roda1, roda2, roda3, roda4;
var calota1, calota2, calota3, calota4;
var corpo;
var car = new THREE.Group();
car = createCar();
scene.add(car);
car.translateY(2.2);
car.rotateY(degreesToRadians(-90));
car.receiveShadow = true;
car.castShadow = true;

/* CARRO - FIM */

/* CEU - INICIO */

let materialArray = [];
let texture_ft = new THREE.TextureLoader().load(
  "../assets/textures/trough_ft.jpg"
);
let texture_bk = new THREE.TextureLoader().load(
  "../assets/textures/trough_bk.jpg"
);
let texture_up = new THREE.TextureLoader().load(
  "../assets/textures/trough_up.jpg"
);
let texture_dn = new THREE.TextureLoader().load(
  "../assets/textures/trough_dn.jpg"
);
let texture_rt = new THREE.TextureLoader().load(
  "../assets/textures/trough_rt.jpg"
);
let texture_lf = new THREE.TextureLoader().load(
  "../assets/textures/trough_lf.jpg"
);

materialArray.push(new THREE.MeshBasicMaterial({ map: texture_ft }));
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_bk }));
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_up }));
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_dn }));
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_rt }));
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_lf }));

for (let i = 0; i < 6; i++) materialArray[i].side = THREE.BackSide;

let skyboxGeo1 = new THREE.BoxGeometry(1000, 1000, 1000);
skyboxGeo1.translate(track1, 200, track1);
let skybox1 = new THREE.Mesh(skyboxGeo1, materialArray);
scene.add(skybox1);

let skyboxGeo2 = new THREE.BoxGeometry(1000, 1000, 1000);
skyboxGeo2.translate(track2, 200, track2);
let skybox2 = new THREE.Mesh(skyboxGeo2, materialArray);
scene.add(skybox2);

let skyboxGeo3 = new THREE.BoxGeometry(1000, 1000, 1000);
skyboxGeo3.translate(track3, 200, track3);
let skybox3 = new THREE.Mesh(skyboxGeo3, materialArray);
scene.add(skybox3);

let skyboxGeo4 = new THREE.BoxGeometry(1000, 1000, 1000);
skyboxGeo4.translate(track4, 200, track4);
let skybox4 = new THREE.Mesh(skyboxGeo4, materialArray);
scene.add(skybox4);

/* CEU - FIM */

// Mudar o modo da camera
document.addEventListener("keypress", function (e) {
  if (e.keyCode === 32) {
    modoCamera == 2 ? (modoCamera = 0) : modoCamera++;

    if (modoCamera == 2) {
      track.visible = false;
    } else {
      track.visible = true;
    }
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
  camera_position.rotation.y = -Math.PI / 2;

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
      information.style.width = "180px";
      information.style.height = "130px";
      information.style.display = "block";

      var seconds = timerVoltas[lap] % 60;
      var minutes = (timerVoltas[lap] - seconds) / 60;

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      var secondsMelhor = timerVoltas[bestLap] % 60;
      var minutesMelhor = (timerVoltas[bestLap] - secondsMelhor) / 60;

      minutesMelhor = minutesMelhor < 10 ? "0" + minutesMelhor : minutesMelhor;
      secondsMelhor = secondsMelhor < 10 ? "0" + secondsMelhor : secondsMelhor;

      var total = 0;
      for (var i = 1; i <= lap; i++) {
        total += timerVoltas[i];
      }

      var secondsTotal = total % 60;
      var minutesTotal = (total - secondsTotal) / 60;

      minutesTotal = minutesTotal < 10 ? "0" + minutesTotal : minutesTotal;
      secondsTotal = secondsTotal < 10 ? "0" + secondsTotal : secondsTotal;

      information.innerHTML =
        "Volta (" +
        lap +
        "/" +
        totalLap +
        ")<br><br>Tempo da volta: " +
        minutes +
        ":" +
        seconds +
        "<br>Melhor tempo: " +
        minutesMelhor +
        ":" +
        secondsMelhor +
        "<br>Tempo total: " +
        minutesTotal +
        ":" +
        secondsTotal +
        "<br><br>Velocidade: " +
        Math.abs(Math.round(speed * 10)) +
        " KM/h";

      timerVoltas[lap]++;
    } else {
      information.innerHTML = "";

      information.style.display = "none";
    }
  }
  setTimeout(function () {
    timerUpdate();
  }, 1000);
}

function createCar() {
  let textura_metal_claro = loader.load("../assets/textures/metal.png");
  textura_metal_claro.wrapS = THREE.RepeatWrapping;
  textura_metal_claro.wrapT = THREE.RepeatWrapping;
  textura_metal_claro.repeat.set(1, 1);
  var material_metal_claro = new THREE.MeshPhongMaterial({
    map: textura_metal_claro,
    color: "rgb(255, 255, 255)",
  });

  let textura_vidro_escuro = loader.load("../assets/textures/dark_glass.jpg");
  textura_vidro_escuro.wrapS = THREE.RepeatWrapping;
  textura_vidro_escuro.wrapT = THREE.RepeatWrapping;
  textura_vidro_escuro.repeat.set(1, 1);
  var material_vidro_escuro = new THREE.MeshPhongMaterial({
    map: textura_vidro_escuro,
    color: "rgb(255, 255, 255)",
  });

  let textura_metal_escuro = loader.load("../assets/textures/dark_metal.png");
  textura_metal_escuro.wrapS = THREE.RepeatWrapping;
  textura_metal_escuro.wrapT = THREE.RepeatWrapping;
  textura_metal_escuro.repeat.set(1, 1);
  var material_metal_escuro = new THREE.MeshPhongMaterial({
    map: textura_metal_escuro,
    color: "rgb(255, 255, 255)",
  });

  let textura_pneu = loader.load("../assets/textures/rubber.jpg");
  textura_pneu.wrapS = THREE.RepeatWrapping;
  textura_pneu.wrapT = THREE.RepeatWrapping;
  textura_pneu.repeat.set(1, 1);
  var material_pneu = new THREE.MeshPhongMaterial({
    map: textura_pneu,
    color: "rgb(255, 255, 255)",
  });

  var car = new THREE.Group();

  /* Corpo do Carro */
  corpo = createBox(
    5.5,
    12.57,
    3,
    "rgb(168, 173, 173)",
    material_metal_claro
  );
  corpo.rotateX(degreesToRadians(90));
  corpo.position.set(0.0, 1, 0.0);
  car.add(corpo);

  var corpo2 = createBox(
    5.5,
    6.5,
    2,
    "rgb(168, 173, 173)",
    material_metal_claro
  );
  corpo2.rotateX(degreesToRadians(-75));
  corpo2.position.set(0.0, 2.35, 2.9);
  car.add(corpo2);

  var corpo3 = createBox(
    5.5,
    6.5,
    2,
    "rgb(168, 173, 173)",
    material_metal_claro
  );
  corpo3.rotateX(degreesToRadians(75));
  corpo3.position.set(0.0, 2.35, -2.9);
  car.add(corpo3);

  /* Janelas */
  var janela_frontal = createBox(
    5,
    4.5,
    2,
    "rgb(28, 28, 28)",
    material_vidro_escuro
  );
  janela_frontal.rotateX(degreesToRadians(-75));
  janela_frontal.position.set(0.0, 2.4, 2.9);
  car.add(janela_frontal);

  var janela_traseira = createBox(
    3.5,
    4.5,
    2,
    "rgb(28, 28, 28)",
    material_vidro_escuro
  );
  janela_traseira.rotateX(degreesToRadians(75));
  janela_traseira.position.set(0.0, 2.4, -2.9);
  car.add(janela_traseira);

  /* Maçanetas */

  var macaneta_esquerda = createBox(
    0.6,
    0.3,
    0.5,
    "rgb(64, 68, 74)",
    material_metal_escuro
  );
  macaneta_esquerda.rotateY(degreesToRadians(90));
  macaneta_esquerda.position.set(2.6, 1.9, 0.5);
  car.add(macaneta_esquerda);

  var macaneta_direita = createBox(
    0.6,
    0.3,
    0.5,
    "rgb(64, 68, 74)",
    material_metal_escuro
  );
  macaneta_direita.rotateY(degreesToRadians(90));
  macaneta_direita.position.set(-2.6, 1.9, 0.5);
  car.add(macaneta_direita);

  /* Para-choques */
  var para_choque_frontal = createBox(
    6.25,
    0.5,
    0.5,
    "rgb(30, 30, 31)",
    material_metal_escuro
  );
  para_choque_frontal.rotateX(degreesToRadians(90));
  para_choque_frontal.position.set(0.0, -0.25, 6.5);
  car.add(para_choque_frontal);

  var para_choque_lateral_esquerdo1 = createBox(
    5,
    0.5,
    0.5,
    "rgb(30, 30, 31)",
    material_metal_escuro
  );
  para_choque_lateral_esquerdo1.rotateY(degreesToRadians(90));
  para_choque_lateral_esquerdo1.position.set(3, -0.25, 0);
  car.add(para_choque_lateral_esquerdo1);

  var para_choque_lateral_esquerdo2 = createBox(
    1.25,
    0.5,
    0.5,
    "rgb(30, 30, 31)",
    material_metal_escuro
  );
  para_choque_lateral_esquerdo2.rotateY(degreesToRadians(90));
  para_choque_lateral_esquerdo2.position.set(3, -0.25, 6.125);
  car.add(para_choque_lateral_esquerdo2);

  var para_choque_lateral_esquerdo3 = createBox(
    1.25,
    0.5,
    0.5,
    "rgb(30, 30, 31)",
    material_metal_escuro
  );
  para_choque_lateral_esquerdo3.rotateY(degreesToRadians(90));
  para_choque_lateral_esquerdo3.position.set(3, -0.25, -6.125);
  car.add(para_choque_lateral_esquerdo3);

  var para_choque_roda_traseira_esquerda1 = createBox(
    1.5,
    0.5,
    0.5,
    "rgb(30, 30, 31)",
    material_metal_escuro
  );
  para_choque_roda_traseira_esquerda1.rotateY(degreesToRadians(90));
  para_choque_roda_traseira_esquerda1.rotateZ(degreesToRadians(-45));
  para_choque_roda_traseira_esquerda1.position.set(3, 0.21, -5.15);
  car.add(para_choque_roda_traseira_esquerda1);

  var para_choque_roda_traseira_esquerda2 = createBox(
    1.5,
    0.5,
    0.5,
    "rgb(30, 30, 31)",
    material_metal_escuro
  );
  para_choque_roda_traseira_esquerda2.rotateY(degreesToRadians(90));
  para_choque_roda_traseira_esquerda2.rotateZ(degreesToRadians(45));
  para_choque_roda_traseira_esquerda2.position.set(3, 0.21, -2.85);
  car.add(para_choque_roda_traseira_esquerda2);

  var para_choque_roda_traseira_esquerda3 = createBox(
    1.6,
    0.5,
    0.5,
    "rgb(30, 30, 31)",
    material_metal_escuro
  );
  para_choque_roda_traseira_esquerda3.rotateY(degreesToRadians(90));
  para_choque_roda_traseira_esquerda3.position.set(3, 0.67, -4);
  car.add(para_choque_roda_traseira_esquerda3);

  var para_choque_roda_dianteira_esquerda1 = createBox(
    1.5,
    0.5,
    0.5,
    "rgb(30, 30, 31)",
    material_metal_escuro
  );
  para_choque_roda_dianteira_esquerda1.rotateY(degreesToRadians(90));
  para_choque_roda_dianteira_esquerda1.rotateZ(degreesToRadians(-45));
  para_choque_roda_dianteira_esquerda1.position.set(3, 0.21, 2.85);
  car.add(para_choque_roda_dianteira_esquerda1);

  var para_choque_roda_dianteira_esquerda2 = createBox(
    1.5,
    0.5,
    0.5,
    "rgb(30, 30, 31)",
    material_metal_escuro
  );
  para_choque_roda_dianteira_esquerda2.rotateY(degreesToRadians(90));
  para_choque_roda_dianteira_esquerda2.rotateZ(degreesToRadians(45));
  para_choque_roda_dianteira_esquerda2.position.set(3, 0.21, 5.15);
  car.add(para_choque_roda_dianteira_esquerda2);

  var para_choque_roda_dianteira_esquerda3 = createBox(
    1.6,
    0.5,
    0.5,
    "rgb(30, 30, 31)",
    material_metal_escuro
  );
  para_choque_roda_dianteira_esquerda3.rotateY(degreesToRadians(90));
  para_choque_roda_dianteira_esquerda3.position.set(3, 0.67, 4);
  car.add(para_choque_roda_dianteira_esquerda3);

  var para_choque_lateral_direito1 = createBox(5, 0.5, 0.5, "rgb(30, 30, 31)");
  para_choque_lateral_direito1.rotateY(degreesToRadians(90));
  para_choque_lateral_direito1.position.set(-3, -0.25, 0);
  car.add(para_choque_lateral_direito1);

  var para_choque_lateral_direito2 = createBox(
    1.25,
    0.5,
    0.5,
    "rgb(30, 30, 31)",
    material_metal_escuro
  );
  para_choque_lateral_direito2.rotateY(degreesToRadians(90));
  para_choque_lateral_direito2.position.set(-3, -0.25, 6.125);
  car.add(para_choque_lateral_direito2);

  var para_choque_lateral_direito3 = createBox(
    1.25,
    0.5,
    0.5,
    "rgb(30, 30, 31)",
    material_metal_escuro
  );
  para_choque_lateral_direito3.rotateY(degreesToRadians(90));
  para_choque_lateral_direito3.position.set(-3, -0.25, -6.125);
  car.add(para_choque_lateral_direito3);

  var para_choque_roda_traseira_direita1 = createBox(
    1.5,
    0.5,
    0.5,
    "rgb(30, 30, 31)",
    material_metal_escuro
  );
  para_choque_roda_traseira_direita1.rotateY(degreesToRadians(90));
  para_choque_roda_traseira_direita1.rotateZ(degreesToRadians(-45));
  para_choque_roda_traseira_direita1.position.set(-3, 0.21, -5.15);
  car.add(para_choque_roda_traseira_direita1);

  var para_choque_roda_traseira_direita2 = createBox(
    1.5,
    0.5,
    0.5,
    "rgb(30, 30, 31)",
    material_metal_escuro
  );
  para_choque_roda_traseira_direita2.rotateY(degreesToRadians(90));
  para_choque_roda_traseira_direita2.rotateZ(degreesToRadians(45));
  para_choque_roda_traseira_direita2.position.set(-3, 0.21, -2.85);
  car.add(para_choque_roda_traseira_direita2);

  var para_choque_roda_traseira_direita3 = createBox(
    1.6,
    0.5,
    0.5,
    "rgb(30, 30, 31)",
    material_metal_escuro
  );
  para_choque_roda_traseira_direita3.rotateY(degreesToRadians(90));
  para_choque_roda_traseira_direita3.position.set(-3, 0.67, -4);
  car.add(para_choque_roda_traseira_direita3);

  var para_choque_roda_dianteira_direita1 = createBox(
    1.5,
    0.5,
    0.5,
    "rgb(30, 30, 31)",
    material_metal_escuro
  );
  para_choque_roda_dianteira_direita1.rotateY(degreesToRadians(90));
  para_choque_roda_dianteira_direita1.rotateZ(degreesToRadians(-45));
  para_choque_roda_dianteira_direita1.position.set(-3, 0.21, 2.85);
  car.add(para_choque_roda_dianteira_direita1);

  var para_choque_roda_dianteira_direita2 = createBox(
    1.5,
    0.5,
    0.5,
    "rgb(30, 30, 31)",
    material_metal_escuro
  );
  para_choque_roda_dianteira_direita2.rotateY(degreesToRadians(90));
  para_choque_roda_dianteira_direita2.rotateZ(degreesToRadians(45));
  para_choque_roda_dianteira_direita2.position.set(-3, 0.21, 5.15);
  car.add(para_choque_roda_dianteira_direita2);

  var para_choque_roda_dianteira_direita3 = createBox(
    1.6,
    0.5,
    0.5,
    "rgb(30, 30, 31)",
    material_metal_escuro
  );
  para_choque_roda_dianteira_direita3.rotateY(degreesToRadians(90));
  para_choque_roda_dianteira_direita3.position.set(-3, 0.67, 4);
  car.add(para_choque_roda_dianteira_direita3);

  var para_choque_traseiro = createBox(
    6.25,
    0.5,
    0.5,
    "rgb(30, 30, 31)",
    material_metal_escuro
  );
  para_choque_traseiro.rotateX(degreesToRadians(90));
  para_choque_traseiro.position.set(0.0, -0.25, -6.5);
  car.add(para_choque_traseiro);

  /* Faróis */

  var farol_frontal = createBox(5, 0.5, 0.15, "rgb(255, 255, 255)");
  farol_frontal.rotateX(degreesToRadians(90));
  farol_frontal.position.set(0.0, 2.25, 6.125);
  car.add(farol_frontal);

  var farol_traseiro1 = createBox(1, 0.5, 0.25, "rgb(196, 35, 35)");
  farol_traseiro1.rotateX(degreesToRadians(90));
  farol_traseiro1.position.set(2.0, 2, -6.125);
  car.add(farol_traseiro1);

  var farol_traseiro2 = createBox(1, 0.5, 0.25, "rgb(196, 35, 35)");
  farol_traseiro2.rotateX(degreesToRadians(90));
  farol_traseiro2.position.set(-2.0, 2, -6.125);
  car.add(farol_traseiro2);

  /*
  const farol_frontal_light = new THREE.PointLight(0xffffff, 0.3, 20);
  farol_frontal_light.position.set(0.0, 2.25, 8);
 
  const farol_frontal_light2 = new THREE.PointLight(0xffffff, 0.3, 20);
  farol_frontal_light2.position.set(1, 2.25, 8);
 
  const farol_frontal_light3 = new THREE.PointLight(0xffffff, 0.3, 20);
  farol_frontal_light3.position.set(-1, 2.25, 8);
 
  const farol_traseiro_light = new THREE.PointLight(0xff0000, 0.5, 15);
  farol_traseiro_light.position.set(0, 2, -8);
*/

  /* Eixos */
  var eixo1 = createCylinder(
    0.3,
    0.3,
    7.0,
    10,
    10,
    false,
    "rgb(132, 142, 156)",
    material_metal_escuro
  );
  eixo1.rotateZ(degreesToRadians(90));
  eixo1.position.set(0.0, -1.0, 4.0);
  car.add(eixo1);

  var eixo2 = createCylinder(
    0.3,
    0.3,
    7.0,
    10,
    10,
    false,
    "rgb(132, 142, 156)",
    material_metal_escuro
  );
  eixo2.rotateZ(degreesToRadians(90));
  eixo2.position.set(0.0, -1.0, -4.0);
  car.add(eixo2);

  /* Rodas */
  roda1 = createTorus(
    1.0,
    0.35,
    20,
    20,
    Math.PI * 2,
    "rgb(30, 30, 31)",
    material_pneu
  );
  roda1.position.set(3.25, -1.0, 4.0);
  car.add(roda1);

  calota1 = createTorus(
    0.9,
    0.35,
    20,
    20,
    Math.PI * 15,
    "rgb(93, 101, 112)",
    material_metal_claro
  );
  calota1.position.set(3.2, -1.0, 4.0);
  car.add(calota1);

  roda2 = createTorus(
    1.0,
    0.35,
    20,
    20,
    Math.PI * 2,
    "rgb(30, 30, 31)",
    material_pneu
  );
  roda2.position.set(-3.25, -1.0, 4.0);
  car.add(roda2);

  calota2 = createTorus(
    0.9,
    0.35,
    20,
    20,
    Math.PI * 15,
    "rgb(93, 101, 112)",
    material_metal_claro
  );
  calota2.position.set(-3.2, -1.0, 4.0);
  car.add(calota2);

  roda3 = createTorus(
    1.0,
    0.35,
    20,
    20,
    Math.PI * 2,
    "rgb(30, 30, 31)",
    material_pneu
  );
  roda3.position.set(3.25, -1.0, -4.0);
  car.add(roda3);

  calota3 = createTorus(
    0.9,
    0.35,
    20,
    20,
    Math.PI * 15,
    "rgb(93, 101, 112)",
    material_metal_claro
  );
  calota3.position.set(3.2, -1.0, -4.0);
  car.add(calota3);

  roda4 = createTorus(
    1.0,
    0.35,
    20,
    20,
    Math.PI * 2,
    "rgb(30, 30, 31)",
    material_pneu
  );
  roda4.position.set(-3.25, -1.0, -4.0);
  car.add(roda4);

  calota4 = createTorus(
    0.9,
    0.35,
    20,
    20,
    Math.PI * 15,
    "rgb(93, 101, 112)",
    material_metal_claro
  );
  calota4.position.set(-3.2, -1.0, -4.0);
  car.add(calota4);

  return car;
}

function createBox(width, height, depth, color, material) {
  var geometry = new THREE.BoxGeometry(width, height, depth);
  if (material == null) {
    var material = new THREE.MeshPhongMaterial({ color: color });
  } else {
    var material = material;
  }
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
  color,
  material
) {
  var geometry = new THREE.CylinderGeometry(
    radiusTop,
    radiusBottom,
    height,
    radialSegments,
    heightSegments,
    openEnded
  );
  if (material == null) {
    var material = new THREE.MeshPhongMaterial({ color: color });
  } else {
    var material = material;
  }
  var object = new THREE.Mesh(geometry, material);
  object.castShadow = true;
  return object;
}

function createTorus(
  radius,
  tube,
  radialSegments,
  tubularSegments,
  arc,
  color,
  material
) {
  var geometry = new THREE.TorusGeometry(
    radius,
    tube,
    radialSegments,
    tubularSegments,
    arc
  );
  if (material == null) {
    var material = new THREE.MeshPhongMaterial({ color: color });
  } else {
    var material = material;
  }
  var object = new THREE.Mesh(geometry, material);
  object.castShadow = true;
  object.rotateY(degreesToRadians(90));
  return object;
}

function createStreet(x, z, material, pistaID) {
  var pista = createBox(10, 10, 0.1, "rgb(150, 150, 150)", material);
  pista.rotateX(degreesToRadians(-90));
  pista.position.set(x, 0, z);
  pista.castShadow = true;
  track.add(pista);

  trackArray.push({ x: x, z: z });

  switch (pistaID) {
    case 0:
      trackArray0.push({ x: x, z: z });
      break;
    case 1:
      trackArray1.push({ x: x, z: z });
      break;
    case 2:
      trackArray2.push({ x: x, z: z });
      break;
    default:
      trackArray3.push({ x: x, z: z });
      break;
  }
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
  var rotateAngle = (Math.PI / 2) * ((speed / 2) * 0.0024) * sensitivity;
  var rotateAngleRoda = (Math.PI / 2) * 0.0024 * sensitivity;

  // Acrecenta velocidade ao carro
  if (keyboard.pressed("X") || keyboard.pressed("up")) {
    if (speed < maxSpeed) {
      speed += incrementSpeed;
    }
  }

  // Verifica se o carro está no ar para não frear
  if (car.position.y - 2.2 <= 0.3) {
    if (keyboard.pressed("down") || keyboard.pressed("Z")) {
      if (speed > -maxSpeed) {
        speed -= incrementSpeed;
      }
    }
  }

  // Faz o carro virar
  if (speed != 0 || modoCamera == 2) {
    if (keyboard.pressed("left")) {
      car.rotateY(rotateAngle);
      camera_look.rotateY(rotateAngle);
      camera_position.rotateY(rotateAngle);
    } else if (keyboard.pressed("right")) {
      car.rotateY(-rotateAngle);
      camera_look.rotateY(-rotateAngle);
      camera_position.rotateY(-rotateAngle);
    }
  }

  // Movimentação das rodas
  if (speed >= 0) {
    if (keyboard.pressed("left")) {
      if (roda1.rotation._y > 0.9) {
        roda1.rotateY(rotateAngleRoda / 2);
        roda2.rotateY(rotateAngleRoda / 2);
        calota1.rotateY(rotateAngleRoda / 2);
        calota2.rotateY(rotateAngleRoda / 2);
      }
    } else if (keyboard.pressed("right")) {
      if (roda1.rotation._y > 0.9) {
        roda1.rotateY(-rotateAngleRoda / 2);
        roda2.rotateY(-rotateAngleRoda / 2);
        calota1.rotateY(-rotateAngleRoda / 2);
        calota2.rotateY(-rotateAngleRoda / 2);
      }
    }
  } else {
    if (keyboard.pressed("left")) {
      if (roda1.rotation._y > 0.9) {
        roda1.rotateY(-rotateAngleRoda / 2);
        roda2.rotateY(-rotateAngleRoda / 2);
        calota1.rotateY(-rotateAngleRoda / 2);
        calota2.rotateY(-rotateAngleRoda / 2);
      }
    } else if (keyboard.pressed("right")) {
      if (roda1.rotation._y > 0.9) {
        roda1.rotateY(rotateAngleRoda / 2);
        roda2.rotateY(rotateAngleRoda / 2);
        calota1.rotateY(rotateAngleRoda / 2);
        calota2.rotateY(rotateAngleRoda / 2);
      }
    }
  }

  // Faz as rodas ficarem retas novamentas
  if (!keyboard.pressed("right") && !keyboard.pressed("left")) {
    roda1.setRotationFromEuler(
      new THREE.Euler(roda1.rotation._x, 1.57, roda1.rotation._z, "XYZ")
    );
    roda2.setRotationFromEuler(
      new THREE.Euler(roda2.rotation._x, 1.57, roda2.rotation._z, "XYZ")
    );
    calota1.setRotationFromEuler(
      new THREE.Euler(calota1.rotation._x, 1.57, calota1.rotation._z, "XYZ")
    );
    calota2.setRotationFromEuler(
      new THREE.Euler(calota2.rotation._x, 1.57, calota2.rotation._z, "XYZ")
    );
  }
}

function createObj1(pistaID) {
  switch (pistaID) {
    case 0:
      var posicao = trackArray0[Math.floor(Math.random() * trackArray0.length)];
      break;
    case 1:
      var posicao = trackArray1[Math.floor(Math.random() * trackArray0.length)];
      break;
    case 2:
      var posicao = trackArray2[Math.floor(Math.random() * trackArray0.length)];
      break;
    default:
      var posicao = trackArray3[Math.floor(Math.random() * trackArray0.length)];
      break;
  }

  let textura_obj1 = loader.load("../assets/textures/crate2.jpg");
  textura_obj1.wrapS = THREE.RepeatWrapping;
  textura_obj1.wrapT = THREE.RepeatWrapping;
  textura_obj1.repeat.set(1, 1);
  var material_obj1 = new THREE.MeshPhongMaterial({
    map: textura_obj1,
    color: "rgb(255, 255, 255)",
  });

  var obj = createBox(6, 6, 6, "rgb(168, 173, 173)", material_obj1);
  obj.rotateX(degreesToRadians(90));
  obj.position.set(posicao["x"], 3, posicao["z"]);
  track.add(obj);

  itensArray.push(obj);
}

function createObj2(pistaID) {
  switch (pistaID) {
    case 0:
      var posicao = trackArray0[Math.floor(Math.random() * trackArray0.length)];
      break;
    case 1:
      var posicao = trackArray1[Math.floor(Math.random() * trackArray0.length)];
      break;
    case 2:
      var posicao = trackArray2[Math.floor(Math.random() * trackArray0.length)];
      break;
    default:
      var posicao = trackArray3[Math.floor(Math.random() * trackArray0.length)];
      break;
  }

  let textura_obj2 = loader.load("../assets/textures/cone.jpg");
  textura_obj2.wrapS = THREE.RepeatWrapping;
  textura_obj2.wrapT = THREE.RepeatWrapping;
  textura_obj2.repeat.set(1, 1);
  var material_obj2 = new THREE.MeshPhongMaterial({
    map: textura_obj2,
    color: "rgb(255, 255, 255)",
    side: THREE.DoubleSide,
  });

  var cone_planeGeometry = new THREE.PlaneGeometry(4, 4);
  var cone_planeMaterial = new THREE.MeshBasicMaterial({
    color: "rgba(195, 82, 29)",
    side: THREE.DoubleSide,
  });
  var cone_plane = new THREE.Mesh(cone_planeGeometry, cone_planeMaterial);
  cone_plane.rotateX(degreesToRadians(90));
  cone_plane.translateZ(2.25);

  var obj = createCylinder(
    0.25,
    1.75,
    5,
    10,
    10,
    true,
    "rgb(168, 173, 173)",
    material_obj2
  );
  obj.position.set(posicao['x'], 2.5, posicao['z']);
  obj.add(cone_plane);
  track.add(obj);

  itensArray.push(obj);
}

for (var i = 0; i < 10; i++) {
  createObj1(0);
  createObj1(1);
  createObj1(2);
  createObj1(3);

  createObj2(0);
  createObj2(1);
  createObj2(2);
  createObj2(3);
}

function detectCollision(object1, object2) {
  object1.geometry.computeBoundingBox();
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
  if (modoCamera == 2 || finalizou == true) {
    speed = 0;
  }

  // Verifica se o carro ta dentro da pista
  if (
    !trackArray.some(
      (e) =>
        e.x === Math.ceil(car.position.x / 10) * 10 &&
        e.z === Math.ceil(car.position.z / 10) * 10
    )
  ) {
    if (speed > 0 && speed > maxSpeed / 2) {
      speed -= 2.4 * incrementSpeed;
    }
    if (speed < 0 && speed < -(maxSpeed / 2)) {
      speed += 2.4 * incrementSpeed;
    }
  }

  // Verifica se o carro passou na linha de chegada
  if (
    finishLineArray.some(
      (e) =>
        e.x === Math.ceil(car.position.x / 10) * 10 &&
        e.z === Math.ceil(car.position.z / 10) * 10
    )
  ) {
    if (canFinish == 2) {
      if (lap == totalLap) {
        track.visible = true;

        var information = document.getElementById("InfoxBox");

        var total = 0;
        var texto = "";

        var melhor = timerVoltas[0];
        for (var i = 1; i <= lap; i++) {
          var seconds = timerVoltas[i] % 60;
          var minutes = (timerVoltas[i] - seconds) / 60;

          minutes = minutes < 10 ? "0" + minutes : minutes;
          seconds = seconds < 10 ? "0" + seconds : seconds;

          total += timerVoltas[i];

          texto += "<br>Volta " + i + " - " + minutes + ":" + seconds;

          if (melhor > timerVoltas[i]) {
            melhor = timerVoltas[i];
          }
        }

        var seconds = melhor % 60;
        var minutes = (melhor - seconds) / 60;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        texto += "<br>Melhor Volta: " + minutes + ":" + seconds;

        var secondsTotal = total % 60;
        var minutesTotal = (total - secondsTotal) / 60;

        minutesTotal = minutesTotal < 10 ? "0" + minutesTotal : minutesTotal;
        secondsTotal = secondsTotal < 10 ? "0" + secondsTotal : secondsTotal;

        information.innerHTML =
          "<div id='fim'> <h1>Parábens, você concluiu a corrida</h1> <h2>" +
          texto +
          "</h2> <br> <h3>Tempo total: " +
          minutesTotal +
          ":" +
          secondsTotal +
          "</h3> </div>";

        information.style.width = "100%";
        information.style.height = "100%";

        var fim = document.getElementById("fim");

        fim.style.color = "rgb(0, 0, 0)";
        fim.style.bottom = "0";
        fim.style.textAlign = "center";
        fim.style.color = "#FFF";
        fim.style.fontSize = "42px";

        //resetCar(track1, track1);
        finalizou = true;
      }

      if (timerVoltas[bestLap] > timerVoltas[lap]) {
        bestLap = lap;
      }

      lap++;

      timerVoltas[lap] = 0;
      canFinish = 0;
    }
  }

  // Verifica se o carro deu a volta na pista (Passou em cima)
  if (
    (canFinish == 0 &&
      Math.abs(car.position.z) > track1 + 340 &&
      Math.abs(car.position.z) < track1 + 400) ||
    (Math.abs(car.position.z) < track2 - 340 &&
      Math.abs(car.position.z) > track2 - 400)
  ) {
    canFinish = 1;
  }
  // Verifica se o carro deu a volta na pista (Passou do lado direito)
  if (
    (canFinish == 1 &&
      car.position.x > -track1 + 150 &&
      car.position.x < -track1 + 200) ||
    (car.position.x > track2 + 150 && car.position.z < track2 + 200)
  ) {
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

  // Verifica se o carro está no ar para não frear
  if (car.position.y - 2.2 <= 0.3) {
    // Desacelera o carro se não precionar nenhum botão
    if (
      !(
        keyboard.pressed("X") ||
        keyboard.pressed("down") ||
        keyboard.pressed("X") ||
        keyboard.pressed("up")
      )
    ) {
      if (speed != 0 && speed > 0) {
        speed -= incrementSpeed;
      }
      if (speed != 0 && speed < 0) {
        speed += incrementSpeed;
      }
    }

    // Desacelera mais o carro caso aperte o botão oposto
    if (speed < 0 && keyboard.pressed("X")) {
      speed += incrementSpeed * 2;
    }

    if (speed > 0 && keyboard.pressed("down")) {
      speed -= incrementSpeed * 2;
    }
  }

  car.translateZ(speed);

  itensArray.forEach(function (obj) {
    if (detectCollision(corpo, obj)) {
      if (bateu == false) {
        speed -= 20 / 100 * speed;
      }
      bateu = true;
    } else {
      bateu = false;
    }
  });

  var rampa = false;
  var rotateAngle = (Math.PI / 2) * (0.022 * speed);

  trackElevationArray.forEach(function (te) {
    if (speed > 0) {
      if (detectCollision(roda1, te) || detectCollision(roda2, te)) {
        rampa = true;
      }
    }
    if (speed < 0) {
      if (detectCollision(roda3, te) || detectCollision(roda4, te)) {
        rampa = true;
      }
    }
  });

  if (rampa == true) {
    car.rotateX(-rotateAngle);
    car.position.y += 0.25;
    rampa = true;
  } else {
    if (car.position.y < 2.2) {
      car.setRotationFromEuler(
        new THREE.Euler(
          camera_look.rotation._x,
          camera_look.rotation._y,
          camera_look.rotation._z,
          "XYZ"
        )
      );
      car.position.y = 2.3;
    }

    if (car.position.y > 3) {
      car.rotateX(rotateAngle);
    }
  }
}

function moveCamera() {
  // Camera inicial
  if (modoCamera == 0) {
    camera_look.position.copy(car.position);

    camera_look.translateZ(20);

    camera.position.x = camera_look.position.x + distance;
    camera.position.y = 35;
    camera.position.z = camera_look.position.z + distance;

    camera.lookAt(
      camera_look.position.x,
      camera_look.position.y,
      camera_look.position.z
    );
  }

  // Camera 3ª pessoa

  if (modoCamera == 1) {
    camera_look.position.copy(car.position);
    camera_position.position.copy(car.position);

    camera_look.translateZ(20);
    camera_position.translateZ(-40);

    camera.position.x = camera_position.position.x;
    camera.position.y = 20;
    camera.position.z = camera_position.position.z;

    camera.lookAt(
      camera_look.position.x,
      camera_look.position.y,
      camera_look.position.z
    );
  }

  light.position.copy(camera.position);

  // Modo de inspeção
  if (modoCamera == 2) {
    trackballControls.update();
    lightExp.position.copy(camera.position);
  }

  lightExp.visible = modoCamera == 2;
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

  // Faz a verificação do botões que estão sendo apertados
  keyboardUpdate();

  // Movimenta o carro
  movimentCar();

  // Faz a animação da camera
  moveCamera();

  requestAnimationFrame(render);

  controlledRender();
}
