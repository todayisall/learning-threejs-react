import * as THREE from "three";
import { Component } from "react";
import * as dat from "dat.gui";
import { initStats } from "../../utils/index";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const TWEEN = require("@tweenjs/tween.js");

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
    let isPlaying = false;
    let deskStatus = "up"; // down
    let posSound = null;
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
    const listener = new THREE.AudioListener();
    camera.add(listener);
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

    camera.position.set(-50, 50, -80);
    controls.update();

    const renderScene = () => {
      TWEEN.update();
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

    const startAnimation = () => {
      const deskTop = scene.getObjectByName("Table");
      const deskPositionY = [1.2, 0.75];
      console.log("deskStatus", deskStatus);
      if (deskTop?.position && !isPlaying) {
        posSound.play();
        const gentTween = new TWEEN.Tween(deskTop.position)
          .to(
            {
              y: deskPositionY[deskStatus === "up" ? 0 : 1],
            },
            2000
          )
          .onComplete((obj) => {
            isPlaying = false;
          })
          .start();
        isPlaying = true;
      }
    };
    loader.load(
      // resource URL
      "/models/left_desk/lifting_desk.gltf",
      function (gltf) {
        console.log("gltf", gltf);
        gltf.scene.scale.set(15, 15, 15);
        scene.add(gltf.scene);

        const deskTop = scene.getObjectByName("Table");
        // 声音文件.
        if (deskTop?.position) { 
          posSound = new THREE.PositionalAudio(listener);
          const audioLoader = new THREE.AudioLoader();
          audioLoader.load('/models/left_desk/audio.mp3', (buffer) => {
            posSound.setBuffer(buffer);
            posSound.setRefDistance(30);
            posSound.
            posSound.setRolloffFactor(0.8);
          })
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

    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(6, 25, 6);
    scene.add(pointLight);

    const sphereSize = 1;
    const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
    scene.add(pointLightHelper);

    // used to determine the switch point for the light animation
    const panelControls = new (function () {
      this.deskStatus = deskStatus;
    })();
    this.controlsGUI = new dat.GUI({ name: "Controls" });
    this.controlsGUI
      .add(panelControls, "deskStatus", ["up", "down"])
      .onChange((value) => {
        deskStatus = value;
        startAnimation();
      });
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
