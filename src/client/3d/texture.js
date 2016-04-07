export default class Texture {
  constructor(context) {
    this.gl = context;
    this.image = null;
    this.textureId = null;
    this.imageLoaded = null;
  }
  isLoaded() {
    return this.textureId !== null;
  }
  isImageLoaded() {
    return this.imageLoaded;
  }
  load(image) {
    const gl = this.gl;
    if (this.isLoaded()) throw new Error('Texture is already loaded');
    let texture = gl.createTexture();
    this.textureId = texture;
    this.image = image;
    if (image.complete) {
      // Image load is already done; just load it
      this.imageLoad();
      return Promise.resolve(this.textureId);
    } else {
      return new Promise((resolve) => {
        // TODO handle errors
        image.addEventListener('load', () => {
          this.imageLoad();
          resolve(this.textureId);
        });
      });
    }
  }
  imageLoad() {
    const gl = this.gl;
    if (this.isImageLoaded()) throw new Error('TexImage is already loaded');
    gl.bindTexture(gl.TEXTURE_2D, this.textureId);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
      this.image);
    // Texture configuration comes here
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
      gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    // Unbind texture
    gl.bindTexture(gl.TEXTURE_2D, null);
    this.imageLoaded = true;
  }
  use(textureId) {
    const gl = this.gl;
    // We can silently ignore this I suppose.
    if (!this.isLoaded()) throw new Error('Texture is not loaded');
    gl.activeTexture(gl.TEXTURE0 + textureId);
    gl.bindTexture(gl.TEXTURE_2D, this.textureId);
  }
  unload() {
    const gl = this.gl;
    // We can silently ignore this I suppose.
    if (!this.isLoaded()) throw new Error('Texture is not loaded');
    gl.deleteTexture(this.textureId);
    this.textureId = null;
    this.imageLoaded = false;
  }
  static fromImage(context, url) {
    let texture = new Texture(context);
    let image = new Image();
    image.src = url;
    texture.load(image);
    // We want Texture object, not a Promise object.
    // TODO Still, it'd be a good idea if we can return Promise from here.
    // (without delaying rendering)
    return texture;
  }
}
