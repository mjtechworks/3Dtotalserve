// import { Color, Scene } from 'three';
import * as THREE from 'three';

function createScene() {
  const scene = new THREE.Scene();

  scene.background = new THREE.Color(0xdddddd);
  scene.fog = new THREE.Fog( 0xdddddd, 2, 22 );

  return scene;
}

export { createScene };
