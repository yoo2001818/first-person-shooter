export default class Shader {
  constructor(context) {
    this.gl = context;

    this.programId = null;
    this.vertexShader = null;
    this.fragmentShader = null;

    this.vertices = null;
    this.normals = null;
    this.texCoords = null;

    this.transform = null;
  }
  loadShader(data, type) {
    const gl = this.gl;
    let shader = gl.createShader(type);
    gl.shaderSource(shader, data);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error('Shader compilation failed: ' +
        gl.getShaderInfoLog(shader));
    }
    switch (type) {
    case gl.FRAGMENT_SHADER:
      this.fragmentShader = shader;
      break;
    case gl.VERTEX_SHADER:
      this.vertexShader = shader;
      break;
    }
    return shader;
  }
  loadVertexShader(data) {
    return this.loadShader(data, this.gl.VERTEX_SHADER);
  }
  loadFragmentShader(data) {
    return this.loadShader(data, this.gl.FRAGMENT_SHADER);
  }
  // TODO Maybe the function name should be 'load' to give consistency?
  link() {
    const gl = this.gl;
    // TODO: currently this doesn't support multiple shaders of one type,
    // though I don't think it is required to do so.
    if (this.vertexShader == null) throw new Error('Vertex shader missing');
    if (this.fragmentShader == null) throw new Error('Fragment shader missing');
    // Create program and attach shaders
    let program = gl.createProgram();
    gl.attachShader(program, this.vertexShader);
    gl.attachShader(program, this.fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error('Shader program linking failed');
    }
    // TODO: if we support multiple shaders, this should be moved to somewhere
    // else.
    // Clean up the shaders
    gl.detachShader(program, this.vertexShader);
    gl.detachShader(program, this.fragmentShader);
    gl.deleteShader(this.vertexShader);
    gl.deleteShader(this.fragmentShader);
    // Set program ID
    this.programId = program;
    // Buffer frequently used attributes, uniforms.
    this.vertices = this.getAttrib('aPosition');
    this.normals = this.getAttrib('aNormal');
    this.texCoords = this.getAttrib('aTexCoord');

    this.transform = this.getUniform('uTransform');
    this.model = this.getUniform('uModel');
    this.modelInvTransp = this.getUniform('uModelInvTransp');

    return program;
  }
  getProgramId() {
    return this.programId;
  }
  // Enable shader program.
  use() {
    const gl = this.gl;
    if (!this.isLoaded()) throw new Error('Shader is not loaded');
    gl.useProgram(this.getProgramId());
    // Enable vertex arrays for the frequently used attributes,
    // but maybe we can do this in linking stage? I'm not sure.
    if (this.vertices !== -1) gl.enableVertexAttribArray(this.vertices);
    if (this.normals !== -1) gl.enableVertexAttribArray(this.normals);
    if (this.texCoords !== -1) gl.enableVertexAttribArray(this.texCoords);
  }
  delete() {
    this.gl.deleteProgram(this.getProgramId());
  }
  isLoaded() {
    return this.programId !== null;
  }
  getAttrib(name) {
    return this.gl.getAttribLocation(this.getProgramId(), name);
  }
  getUniform(name) {
    return this.gl.getUniformLocation(this.getProgramId(), name);
  }
}
