import { ease } from 'pixi-ease';
import * as PIXI from 'pixi.js';

import { DropShadowFilter } from '@pixi/filter-drop-shadow';

import { IPosition, Vector2 } from '../geometry';
import Entity from '../objects/entity';
import { DirectionIndicator, External } from '../objects/external';
import { Loader } from '../system';

export enum PLAYER_TYPES {
  KNIGHT_M = 'knight_m',
}

export enum NONPLAYER_TYPES {}

export const CHARACTER_CATEGORIES = {
  ...PLAYER_TYPES,
  ...NONPLAYER_TYPES,
};

export enum CHARACTER_ANIMATIONS {
  HOLD = 'hold',
  WALK = 'walk',
  ATTACK = 'attack',
  HURT = 'hurt',
}

export default class Character extends PIXI.Container {
  protected _type: PLAYER_TYPES | NONPLAYER_TYPES;
  protected _entities: Entity[][];
  protected _stepSound: PIXI.sound.Sound;
  protected _externals: External[] = [];

  private _direction: Vector2 = Vector2.down;
  private _geometryPosition: Vector2;
  private _spriteOffset: { x: number; y: number };

  protected constructor(
    geometryPosition: Vector2 | IPosition,
    type: PLAYER_TYPES | NONPLAYER_TYPES,
    spriteOffset = { x: 32, y: 24 }
  ) {
    super();
    if (geometryPosition instanceof Vector2) {
      this._geometryPosition = geometryPosition;
    } else {
      const { x, y } = geometryPosition;
      this._geometryPosition = new Vector2(x, y);
    }
    this._type = type;
    this._spriteOffset = spriteOffset;

    this.initialize(type);
  }

  public addExternal(enternal: External) {
    this._externals.push(enternal);
    this.addChild(enternal.sprite);
  }

  public showExternal(externalName?: string) {
    if (!externalName) {
      this._externals.forEach((external) => {
        external.visiable = true;
      });
    } else {
      const externals = this._externals.filter((external) => {
        return external.name === externalName;
      });
      externals.forEach((external) => {
        external.visiable = true;
      });
    }
  }

  public hideExternal(externalName?: string) {
    if (!externalName) {
      this._externals.forEach((external) => {
        external.visiable = false;
      });
    } else {
      const externals = this._externals.filter((external) => {
        return external.name === externalName;
      });
      externals.forEach((external) => {
        external.visiable = false;
      });
    }
  }

  public get direction() {
    return this._direction;
  }

  public set direction(direction: Vector2) {
    if (!this._direction.equals(direction)) {
      this._direction = direction;
      this.changeSpriteDirection(direction);
    }

    this._externals.forEach((external) => {
      external.direction = direction;
    });
  }

  public set geometryPosition(position: Vector2) {
    this._geometryPosition = position;
    const { x, y } = position;
    this.position.set(x * 16 + this._spriteOffset.x, y * 16 + this._spriteOffset.y);
  }

  public get geometryPosition() {
    return this._geometryPosition;
  }

  public get entities() {
    return this._entities;
  }

  public set entities(entities: Entity[][]) {
    this._entities = entities;
  }

  public hold() {
    const [hold, walk, attack, hurt] = this.children as PIXI.AnimatedSprite[];
    hold.visible = true;
    walk.visible = false;
    attack.visible = false;
    hurt.visible = false;

    hold.play();

    this._stepSound.stop();
    this.hideExternal();
  }

  public walk(direction: Vector2) {
    const [hold, walk, attack, hurt] = this.children as PIXI.AnimatedSprite[];
    hold.visible = false;
    walk.visible = true;
    attack.visible = false;
    hurt.visible = false;

    this._geometryPosition.combine(direction);
    const { x, y } = this._geometryPosition;

    const move = ease.add(
      this,
      {
        x: x * 16 + this._spriteOffset.x,
        y: y * 16 + this._spriteOffset.y,
      },
      {
        duration: 200,
      }
    );

    move.once('complete', () => {
      walk.play();
    });

    if (!this._stepSound.isPlaying) {
      this._stepSound.play();
    }
  }

  public attack(direction: Vector2) {
    const [hold, walk, attack, hurt] = this.children as PIXI.AnimatedSprite[];
    hold.visible = false;
    walk.visible = false;
    attack.visible = true;
    hurt.visible = false;

    this._geometryPosition.combine(direction);
    attack.play();
  }

  public hurt() {
    const [hold, walk, attack, hurt] = this.children as PIXI.AnimatedSprite[];
    hold.visible = false;
    walk.visible = false;
    attack.visible = false;
    hurt.visible = true;

    hurt.play();
  }

  protected get Entities() {
    return this.Entities;
  }

  protected changeSpriteDirection(direction: Vector2) {
    if (direction.equals(Vector2.left)) {
      this.scale.x = -1;
      const [hold, walk, attack, hurt] = this.children as PIXI.AnimatedSprite[];

      hold.anchor.set(0.5625, 0.5);
      walk.anchor.set(0.5625, 0.5);
      attack.anchor.set(0.5625, 0.5);
      hurt.anchor.set(0.5625, 0.5);
    }

    if (direction.equals(Vector2.right)) {
      this.scale.x = 1;
      const [hold, walk, attack, hurt] = this.children as PIXI.AnimatedSprite[];

      hold.anchor.set(0.5, 0.5);
      walk.anchor.set(0.5, 0.5);
      attack.anchor.set(0.5, 0.5);
      hurt.anchor.set(0.5, 0.5);
    }
  }

  private initialize(type: PLAYER_TYPES | NONPLAYER_TYPES) {
    const character = type.toString().toUpperCase();

    const holdBatch = Loader.textures[character][CHARACTER_ANIMATIONS.HOLD];
    const walkBatch = Loader.textures[character][CHARACTER_ANIMATIONS.WALK];
    const attackBatch = Loader.textures[character][CHARACTER_ANIMATIONS.ATTACK];
    const hurtBatch = Loader.textures[character][CHARACTER_ANIMATIONS.HURT];

    const hold = new PIXI.AnimatedSprite(holdBatch);
    const walk = new PIXI.AnimatedSprite(walkBatch);
    const attack = new PIXI.AnimatedSprite(attackBatch);
    const hurt = new PIXI.AnimatedSprite(hurtBatch);

    hold.visible = true;
    walk.visible = false;
    attack.visible = false;
    hurt.visible = false;

    const duringSecond = 0.5;
    const speed = 1 / (duringSecond / (4 / 60));

    hold.animationSpeed = speed;
    walk.animationSpeed = speed;
    attack.animationSpeed = speed;
    hurt.animationSpeed = speed;

    hold.anchor.set(0.5, 0.5);
    walk.anchor.set(0.5, 0.5);
    attack.anchor.set(0.5, 0.5);
    hurt.anchor.set(0.5, 0.5);

    // default play HOLD animation
    hold.play();

    // prepare character's animations
    this.addChild(hold, walk, attack, hurt);
    const { x, y } = this._geometryPosition;
    this.position.set(x * 16 + this._spriteOffset.x, y * 16 + this._spriteOffset.y);

    // external composition
    const directionIndicator = new DirectionIndicator();
    directionIndicator.direction = this.direction;
    this._externals.push(directionIndicator);
    this.addChild(directionIndicator.sprite);

    // character's drop shadow
    this.filters = [new DropShadowFilter({ blur: 0, distance: 5, rotation: -90 })];
  }
}
