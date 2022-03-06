import * as THREE from "three";
import { Component } from "react";
import * as dat from "dat.gui";
import { initStats } from "../../utils/index";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

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

    this.canvas = document.querySelector(".webgl-output");

    // Create a scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x333333);
    
    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      this.canvas.clientWidth / this.canvas.clientHeight,
      0.1,
      1000
    );
    camera.lookAt(scene.position);

    // 渲染器
    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    renderer.shadowMap.enabled = true;
    this.canvas.appendChild(renderer.domElement);

    // 添加控制器
    const controls = new OrbitControls(camera, renderer.domElement);

    //controls.update() must be called after any manual changes to the camera's transform
    camera.position.set(-50, 50, -80);
    controls.update();

    const renderScene = () => {
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
      "/models/cyberpunk_desk/scene.gltf",
      function (gltf) {
        console.log("gltf", gltf);
        gltf.scene.scale.set(5, 5, 5);
        scene.add(gltf.scene);
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

    const pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(0, 10, 0);
    pointLight.castShadow = true;
    // pointLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    pointLight.shadow.camera.near = 40;
    pointLight.shadow.camera.far = 130;
    scene.add(pointLight);

    // 辅助线
    const axes = new THREE.AxesHelper(20);
    scene.add(axes);

    // 控制相机
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
