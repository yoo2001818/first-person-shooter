import { mat4, vec3 } from 'gl-matrix';

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
  }
  // :P This isn't React, but still whatever.
  setupEvents() {
  }
  loadShader(data, type) {
    const gl = this.gl;
    let shader = gl.createShader(type);
    gl.shaderSource(shader, data);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
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
    // Near things obscure far things
    gl.depthFunc(gl.LEQUAL);
    // Clear the color as well as the depth buffer.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.initShaders();
    this.initBuffers();
  }
  initShaders() {
    const gl = this.gl;
    let fragShader = this.loadShader(require('../shader/test.frag'),
      gl.FRAGMENT_SHADER);
    let vertShader = this.loadShader(require('../shader/test.vert'),
      gl.VERTEX_SHADER);
    let program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      alert('Failed to init shader program.');
    }
    gl.useProgram(program);
    let vertPos = gl.getAttribLocation(program, 'aVertexPosition');
    gl.enableVertexAttribArray(vertPos);
    this.vertPosAttrib = vertPos;
    let vertColor = gl.getAttribLocation(program, 'aVertexColor');
    gl.enableVertexAttribArray(vertColor);
    this.vertColorAttrib = vertColor;
    this.shaderProgram = program;
    return program;
  }
  initBuffers() {
    const gl = this.gl;
    let vertices = [
      1.0, 1.0, 0.0,   1.0, 0.0, 0.0,
      -1.0, 1.0, 0.0,  0.0, 1.0, 0.0,
      1.0, -1.0, 0.0,  0.0, 0.0, 1.0,
      -1.0, -1.0, 0.0, 1.0, 1.0, 1.0
    ];
    this.squareVert = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVert);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    let indices = [
      0, 1, 3,
      0, 2, 3
    ];
    this.squareIndices = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.squareIndices);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices),
      gl.STATIC_DRAW);
  }
  // OpenGL render point
  render() {
    const gl = this.gl;
    if (!gl) return;
    // We can do OpenGL stuff now.. but now what?
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // Init basic matrix
    let perspective = mat4.create();
    mat4.perspective(perspective,
      45 * Math.PI / 180, this.canvas.width / this.canvas.height, 0.1, 100.0);
    let identity = mat4.create();
    mat4.translate(identity, identity, [0, 0, -6]);
    mat4.rotateZ(identity, identity, Math.sin(Date.now() / 400) * Math.PI);
    mat4.rotateY(identity, identity, Math.cos(Date.now() / 400) * Math.PI);
    // Load square
    gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVert);
    gl.vertexAttribPointer(this.vertPosAttrib, 3, gl.FLOAT, false, 24, 0);
    gl.vertexAttribPointer(this.vertColorAttrib, 3, gl.FLOAT, false, 24, 12);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.squareIndices);

    var pUniform = gl.getUniformLocation(this.shaderProgram, 'uPMatrix');
    gl.uniformMatrix4fv(pUniform, false, perspective);
    var mvUniform = gl.getUniformLocation(this.shaderProgram, 'uMVMatrix');
    gl.uniformMatrix4fv(mvUniform, false, identity);

    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  }
}
