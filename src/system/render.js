import registerComponent from '../util/registerComponent';

export default class RenderSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }
  onMount(store) {
    this.store = store;
    this.entities = store.systems.family.get(['pos', 'render']).entities;
    store.subscribe('all', this.render.bind(this));
  }
  render() {
    const { ctx } = this;
    ctx.clearRect(0, 0, ctx.width, ctx.height);
    for (let i = 0; i < this.entities.length; ++i) {
      let entity = this.entities[i];
      let { x, y } = entity.pos;
      x = (x | 0) + 0.5;
      y = (y | 0) + 0.5;
      ctx.strokeStyle = entity.render.color || '#000000';
      ctx.fillStyle = entity.render.color || '#000000';
      switch (entity.geom && entity.geom.type) {
      case 'rect':
        ctx.strokeRect(x - entity.geom.width / 2, y - entity.geom.height / 2,
          entity.geom.width, entity.geom.height);
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
