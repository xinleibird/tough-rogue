import { ease } from 'pixi-ease';
import { Character } from '../character';
import { SPRITE_OPTIONS } from '../config';
import { Vector2 } from '../geometry';
import { ABILITY_NAMES, ABILITY_STATUS } from '../object/ability';
import Entity from '../object/entity';
import { updateEntitiesDislightings, updateEntitiesLightings } from '../utils';
import Behavior from './behavior';

const { SPRITE_OFFSET_X, SPRITE_OFFSET_Y } = SPRITE_OPTIONS;

export default class Movement extends Behavior {
  public constructor(entities: Entity[][], character: Character) {
    super('Movement', entities, character);
  }

  public do(direction: Vector2) {
    const geometryPosition = this._character.geometryPosition;
    updateEntitiesDislightings(geometryPosition, this._entities);

    geometryPosition.combine(direction);
    const { x, y } = geometryPosition;

    ease.add(
      this._character,
      {
        x: x * 16 + SPRITE_OFFSET_X,
        y: y * 16 + SPRITE_OFFSET_Y,
      },
      {
        duration: 150,
      }
    );

    updateEntitiesLightings(geometryPosition, this._entities);
  }

  public canDo(direction: Vector2) {
    const tarPosition = Vector2.merge(this._character.geometryPosition, direction);
    const { x, y } = tarPosition;

    const tarEntity = this._entities?.[y]?.[x];

    if (tarEntity.hasAbility(ABILITY_NAMES.PASSABLE)) {
      const passable = tarEntity.getAbility(ABILITY_NAMES.PASSABLE);
      if (passable.status === ABILITY_STATUS.PASS) {
        return true;
      }
    }

    return false;
  }
}