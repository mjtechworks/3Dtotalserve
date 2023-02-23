import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
// import { setupModel } from './setupModel.js';

async function loadModel(id) {
  const loaderGLTF = new GLTFLoader();

  // const model_group = new THREE.Group();

  const [object_model] = await Promise.all([
    loaderGLTF.loadAsync("/assets/models/" + id + ".glb"),
  ]);

  object_model.scene.scale.set(0.01, 0.01, 0.01);
  //   object_model.scene.position.set(0, 0, -1);
  object_model.scene.rotateY(-Math.PI / 2);

  // model_group.add(object_model.scene);

  return object_model.scene;
}

export { loadModel };
