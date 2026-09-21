import { Color } from './common';

export const EyeColor = {
  1: {
    id: 1,
    hex: '#6bccef',
    hsl: {
      h: 196,
      s: 80,
      l: 68
    },
    rgb: {
      r: 107,
      g: 204,
      b: 239
    }
  },
  2: {
    id: 2,
    hex: '#4a81d2',
    hsl: {
      h: 216,
      s: 60,
      l: 56
    },
    rgb: {
      r: 74,
      g: 129,
      b: 210
    }
  },
  3: {
    id: 3,
    hex: '#759743',
    hsl: {
      h: 84,
      s: 39,
      l: 43
    },
    rgb: {
      r: 117,
      g: 151,
      b: 67
    }
  },
  4: {
    id: 4,
    hex: '#446317',
    hsl: {
      h: 84,
      s: 62,
      l: 24
    },
    rgb: {
      r: 68,
      g: 99,
      b: 23
    }
  },
  5: {
    id: 5,
    hex: '#7e493e',
    hsl: {
      h: 10,
      s: 34,
      l: 37
    },
    rgb: {
      r: 126,
      g: 73,
      b: 62
    }
  },
  6: {
    id: 6,
    hex: '#552218',
    hsl: {
      h: 10,
      s: 56,
      l: 21
    },
    rgb: {
      r: 85,
      g: 34,
      b: 24
    }
  },
  7: {
    id: 7,
    hex: '#b1b2b4',
    hsl: {
      h: 220,
      s: 2,
      l: 70
    },
    rgb: {
      r: 177,
      g: 178,
      b: 180
    }
  },
  8: {
    id: 8,
    hex: '#6f7177',
    hsl: {
      h: 225,
      s: 3,
      l: 45
    },
    rgb: {
      r: 111,
      g: 113,
      b: 119
    }
  }
} satisfies Record<number, Color>;

export type EyeColorId = keyof typeof EyeColor;

export const SkinColor = {
  1: {
    id: 1,
    hex: '#fde8d5',
    hsl: {
      h: 28,
      s: 91,
      l: 91
    },
    rgb: {
      r: 253,
      g: 232,
      b: 213
    }
  },
  2: {
    id: 2,
    hex: '#f0e1a8',
    hsl: {
      h: 48,
      s: 71,
      l: 80
    },
    rgb: {
      r: 240,
      g: 225,
      b: 168
    }
  },
  3: {
    id: 3,
    hex: '#f4d09b',
    hsl: {
      h: 36,
      s: 80,
      l: 78
    },
    rgb: {
      r: 244,
      g: 208,
      b: 155
    }
  },
  4: {
    id: 4,
    hex: '#d2a057',
    hsl: {
      h: 36,
      s: 58,
      l: 58
    },
    rgb: {
      r: 210,
      g: 160,
      b: 87
    }
  },
  5: {
    id: 5,
    hex: '#6d4723',
    hsl: {
      h: 29,
      s: 51,
      l: 28
    },
    rgb: {
      r: 109,
      g: 71,
      b: 35
    }
  },
  6: {
    id: 6,
    hex: '#c3886a',
    hsl: {
      h: 20,
      s: 43,
      l: 59
    },
    rgb: {
      r: 195,
      g: 136,
      b: 106
    }
  }
} satisfies Record<number, Color>;

export type SkinColorId = keyof typeof SkinColor;

export type Gender = 'girl' | 'boy';

export const basePath = 'assets/Character';
export const headPaths = {
  hair: {
    gender: {
      boy: ['hair1', 'hair2', 'hair3', 'hair5', 'hair6'],
      girl: ['hair7', 'hair8', 'hair10', 'hair12', 'hair13']
    }
  },
  head: {
    gender: {
      boy: ['head1', 'head4'],
      girl: ['head0', 'head18']
    }
  }
};
export const clothingPaths = {
  shirt: ['tcloth0', 'tcloth1', 'tcloth2', 'tcloth3', 'tcloth4', 'tcloth5'],
  bottoms: ['pants0', 'pants2', 'skirt0', 'pants3'],
  shoes: ['shoe1', 'shoe2', 'shoe3', 'shoe4', 'shoe5', 'shoe6']
};
