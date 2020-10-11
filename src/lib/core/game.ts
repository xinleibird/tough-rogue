import Cull from 'pixi-cull';
import { Viewport, ViewportOptions } from 'pixi-viewport';
import * as PIXI from 'pixi.js';

import { PixiStatsPlugin } from '@armathai/pixi-stats';
import { OldFilmFilter } from '@pixi/filter-old-film';

import { NonePlayer, Player, PLAYER_TYPES } from '../character';
import { GAME_OPTIONS } from '../config';
import Controller from '../input/controller';
import { emitter, Loader, RESOURCE_EVENTS } from '../system';
import Dungeon from '../tilemap/dungeon';

export interface PIXIAppOption {
  autoStart?: boolean;
  width?: number;
  height?: number;
  view?: HTMLCanvasElement;
  transparent?: boolean;
  autoDensity?: boolean;
  antialias?: boolean;
  preserveDrawingBuffer?: boolean;
  resolution?: number;
  forceCanvas?: boolean;
  backgroundColor?: number;
  clearBeforeRender?: boolean;
  powerPreference?: string;
  sharedTicker?: boolean;
  sharedLoader?: boolean;
  resizeTo?: Window | HTMLElement;
}

PIXI.Application.registerPlugin(PixiStatsPlugin);
const { PIXEL_SCALE, DEBUG } = GAME_OPTIONS;
const MAX_DUNGEON_SIZE = 150;

const defaultGameOptions: PIXIAppOption = {
  width: window.innerWidth / PIXEL_SCALE / window.devicePixelRatio,
  height: window.innerHeight / PIXEL_SCALE / window.devicePixelRatio,
  antialias: false,
  resolution: PIXEL_SCALE * window.devicePixelRatio,
  backgroundColor: 0x160c21,
};

const defaultViewportOptions: ViewportOptions = {
  screenWidth: window.innerWidth / PIXEL_SCALE / window.devicePixelRatio,
  screenHeight: window.innerHeight / PIXEL_SCALE / window.devicePixelRatio,
  worldHeight: MAX_DUNGEON_SIZE * 16 + defaultGameOptions.width,
  worldWidth: MAX_DUNGEON_SIZE * 16 + defaultGameOptions.height,
};

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

export default class Game extends PIXI.Application {
  private _currentDungeon: Dungeon;
  private _player: Player;
  private _noneplayers: NonePlayer[] = [];
  private _controller: Controller;
  private _viewport: Viewport;
  private _background: PIXI.Graphics;
  private stats: any;

  public constructor(props?: PIXIAppOption) {
    super({ ...defaultGameOptions, ...props });

    this.initialize();

    Loader.load();
  }

  public play() {
    emitter.on(RESOURCE_EVENTS.RESOURCES_LOADED, () => {
      this.gameLoop();
    });
  }

  private registResizer() {
    window.onorientationchange = () => {
      this.renderer.resize(
        window.innerWidth / PIXEL_SCALE / window.devicePixelRatio,
        window.innerHeight / PIXEL_SCALE / window.devicePixelRatio
      );
      this._viewport.resize(
        window.innerWidth / PIXEL_SCALE / window.devicePixelRatio,
        window.innerHeight / PIXEL_SCALE / window.devicePixelRatio
      );
    };
    window.onresize = () => {
      this.renderer.resize(
        window.innerWidth / PIXEL_SCALE / window.devicePixelRatio,
        window.innerHeight / PIXEL_SCALE / window.devicePixelRatio
      );
      this._viewport.resize(
        window.innerWidth / PIXEL_SCALE / window.devicePixelRatio,
        window.innerHeight / PIXEL_SCALE / window.devicePixelRatio
      );
    };
  }

  private fillBackground() {
    const background = new PIXI.Graphics();
    background.beginFill(0x160c21);
    background.drawRect(
      0,
      0,
      MAX_DUNGEON_SIZE * 16 + defaultGameOptions.width,
      MAX_DUNGEON_SIZE * 16 + defaultGameOptions.height
    );
    background.endFill();
    this._background = background;

    this.stage.addChild(background);
  }

  private fillFilter() {
    PIXI.Ticker.shared.add(() => {
      this.stage.filters = [
        new OldFilmFilter(
          {
            sepia: 0,
            noise: 0.0618,
            noiseSize: 1,
            scratch: -1,
            scratchDensity: 0,
            scratchWidth: 1,
            vignetting: 0.3,
            vignettingAlpha: 1,
            vignettingBlur: 0.3,
          },
          Math.random()
        ),
      ];
    });
  }

  private initialize() {
    const root = document.getElementById('root');
    root.appendChild(this.view);

    // stats.js
    if (DEBUG) {
      root.appendChild(this.stats.dom);
      PIXI.Ticker.shared.add(() => {
        this.stats.update();
      });
    }

    this.fillBackground();
    this.registResizer();
    this._controller = new Controller();
    this._viewport = new Viewport(defaultViewportOptions);
    this.stage.addChild(this._viewport);

    this.fillFilter();
  }

  private cullViewport() {
    const cull = new Cull.Simple({
      dirtyTest: false,
    });

    cull.addList(this._viewport.children);
    cull.cull(this._viewport.getVisibleBounds());

    PIXI.Ticker.shared.add(() => {
      if (this._viewport.dirty) {
        cull.cull(this._viewport.getVisibleBounds());
        this._viewport.dirty = false;
      }
    });
  }

  private gameLoop() {
    this._currentDungeon = new Dungeon(MAX_DUNGEON_SIZE, MAX_DUNGEON_SIZE, this._viewport);

    this._player = new Player({ x: 0, y: 0 }, PLAYER_TYPES.KNIGHT_M, this._viewport);
    this._player.geometryPosition = this._currentDungeon.getRespawnPosition();
    this._player.entities = this._currentDungeon.entities;

    this._currentDungeon.draw();

    this._player.act();
    this._viewport.follow(this._player);

    this.cullViewport();

    const mainTheme = Loader.sounds.musics.main;
    mainTheme.volume = 0.06;
    mainTheme.loop = true;
    mainTheme.play();
  }
}
