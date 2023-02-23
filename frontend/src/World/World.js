import { loadWall } from "./components/intor/wall.js";
import { loadModel } from "./components/intor/object3D.js";
import { createCamera } from "./components/camera.js";
import { createLights } from "./components/lights.js";
import { createScene } from "./components/scene.js";

import { createControls } from "./systems/controls.js";
import { createTransControls } from "./systems/transformcontrols.js";
import { createHelper } from "./systems/helper.js";
import { createRenderer } from "./systems/renderer.js";
import { Resizer } from "./systems/Resizer.js";
import { Loop } from "./systems/Loop.js";

import * as THREE from "three";

let camera;
let controls;

let transcontrols;
let renderer;
let scene;
let loop;
// let helper;
let objects;

// let pointer;

class World {
  constructor(container) {
    camera = createCamera();
    renderer = createRenderer();
    scene = createScene();
    // helper = createHelper();
    loop = new Loop(camera, scene, renderer);
    container.append(renderer.domElement);

    const light = createLights();

    scene.add(light);

    // scene.add(helper);

    const resizer = new Resizer(container, camera, renderer);
  }

  async init() {
    let object_id;
    let control_state;
    let model_objects = new THREE.Group();
    let currentObject;

    controls = createControls(camera, renderer.domElement);
    loop.updatables.push(controls);

    setControlState("init");

    transcontrols = createTransControls(camera, renderer.domElement);
    const model = await loadWall();

    for (
      var i = 0;
      i < document.getElementsByClassName("img-item").length;
      i++
    ) {
      document
        .getElementsByClassName("img-item")
        [i].addEventListener("click", add_model, false);
    }
    // let model_object;

    let model_object;
    function setControlState(state) {
      control_state = state;
      if (state == "init") {
        document.getElementById("tool-button").style.visibility = "hidden";
      } else if (state == "set") {
        document.getElementById("tool-button").style.visibility = "visible";
      }
    }

    function changeModel_object_state(model_object, state) {
      if (!state) {
        model_object.traverse(function (object) {
          if (object.type == "Mesh") {
            object.material.transparent = true;
            object.material.opacity = 0.5;
          }
        });
      } else {
        model_object.traverse(function (object) {
          if (object.type == "Mesh") {
            object.material.transparent = false;
            object.material.opacity = 1;
          }
        });
      }
    }

    async function add_model() {
      if (control_state == "init") {
        setControlState("add");
        control_state = "add";
        object_id = this.getAttribute("id");
        // console.log(this);
        this.getElementsByTagName("img")[0].style.border = "2px solid #aaaaaa";
        model_object = await loadModel(object_id);

        changeModel_object_state(model_object, false);
        model_object.position.set(100, 1000, 1000);

        scene.add(model_object);
        for (
          var i = 0;
          i < document.getElementsByClassName("img-item").length;
          i++
        ) {
          if (
            this.getAttribute("id") !=
            document.getElementsByClassName("img-item")[i].getAttribute("id")
          )
            document
              .getElementsByClassName("img-item")
              [i].getElementsByTagName("img")[0].style.border =
              "2px solid #ffffff";
        }
        // get_model_object(object_id);
      }
    }

    objects = [];
    objects.push(model.children[4]);
    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerdown", onPointerDown);
    function onPointerMove(event) {
      if (control_state == "add") {
        let raycaster = new THREE.Raycaster();
        let pointer = new THREE.Vector2();
        pointer.set(
          (event.clientX /
            document.getElementById("scene-container").offsetWidth) *
            2 -
            1,
          -(
            event.clientY /
            document.getElementById("scene-container").offsetHeight
          ) *
            2 +
            1
        );

        raycaster.setFromCamera(pointer, camera);

        const intersects = raycaster.intersectObjects(objects, false);
        if (intersects.length > 0) {
          const intersect = intersects[intersects.length - 1];
          model_object.position.set(intersect.point.x, 0, intersect.point.z);
          renderer.render(scene, camera);
          // controls.detach();
        }
      }
      if (control_state == "init") {
        // changeModel_object_state(objects, true);
        let raycaster = new THREE.Raycaster();
        let pointer = new THREE.Vector2();
        pointer.set(
          (event.clientX /
            document.getElementById("scene-container").offsetWidth) *
            2 -
            1,
          -(
            event.clientY /
            document.getElementById("scene-container").offsetHeight
          ) *
            2 +
            1
        );

        raycaster.setFromCamera(pointer, camera);

        const intersects = raycaster.intersectObjects(objects, false);

        if (intersects.length > 1) {
          const intersect = intersects[0];

          // intersect;
          // changeModel_object_state(intersect.object, false);
        }
      }
    }

    function onPointerDown(event) {
      if (control_state == "add") {
        let raycaster = new THREE.Raycaster();
        let pointer = new THREE.Vector2(
          (event.clientX /
            document.getElementById("scene-container").offsetWidth) *
            2 -
            1,
          -(
            event.clientY /
            document.getElementById("scene-container").offsetHeight
          ) *
            2 +
            1
        );

        raycaster.setFromCamera(pointer, camera);

        const intersects = raycaster.intersectObjects(objects, false);

        if (intersects.length > 0) {
          const intersect = intersects[intersects.length - 1];

          setControlState("set");
          model_objects.add(model_object);
          objects.push(
            model_objects.children[model_objects.children.length - 1]
              .children[0].children[0]
          );
          currentObject = model_object;

          scene.add(model_objects);
          setTransform();

          renderer.render(scene, camera);
        }
      }
      if (control_state == "init") {
        let raycaster = new THREE.Raycaster();
        let pointer = new THREE.Vector2();
        pointer.set(
          (event.clientX /
            document.getElementById("scene-container").offsetWidth) *
            2 -
            1,
          -(
            event.clientY /
            document.getElementById("scene-container").offsetHeight
          ) *
            2 +
            1
        );

        raycaster.setFromCamera(pointer, camera);

        const intersects = raycaster.intersectObjects(objects, false);

        if (intersects.length > 1) {
          const intersect = intersects[0];
          setControlState("set");
          currentObject = intersect.object.parent.parent;
          changeModel_object_state(intersect.object.parent.parent, false);

          // intersect;
          transcontrols.attach(intersect.object);
        }
      }
    }
    function setTransform() {
      if (control_state == "set") {
        transcontrols.attach(
          model_objects.children[model_objects.children.length - 1]
        );
        transcontrols.addEventListener("dragging-changed", function (event) {
          controls.enabled = !event.value;
        });
        scene.add(transcontrols);
      }
    }
    document.getElementById("btn_ok").addEventListener("click", () => {
      transcontrols.detach();
      changeModel_object_state(currentObject, true);
      setControlState("init");
    });

    document.getElementById("btn_del").addEventListener("click", () => {
      transcontrols.detach();

      const isLargeNumber = (element) =>
        element == currentObject.children[0].children[0];

      console.log(objects.findIndex(isLargeNumber));
      objects.splice(objects.findIndex(isLargeNumber), 1);

      console.log(currentObject.children[0].children[0]);

      // objects.pop(currentObject.parent);
      console.log(objects);

      model_objects.remove(currentObject);

      setControlState("init");
    });

    // let raycaster = new THREE.Raycaster();
    // let pointer = new THREE.Vector2();
    // function

    // move the target to the center of the front bird
    // controls.target.copy(parrot.position);

    scene.add(model);
  }

  render() {
    renderer.render(scene, camera);
  }

  start() {
    loop.start();
  }

  stop() {
    loop.stop();
  }
}

export { World };
