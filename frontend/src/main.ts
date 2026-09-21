import './main.css';

import type { IScreenHandler, ICanvasRenderer } from './types/rendering.ts';

import ChloeIntro from './classes/screens/chloe-intro-screen.ts';
import screenHandlerModule from './modules/screen-handler-module.ts';
import canvasRendererModule from './modules/canvas-renderer-module.ts';

/**
 * Application entry point – sets up the canvas, render loop, and initial screen.
 */
((): void => {
  let canvasRenderer: ICanvasRenderer | null = null;

  const canvas: HTMLCanvasElement = document.createElement('canvas');
  const canvasStyle: CSSStyleDeclaration = canvas.style;
  const screenHandler: IScreenHandler = screenHandlerModule.getInstance(canvas);

  document.body.appendChild(canvas);

  canvasStyle.margin = 'auto';
  canvasStyle.display = 'block';

  canvasRenderer = canvasRendererModule.getCanvasRenderer(canvas);

  canvasRenderer.startRender();

  // Chloe's talk, which is the default screen / can't be accessed with buttons
  void screenHandler.setScreen(ChloeIntro);
})();
