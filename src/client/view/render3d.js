import { mat4, vec3 } from 'gl-matrix';
import Container from '../3d/container';
import Mesh from '../3d/mesh';
import BoxGeometry from '../3d/boxGeometry';
import QuadGeometry from '../3d/quadGeometry';
import PhongMaterial from '../3d/phongMaterial';
import Material from '../3d/material';
import Shader from '../3d/shader';
import Texture from '../3d/texture';

export default class RenderView3D {
  constructor(store, canvas) {
    this.canvas = canvas;
    try {
      this.gl = canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl');
    } catch (e) {
      console.log(e);
    }
    if (!this.gl) {
      alert('This browser does not support WebGL :(');
      throw new Error('WebGL unsupported');
    }
    this.store = store;
    this.entities = store.systems.family.get(['pos', 'render']).entities;
    store.subscribe('all', this.render.bind(this));
    this.mouseX = 0;
    this.mouseY = 0;
    this.pitch = 0;
    this.yaw = -Math.PI/2;
  }
  clearEvents() {

  }
  setupEvents() {
    this.keys = {};
    window.addEventListener('keydown', e => {
      this.keys[e.keyCode] = true;
    });
    window.addEventListener('keyup', e => {
      this.keys[e.keyCode] = false;
    });
    this.canvas.addEventListener('click', () => {
      this.canvas.requestPointerLock = this.canvas.requestPointerLock ||
                                       this.canvas.mozRequestPointerLock;
      this.canvas.requestPointerLock();
    });
    this.canvas.addEventListener('mousemove', e => {
      if (document.pointerLockElement || document.mozPointerLockElement) {
        this.pitch = Math.max(-Math.PI / 2 + 0.001, Math.min(Math.PI / 2
          - 0.001, this.pitch - e.movementY / 400));
        this.yaw = this.yaw + e.movementX / 400;
      }
      let mouseX = e.layerX - this.canvas.width / 2;
      let mouseY = e.layerY - this.canvas.height / 2;
      if (Math.abs(this.mouseX - mouseX) < 100 &&
        Math.abs(this.mouseY - mouseY) < 100
      ) {
        this.pitch = Math.max(-Math.PI / 2 + 0.001, Math.min(Math.PI / 2
          - 0.001, this.pitch - (mouseY - this.mouseY) / 400));
        this.yaw = this.yaw + (mouseX - this.mouseX) / 400;
      }
      this.mouseX = mouseX;
      this.mouseY = mouseY;
    });
  }
  resize() {
    const gl = this.gl;
    if (!gl) return;
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.render();
  }
  // OpenGL init point
  init() {
    const gl = this.gl;
    if (!gl) return;
    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Enable depth testing
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    // gl.enable(gl.BLEND);
    // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    // Near things obscure far things
    gl.depthFunc(gl.LEQUAL);
    // Clear the color as well as the depth buffer.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.initWorld();
    this.render();
  }
  initWorld() {
    const gl = this.gl;
    this.camera = {
      pos: vec3.fromValues(0, 0, 12),
      front: vec3.fromValues(0, 0, -1),
      up: vec3.fromValues(0, 1, 0)
    };

    let container = new Container();

    let geometry = new BoxGeometry(gl);
    geometry.load();
    let quadGeom = new QuadGeometry(gl);
    quadGeom.load();

    // Add light material
    let lightShader = new Shader(gl);
    lightShader.loadVertexShader(require('../shader/light.vert'));
    lightShader.loadFragmentShader(require('../shader/light.frag'));
    lightShader.link();
    let lightMaterial = new Material(gl, lightShader);
    lightMaterial.use = function(geometry) {
      Material.prototype.use.call(this, geometry);
      const gl = this.gl;
      gl.uniform3fv(this.shader.getUniform('uColor'), this.color);
    };
    lightMaterial.color = new Float32Array([1, 1, 1]);

    let light = new Mesh(geometry, lightMaterial);
    container.appendChild(light);
    mat4.translate(light.matrix, light.matrix, [3, -3, 0]);
    mat4.scale(light.matrix, light.matrix, [0.2, 0.2, 0.2]);
    this.light = light;

    let material = new PhongMaterial(gl, {
      ambient: new Float32Array([0.05 / 0.2, 0.05 / 0.2, 0]),
      diffuse: new Float32Array([0.5, 0.5, 0.4]),
      specular: new Float32Array([0.7, 0.7, 0.04]),
      shininess: 1
    });
    let texture = Texture.fromImage(gl, require('../asset/texture2.png'));
    let normalTex = Texture.fromImage(gl,
      require('../asset/texture2_normal.png'));
    let depthTex = Texture.fromImage(gl,
      require('../asset/texture2_depth.png'));
    /*let texture = Texture.fromImage(gl,
      require('../asset/texture_diffuse.jpg'));
    let normalTex = Texture.fromImage(gl,
      require('../asset/texture_normal.jpg'));
    let depthTex = Texture.fromImage(gl,
      require('../asset/texture_depth.jpg'));*/
    let material2 = new PhongMaterial(gl, {
      diffuseMap: texture,
      normalMap: normalTex,
      depthMap: depthTex,
      depthMapScale: new Float32Array([0.1, 1.5]),
      // specularMap: texture2,
      // ambient: new Float32Array([0.24725 / 0.2, 0.1995 / 0.2, 0.0745 / 0.2]),
      // diffuse: new Float32Array([0.75164, 0.60648, 0.22648]),
      specular: new Float32Array([0.5, 0.5, 0.55]),
      shininess: 30
    });
    this.material2 = material2;
    let material3 = new PhongMaterial(gl, {
      ambient: new Float32Array([0.1745 / 0.2, 0.01175 / 0.2, 0.01175 / 0.2]),
      diffuse: new Float32Array([0.61424, 0.04136, 0.04136]),
      specular: new Float32Array([0.727811, 0.626959, 0.626959]),
      shininess: 76.8
    });
    let mesh = new Mesh(geometry, material);
    container.appendChild(mesh);
    for (let i = 0; i < 10; ++i) {
      let mesh2 = new Mesh(geometry, material2);
      mat4.rotateX(mesh2.matrix, mesh2.matrix, Math.random() * Math.PI * 4);
      mat4.rotateY(mesh2.matrix, mesh2.matrix, Math.random() * Math.PI * 4);
      mat4.rotateZ(mesh2.matrix, mesh2.matrix, Math.random() * Math.PI * 4);
      mat4.translate(mesh2.matrix, mesh2.matrix, [
        Math.random() * 20 - 10,
        Math.random() * 20 - 10,
        Math.random() * 20 - 10
      ]);
      container.appendChild(mesh2);
    }
    let quad = new Mesh(quadGeom, material3);
    mat4.translate(quad.matrix, quad.matrix, [0, -10, 0]);
    mat4.scale(quad.matrix, quad.matrix, [60, 60, 60]);
    mat4.rotateX(quad.matrix, quad.matrix, -90 * Math.PI / 180);
    // container.appendChild(quad);
    this.container = container;
  }
  // OpenGL render point
  render(delta) {
    const gl = this.gl;
    if (!gl) return;
    // 37: left, 38: up, 39: right, 40: down
    // This should not  exist in here, but what the heck
    const cameraSpeed = 0.02 * delta;
    if (this.keys[38] || this.keys[87]) {
      vec3.add(this.camera.pos, this.camera.pos,
        vec3.scale(vec3.create(), this.camera.front, cameraSpeed));
    }
    if (this.keys[40] || this.keys[83]) {
      vec3.add(this.camera.pos, this.camera.pos,
        vec3.scale(vec3.create(), this.camera.front, -cameraSpeed));
    }
    if (this.keys[69]) {
      vec3.add(this.camera.pos, this.camera.pos,
        vec3.scale(vec3.create(), this.camera.up, cameraSpeed));
    }
    if (this.keys[81]) {
      vec3.add(this.camera.pos, this.camera.pos,
        vec3.scale(vec3.create(), this.camera.up, -cameraSpeed));
    }
    let cameraCross = vec3.cross(vec3.create(),
      this.camera.front, this.camera.up);
    vec3.normalize(cameraCross, cameraCross);
    if (this.keys[37] || this.keys[65]) {
      vec3.add(this.camera.pos, this.camera.pos,
        vec3.scale(vec3.create(), cameraCross, -cameraSpeed));
    }
    if (this.keys[39] || this.keys[68]) {
      vec3.add(this.camera.pos, this.camera.pos,
        vec3.scale(vec3.create(), cameraCross, cameraSpeed));
    }
    // Camera moving routine
    vec3.normalize(this.camera.front, [
      Math.cos(this.pitch) * Math.cos(this.yaw),
      Math.sin(this.pitch),
      Math.cos(this.pitch) * Math.sin(this.yaw)
    ]);
    // Rotate light around
    /*let lightVec3 = new Float32Array([
      Math.cos(Date.now() / 700) * 10, 0, Math.sin(Date.now() / 700) * 10
    ]);*/
    let lightVec4 = new Float32Array([
      3, -3, 0, 1
      // 0, 1, 0, 0
    ]);
    mat4.identity(this.light.matrix);
    mat4.translate(this.light.matrix, this.light.matrix, lightVec4);
    mat4.scale(this.light.matrix, this.light.matrix, [0.2, 0.2, 0.2]);
    // Calculate camera vectors
    let projectionMat = mat4.create();
    mat4.perspective(projectionMat,
      45 * Math.PI / 180, this.canvas.width / this.canvas.height, 0.1, 100.0);
    let cameraLook = vec3.create();
    vec3.add(cameraLook, this.camera.pos, this.camera.front);
    let viewMat = mat4.create();
    mat4.lookAt(viewMat, this.camera.pos, cameraLook, this.camera.up);
    let vpMat = mat4.create();
    mat4.multiply(vpMat, projectionMat, viewMat);
    // We can do OpenGL stuff now.. but now what?
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.container.render(gl, vpMat, {
      light: {
        position: lightVec4,
        // position: new Float32Array([
        //  this.camera.pos[0], this.camera.pos[1], this.camera.pos[2], 1.0]),
        ambient: new Float32Array([0.2, 0.2, 0.2]),
        diffuse: new Float32Array([1, 1, 1]),
        specular: new Float32Array([1, 1, 1]),
        attenuation: 0.0014
        // coneDirection: new Float32Array([1, 1, 1]),
        /*coneDirection: this.camera.front,
        coneCutOff: new Float32Array([
          Math.cos(12.5 / 180 * Math.PI),
          Math.cos(17.5 / 180 * Math.PI)
        ])*/
      },
      viewPos: this.camera.pos
    });
  }
}
