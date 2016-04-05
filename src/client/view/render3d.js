import { mat4, vec3 } from 'gl-matrix';
import Texture from '../asset/texture.png';

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
    // gl.enable(gl.BLEND);
    // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    // Near things obscure far things
    gl.depthFunc(gl.LEQUAL);
    // Clear the color as well as the depth buffer.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.initShaders();
    this.initTextures();
    this.initBuffers();
    this.render();
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
    // let vertColor = gl.getAttribLocation(program, 'aVertexColor');
    // gl.enableVertexAttribArray(vertColor);
    // this.vertColorAttrib = vertColor;
    let texCoord = gl.getAttribLocation(program, 'aTextureCoord');
    gl.enableVertexAttribArray(texCoord);
    this.texCoordAttrib = texCoord;
    this.shaderProgram = program;
    return program;
  }
  initTextures() {
    const gl = this.gl;
    this.texture = gl.createTexture();
    let image = new Image();
    image.onload = () => {
      this.handleTextureLoad(image, this.texture);
    };
    image.src = Texture;
  }
  handleTextureLoad(image, texture) {
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }
  initBuffers() {
    const gl = this.gl;
    this.camera = {
      pos: vec3.fromValues(0, 0, 12),
      front: vec3.fromValues(0, 0, -1),
      up: vec3.fromValues(0, 1, 0)
    };
    let vertices = [
      // Position        // Color        // Texture
      // Front
      -1.0, -1.0,  1.0,  1.0, 0.0, 0.0,  0.0, 0.0,
      1.0, -1.0,  1.0,  0.0, 1.0, 0.0,  1.0, 0.0,
      1.0,  1.0,  1.0,  0.0, 0.0, 1.0,  1.0, 1.0,
      -1.0,  1.0,  1.0,  1.0, 1.0, 1.0,  0.0, 1.0,
      // Back
      -1.0, -1.0, -1.0,  1.0, 0.0, 0.0,  1.0, 0.0,
      1.0, -1.0, -1.0,  0.0, 1.0, 0.0,  0.0, 0.0,
      1.0,  1.0, -1.0,  0.0, 0.0, 1.0,  0.0, 1.0,
      -1.0,  1.0, -1.0,  1.0, 1.0, 1.0,  1.0, 1.0,
      // Top
      -1.0,  1.0, -1.0,  1.0, 0.0, 0.0,  0.0, 1.0,
      -1.0,  1.0,  1.0,  0.0, 1.0, 0.0,  0.0, 0.0,
      1.0,  1.0,  1.0,  0.0, 0.0, 1.0,  1.0, 0.0,
      1.0,  1.0, -1.0,  1.0, 1.0, 1.0,  1.0, 1.0,
      // Bottom
      -1.0, -1.0, -1.0,  1.0, 0.0, 0.0,  0.0, 0.0,
      -1.0, -1.0,  1.0,  0.0, 1.0, 0.0,  0.0, 1.0,
      1.0, -1.0,  1.0,  0.0, 0.0, 1.0,  1.0, 1.0,
      1.0, -1.0, -1.0,  1.0, 1.0, 1.0,  1.0, 0.0,
      // Right
      1.0, -1.0, -1.0,  1.0, 0.0, 0.0,  1.0, 0.0,
      1.0,  1.0, -1.0,  0.0, 1.0, 0.0,  1.0, 1.0,
      1.0,  1.0,  1.0,  0.0, 0.0, 1.0,  0.0, 1.0,
      1.0, -1.0,  1.0,  1.0, 1.0, 1.0,  0.0, 0.0,
      // Left
      -1.0, -1.0, -1.0,  1.0, 0.0, 0.0,  0.0, 0.0,
      -1.0,  1.0, -1.0,  0.0, 1.0, 0.0,  0.0, 1.0,
      -1.0,  1.0,  1.0,  0.0, 0.0, 1.0,  1.0, 1.0,
      -1.0, -1.0,  1.0,  1.0, 1.0, 1.0,  1.0, 0.0
    ];
    this.squareVert = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVert);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    console.log(vertices);
    let indices = [
      0, 1, 2,     0, 2, 3,    // front
      4, 5, 6,     4, 6, 7,    // back
      8, 9, 10,    8, 10, 11,  // top
      12, 13, 14,  12, 14, 15, // bottom
      16, 17, 18,  16, 18, 19, // right
      20, 21, 22,  20, 22, 23  // left
    ];
    this.squareIndices = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.squareIndices);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices),
      gl.STATIC_DRAW);
  }
  // OpenGL render point
  render(delta) {
    // 37: left, 38: up, 39: right, 40: down
    // This should exist in here, but what the heck
    const cameraSpeed = 0.02 * delta;
    if (this.keys[38] || this.keys[87]) {
      vec3.add(this.camera.pos, this.camera.pos,
        vec3.scale(vec3.create(), this.camera.front, cameraSpeed));
    }
    if (this.keys[40] || this.keys[83]) {
      vec3.add(this.camera.pos, this.camera.pos,
        vec3.scale(vec3.create(), this.camera.front, -cameraSpeed));
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
    const gl = this.gl;
    if (!gl) return;
    // We can do OpenGL stuff now.. but now what?
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Load cube
    gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVert);
    gl.vertexAttribPointer(this.vertPosAttrib, 3, gl.FLOAT, false, 32, 0);
    // gl.vertexAttribPointer(this.vertColorAttrib, 3, gl.FLOAT, false, 32, 12);
    gl.vertexAttribPointer(this.texCoordAttrib, 2, gl.FLOAT, false, 32, 24);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.uniform1i(gl.getUniformLocation(this.shaderProgram, 'uTexture'), 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.squareIndices);

    let projectionMat = mat4.create();
    mat4.perspective(projectionMat,
      45 * Math.PI / 180, this.canvas.width / this.canvas.height, 0.1, 100.0);

    var pUniform = gl.getUniformLocation(this.shaderProgram, 'uProjectionMat');
    gl.uniformMatrix4fv(pUniform, false, projectionMat);

    let cameraLook = vec3.create();
    vec3.add(cameraLook, this.camera.pos, this.camera.front);
    let viewMat = mat4.create();
    mat4.lookAt(viewMat, this.camera.pos, cameraLook, this.camera.up);
    var vUniform = gl.getUniformLocation(this.shaderProgram, 'uViewMat');
    gl.uniformMatrix4fv(vUniform, false, viewMat);

    let modelMat = mat4.create();
    mat4.rotateZ(modelMat, modelMat, (Date.now() / 1000) % (Math.PI * 2));
    // mat4.rotateX(modelMat, modelMat, 30 / 180 * Math.PI);
    // mat4.rotateY(modelMat, modelMat, (Date.now() / 400) % (Math.PI * 2));
    // mat4.rotate(modelMat, modelMat, 20 * Math.PI / 180 * i,
    //  [1.0, 0.3, 0.5]);

    var mUniform = gl.getUniformLocation(this.shaderProgram, 'uModelMat');
    gl.uniformMatrix4fv(mUniform, false, modelMat);

    var oUniform = gl.getUniformLocation(this.shaderProgram, 'uOffset');
    for (let i = 0; i < 10; ++i) {
      gl.uniform3f(oUniform, Math.cos(36 * Math.PI / 180 * i) * 6,
      Math.sin(36 * Math.PI / 180 * i) * 6,
      0);
      gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    }
  }
}
