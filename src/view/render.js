import * as GeometryType from '../util/geometryType';

export default class RenderView {
  constructor(store, canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.camera = {
      x: 0, y: 0
    };
    this.store = store;
    this.entities = store.systems.family.get(['pos', 'render']).entities;
    store.subscribe('all', this.render.bind(this));
  }
  // :P This isn't React, but still whatever.
  setupEvents() {
    let mouseX = 0;
    let mouseY = 0;
    const { canvas } = this;

    const handleMouseMove = e => {
      let diffX = e.clientX - mouseX;
      let diffY = e.clientY - mouseY;
      mouseX = e.clientX;
      mouseY = e.clientY;
      this.camera.x += diffX;
      this.camera.y += diffY;
      // Request rerender
      // window.requestAnimationFrame(this.render.bind(this));
    };
    canvas.addEventListener('contextmenu', e => e.preventDefault());
    canvas.addEventListener('mousedown', e => {
      if (e.button !== 2) return;
      window.addEventListener('mousemove', handleMouseMove);
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    window.addEventListener('mouseup', () => {
      window.removeEventListener('mousemove', handleMouseMove);
    });
    canvas.addEventListener('mousemove', e => {
      this.store.dispatch({
        type: 'cursor/move',
        payload: {
          x: e.clientX - this.camera.x - canvas.width / 2,
          y: e.clientY - this.camera.y - canvas.height / 2
        }
      });
    });
  }
  render() {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw grids
    ctx.strokeStyle = '#000000';
    ctx.beginPath();
    ctx.moveTo(0.5, this.camera.y + canvas.height / 2 + 0.5);
    ctx.lineTo(canvas.width + 0.5, this.camera.y + canvas.height / 2 + 0.5);
    ctx.moveTo(this.camera.x + canvas.width / 2 + 0.5, 0.5);
    ctx.lineTo(this.camera.x + canvas.width / 2 + 0.5, canvas.height + 0.5);
    ctx.stroke();
    for (let i = 0; i < this.entities.length; ++i) {
      let entity = this.entities[i];
      let [x, y] = entity.pos.translate;
      let [width, height] = entity.pos.scale;
      x = (x + this.camera.x + canvas.width / 2 | 0) + 0.5;
      y = (y + this.camera.y + canvas.height / 2 | 0) + 0.5;
      ctx.strokeStyle = entity.render.color || '#000000';
      ctx.fillStyle = entity.render.color || '#000000';
      switch (entity.pos.type) {
      case GeometryType.RECT:
        ctx.strokeRect(x - width, y - height,
          width * 2, height * 2);
        break;
      case GeometryType.LINE:
        ctx.beginPath();
        ctx.moveTo(x - width, y - height);
        ctx.lineTo(x + width, y + height);
        ctx.stroke();
        break;
      case GeometryType.CIRCLE:
        ctx.beginPath();
        ctx.arc(x, y, width, 0, Math.PI * 2);
        ctx.stroke();
        break;
      case GeometryType.POINT:
      default:
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
    }
    ctx.fillStyle = '#ff0000';
    ctx.strokeStyle = '#ff0000';
    if (this.store.state.globals.debug != null) {
      this.store.state.globals.debug.forEach(v => {
        let x = this.camera.x + canvas.width / 2 + v.x - 2 | 0;
        let y = this.camera.y + canvas.height / 2 + v.y - 2 | 0;
        if (v.vector) {
          ctx.beginPath();
          ctx.moveTo(x + 0.5, y + 0.5);
          ctx.lineTo((x + v.vx * 30 | 0) + 0.5, (y + v.vy * 30 | 0) + 0.5);
          ctx.stroke();
        } else {
          ctx.fillRect(x, y, 4, 4);
        }
      });
    }
  }
}
