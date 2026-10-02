import AbstractSprite from '../abstract-sprite.js';
import type {
  Point2D,
  TextConstructorOptions,
  TextPosition
} from '../../../../types/common.js';

export default class TextSprite extends AbstractSprite {
  private text: string;
  private color: string;
  private fontFamily: string;
  private fontSize: number;
  // eslint-disable-next-line no-undef
  private textAlign: CanvasTextAlign;
  // eslint-disable-next-line no-undef
  private textBaseline: CanvasTextBaseline;
  private position: TextPosition;

  constructor(options: TextConstructorOptions) {
    const {
      text = '',
      color = '#ffffff',
      fontFamily = 'Futura',
      fontSize = 12,
      textAlign = 'center',
      textBaseline = 'middle',
      position = { x: 0, y: 0 },
      zIndex,
      ...spriteOptions
    } = options;

    super({ ...spriteOptions, zIndex: zIndex ?? 11 });

    this.text = text;
    this.color = color;
    this.fontFamily = fontFamily;
    this.fontSize = fontSize * 3;
    this.textAlign = textAlign;
    this.textBaseline = textBaseline;
    this.position = position;

    document.fonts.load(`${this.fontSize}px '${this.fontFamily}'`);
  }

  draw(): void {
    if (!this.canvas) {
      return;
    }

    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const lines = this.text.split('\n');
    const offset = this.fontSize;
    const textPosition = this.resolveTextPosition();
    if (!textPosition) {
      return;
    }

    const startY = textPosition.y - ((lines.length - 1) * offset) / 2;
    ctx.save();
    try {
      ctx.font = `${this.fontSize}px '${this.fontFamily}', sans-serif`;
      ctx.fillStyle = this.color;
      ctx.textAlign = this.textAlign;
      ctx.textBaseline = this.textBaseline;

      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], textPosition.x, startY + i * offset);
      }
    } finally {
      ctx.restore();
    }
  }

  private resolveTextPosition(): Point2D | null {
    if (!('relativeTo' in this.position)) {
      return this.position;
    }

    const {
      relativeTo,
      anchor = { x: 0, y: 0 },
      offset = { x: 0, y: 0 }
    } = this.position;

    if (relativeTo instanceof HTMLCanvasElement) {
      return {
        x: relativeTo.width * anchor.x + offset.x,
        y: relativeTo.height * anchor.y + offset.y
      };
    }

    const position = relativeTo.getPosition();
    const size = relativeTo.getSize();
    if (size.x === 0 || size.y === 0) {
      return null;
    }

    return {
      x: position.x + size.x * anchor.x + offset.x,
      y: position.y + size.y * anchor.y + offset.y
    };
  }

  public destroy(): void {
    super.destroy();
  }
}
