import { PROPERTIES_RESOLVERS_META } from '../constants'
import { type PropertyResolver } from '../types/property-resolver.type'
import { type Constructable } from '../types/constructable.type'
import { type InjectToken } from '../types/inject-token.type'

export function getClassName (target: Constructable | Object): string {
  if (typeof target === 'object') {
    return Object.getPrototypeOf(target).name
  }

  return target.name
}

export function getPropertyResolver (target: Object, propertyKey: string | symbol, token?: InjectToken): PropertyResolver {
  if (!token) {
    const type = Reflect.getMetadata('design:type', target, propertyKey)
    token = () => type
  }

  return {
    token,
    key: propertyKey
  }
}

export function definePropertyResolver (target: Object, propertyResolver: PropertyResolver): void {
  const resolvers: PropertyResolver[] = Reflect.getMetadata(PROPERTIES_RESOLVERS_META, target) || []

  const duplicateResolver = resolvers.find(({ key }) => key === propertyResolver.key)

  if (duplicateResolver) {
    throw new TypeError(`You cannot use @Inject multiple time on one property. Target: ${getClassName(target)}. Property: ${propertyResolver.key.toString()}`)
  }

  resolvers.push(propertyResolver)

  Reflect.defineMetadata(PROPERTIES_RESOLVERS_META, resolvers, target)
}
