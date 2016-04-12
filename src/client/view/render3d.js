import { mat4, vec3, vec4 } from 'gl-matrix';
import Container from '../3d/container';
import Mesh from '../3d/mesh';
import SkyboxMesh from '../3d/skyboxMesh';
import BoxGeometry from '../3d/boxGeometry';
import SkyboxGeometry from '../3d/skyboxGeometry';
import CombinedGeometry from '../3d/combinedGeometry';
import QuadGeometry from '../3d/quadGeometry';
import PhongMaterial from '../3d/phongMaterial';
import SkyboxMaterial from '../3d/skyboxMaterial';
import Material from '../3d/material';
import Shader from '../3d/shader';
import Texture from '../3d/texture';
import CubeTexture from '../3d/cubeTexture';
import Light from '../3d/light';
import Context from '../3d/context';

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
    this.cameraVelY = 0;
    this.cameraGround = 1;
    this.objects = [];
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
    this.render(0);
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

    let light = new Light({
      ambient: new Float32Array([0.2, 0.2, 0.2]),
      diffuse: new Float32Array([0.8, 0.8, 0.8]),
      specular: new Float32Array([0.8, 0.8, 0.8]),
      attenuation: 0.014
      // coneDirection: new Float32Array([1, 1, 1]),
      /*coneDirection: this.camera.front,
      coneCutOff: new Float32Array([
        Math.cos(12.5 / 180 * Math.PI),
        Math.cos(17.5 / 180 * Math.PI)
      ])*/
    });
    container.appendChild(light);
    light.position = vec4.create();
    vec4.set(light.position, -1, 1, 0, 0);
    mat4.translate(light.matrix, light.matrix, [3, -3, 0]);
    mat4.scale(light.matrix, light.matrix, [0.2, 0.2, 0.2]);
    this.light = light;

    let flashLight = new Light({
      ambient: new Float32Array([0.2, 0.2, 0.2]),
      diffuse: new Float32Array([1, 1, 1]),
      specular: new Float32Array([0.75, 0.75, 0.75]),
      attenuation: 0.0005,
      coneCutOff: new Float32Array([
        Math.cos(12.5 / 180 * Math.PI),
        Math.cos(17.5 / 180 * Math.PI)
      ])
    });
    container.appendChild(flashLight);
    this.flashLight = flashLight;

    /*let material = new PhongMaterial(gl, {
      ambient: new Float32Array([0.05 / 0.2, 0.05 / 0.2, 0]),
      diffuse: new Float32Array([0.5, 0.5, 0.4]),
      specular: new Float32Array([0.7, 0.7, 0.04]),
      shininess: 70
    });*/
    /*let texture = Texture.fromImage(gl, require('../asset/texture2.png'));
    let normalTex = Texture.fromImage(gl,
      require('../asset/texture2_normal.png'));
    let depthTex = Texture.fromImage(gl,
      require('../asset/texture2_depth.png'));*/
    let texture = Texture.fromImage(gl,
      require('../asset/texture_diffuse.jpg'));
    let normalTex = Texture.fromImage(gl,
      require('../asset/texture_normal.jpg'));
    let depthTex = Texture.fromImage(gl,
      require('../asset/texture_depth.jpg'));
    let material2 = new PhongMaterial(gl, {
      diffuseMap: texture,
      normalMap: normalTex,
      depthMap: depthTex,
      depthMapScale: new Float32Array([0.1, 1]),
      // specularMap: texture2,
      // ambient: new Float32Array([0.24725 / 0.2, 0.1995 / 0.2, 0.0745 / 0.2]),
      // diffuse: new Float32Array([0.75164, 0.60648, 0.22648]),
      specular: new Float32Array([0.5, 0.5, 0.55]),
      shininess: 128
    });
    this.material2 = material2;

    let woodTex = Texture.fromImage(gl, require('../asset/woodfloor_c.jpg'));
    let woodNormalTex = Texture.fromImage(gl,
      require('../asset/woodfloor_n.jpg'));
    let woodSpecTex = Texture.fromImage(gl,
      require('../asset/woodfloor_s.jpg'));
    let material3 = new PhongMaterial(gl, {
      diffuseMap: woodTex,
      normalMap: woodNormalTex,
      specularMap: woodSpecTex,
      shininess: 30
    });
    // let mesh = new Mesh(geometry, material);
    // container.appendChild(mesh);
    let combinedGeom = new CombinedGeometry(gl);
    let prevPos = [0, -9, 0];
    let angle = Math.random() * 360 - 180;
    for (let i = 0; i < 40; ++i) {
      // let mesh2 = new Mesh(geometry, material2);
      // No, I won't do 3D OBB
      /*mat4.rotateX(mesh2.matrix, mesh2.matrix, Math.random() * Math.PI * 4);
      mat4.rotateY(mesh2.matrix, mesh2.matrix, Math.random() * Math.PI * 4);
      mat4.rotateZ(mesh2.matrix, mesh2.matrix, Math.random() * Math.PI * 4);*/
      let pos = [
        prevPos[0] + Math.cos(angle / 180 * Math.PI) * (Math.random() * 4 + 2),
        prevPos[1] + Math.random() * 1 + 1.5,
        prevPos[2] + Math.sin(angle / 180 * Math.PI) * (Math.random() * 4 + 2)
      ];
      prevPos = pos;
      angle += Math.random() * 60 - 30;
      let mat = mat4.create();
      mat4.translate(mat, mat, pos);
      // mat4.translate(mesh2.matrix, mesh2.matrix, pos);
      this.objects.push(pos);
      // container.appendChild(mesh2);
      combinedGeom.combine(geometry, mat);
    }
    combinedGeom.load();
    let gameMap = new Mesh(combinedGeom, material2);
    container.appendChild(gameMap);

    let quad = new Mesh(quadGeom, material3);
    mat4.translate(quad.matrix, quad.matrix, [0, -7.5, 0]);
    mat4.scale(quad.matrix, quad.matrix, [40, 40, 40]);
    mat4.rotateX(quad.matrix, quad.matrix, -90 * Math.PI / 180);
    container.appendChild(quad);

    // Lastly, add skybox
    let skyboxTexture = CubeTexture.fromImage(gl, [
      require('../asset/clouds1_east.jpg'),
      require('../asset/clouds1_west.jpg'),
      require('../asset/clouds1_up.jpg'),
      require('../asset/clouds1_down.jpg'),
      require('../asset/clouds1_north.jpg'),
      require('../asset/clouds1_south.jpg')
    ]);
    let skyboxMaterial = new SkyboxMaterial(gl, skyboxTexture);
    let skyboxGeom = new SkyboxGeometry(gl);
    skyboxGeom.load();
    let skybox = new SkyboxMesh(skyboxGeom, skyboxMaterial);
    container.appendChild(skybox);

    this.container = container;
  }
  // OpenGL render point
  render(delta) {
    const gl = this.gl;
    if (!gl) return;
    // 37: left, 38: up, 39: right, 40: down
    // This should not  exist in here, but what the heck
    const cameraSpeed = 0.01 * delta;
    let moveFront = vec3.create();
    vec3.normalize(moveFront, [
      Math.cos(this.yaw),
      0,
      Math.sin(this.yaw)
    ]);
    if (this.keys[38] || this.keys[87]) {
      vec3.add(this.camera.pos, this.camera.pos,
        vec3.scale(vec3.create(), moveFront, cameraSpeed));
    }
    if (this.keys[40] || this.keys[83]) {
      vec3.add(this.camera.pos, this.camera.pos,
        vec3.scale(vec3.create(), moveFront, -cameraSpeed));
    }
    /*
    if (this.keys[69]) {
      vec3.add(this.camera.pos, this.camera.pos,
        vec3.scale(vec3.create(), this.camera.up, cameraSpeed));
    }
    if (this.keys[81]) {
      vec3.add(this.camera.pos, this.camera.pos,
        vec3.scale(vec3.create(), this.camera.up, -cameraSpeed));
    }
    */
    let cameraCross = vec3.cross(vec3.create(),
      moveFront, this.camera.up);
    vec3.normalize(cameraCross, cameraCross);
    if (this.keys[37] || this.keys[65]) {
      vec3.add(this.camera.pos, this.camera.pos,
        vec3.scale(vec3.create(), cameraCross, -cameraSpeed));
    }
    if (this.keys[39] || this.keys[68]) {
      vec3.add(this.camera.pos, this.camera.pos,
        vec3.scale(vec3.create(), cameraCross, cameraSpeed));
    }
    if (this.keys[32] && Math.abs(this.cameraVelY) < 0.030 &&
      this.cameraGround
    ) {
      this.cameraVelY = 0.25;
      this.cameraGround = 0;
    }
    // Camera moving routine
    vec3.normalize(this.camera.front, [
      Math.cos(this.pitch) * Math.cos(this.yaw),
      Math.sin(this.pitch),
      Math.cos(this.pitch) * Math.sin(this.yaw)
    ]);
    this.cameraVelY -= 0.0005 * delta;
    vec3.add(this.camera.pos, this.camera.pos, [0, this.cameraVelY, 0]);
    if (this.camera.pos[1] < -6) {
      this.camera.pos[1] = -6;
      this.cameraVelY = 0;
      this.cameraGround = 1;
    }
    for (let i = 0; i < this.objects.length; ++i) {
      let object = this.objects[i];
      if (this.camera.pos[1] - 1.5 > object[1] - 1 &&
        this.camera.pos[1] - 1.5 < object[1] + 1 &&
        this.camera.pos[0] > object[0] - 1 &&
        this.camera.pos[0] < object[0] + 1 &&
        this.camera.pos[2] > object[2] - 1 &&
        this.camera.pos[2] < object[2] + 1
      ) {
        this.camera.pos[1] = object[1] + 1 + 1.5;
        this.cameraVelY = 0;
        this.cameraGround = 1;
      }
    }
    // Rotate light around
    /*let lightVec3 = new Float32Array([
      Math.cos(Date.now() / 700) * 10, 0, Math.sin(Date.now() / 700) * 10
    ]);*/
    /*this.light.position = new Float32Array([
      Math.cos(Date.now() / 700) * 10, 0, Math.sin(Date.now() / 700) * 10
    ]);
    mat4.identity(this.light.matrix);
    mat4.translate(this.light.matrix, this.light.matrix, this.light.position);
    mat4.scale(this.light.matrix, this.light.matrix, [0.2, 0.2, 0.2]);*/

    vec3.copy(this.flashLight.position, this.camera.pos);
    vec3.copy(this.flashLight.rotation, this.camera.front);
    mat4.identity(this.flashLight.matrix);
    mat4.translate(this.flashLight.matrix, this.flashLight.matrix,
      this.flashLight.position);
    mat4.scale(this.flashLight.matrix, this.flashLight.matrix, [0.2, 0.2, 0.2]);
    // Calculate camera vectors
    let projectionMat = mat4.create();
    mat4.perspective(projectionMat,
      90 * Math.PI / 180, this.canvas.width / this.canvas.height, 0.1, 1000.0);
    let cameraLook = vec3.create();
    vec3.add(cameraLook, this.camera.pos, this.camera.front);
    let viewMat = mat4.create();
    mat4.lookAt(viewMat, this.camera.pos, cameraLook, this.camera.up);
    let vpMat = mat4.create();
    mat4.multiply(vpMat, projectionMat, viewMat);
    // Do OpenGL stuff from now on
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // Update context information
    let context = new Context(gl);
    context.viewPos = this.camera.pos;
    context.vpMatrix = vpMat;
    context.pMatrix = projectionMat;
    context.vMatrix = viewMat;
    this.container.update(context);
    this.container.render(context);
  }
}
