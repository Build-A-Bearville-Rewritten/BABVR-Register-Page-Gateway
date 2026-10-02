// Splits each layer of an SVG into it's own SVGS
//
// Usage: let urls = await SVGHandler.splitLayers("your svg location");

import type { ISVGHandler } from '../types/modules.ts';

/**
 * SVG Handler class for splitting SVG layers into separate SVGs
 */
class SVGHandler implements ISVGHandler {
  /**
   * Takes in an svg and gets its source as a string
   * @param sourceSvg - The URL or path to the SVG file
   * @returns Promise that resolves to the SVG string
   */
  private getSVGString(sourceSvg: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      fetch(sourceSvg)
        .then(response => response.text())
        .then(svgString => {
          resolve(svgString);
        })
        .catch(reject);
    });
  }

  /**
   * Creates a blob URL for the SVG
   * @param svg - The SVG element to create a URL for
   * @returns The blob URL string
   */
  private createUrl(svg: SVGSVGElement): string {
    const svgString = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgString], {
      type: 'image/svg+xml;charset=utf-8'
    });
    const DOMURL = globalThis.URL || globalThis.webkitURL || globalThis;

    return DOMURL.createObjectURL(svgBlob);
  }

  /**
   * Gets the style, width, and height of an SVG
   * @param doc - The parsed SVG document
   * @returns Tuple containing [style element, width, height]
   */
  private getAttributes(
    doc: Document
  ): [HTMLStyleElement | null, string | null, string | null] {
    let height: string | null = null;
    let vHeight: string | null = null;
    let viewBox: string | null = null;
    let vWidth: string | null = null;
    let width: string | null = null;

    const style = doc.querySelector('style') as HTMLStyleElement | null;
    const svg = doc.querySelector('svg') as SVGSVGElement | null;

    if (!svg) {
      return [null, null, null];
    }

    viewBox = svg.getAttribute('viewBox');

    if (viewBox) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
      const [_x, _y, width, height] = viewBox.split(' ');
      vWidth = width || null;
      vHeight = height || null;
    }

    width = svg.getAttribute('width') || vWidth;
    height = svg.getAttribute('height') || vHeight;

    return [style, width, height];
  }

  /**
   * Creates an SVG with the same style, width, and height of the source SVG
   * @param doc - The parsed SVG document
   * @returns A new SVG element with the same attributes
   */
  private createSVG(doc: Document): SVGSVGElement {
    const [style, width, height] = this.getAttributes(doc);

    const newSvg = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg'
    ) as SVGSVGElement;
    if (style) {
      newSvg.appendChild(style.cloneNode(true));
    }
    if (width) {
      newSvg.setAttribute('width', width);
    }
    if (height) {
      newSvg.setAttribute('height', height);
    }

    return newSvg;
  }

  /**
   * Splits each layer of an SVG into its own SVGs
   * Returns a list of all layers as separate svgs
   * @param sourceSvg - The URL or path to the source SVG file
   * @returns Promise that resolves to an array of blob URLs for each layer
   */
  async splitLayers(sourceSvg: string): Promise<string[]> {
    const svgString = await this.getSVGString(sourceSvg);
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');

    const layerList = doc.querySelectorAll('svg > g');
    const svgURLS: string[] = [];

    layerList.forEach((layer: Element) => {
      const newSvg = this.createSVG(doc);

      newSvg.appendChild(layer.cloneNode(true));
      svgURLS.push(this.createUrl(newSvg));
    });

    return svgURLS;
  }
}

const svgHandler = new SVGHandler();
export default svgHandler;
