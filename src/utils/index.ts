import { type InjectToken } from '../types/inject-token.type'
import { type Registry } from '../types/registry.type'
import { type Token } from '../types/token.type'
import { PROPERTIES_RESOLVERS_META, PARAMETERS_RESOLVERS_META } from '../constants'
import { type PropertyResolver } from '../types/property-resolver.type'
import { type ParameterResolver } from '../types/parameter-resolver.type'

function defineParameterResolver (target: Object, resolver: ParameterResolver): void {
  const resolvers: ParameterResolver[] = Reflect.getMetadata(PARAMETERS_RESOLVERS_META, target) || []

  resolvers.push(resolver)

  Reflect.defineMetadata(PARAMETERS_RESOLVERS_META, resolvers, target)
}

function definePropertyResolver (target: Object, resolver: PropertyResolver): void {
  const resolvers: PropertyResolver[] = Reflect.getMetadata(PROPERTIES_RESOLVERS_META, target) || []

  resolvers.push(resolver)

  Reflect.defineMetadata(PROPERTIES_RESOLVERS_META, resolvers, target)
}

export function getResolver (target: Object, propertyKey?: string | symbol, index?: number, token?: InjectToken): PropertyResolver | ParameterResolver {
  if (propertyKey) {
    token = token ?? (() => Reflect.getMetadata('design:type', target, propertyKey))
    return {
      propertyKey,
      token
    }
  }

  if (index !== undefined) {
    token = token ?? (() => Reflect.getMetadata('design:paramtypes', target)?.at(index))
    return {
      index,
      token
    }
  }

  throw new Error('propertyKey or index is required to get resolver')
}

export function defineResolver (target: Object, resolver: ParameterResolver | PropertyResolver): void {
  if ('index' in resolver) {
    defineParameterResolver(target, resolver)
  } else {
    definePropertyResolver(target, resolver)
  }
}

export function createRegistry (): Registry {
  return new Map<Token, any>()
}
