import RenderView3D from './client/view/render3d';

document.body.style.margin = '0';
document.body.style.padding = '0';
document.body.style.overflow = 'hidden';

let canvas = document.createElement('canvas');
document.body.appendChild(canvas);

let score = document.createElement('div');
document.body.appendChild(score);
score.style.position = 'fixed';
score.style.left = '0';
score.style.top = '0';
score.style.backgroundColor = '#fff';
score.style.color = '#000';
score.style.fontSize = '20pt';

let scoreText = document.createTextNode('');
score.appendChild(scoreText);

let fps = document.createElement('div');
document.body.appendChild(fps);
fps.style.position = 'fixed';
fps.style.right = '0';
fps.style.top = '0';
fps.style.color = '#000';
fps.style.fontSize = '14pt';

let fpsText = document.createTextNode('60fps');
fps.appendChild(fpsText);

let fpsSum = 0;
let fpsCount = 0;

let prevData = '';

let cWidth, cHeight, lastTime, renderView;

function validateSize() {
  const { clientWidth: width, clientHeight: height } = document.documentElement;
  if (cWidth !== width || cHeight !== height) {
    canvas.width = width | 0;
    canvas.height = height | 0;
    cWidth = width;
    cHeight = height;
    if (renderView) {
      renderView.resize();
    }
  }
}

function animate() {
  renderView.render(Date.now() - lastTime);
  let data = renderView.score + '점 (최고 ' +
    renderView.maxScore + '점)';
  if (data != prevData) {
    scoreText.nodeValue = data;
    prevData = data;
  }
  fpsSum += 1000 / (Date.now() - lastTime);
  fpsCount ++;
  if (fpsCount > 60) {
    fpsText.nodeValue = (fpsSum / fpsCount).toFixed(2) + 'fps';
    fpsSum = 0;
    fpsCount = 0;
  }
  lastTime = Date.now();
  window.requestAnimationFrame(animate);
}

function initView() {
  lastTime = Date.now();
  renderView = new RenderView3D(null, canvas);
  renderView.setupEvents();
  renderView.init();
  renderView.render(0);
}

validateSize();
initView();
window.requestAnimationFrame(animate);
window.addEventListener('resize', validateSize);
