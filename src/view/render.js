import registerComponent from '../util/registerComponent';

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
      window.requestAnimationFrame(this.render.bind(this));
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
  }
  render() {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < this.entities.length; ++i) {
      let entity = this.entities[i];
      let { x, y } = entity.pos;
      x = (x + this.camera.x + canvas.width / 2 | 0) + 0.5;
      y = (y + this.camera.y + canvas.height / 2 | 0) + 0.5;
      ctx.strokeStyle = entity.render.color || '#000000';
      ctx.fillStyle = entity.render.color || '#000000';
      switch (entity.geom && entity.geom.type) {
      case 'rect':
        ctx.strokeRect(x - entity.geom.width / 2, y - entity.geom.height / 2,
          entity.geom.width, entity.geom.height);
        break;
      case 'line':
        ctx.beginPath();
        ctx.moveTo(x - entity.geom.width / 2, y - entity.geom.height / 2);
        ctx.lineTo(x + entity.geom.width / 2, y + entity.geom.height / 2);
        ctx.stroke();
        break;
      case 'circle':
        ctx.beginPath();
        ctx.arc(x, y, entity.geom.radius, 0, Math.PI * 2);
        ctx.stroke();
        break;
      case 'point':
      default:
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
    }
  }
}

registerComponent('render');
