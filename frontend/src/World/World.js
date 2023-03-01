import { loadWall } from "./components/object3D/modelBase.js";
import { loadModel } from "./components/object3D/modelObject.js";
import { loadTextModel } from "./components/object3D/textObject.js";
import { createLine } from "./components/object3D/lineObject.js";
import { createCamera } from "./components/camera.js";
import { createLights } from "./components/lights.js";
import { createScene } from "./components/scene.js";

import { createControls } from "./systems/controls.js";
import { createTransControls } from "./systems/transformcontrols.js";

import { createHelper } from "./systems/helper.js";
import { createRenderer } from "./systems/renderer.js";

import { createRaycuster } from "./systems/raycaster.js";

import { Resizer } from "./systems/Resizer.js";
import { Loop } from "./systems/Loop.js";

import * as THREE from "three";

let camera;
let controls;
let transcontrols;
let renderer;
let scene;
let loop;
let helper;
let objects;
// let pointer;

class World {
  constructor(container) {
    camera = createCamera();
    renderer = createRenderer();
    scene = createScene();
    loop = new Loop(camera, scene, renderer);
    container.append(renderer.domElement);
    //add light
    const light = createLights();
    scene.add(light);
    //add helper
    helper = createHelper();
    scene.add(helper);
    new Resizer(container, camera, renderer);
  }

