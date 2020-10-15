import { event, JOY_EVENTS, JOY_NAMES } from './event';

export interface IJoyEventType {
  timeStamp: number;
  joy?: JOY_NAMES;
}

export default class Joy {
  private _name: JOY_NAMES;
  private _isDown = false;
  private _isUp = true;
  private _lastDown = 0;
  private _lastUp = 0;
  private _delay = 150;
  private onDown = event;
  private onUp = event;

  public constructor(name: JOY_NAMES) {
    this._name = name;
  }

  public get name() {
    return this._name;
  }

  public processJoyDown(event: IJoyEventType) {
    if (this._isDown) {
      if (event.timeStamp > this._lastDown + this._delay) {
        this.onDown.emit(JOY_EVENTS.JOY_DOWN, this._name);
        this._lastDown = event.timeStamp;
      }
    } else {
      this._isDown = true;
      this._isUp = false;

      this.onDown.emit(JOY_EVENTS.JOY_DOWN, this._name);
      this._lastDown = event.timeStamp;
    }
  }

  public processJoyUp(event: IJoyEventType) {
    this._isDown = false;
    this._isUp = true;
    this._lastUp = event.timeStamp;

    this.onUp.emit(JOY_EVENTS.JOY_UP, this._name);
  }
}