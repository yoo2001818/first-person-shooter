import Texture from './texture';
export default class CubeTexture extends Texture {
  isImageLoaded() {
    return this.imageLoaded === 6;
  }
  load(images) {
    const gl = this.gl;
    if (this.isLoaded()) throw new Error('Texture is already loaded');
    let texture = gl.createTexture();
    this.textureId = texture;
    this.imageLoaded = 0;
    this.images = images;
    let promises = images.map((image, index) => {
      if (image.complete) {
        // Image load is already done; just load it
        this.imageLoad(index);
        return Promise.resolve(this.textureId);
      } else {
        return new Promise((resolve) => {
          // TODO handle errors
          image.addEventListener('load', () => {
            this.imageLoad(index);
            resolve(this.textureId);
          });
        });
      }
    });
    return Promise.all(promises);
  }
  imageLoad(index) {
    const gl = this.gl;
    if (this.isImageLoaded()) throw new Error('TexImage is already loaded');
    this.imageLoaded += 1;
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.textureId);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + index, 0, gl.RGBA, gl.RGBA,
      gl.UNSIGNED_BYTE, this.images[index]);
    if (this.imageLoaded === 6) {
      // Texture configuration comes here
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER,
        gl.LINEAR_MIPMAP_NEAREST);
      gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    }
    // Unbind texture
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
  }
  use(textureId) {
    const gl = this.gl;
    // We can silently ignore this I suppose.
    if (!this.isLoaded()) throw new Error('Texture is not loaded');
    gl.activeTexture(gl.TEXTURE0 + textureId);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.textureId);
  }
  unload() {
    const gl = this.gl;
    // We can silently ignore this I suppose.
    if (!this.isLoaded()) throw new Error('Texture is not loaded');
    gl.deleteTexture(this.textureId);
    this.textureId = null;
    this.imageLoaded = false;
  }
  static fromImage(context, urls) {
    let texture = new CubeTexture(context);
    let images = urls.map(url => {
      let image = new Image();
      image.src = url;
      return image;
    });
    texture.load(images);
    // We want Texture object, not a Promise object.
    // TODO Still, it'd be a good idea if we can return Promise from here.
    // (without delaying rendering)
    return texture;
  }
}
