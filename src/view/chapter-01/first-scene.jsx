import * as THREE from "three";
import { Component } from "react";

class FirstScene extends Component {
  constructor(props) {
    super(props);
    this.canvas = null;
  }

  componentDidMount() {
    this.init();
  }

  init() {
    console.log("init");
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
    this.canvas.appendChild(renderer.domElement);

    const planeGeometry = new THREE.PlaneGeometry(60, 20);
    const planeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(15, 0, 0);
    scene.add(plane);

    const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    const cubeMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true,
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(-4, 3, 0);
    scene.add(cube);

    const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x7777ff,
      wireframe: true,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(20, 5, 2);
    scene.add(sphere);

    // 辅助线
    const axes = new THREE.AxesHelper(20);
    scene.add(axes);

    renderer.render(scene, camera);
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

export default FirstScene;
