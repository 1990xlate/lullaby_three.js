import * as THREE from "./three.js-dev/build/three.module.js";
import { OBJLoader } from "./three.js-dev/examples/jsm/loaders/OBJLoader.js";
import { OrbitControls } from "./three.js-dev/examples/jsm/controls/OrbitControls.js";
import { AnaglyphEffect } from './three.js-dev/examples/jsm/effects/AnaglyphEffect.js'


export function example_iv() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x00001a);
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer();
  const orbit_controls = new OrbitControls(camera, renderer.domElement);
  const loader = new THREE.TextureLoader();

  //audio
  const listener = new THREE.AudioListener();
camera.add( listener );

const sound = new THREE.Audio( listener );

const audioLoader = new THREE.AudioLoader();
audioLoader.load( './sleep.mp3', function( buffer ) {
  sound.setBuffer( buffer );
  sound.setLoop( true );
  sound.setVolume( 0.5 );
  sound.play();
});

 renderer.setSize(window.innerWidth, window.innerHeight);
 renderer.setPixelRatio(window.devicePixelRatio);

  let windowHalfX = window.innerWidth/2;
  let windowHalfY = window.innerHeighth/2;

  orbit_controls.enableDamping = true;
  orbit_controls.dampingFactor = 0.05;
  orbit_controls.screenSpacePanning = false;
  orbit_controls.minDistance = 100;
  orbit_controls.maxDistance = 500;
  orbit_controls.maxPolarAngle = Math.PI / 2;

  let object;

const geometry = new THREE.SphereGeometry();
const geometry1 = new THREE.TorusGeometry( 20, 1, 16, 100 );



//light
  const ambientLight = new THREE.AmbientLight(0xffcce6, 1);
  scene.add(ambientLight);

  const light = new THREE.DirectionalLight();
        light.position.set( 0.5, 1, 1 );
        light.castShadow = true;
        light.shadow.camera.zoom = 4; 
        scene.add( light );

//loadmodel+texture
  const manager = new THREE.LoadingManager(loadModel);
  const texture_loader = new THREE.TextureLoader(manager);
  const texture = texture_loader.load('./tex3.jpg');

//material
 
let uniform = {
    time: { value: 1 }
  };

  const material = new THREE.ShaderMaterial({
    uniforms: uniform,
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent
  });



const material_m = new THREE.MeshPhongMaterial({
    color: "#ffffff",
morphTargets: true,
  });

//object



  const object_loader = new OBJLoader(manager);
  object_loader.load('./obj_build.obj', function (obj) {
    object = obj;
  }, onProgress, onError);


///cube
const cube = new THREE.Mesh(geometry1, material);
cube.scale.set(10, 10, 10);
cube.position.z = -40; 
 cube.position.y = 0;

scene.add(cube);

//cube1
const cube1 = new THREE.Mesh(geometry1, material);
cube1.scale.set(10, 10, 10);
cube1.position.z = -40; 
cube1.position.y = 0;
 
scene.add(cube1);


//orbi
const this_mesh = new THREE.Group();
 
 for (let i_counter = 0; i_counter < 200; i_counter++) {
        let this_mesh = new THREE.Mesh(geometry, material_m);
        this_mesh.position.x = Math.random() * 600 - 300;
        this_mesh.position.y = Math.random() * 600 - 300;;
        this_mesh.position.z = Math.random() * 600 - 300;
        this_mesh.updateMatrix();
        this_mesh.matrixAutoUpdate = false;
        scene.add(this_mesh);

    }



    orbit_controls.update();







//efect
const width = window.innerWidth || 2;
const height = window.innerHeight || 2;

const effect = new AnaglyphEffect( renderer );
effect.setSize( width, height );



  //Animation loop
  renderer.setAnimationLoop(function () {
 

cube.rotation.y += Math.PI/180;
cube1.rotation.y += Math.PI/160;

  uniform["time"].value = performance.now() / 1000;

  orbit_controls.update();

  effect.render(scene,camera);
  });

  document.body.appendChild(renderer.domElement);

  //Functions
  function loadModel() {
   object.traverse(function (child) {
     //traverse
     if (child.isMesh) {
       child.material.map = texture;
   }
    });
   object.scale.set(7,7,7);
    object.position.z = -20;    
    object.position.y = 0;
    object.position.x = 0;
    object.rotation.x = - Math.PI / 1;
    object.rotation.y = - Math.PI / 1.5 ;
    

    scene.add(object);
  }

  //On progress
  function onProgress(xhr) {
    if (xhr.lengthComputable) {
      const loading_completed = xhr.loaded / xhr.total / 100;
      console.log('Model ' + Math.round(loading_completed, 2) + '% loaded.');
    }
  }

  //On error
  function onError(err) {
    console.log(err);
  }


}

  