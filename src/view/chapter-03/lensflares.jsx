import * as THREE from "three";
import { Component } from "react";
import * as dat from "dat.gui";
import { initStats, initTrackballControls } from "../../utils/index";
import grassBg from "../../assets/textures/ground/grasslight-big.jpg";
import textureFlare0Img from "../../assets/textures/lensflare/lensflare0.png";
import textureFlare3Img from "../../assets/textures/lensflare/lensflare3.png";
import {
  Lensflare,
  LensflareElement,
} from "three/examples/jsm/objects/Lensflare.js";
// 镜头光晕
class Lensflares extends Component {
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
    console.log("init");
    let stats = initStats();

    this.canvas = document.querySelector(".webgl-output");

    // Create a scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xaaaaff);
    scene.fog = new THREE.Fog(0xaaaaaa, 0.01, 200);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      this.canvas.clientWidth / this.canvas.clientHeight,
      0.1,
      1000
    );

    camera.position.set(-20, 15, 45);
    camera.lookAt(new THREE.Vector3(10, 0, 0));

    // 渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    renderer.shadowMap.enabled = true;
    this.canvas.appendChild(renderer.domElement);

    window.addEventListener("resize", () => {
      camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    });

    const textureGrass = new THREE.TextureLoader().load(grassBg);
    textureGrass.wrapS = THREE.RepeatWrapping;
    textureGrass.wrapT = THREE.RepeatWrapping;
    textureGrass.repeat.set(4, 4);

    const planeGeometry = new THREE.PlaneGeometry(1000, 200, 20, 20);
    const planeMaterial = new THREE.MeshLambertMaterial({
      map: textureGrass,
    });

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    // rotate and position the plane
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(15, 0, 0);

    plane.receiveShadow = true;
    scene.add(plane);

    const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    const cubeMaterial = new THREE.MeshLambertMaterial({
      color: 0xff3333,
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(-4, 3, 0);
    cube.castShadow = true;
    scene.add(cube);

    const sphereGeometry = new THREE.SphereGeometry(4, 25, 25);
    const sphereMaterial = new THREE.MeshLambertMaterial({
      color: 0x7777ff,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(10, 5, 10);
    sphere.castShadow = true;
    scene.add(sphere);

    const ambiColor = "#1c1c1c";
    const ambientLight = new THREE.AmbientLight(ambiColor);
    scene.add(ambientLight);

    const pointLight0 = new THREE.PointLight(0xcccccc);
    pointLight0.position.set(-40, 60, -10);
    pointLight0.castShadow = true;
    pointLight0.lookAt(plane);
    scene.add(pointLight0);

    // 辅助线
    // const axes = new THREE.AxesHelper(20);
    // scene.add(axes);

    // 光晕
    const light = new THREE.PointLight(0xffffff, 1.5, 2000);
    const textureLoader = new THREE.TextureLoader();

    const textureFlare0 = textureLoader.load(textureFlare0Img);
    const textureFlare3 = textureLoader.load(textureFlare3Img);

    const lensflare = new Lensflare();
    lensflare.addElement(new LensflareElement(textureFlare0, 216, 0));
    lensflare.addElement(new LensflareElement(textureFlare3, 216, 0));
    lensflare.position.set(200, 1, -800);
    light.add(lensflare);
    scene.add(lensflare);

    // GUI  使用.
    var step = 0;

    // used to determine the switch point for the light animation
    const controls = new (function () {
      this.rotationSpeed = 0.03;
      this.bouncingSpeed = 0.03;
      this.ambientColor = ambiColor;
      this.intensity = 0.1;
      this.distance = 0;
      this.exponent = 30;
      this.angle = 0.1;
      this.debug = false;
      this.castShadow = true;
      this.onlyShadow = false;
      this.target = "Plane";
    })();
    this.controlsGUI = new dat.GUI({ name: "Controls" });

    const gui = this.controlsGUI;
    gui.addColor(controls, "ambientColor").onChange(function (e) {
      ambientLight.color = new THREE.Color(e);
    });

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

export default Lensflares;
