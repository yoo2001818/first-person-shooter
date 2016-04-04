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
    let vertColor = gl.getAttribLocation(program, 'aVertexColor');
    gl.enableVertexAttribArray(vertColor);
    this.vertColorAttrib = vertColor;
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
  render() {
    const gl = this.gl;
    if (!gl) return;
    // We can do OpenGL stuff now.. but now what?
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // Init basic matrix
    /*let perspective = mat4.create();
    mat4.perspective(perspective,
      45 * Math.PI / 180, this.canvas.width / this.canvas.height, 0.1, 100.0);
    // mat4.ortho(perspective, -this.canvas.width / this.canvas.height * 2,
    //   this.canvas.width / this.canvas.height * 2, -2, 2, 0.3, 1000);
    let identity = mat4.create();
    mat4.translate(identity, identity, [0, 0, -6]);
    // mat4.rotateY(identity, identity, 180 / 180 * Math.PI);
    mat4.rotateX(identity, identity, 30 / 180 * Math.PI);
    // mat4.rotateX(identity, identity, Math.sin(Date.now() / 500) *
    Math.PI / 4);
    mat4.rotateY(identity, identity, (Date.now() / 400) % (Math.PI * 2));
    */

    // Load cube
    gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVert);
    gl.vertexAttribPointer(this.vertPosAttrib, 3, gl.FLOAT, false, 32, 0);
    gl.vertexAttribPointer(this.vertColorAttrib, 3, gl.FLOAT, false, 32, 12);
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
    let viewMat = mat4.create();
    mat4.translate(viewMat, viewMat, [0, 0, -6]);
    var vUniform = gl.getUniformLocation(this.shaderProgram, 'uViewMat');
    gl.uniformMatrix4fv(vUniform, false, viewMat);

    for (var i = 0; i < 10; ++i) {
      let modelMat = mat4.create();
      mat4.rotateZ(modelMat, modelMat, (Date.now() / 1000) % (Math.PI * 2));
      mat4.translate(modelMat, modelMat, [
        Math.cos(36 * Math.PI / 180 * i) * 6,
        Math.sin(36 * Math.PI / 180 * i) * 6,
        - 10,
        0]);
      mat4.rotateX(modelMat, modelMat, 30 / 180 * Math.PI);
      mat4.rotateY(modelMat, modelMat, (Date.now() / 400) % (Math.PI * 2));
      mat4.rotate(modelMat, modelMat, 20 * Math.PI / 180 * i,
        [1.0, 0.3, 0.5]);

      var mUniform = gl.getUniformLocation(this.shaderProgram, 'uModelMat');
      gl.uniformMatrix4fv(mUniform, false, modelMat);

      gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    }
  }
}
