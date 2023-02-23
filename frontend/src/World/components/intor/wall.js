import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import * as THREE from "three";
// import { setupModel } from './setupModel.js';

async function loadWall() {
  const loaderGLTF = new GLTFLoader();
  const loaderFBX = new FBXLoader();

  const model_group = new THREE.Group();

  // const [parrotData, flamingoData, storkData] = await Promise.all([
  //   loaderGLTF.loadAsync("/assets/models/Parrot.glb"),
  //   loaderGLTF.loadAsync("/assets/models/Flamingo.glb"),
  //   loaderGLTF.loadAsync("/assets/models/Stork.glb"),
  // ]);

  const [door, window] = await Promise.all([
    loaderGLTF.loadAsync("/assets/models/door.glb"),
    loaderGLTF.loadAsync("/assets/models/window.glb"),
  ]);

  // console.log("Squaaawk!", parrotData);

  var planeGeometry = new THREE.PlaneGeometry(2, 1.4);
  var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  // plane.rotateY(-Math.PI / 2);
  plane.position.set(0, 0.7, -1);
  model_group.add(plane);

  var planeGeometry2 = new THREE.PlaneGeometry(2, 1.4);
  var planeMaterial2 = new THREE.MeshLambertMaterial({ color: 0xffffff });
  var plane2 = new THREE.Mesh(planeGeometry2, planeMaterial2);
  plane2.rotateY(-Math.PI / 2);
  plane2.position.set(1, 0.7, 0);
  model_group.add(plane2);

  var planeGeometry3 = new THREE.PlaneGeometry(2, 1.4);
  var planeMaterial3 = new THREE.MeshLambertMaterial({ color: 0xffffff });
  var plane3 = new THREE.Mesh(planeGeometry3, planeMaterial3);
  plane3.rotateY(Math.PI / 2);
  plane3.position.set(-1, 0.7, 0);
  model_group.add(plane3);

  var planeGeometry4 = new THREE.PlaneGeometry(2, 1.4);
  var planeMaterial4 = new THREE.MeshLambertMaterial({ color: 0xffffff });
  var plane4 = new THREE.Mesh(planeGeometry4, planeMaterial4);
  plane4.rotateY(Math.PI);
  plane4.position.set(0, 0.7, 1);
  model_group.add(plane4);

  var planeGeometry5 = new THREE.PlaneGeometry(2, 2);
  var textureLoader = new THREE.TextureLoader();
  var texture = textureLoader.load("/assets/models/floor_texture.jpg");
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.x = 3;
  texture.repeat.y = 3;
  var planeMaterial5 = new THREE.MeshLambertMaterial({
    color: 0xdddddd,
    map: texture,
  });
  var plane5 = new THREE.Mesh(planeGeometry5, planeMaterial5);
  plane5.rotateX(-Math.PI / 2);
  plane5.position.set(0, 0, 0);
  var asd = new THREE.Object3D();
  asd.add(plane5);
  model_group.add(plane5);

  var planeGeometry6 = new THREE.PlaneGeometry(60, 60);
  var planeMaterial6 = new THREE.MeshLambertMaterial({ color: 0xf0f0f0 });
  var plane6 = new THREE.Mesh(planeGeometry6, planeMaterial6);
  plane6.rotateX(-Math.PI / 2);
  plane6.position.set(0, -0.1, 0);

  model_group.add(plane6);

  door.scene.scale.set(0.02, 0.02, 0.02);
  door.scene.position.set(0, 0, -1.19);
  door.scene.children[0].children[0].material.emissive.setHex(0x666666);

  window.scene.scale.set(0.01, 0.01, 0.01);
  window.scene.position.set(0.86, 0.5, 0);
  window.scene.rotateY(Math.PI / 2);
  window.scene.children[0].children[0].material.emissive.setHex(0x666666);

  model_group.add(door.scene);
  model_group.add(window.scene);

  return model_group;
}

export { loadWall };
