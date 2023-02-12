import { INJECTABLE_META } from '../constants'

export function Injectable (): ClassDecorator {
  return target => {
    Reflect.defineMetadata(INJECTABLE_META, true, target)
    return target
  }
}
