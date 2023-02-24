import { WebGLRenderer } from "three";

function createRenderer() {
  const renderer = new WebGLRenderer({
    antialias: true,
    logarithmicDepthBuffer: true,
  });

  renderer.physicallyCorrectLights = true;

  return renderer;
}

export { createRenderer };
