function main()
{
  var scene = new THREE.Scene();    // Create main scene
  var clock = new THREE.Clock();
  var stats = initStats();          // To show FPS information
  var light = initDefaultLighting(scene, new THREE.Vector3(25, 30, 20)); // Use default light
  var renderer = initRenderer();    // View function in util/utils
    renderer.setClearColor("rgb(30, 30, 30)");
  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.lookAt(0, 0, 0);
    camera.position.set(5,15,40);
    camera.up.set( 0, 1, 0 );

  var followCamera = false; // Controls if light will follow camera

  // To use the keyboard
  var keyboard = new KeyboardState();

  // Enable mouse rotation, pan, zoom etc.
  var trackballControls = new THREE.TrackballControls( camera, renderer.domElement );

  // Listen window size changes
  window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

  var groundPlane = createGroundPlane(40, 35); // width and height
    groundPlane.rotateX(degreesToRadians(-90));
  scene.add(groundPlane);

  // Show axes (parameter is size of each axis)
  var axesHelper = new THREE.AxesHelper( 20 );
    axesHelper.visible = false;
    axesHelper.translateY(0.1);
  scene.add( axesHelper );

  // Show text information onscreen
  showInformation();

  // Object Material
  var objectMaterial = new THREE.MeshPhongMaterial({color:"rgb(50,130,150)"});

  //----------------------------------
  // Create Convex Geometry
  //----------------------------------
  // First, create the point vector to be used by the convex hull algorithm
  var points = generatePoints();

  var convexGeometry = new THREE.ConvexBufferGeometry(points);
    convexGeometry.computeVertexNormals();
    convexGeometry.computeFaceNormals();
    convexGeometry.computeBoundingBox();
    //convexGeometry.computeFlatVertexNormals(); // Enable this to see flat faces
    convexGeometry.normalsNeedUpdate = true;
  var object = new THREE.Mesh(convexGeometry, objectMaterial);
    object.castShadow = true;

  scene.add(object);

  render();

  function generatePoints()
  {
    var points = [];
    var numberOfPoints = 15;
    var maxSize = 10;
    for (var i = 0; i < numberOfPoints; i++) {
      var randomX = Math.round(-maxSize + Math.random() * maxSize*2);
      var randomY = Math.round(0.1 + Math.random() * maxSize); //
      var randomZ = Math.round(-maxSize + Math.random() * maxSize*2);

      points.push(new THREE.Vector3(randomX, randomY, randomZ));
    }
    // material for all points
    var material = new THREE.MeshPhongMaterial({color:"rgb(255,255,0)"});

    spGroup = new THREE.Object3D();
    points.forEach(function (point) {
      var spGeom = new THREE.SphereGeometry(0.2);
      var spMesh = new THREE.Mesh(spGeom, material);
      spMesh.position.set(point.x, point.y, point.z);
      spMesh.castShadow = true;
      spGroup.add(spMesh);
    });
    // add the points as a group to the scene
    scene.add(spGroup);
    return points;
  }

  function keyboardUpdate()
  {
    keyboard.update();
  	if ( keyboard.down("A") )
    {
      axesHelper.visible = !axesHelper.visible
    }
    if ( keyboard.down("O") )
    {
      object.visible = !object.visible
    }
    if ( keyboard.down("P") )
    {
      spGroup.visible = !spGroup.visible
    }
    if ( keyboard.down("C") )
    {
      followCamera = !followCamera;
    }
  }

  function showInformation()
  {
    // Use this to show information onscreen
    controls = new InfoBox();
      controls.add("Convex Geometry Example");
      controls.show();
      controls.addParagraph();
      controls.add("Pressione 'A' para visualizar/ocultar os eixos.");
      controls.add("Pressione 'P' para visualizar/ocultar os pontos base.");
      controls.add("Pressione 'O' para visualizar/ocultar o objeto principal.");
      controls.add("Pressione 'C' para luz acompanhar (ou não) a camera.");
      controls.show();
  }

  function render()
  {
    stats.update();
    trackballControls.update();
    if(followCamera)
        lightFollowingCamera(light, camera) // Makes light follow the camera
    else
        light.position.set(5,15,40);
    keyboardUpdate();
    requestAnimationFrame(render);
    renderer.render(scene, camera)
  }
}
