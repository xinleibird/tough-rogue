const NW = 0b00000001;
const NN = 0b00000010;
const NE = 0b00000100;
const WW = 0b00001000;
const EE = 0b00010000;
const SW = 0b00100000;
const SS = 0b01000000;
const SE = 0b10000000;

const BITMASK = {
  [NN]: 1,
  [WW]: 2,
  [NN | WW]: 3,
  [NW | NN | WW]: 4,
  [EE]: 5,
  [NN | EE]: 6,
  [NN | NE | EE]: 7,
  [WW | EE]: 8,
  [NN | WW | EE]: 9,
  [NW | NN | WW | EE]: 10,
  [NN | NE | WW | EE]: 11,
  [NW | NN | NE | WW | EE]: 12,
  [SS]: 13,
  [NN | SS]: 14,
  [WW | SS]: 15,
  [NN | WW | SS]: 16,
  [NW | NN | WW | SS]: 17,
  [EE | SS]: 18,
  [NN | EE | SS]: 19,
  [NN | NE | EE | SS]: 20,
  [WW | EE | SS]: 21,
  [NN | WW | EE | SS]: 22,
  [NW | NN | WW | EE | SS]: 23,
  [NN | NE | WW | EE | SS]: 24,
  [NW | NN | NE | WW | EE | SS]: 25,
  [WW | SW | SS]: 26,
  [NN | WW | SW | SS]: 27,
  [NW | NN | WW | SW | SS]: 28,
  [WW | EE | SW | SS]: 29,
  [NN | WW | EE | SW | SS]: 30,
  [NW | NN | WW | EE | SW | SS]: 31,
  [NN | NE | WW | EE | SW | SS]: 32,
  [NW | NN | NE | WW | EE | SW | SS]: 33,
  [EE | SS | SE]: 34,
  [NN | EE | SS | SE]: 35,
  [NN | NE | EE | SS | SE]: 36,
  [WW | EE | SS | SE]: 37,
  [NN | WW | EE | SS | SE]: 38,
  [NW | NN | WW | EE | SS | SE]: 39,
  [NN | NE | WW | EE | SS | SE]: 40,
  [NW | NN | NE | WW | EE | SS | SE]: 41,
  [WW | EE | SW | SS | SE]: 42,
  [NN | WW | EE | SW | SS | SE]: 43,
  [NW | NN | WW | EE | SW | SS | SE]: 44,
  [NN | NE | WW | EE | SW | SS | SE]: 45,
  [NW | NN | NE | WW | EE | SW | SS | SE]: 46,
  0: 47,
};

// eslint-disable-next-line complexity
const lookAround = (
  map: number[][],
  x_boundary: number,
  y_boundary: number,
  x: number,
  y: number
) => {
  let sum = 0;
  let n = false;
  let e = false;
  let s = false;
  let w = false;

  if (!map[y][x]) {
    return 0;
  }

  if (y > 0 && map[y - 1][x]) {
    n = true;
    sum |= NN;
  }

  if (x > 0 && map[y][x - 1]) {
    w = true;
    sum |= WW;
  }

  if (x < x_boundary && map[y][x + 1]) {
    e = true;
    sum |= EE;
  }

  if (y < y_boundary && map[y + 1][x]) {
    s = true;
    sum |= SS;
  }

  if (n && w && y > 0 && x > 0 && map[y - 1][x - 1]) {
    sum |= NW;
  }

  if (n && e && y > 0 && x < x_boundary && map[y - 1][x + 1]) {
    sum |= NE;
  }

  if (s && w && y < y_boundary && x > 0 && map[y + 1][x - 1]) {
    sum |= SW;
  }

  if (s && e && x < x_boundary && y < y_boundary && map[y + 1][x + 1]) {
    sum |= SE;
  }

  return BITMASK[sum];
};

export const generateAutotile = (map: number[][]) => {
  const tiles: number[][] = [];
  const height = map.length;
  const width = map[0].length;
  const x_boundary = width - 1;
  const y_boundary = height - 1;

  for (let y = 0; y < height; y++) {
    tiles[y] = [];
    for (let x = 0; x < width; x++) {
      tiles[y][x] = lookAround(map, x_boundary, y_boundary, x, y);
    }
  }

  return tiles;
};