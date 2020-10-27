import { JOY_NAMES, KEY_NAMES } from '../input';

export enum CONTROL_ACTIONS {
  WALK_LEFT = 'walkLeft',
  WALK_RIGHT = 'walkRight',
  WALK_UP = 'walkUp',
  WALK_DOWN = 'walkDown',
  SHOW_EXTERNAL = 'showExternal',
  ATTACK = 'attack',
  GO_TO_LEFT = 'GoToLeft',
}

export const KEYBOARD_CONTROLLED_KEYS = {
  [CONTROL_ACTIONS.WALK_LEFT]: KEY_NAMES.a,
  [CONTROL_ACTIONS.WALK_RIGHT]: KEY_NAMES.d,
  [CONTROL_ACTIONS.WALK_UP]: KEY_NAMES.w,
  [CONTROL_ACTIONS.WALK_DOWN]: KEY_NAMES.s,
  [CONTROL_ACTIONS.SHOW_EXTERNAL]: KEY_NAMES.f,
  [CONTROL_ACTIONS.ATTACK]: KEY_NAMES.Space,
  [CONTROL_ACTIONS.GO_TO_LEFT]: KEY_NAMES.ArrowLeft,
};

export const JOYSTICK_CONTROLLED_JOYS = {
  [CONTROL_ACTIONS.WALK_LEFT]: JOY_NAMES.left,
  [CONTROL_ACTIONS.WALK_RIGHT]: JOY_NAMES.right,
  [CONTROL_ACTIONS.WALK_UP]: JOY_NAMES.up,
  [CONTROL_ACTIONS.WALK_DOWN]: JOY_NAMES.down,
};

const PIXEL_SCALE = {
  PIXEL_SCALE_NORMAL: 3,
  PIXEL_SCALE_RETINA: 3,
};

export const GAME_OPTIONS = {
  DEBUG: true,
  MAX_DUNGEON_SIZE: 75,
  PIXEL_SCALE:
    window.devicePixelRatio >= 2
      ? PIXEL_SCALE.PIXEL_SCALE_RETINA * window.devicePixelRatio
      : PIXEL_SCALE.PIXEL_SCALE_NORMAL * window.devicePixelRatio,
};

export const TILE_OPTIONS = {
  TILE_SIZE: 16,
  TILE_OFFSET_X: 24,
  TILE_OFFSET_Y: 32,
};

export const SPRITE_OPTIONS = {
  SPRITE_SIZE: 16,
  SPRITE_OFFSET_X: 32,
  SPRITE_OFFSET_Y: 24,
};
