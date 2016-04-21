import { mat4, vec3, vec4 } from 'gl-matrix';
import Container from '../3d/container';
import Context from '../3d/context';
import Grid from '../3d/util/grid';

import Light from '../3d/light';

// import ObjLoader from '../3d/util/objLoader';
import BoxGeometry from '../3d/geom/boxGeometry';
import SolidMaterial from '../3d/material/solidMaterial';
import Mesh from '../3d/mesh';

export default class RenderView3D {
  constructor(store, canvas) {
    this.canvas = canvas;
    try {
      this.gl = canvas.getContext('webgl', { antialias: false }) ||
        canvas.getContext('experimental-webgl');
    } catch (e) {
      console.log(e);
    }
    if (!this.gl) {
      alert('This browser does not support WebGL.');
      throw new Error('WebGL unsupported');
    }
    /*this.store = store;
    this.entities = store.systems.family.get(['pos', 'render']).entities;
    store.subscribe('all', this.render.bind(this));*/
  }
  clearEvents() {

  }
  setupEvents() {
  }
  resize() {
    const gl = this.gl;
    if (!gl) return;
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.render(0);
  }
  // OpenGL init point
  init() {
    const gl = this.gl;
    if (!gl) return;
    // Set clear color to black, fully opaque
    gl.clearColor(57 / 255, 57 / 255, 57 / 255, 1.0);
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
      pos: vec3.fromValues(0, 0, 5),
      front: vec3.fromValues(0, 0, -1),
      up: vec3.fromValues(0, 1, 0)
    };
    let container = new Container();
    this.container = container;
    let grid = new Grid(gl, 17, 17, 1);
    container.appendChild(grid);
    mat4.rotateX(grid.matrix, grid.matrix, 90 / 180 * Math.PI);

    let light = new Light({
      ambient: new Float32Array([0.2, 0.2, 0.2]),
      diffuse: new Float32Array([0.8, 0.8, 0.8]),
      specular: new Float32Array([0.8, 0.8, 0.8]),
      attenuation: 0.014
    });
    container.appendChild(light);
    light.position = vec4.create();
    vec4.set(light.position, 10, 10, 0, 0);

    let material = new SolidMaterial(gl, {
      specular: new Float32Array([0.3, 0.3, 0.3]),
      diffuse: new Float32Array([158 / 255, 158 / 255, 166 / 255]),
      ambient: new Float32Array([88 / 255, 88 / 255, 88 / 255]),
      reflection: new Float32Array([140 / 255, 140 / 255, 170 / 255]),
      shininess: 14.0
    });
    let boxGeometry = new BoxGeometry(gl);
    // let boxGeometry = ObjLoader.load(gl, require('../asset/model2.obj'));
    boxGeometry.load();
    let cube = new Mesh(boxGeometry, material);
    // mat4.scale(cube.matrix, cube.matrix, [3, 3, 3]);
    container.appendChild(cube);
    this.cube = cube;
  }
  // OpenGL render point
  render() {
    const gl = this.gl;
    if (!gl) return;
    this.camera.pos = new Float32Array([
      Math.cos(Date.now() / 1000) * 6,
      Math.cos(Date.now() / 1500) * 6,
      Math.sin(Date.now() / 1000) * 6
    ]);
    // Calculate camera vectors
    let projectionMat = mat4.create();
    mat4.perspective(projectionMat,
      70 * Math.PI / 180, this.canvas.width / this.canvas.height, 0.1, 1000.0);
    let cameraLook = vec3.create();
    //vec3.add(cameraLook, this.camera.pos, this.camera.front);
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
