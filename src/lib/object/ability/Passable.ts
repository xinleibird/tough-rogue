import { Character } from '../../character';
import { Entity } from '../../entity';
import Ability, { ABILITY_NAMES, ABILITY_STATUS } from './Ability';

type PassableStatus = ABILITY_STATUS.PASS | ABILITY_STATUS.STOP;

export default class Passable extends Ability {
  protected _status: PassableStatus;
  public constructor(owner: Character | Entity, status: PassableStatus = ABILITY_STATUS.STOP) {
    super(owner);
    this._status = status;
    this._name = ABILITY_NAMES.PASSABLE;
  }

  public exert() {}

  public set status(status: PassableStatus) {
    this._status = status;
  }

  public get status() {
    return this._status;
  }
}
