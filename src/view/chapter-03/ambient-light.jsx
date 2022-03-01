import * as THREE from "three";
import { Component } from "react";
import * as dat from "dat.gui";
import { initStats, initTrackballControls } from "../../utils/index";

class AmbientLight extends Component {
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

    const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    const cubeMaterial = new THREE.MeshLambertMaterial({
      color: 0xff0000,
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(-4, 3, 0);
    cube.castShadow = true;
    scene.add(cube);

    const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    const sphereMaterial = new THREE.MeshLambertMaterial({
      color: 0x7777ff,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(20, 4, 2);
    sphere.castShadow = true;
    scene.add(sphere);

    var ambiColor = "#0c0c0c";
    const ambientLight = new THREE.AmbientLight(ambiColor, 0.5);
    scene.add(ambientLight);

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
      this.bouncingSpeed = 0.03;
      this.ambientColor = ambiColor;
      this.disableSpotlight = false;
      this.intensity = 0.5;
    })();
    this.controlsGUI = new dat.GUI({ name: "Controls" });


    const gui = this.controlsGUI;
    gui.add(controls, "intensity", 0, 3, 0.5).onChange((e) => {
      ambientLight.color = new THREE.Color(controls.ambientColor);
      ambientLight.intensity = controls.intensity;
    });
    gui.addColor(controls, "ambientColor").onChange((e) => {
      ambientLight.color = new THREE.Color(controls.ambientColor);
      ambientLight.intensity = controls.intensity;
    });
    gui.add(controls, "disableSpotlight").onChange((e) => {
      pointLight.visible = !e;
    })

    // 控制相机
    const trackballControls = initTrackballControls(camera, renderer);

    const renderScenne = () => {
      // 控制相机
      trackballControls.update();
      cube.rotation.x += controls.rotationSpeed;
      cube.rotation.y += controls.rotationSpeed;
      cube.rotation.z += controls.rotationSpeed;
      step += controls.bouncingSpeed;
      sphere.position.x = 20 + 10 * Math.cos(step);
      sphere.position.y = 2 + 10 * Math.abs(Math.sin(step));

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

export default AmbientLight;
