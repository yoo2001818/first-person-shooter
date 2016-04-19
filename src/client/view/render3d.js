import { mat4, vec3, vec4 } from 'gl-matrix';
import Container from '../3d/container';
import Context from '../3d/context';
import Grid from '../3d/util/grid';

import Light from '../3d/light';

import BoxGeometry from '../3d/geom/boxGeometry';
import PhongMaterial from '../3d/material/phongMaterial';
import Mesh from '../3d/mesh';

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

    let material = new PhongMaterial(gl, {
      ambient: new Float32Array([0.24275 / 0.2, 0.1995 / 0.2, 0.0745 / 0.2]),
      diffuse: new Float32Array([0.75164, 0.60648, 0.22648]),
      specular: new Float32Array([0.628281, 0.555802, 0.366065]),
      shininess: 51.2
    });
    let boxGeometry = new BoxGeometry(gl);
    boxGeometry.load();
    let cube = new Mesh(boxGeometry, material);
    container.appendChild(cube);
  }
  // OpenGL render point
  render() {
    const gl = this.gl;
    if (!gl) return;
    this.camera.pos = new Float32Array([
      Math.cos(Date.now() / 1000) * 6,
      4,
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
