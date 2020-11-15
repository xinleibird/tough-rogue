import nipple, { JoystickManager } from 'nipplejs';
import Joy, { IJoyEventType, JOY_NAMES } from './Joy';

type HandleJoysType = {
  [key in JOY_NAMES]?: Joy;
};

export default class Joystick {
  private _handleJoys: HandleJoysType = {};
  private _lastDown = 0;
  private _lastJoy: JOY_NAMES;
  private _delay = 100;

  private _nipple: JoystickManager;

  private _burstIDs: any[] = [];

  public constructor() {
    this.initialize();
  }

  public addHandleJoy(joy: JOY_NAMES) {
    const inHandle = this._handleJoys?.[joy];
    if (!inHandle) {
      this._handleJoys[joy] = new Joy(joy);
    }
  }

  private initialize() {
    this._nipple = nipple.create({ zone: document.body, color: '#5a697b', threshold: 0.2 });
    this._handleJoys = {};

    this._nipple.on('dir', this.processJoyDown.bind(this));
    this._nipple.on('end', this.processJoyUp.bind(this));
  }

  private processJoyDown(event: nipple.EventData, data: nipple.JoystickOutputData & 1) {
    this.clearAllInterval();

    const joy = data?.direction?.angle as JOY_NAMES;
    const inHandleJoy = this._handleJoys?.[joy];

    this._burstIDs.push(
      setInterval(() => {
        const timeStamp = Date.now();

        if (inHandleJoy) {
          if (
            joy === this._lastJoy ||
            (joy !== this._lastJoy && timeStamp > this._lastDown + this._delay)
          ) {
            const event: IJoyEventType = { timeStamp, joy };
            inHandleJoy.processJoyDown(event);
            this._lastJoy = joy as JOY_NAMES;
            this._lastDown = timeStamp;
          }
        }
      }, this._delay)
    );
  }

  private processJoyUp(
    event: nipple.EventData,
    data: nipple.JoystickOutputData & { frontPosition: { x: number; y: number } }
  ) {
    const timeStamp = Date.now();

    const { x, y } = data.frontPosition;
    console.log(x, y);

    if (Math.abs(x) < 10 && Math.abs(y) < 10) {
      const center = JOY_NAMES.center;
      const inHandleJoy = this._handleJoys?.[center];
      const event: IJoyEventType = { timeStamp, joy: center };
      inHandleJoy.processJoyDown(event);
      this._lastJoy = center as JOY_NAMES;
      this._lastDown = timeStamp;
      inHandleJoy.processJoyDown(event);
    }

    for (const inHandle in this._handleJoys) {
      if (Object.prototype.hasOwnProperty.call(this._handleJoys, inHandle)) {
        const event: IJoyEventType = { timeStamp };
        this._handleJoys[inHandle].processJoyUp(event);
      }
    }

    this.clearAllInterval();
  }

  private clearAllInterval() {
    this._burstIDs.forEach((id) => {
      clearInterval(id);
    });
  }
}
