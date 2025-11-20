import ChloeIntro from './classes/screens/chloe-intro-screen.js';

import screenHandlerModule from './modules/screen-handler-module.ts';
import canvasRendererModule from './modules/canvas-renderer-module.ts';

(function () {
  const canvas = document.createElement('canvas');
  const screenHandler = screenHandlerModule.getInstance(canvas);

  document.body.appendChild(canvas);
  canvas.style.margin = 'auto';
  canvas.style.display = 'block';

  const canvasRenderer = canvasRendererModule.getCanvasRenderer(canvas);
  canvasRenderer.startRender();

  // chloe's talk, which is the default screen / can't be accessed with buttons
  screenHandler.setScreen(ChloeIntro);

})();
