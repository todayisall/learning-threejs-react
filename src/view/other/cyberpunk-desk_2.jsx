import * as THREE from "three";
import { Component } from "react";
import * as dat from "dat.gui";
import { initStats } from "../../utils/index";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/**
 * 1. 增加合适光照要有阴影.
 * 2. 增加材质的质量.
 * 3. 编辑模型增加模型交互.
 * 4. 增加缩放的声音.
 */
class CyberpunkDesk extends Component {
  constructor(props) {
    super(props);
    this.canvas = null;
    this.controlsGUI = null;
    console.log("constructor");
  }

  componentDidMount() {
    this.init();
  }
  componentWillUnmount() {
    this.controlsGUI.destroy();
  }
  init() {
    console.log("init ");
    let stats = initStats();
    let mixer = null;
    let isPlaying = false;
    const deskStatus = "up"; // down
    const destAction = {
      toUp: null,
      toDown: null,
    };
    this.canvas = document.querySelector(".webgl-output");

    // Create a scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x333333);

    // 环境光，
    const light = new THREE.AmbientLight(0xffffff); // soft white light
    scene.add(light);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      this.canvas.clientWidth / this.canvas.clientHeight,
      0.1,
      500
    );
    camera.lookAt(scene.position);

    // 渲染器
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    renderer.shadowMap.enabled = true;
    this.canvas.appendChild(renderer.domElement);

    // 添加控制器
    const controls = new OrbitControls(camera, renderer.domElement);

    //controls.update() must be called after any manual changes to the camera's transform
    camera.position.set(-50, 50, -80);
    controls.update();

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const doAction = (action) => {
      console.log("开始动画:", action);

      action.play();
      isPlaying = true;
      action.addEventListener("finished", () => {
        console.log("结束动画:", action);
        isPlaying = false;
        action.stop();
      });
    };
    const renderScene = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children);
      if (localStorage.getItem("deskStatus") === "up" && !isPlaying) {
        if (destAction?.toDown) {
          doAction(destAction?.toDown);
        }
      } else if (localStorage.getItem("deskStatus") === "down" && !isPlaying) {
        if (destAction?.toUp) {
          doAction(destAction?.toUp);
        }
      }

      controls.update();
      requestAnimationFrame(renderScene);
      stats.update();
      renderer.render(scene, camera);
    };
    renderScene();

    window.addEventListener("resize", () => {
      camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    });

    // Instantiate a loader
    const loader = new GLTFLoader();

    // Load a glTF resource
    loader.load(
      // resource URL
      "/models/left_desk/lifting_desk.gltf",
      function (gltf) {
        console.log("gltf", gltf);
        gltf.scene.scale.set(15, 15, 15);
        scene.add(gltf.scene);

        const animations = gltf.animations;
        mixer = new THREE.AnimationMixer(gltf.scene);

        // 加载动画
        for (let i = 0; i < animations.length; i++) {
          const animation = animations[i];
          if (animation.name === "table_down_actoin") {
            console.info("table_down_actoin");
            const action = mixer.clipAction(animation);
            destAction.toDown = action;
            console.log("animations.toDown", destAction.toDown);
          } else if (animation.name === "table_up_action") {
            const action = mixer.clipAction(animation);
            console.info("table_toUp_actoin");
            destAction.toUp = action;
            console.log("animations.toUp", destAction.toUp);
          }
        }

        renderScene();
      },
      // called while loading is progressing
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      // called when loading has errors
      function (error) {
        console.log("An error happened");
      }
    );

    const pointLight = new THREE.PointLight(0xf0f0f0, 1, 100);
    pointLight.position.set(6, 25, 6);
    scene.add(pointLight);

    const sphereSize = 1;
    const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
    scene.add(pointLightHelper);
  }

  render() {
    return (
      <div
        className="webgl-output"
        style={{ width: "100vw", height: "100vh" }}
      ></div>
    );
  }
}

export default CyberpunkDesk;
