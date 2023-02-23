import * as THREE from "three";

function createHelper(camera, canvas) {
   const helper= new THREE.AxesHelper( 20 );

//   controls.enableDamping = true;

//   // forward controls.update to our custom .tick method
//   controls.tick = () => controls.update();

  return helper;
}

export { createHelper };
