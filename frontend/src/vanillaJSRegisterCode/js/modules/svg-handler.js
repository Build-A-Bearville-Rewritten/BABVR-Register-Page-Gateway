// Splits each layer of an SVG into it's own SVGS
//
// Usage: let urls = await SVGHandler.splitLayers("your svg location");

const SVGHandler = (() => {
  // Takes in an svg and get's it's source as a string
  function getSVGString(sourceSvg) {
    return new Promise((resolve, reject) => {
      fetch(sourceSvg)
        .then(response => response.text())
        .then(svgString => {
          resolve(svgString);
        });
    });
  }

  // create a blob url for the svg
  function createUrl(svg) {
    const svgString = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgString], {
      type: 'image/svg+xml;charset=utf-8'
    });

    const DOMURL = window.URL || window.webkitURL || window;
    const url = DOMURL.createObjectURL(svgBlob);

    return url;
  }

  // get the style, width, and height of an svg
  function getAttributes(doc) {
    const style = doc.querySelector('style');
    const svg = doc.querySelector('svg');
    const viewBox = svg.getAttribute('viewBox');

    let x, y, vWidth, vHeight;
    if (viewBox) [x, y, vWidth, vHeight] = viewBox.split(' ');

    const width = svg.getAttribute('width') || vWidth;
    const height = svg.getAttribute('height') || vHeight;

    return [style, width, height];
  }

  // creates an svg with the same style, width, and height of the source svg
  function createSVG(doc) {
    let [style, width, height] = getAttributes(doc);

    const newSvg = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg'
    );
    if (style) newSvg.appendChild(style.cloneNode(true));
    newSvg.setAttribute('width', width);
    newSvg.setAttribute('height', height);

    return newSvg;
  }

  // Splits each layer of an SVG into it's own SVGs
  // Returns a list of all layers as seperate svgs
  async function splitLayers(sourceSvg) {
    let svgString = await getSVGString(sourceSvg);

    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');

    const layerList = doc.querySelectorAll('svg > defs > g');
    let svgURLS = [];

    layerList.forEach(layer => {
      let newSvg = createSVG(doc);

      newSvg.appendChild(layer.cloneNode(true));
      svgURLS.push(createUrl(newSvg));
    });

    return svgURLS;
  }

  return {
    splitLayers
  };
})();

export default SVGHandler;
