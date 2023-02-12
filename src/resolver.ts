import { type Constructable } from './types/constructable.type'
import { type PropertyResolver } from './types/property-resolver.type'
import { type Registry } from './types/registry.type'
import { PROPERTIES_RESOLVERS_META, PARAMETERS_RESOLVERS_META, INJECTABLE_META } from './constants'
import { createRegistry } from './utils'
import { type ParameterResolver } from './types/parameter-resolver.type'
import { type InjectToken } from './types/inject-token.type'

export class Resolver {
  private readonly globalRegistry: Registry
  /**
   * Local registry is used to resolve cycle dependencies, since we need to store
   * already resolved Constructable instances
   * @private
   */
  private readonly localRegistry: Registry = createRegistry()

  constructor (globalRegistry: Registry) {
    this.globalRegistry = globalRegistry
  }

  private resolveToken (token: InjectToken): unknown {
    let value: unknown

    if (typeof token !== 'function') {
      value = this.globalRegistry.get(token)
    } else {
      const type = token()
      const resolvedType = this.localRegistry.get(type)

      if (resolvedType) {
        value = resolvedType
      } else {
        value = this.resolve(token())
      }
    }

    return value
  }

  private resolveProperties (target: Object): void {
    const propertiesResolvers: PropertyResolver[] = Reflect.getMetadata(PROPERTIES_RESOLVERS_META, target)

    if (!propertiesResolvers?.length) {
      return
    }

    for (const { propertyKey, token } of propertiesResolvers) {
      Reflect.set(target, propertyKey, this.resolveToken(token))
    }
  }

  private resolveParameters (target: Object): unknown[] {
    const parametersResolvers: ParameterResolver[] = Reflect.getMetadata(PARAMETERS_RESOLVERS_META, target)
    const parametersTypes: unknown[] = Reflect.getMetadata('design:paramtypes', target)

    if (!parametersTypes?.length) {
      return []
    }

    const parameters: unknown[] = []

    for (let index = 0; index < parametersTypes.length; index++) {
      const parameterResolver = parametersResolvers?.find((resolver) => resolver.index === index)
      parameters.push(this.resolveToken(parameterResolver?.token ?? (() => parametersTypes[index] as Constructable)))
    }

    return parameters
  }

  public resolve<T extends Constructable>(Constructable: T): T extends Constructable<infer D> ? D : T {
    if (typeof Constructable !== 'function') {
      throw new TypeError('Cannot resolve non-function constructable')
    }

    if (!Reflect.hasOwnMetadata(INJECTABLE_META, Constructable)) {
      throw new TypeError(`${Constructable.name} has not been marked as @Injectable and cannot be resolved`)
    }

    const parameters = this.resolveParameters(Constructable)

    const instance = new Constructable(...parameters)

    /**
     * We need to save Constructable instance to resolve it later in cycle dependencies
     */
    this.localRegistry.set(Constructable, instance)

    this.resolveProperties(instance)

    return instance
  }
}
