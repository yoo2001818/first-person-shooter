export default class Geometry {
  constructor(context) {
    this.gl = context;
    this.vaoExt = null;

    this.vertices = null;
    this.normals = null;
    this.texCoords = null;
    this.indices = null;
    this.indicesType = null;

    this.bufferId = null;
    this.indicesBufferId = null;

    this.vaoId = [];
  }
  getVertexCount() {
    // While vertex array must be multiple of 3, it'd be good idea to
    // make this value to integer.
    return this.vertices.length / 3 | 0;
  }
  isLoaded() {
    return this.bufferId !== null;
  }
  load() {
    const gl = this.gl;
    if (this.isLoaded()) throw new Error('Geometry is already loaded');
    if (this.vertices === null) throw new Error('Vertices array is null');
    if (this.normals === null) throw new Error('Normals array is null');
    if (this.texCoords === null) throw new Error('Texure coords array is null');
    if (this.vertices.length !== this.normals.length) {
      throw new Error('Vertices and normals array size does not match');
    }
    if (this.vertices.length / 3 !== this.texCoords.length / 2) {
      throw new Error('Vertices and texture coords array size does not match');
    }
    // Create and bind the buffer.
    this.bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferId);
    let vertexCount = this.getVertexCount();
    // Assign the buffer.
    // Since this class assumes the geometry is buffered only once, it is right
    // to use STATIC_DRAW.
    // Each vertex consumes 44 bytes (that's a lot). Every float is 4 bytes,
    // and there is position (vec3), texCoords (vec2), normals (vec3).
    // plus tangent (vec3).
    gl.bufferData(gl.ARRAY_BUFFER, vertexCount * 44, gl.STATIC_DRAW);
    // Upload data to the buffer.
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertices);
    gl.bufferSubData(gl.ARRAY_BUFFER, this.getVertexCount() * 12,
      this.normals);
    gl.bufferSubData(gl.ARRAY_BUFFER, this.getVertexCount() * 24,
      this.tangents);
    gl.bufferSubData(gl.ARRAY_BUFFER, this.getVertexCount() * 36,
      this.texCoords);
    // Unbind buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    // If indices array exists, Use element array buffer too.
    if (this.indices != null) {
      // Create and bind index buffer.
      this.indicesBufferId = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBufferId);
      // Then upload the data to the buffer. Indices may use Uint16Array,
      // or Uint32Array. However we don't handle that much vertices yet.
      // TODO remove hard-coded index buffer type
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
      this.indicesType = gl.UNSIGNED_SHORT;
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
    // Enable VAO extension if possible.
    this.vaoExt = gl.getExtension('OES_vertex_array_object');
  }
  unload() {
    const gl = this.gl;
    if (!this.isLoaded()) throw new Error('Geometry is not loaded');
    gl.deleteBuffer(this.bufferId);
    gl.deleteBuffer(this.indicesBufferId);
    this.bufferId = null;
    this.indicesBufferId = null;
    if (this.vaoExt) {
      this.vaoId.forEach(vao => {
        this.vaoExt.deleteVertexArrayOES(vao);
      });
    }
  }
  // 'Dump' buffer to the shader attributes. Obviously this should be done
  // after the shader's use method.
  use(shader) {
    const gl = this.gl;
    if (!this.isLoaded()) throw new Error('Geometry is not loaded');
    // VAO extension section
    if (this.vaoExt) {
      let shaderId = shader.getId();
      if (this.vaoId[shaderId]) {
        // If VAO exists, just set the VAO to that.
        this.vaoExt.bindVertexArrayOES(this.vaoId[shaderId]);
        return;
      } else {
        // If VAO doesn't exists, create and bind VAO.
        this.vaoId[shaderId] = this.vaoExt.createVertexArrayOES();
        this.vaoExt.bindVertexArrayOES(this.vaoId[shaderId]);
        // Further buffer binds will be recorded on this VAO.
        console.log('Create VAO', shaderId);
      }
    }
    // Enable vertex arrays
    if (shader.vertices !== -1) {
      gl.enableVertexAttribArray(shader.vertices);
    }
    if (shader.normals !== -1) {
      gl.enableVertexAttribArray(shader.normals);
    }
    if (shader.texCoords !== -1) {
      gl.enableVertexAttribArray(shader.texCoords);
    }
    if (shader.tangents !== -1) {
      gl.enableVertexAttribArray(shader.tangents);
    }
    // Bind buffer and apply it to the attributes
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferId);
    gl.vertexAttribPointer(shader.vertices, 3, gl.FLOAT, false, 12, 0);
    if (shader.normals !== -1) {
      gl.vertexAttribPointer(shader.normals, 3, gl.FLOAT, false, 12,
        this.getVertexCount() * 12);
    }
    if (shader.tangents !== -1) {
      gl.vertexAttribPointer(shader.tangents, 3, gl.FLOAT, false, 12,
        this.getVertexCount() * 24);
    }
    if (shader.texCoords !== -1) {
      gl.vertexAttribPointer(shader.texCoords, 2, gl.FLOAT, false, 8,
        this.getVertexCount() * 36);
    }
    if (this.indicesBufferId !== null) {
      // Bind indices buffer too
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBufferId);
    }
  }
  // Actually draw the vertices to the screen.
  draw() {
    const gl = this.gl;
    if (!this.isLoaded()) throw new Error('Geometry is not loaded');
    // TODO Maybe I should support for points, lines, etc...?
    if (this.indicesBufferId !== null) {
      // Draw by elements if indices buffer exists
      gl.drawElements(gl.TRIANGLES, this.indices.length, this.indicesType, 0);
    } else {
      // Or just use array drawing
      gl.drawArrays(gl.TRIANGLES, 0, this.getVertexCount());
    }
  }
  cleanUp() {
    // Clean up the buffers after use (not really required though)
    const gl = this.gl;
    if (this.vaoExt) {
      this.vaoExt.bindVertexArrayOES(null);
    } else {
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
  }
}
