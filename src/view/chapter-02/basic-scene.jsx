import * as THREE from "three";
import { Component } from "react";
import * as dat from "dat.gui";
import { initStats, initTrackballControls } from "../../utils/index";

class BasicScene extends Component {
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

    // fog 
    scene.fog = new THREE.Fog(0xffffff, 0.015, 100);
    // scene.overrideMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      this.canvas.clientWidth / this.canvas.clientHeight,
      0.1,
      1000
    );
    camera.position.set(-30, 40, 30);
    camera.lookAt(scene.position);

    // 渲染器
    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    renderer.shadowMap.enabled = true;
    this.canvas.appendChild(renderer.domElement);

    window.addEventListener("resize", () => {
      camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    });

    const planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
    const planeMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff,
    });

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(15, 0, 0);
    plane.receiveShadow = true;
    scene.add(plane);

    const pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(-40, 60, -10);
    pointLight.castShadow = true;
    pointLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    pointLight.shadow.camera.near = 40;
    pointLight.shadow.camera.far = 130;
    scene.add(pointLight);

    // 辅助线
    const axes = new THREE.AxesHelper(20);
    scene.add(axes);

    // GUI  使用.
    let step = 0;
    const controls = new (function () {
      this.rotationSpeed = 0.02;
      this.numberOfObjects = scene.children.length;

      this.addCube = function () {
        const cubeSize = Math.ceil(Math.random() * 3);
        const cubeGeometry = new THREE.BoxGeometry(
          cubeSize,
          cubeSize,
          cubeSize
        );
        const cubeMaterial = new THREE.MeshLambertMaterial({
          color: Math.random() * 0xffffff,
        });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.castShadow = true;
        cube.name = "cube-" + scene.children.length;

        // position the cube randomly in the scene
        cube.position.x =
          -30 + Math.round(Math.random() * planeGeometry.parameters.width);
        cube.position.y = Math.round(Math.random() * 5);
        cube.position.z =
          -20 + Math.round(Math.random() * planeGeometry.parameters.height);

        scene.add(cube);
        this.numberOfObjects = scene.children.length;
      };
      this.removeCube = function () {
        const allChildren = scene.children;
        const lastObject = allChildren[allChildren.length - 1];
        if (lastObject instanceof THREE.Mesh) {
          scene.remove(lastObject);
          this.numberOfObjects = scene.children.length;
        }
      };
    })();
    this.controlsGUI = new dat.GUI({ name: "Controls" });

    const gui = this.controlsGUI;
    gui.add(controls, "rotationSpeed", 0, 0.5);
    gui.add(controls, "addCube");
    gui.add(controls, "removeCube");
    gui.add(controls, "numberOfObjects").listen();
    // 控制相机
    const trackballControls = initTrackballControls(camera, renderer);
    console.log(scene);
    const renderScenne = () => {
      // 控制相机
      trackballControls.update();

      // rotate the cubes around its axes
      scene.traverse(function (e) {
        if (e instanceof THREE.Mesh && e != plane) {
          e.rotation.x += controls.rotationSpeed;
          e.rotation.y += controls.rotationSpeed;
          e.rotation.z += controls.rotationSpeed;
        }
      });
      requestAnimationFrame(renderScenne);
      stats.update();
      renderer.render(scene, camera);
    };
    renderScenne();
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

export default BasicScene;
