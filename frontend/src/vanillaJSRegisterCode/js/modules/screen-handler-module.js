import ScreenHandler from '../classes/rendering/screen-handler.js';

// keeps track of all screen handler instances,
// and allows for getting and setting sprite renderers for each canvas
const ScreenHandlerModule = (() => {
  let screenHandler = [];

  // Gets the screen handler, returning a new one if it doesn't already exist.
  function getInstance(canvas) {
    if (!screenHandler[canvas]) {
      const newInstance = new ScreenHandler(canvas);
      screenHandler[canvas] = newInstance;
    }

    return screenHandler[canvas];
  }

  return {
    getInstance
  };
})();

export default ScreenHandlerModule;