  async init() {
    let object_id;
    let control_state;
    let model_object;
    let model_objects = new THREE.Group();
    model_objects.name = "modelObjects";
    let current_object;

    //initial setting

    controls = createControls(camera, renderer.domElement);
    loop.updatables.push(controls);
    transcontrols = createTransControls(
      camera,
      renderer.domElement,
      control_state
    );
    const model = await loadWall();
    scene.add(model);

    setControlState("init");

    let openSelectPanelDivState = false;

    $("#components-nav").on("shown.bs.collapse", function () {
      changeSelectPanelDiv(true);
    });

    $("#components-nav").on("hidden.bs.collapse", function () {
      changeSelectPanelDiv(false);
    });

    function changeSelectPanelDiv(state) {
      if (!state) {
        document.getElementById("select-panel").style.marginLeft = "-430px";
      } else {
        document.getElementById("select-panel").style.marginLeft = "-30px";
      }
      openSelectPanelDivState = !openSelectPanelDivState;
    }

    for (
      var i = 0;
      i < document.getElementsByClassName("model-item").length;
      i++
    ) {
      document
        .getElementsByClassName("model-item")
        [i].addEventListener("click", add_model, false);
    }

    async function add_model() {
      if (control_state == "init" || control_state == "add") {
        object_id = this.getAttribute("id");
        model_object = await loadModel(object_id);

        changeModel_object_state(model_object, false);
        model_object.position.set(100, 1000, 1000);

        scene.add(model_object);
        setControlState("add");
        $("#components-nav").collapse("hide");
      }
    }

    var old_control_state;

    var myModal = new bootstrap.Modal(document.getElementById("basicModal"));

    document
      .getElementById("btn_openAddTextModal")
      .addEventListener("click", () => {
        if (control_state == "init") {
          openSetTextModal();
        }
      });
    document
      .getElementById("btn_setTextModalOk")
      .addEventListener("click", () => {
        if (document.getElementById("textContent").value) {
          myModal.hide();
          settext();
        }
      });

    document.getElementById("btn_addArrow").addEventListener("click", () => {
      setControlState("addFirstArrow");
    });

    $("#basicModal").on("hidden.bs.modal", function () {
      setControlState(old_control_state);
    });

    function openSetTextModal() {
      old_control_state = control_state;
      myModal.show();

      if (control_state == "init") {
        setControlState("addText");
        document.getElementById("txt_setTextModalTitle").innerHTML = "Add Text";
      } else if (control_state == "set") {
        setControlState("setText");
        document.getElementById("textContent").value =
          current_object.textProps.text;
        document.getElementById("textSize").value =
          current_object.textProps.size;
        document.getElementById("textFont").value =
          current_object.textProps.font;
        document.getElementById("textColor").value =
          current_object.textProps.color;
        document.getElementById("textBold").checked =
          current_object.textProps.bold;
        document.getElementById("txt_setTextModalTitle").innerHTML = "Set Text";
      }
    }

    async function settext() {
      if (control_state == "addText") {
        model_object = await loadTextModel(
          document.getElementById("textContent").value,
          document.getElementById("textSize").value,
          document.getElementById("textColor").value,
          document.getElementById("textFont").value,
          document.getElementById("textBold").checked
        );
        changeModel_object_state(model_object, false);
        model_object.position.set(0, 10000, 0);
        scene.add(model_object);
        setControlState("add");
      } else if (control_state == "setText") {
        let new_current = await loadTextModel(
          document.getElementById("textContent").value,
          document.getElementById("textSize").value,
          document.getElementById("textColor").value,
          document.getElementById("textFont").value,
          document.getElementById("textBold").checked
        );
        new_current.position.copy(current_object.position);
        new_current.rotation.copy(current_object.rotation);
        new_current.scale.copy(current_object.scale);
        scene.add(new_current);
        delete_current_object();
        current_object = new_current;
        transcontrols.attach(current_object);
        current_object.traverse(function (object) {
          if (object.type == "Mesh") {
            objects.push(object);
          }
        });
        model_objects.add(current_object);
        setControlState("set");
      }
      old_control_state = control_state;
    }

    function setControlState(state) {
      control_state = state;
      if (state == "init") {
        document.getElementById("tool-button").style.opacity = 0;
        document.getElementById("tool-button").style.visibility = "hidden";
        for (
          var i = 0;
          i < document.getElementsByClassName("model-item").length;
          i++
        ) {
          document
            .getElementsByClassName("model-item")
            [i].getElementsByTagName("img")[0].style.borderColor = "#ffffff";
        }
      } else if (state == "set") {
        document.getElementById("tool-button").style.opacity = 1;
        document.getElementById("tool-button").style.visibility = "visible";
      }
    }

    function changeModel_object_state(model_object, state) {
      if (!state) {
        model_object.traverse(function (object) {
          if (object.type == "Mesh") {
            object.material.transparent = true;
            object.material.opacity = 0.8;
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

    objects = [];
    objects.push(model.children[0]);

    //add line
    let start = new THREE.Vector3(-1, 0, -1);
    let end = new THREE.Vector3(1, 0, 1);
    let line = new THREE.Object3D();
    line.name = "lineObject";
    line.add(createLine(start, end));

    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    function onPointerMove(event) {
      let intersects = createRaycuster(event, objects, renderer, camera);
      renderer.render(scene, camera);
      {
        if (control_state == "init") {
          if (intersects.length > 1 && intersects[0].object.name != "plane") {
            document.body.style.cursor = "pointer";
          } else {
            document.body.style.cursor = "inherit";
          }
        }
        if (control_state == "add") {
          if (intersects.length > 0) {
            const intersect = intersects[intersects.length - 1];
            model_object.position.set(intersect.point.x, 0, intersect.point.z);
          }
        }
        if (control_state == "addFirstArrow") {
          if (intersects.length > 0) {
            document.body.style.cursor = "pointer";
          } else {
            document.body.style.cursor = "inherit";
          }
        }
        if (control_state == "addSecondArrow") {
          if (intersects.length > 0) {
            const intersect = intersects[intersects.length - 1];
            end.set(intersect.point.x, 0, intersect.point.z);
            let lineTemp = createLine(start, end);
            line.add(lineTemp);
            line.remove(line.children[0]);
            scene.add(line);
            document.body.style.cursor = "pointer";
          } else {
            document.body.style.cursor = "inherit";
          }
        }
      }
    }

    // test

    document.getElementById("btn_editText").addEventListener("click", () => {
      openSetTextModal();
    });

    function onPointerDown(event) {
      document.body.style.cursor = "inherit";
      let intersects = createRaycuster(event, objects, renderer, camera);
      if (control_state == "add") {
        if (intersects.length > 0) {
          setObject(model_object);
        }
      }
      if (control_state == "init") {
        if (intersects.length > 1) {
          const intersect = intersects[0];

          //get object from casted mesh
          let currentNode = intersect.object;
          if (currentNode.name != "plane") {
            setControlState("set");

            while (
              !(
                currentNode.type == "Scene" ||
                currentNode.name.includes("modelObject_") ||
                currentNode.name.includes("textObject") ||
                currentNode.name.includes("lineObject")
              )
            ) {
              currentNode = currentNode.parent;
              console.log(currentNode);
            }
            if (currentNode.type == "Scene") {
              console.error("Invaild object.");
            }

            current_object = currentNode;
            if (current_object.name.includes("textObject")) {
              document.getElementById("btn_editText").style.display =
                "inline-block";
            } else {
              document.getElementById("btn_editText").style.display = "none";
            }

            // current_object = intersect.object.parent.parent;
            changeModel_object_state(current_object, false);

            // intersect;
            transcontrols.attach(current_object);
          }
        }
      }
      if (control_state == "addSecondArrow") {
        if (intersects.length > 0) {
          const intersect = intersects[0];
          let line_current = createLine(start, end);
          scene.remove(line);
          scene.add(line_current);
          setObject(line_current);
          setControlState("set");
        }
      }

      if (control_state == "addFirstArrow") {
        if (intersects.length > 0) {
          const intersect = intersects[0];
          start.copy(intersect.point);
          setControlState("addSecondArrow");
        }
      }
    }
    function setObject(selected_object) {
      if (control_state == "add" || control_state == "addSecondArrow") {
        if (selected_object.name.includes("textObject")) {
          document.getElementById("btn_editText").style.display =
            "inline-block";
        } else {
          document.getElementById("btn_editText").style.display = "none";
        }
        model_objects.add(selected_object);
        selected_object.traverse(function (object) {
          if (object.type == "Mesh") {
            objects.push(object);
          }
        });
        current_object = selected_object;
        scene.remove(selected_object);
        scene.add(model_objects);
        transcontrols.attach(
          model_objects.children[model_objects.children.length - 1]
        );
        transcontrols.addEventListener("dragging-changed", function (event) {
          controls.enabled = !event.value;
        });
        scene.add(transcontrols);
      }
      setControlState("set");
    }
    document.getElementById("btn_ok").addEventListener("click", () => {
      check_current_object();
    });

    document.addEventListener("keydown", (event) => {
      if (control_state == "set") {
        switch (event.which || event.keyCode || event.charCode) {
          case 46:
            delete_current_object();
            break;
          case 13:
            check_current_object();
            break;
        }
      }
    });

    document.getElementById("btn_del").addEventListener("click", () => {
      delete_current_object();
    });

    function delete_current_object() {
      transcontrols.detach();
      current_object.traverse(function (object) {
        if (object.type == "Mesh") {
          const isLargeNumber = (element) => element == object;
          objects.splice(objects.findIndex(isLargeNumber), 1);
        }
      });
      model_objects.remove(current_object);
      setControlState("init");
    }

    function check_current_object() {
      transcontrols.detach();
      changeModel_object_state(current_object, true);
      setControlState("init");
    }

    // function save_
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
