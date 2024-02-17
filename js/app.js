import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import fragment from "./shaders/fragment.glsl";
import vertex from "./shaders/vertex.glsl";

class Sketch {
  constructor(option) {
    this.scene = new THREE.Scene();

    this.container = option.dom;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.camera = new THREE.PerspectiveCamera(
      70,
      this.width / this.height,
      0.01,
      10
    );
    this.camera.position.z = 1;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.width, this.height);
    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.time = 0;

    this.addObject();
    this.mouseMove();
    this.render();
  }

  addObject() {
    this.geometry = new THREE.PlaneGeometry(1, 1, 1);
    this.material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        u_time: { value: 0.0 },
        u_resolution: { value: new THREE.Vector2() },
        u_mouse: { value: new THREE.Vector2() },
      },
      fragmentShader: fragment,
      vertexShader: vertex,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  mouseMove() {
    window.addEventListener("mousemove", (e) => {
      this.material.uniforms.u_mouse.value.x = e.pageX;
      this.material.uniforms.u_mouse.value.y = e.pageY;
    });
  }

  render() {
    requestAnimationFrame(this.render.bind(this));
    this.material.uniforms.u_time.value += 0.05;
    this.renderer.render(this.scene, this.camera);
  }
}

new Sketch({
  dom: document.getElementById("container"),
});
