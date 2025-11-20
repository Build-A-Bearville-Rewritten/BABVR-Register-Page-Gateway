import ChloeIntro from './classes/screens/chloe-intro-screen.ts';
import screenHandlerModule from './modules/screen-handler-module.ts';
import canvasRendererModule from './modules/canvas-renderer-module.ts';
import type { IScreenHandler, ICanvasRenderer } from '../types/rendering.ts';

/**
 * Application entry point – sets up the canvas, render loop, and initial screen.
 */
((): void => {
  const canvas: HTMLCanvasElement = document.createElement('canvas');
  const screenHandler: IScreenHandler = screenHandlerModule.getInstance(canvas);

  document.body.appendChild(canvas);
  const canvasStyle = canvas.style;
  canvasStyle.margin = 'auto';
  canvasStyle.display = 'block';

  const canvasRenderer: ICanvasRenderer = canvasRendererModule.getCanvasRenderer(canvas);
  canvasRenderer.startRender();

  // Chloe's talk, which is the default screen / can't be accessed with buttons
  void screenHandler.setScreen(ChloeIntro);
})();
