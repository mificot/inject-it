import { type Constructable } from './types/constructable.type'
import { type PropertyResolver } from './types/property-resolver.type'
import { PROPERTIES_RESOLVERS_META } from './constants'
import { Registry } from './registry'

export class Resolver {
  private readonly globalRegistry: Registry
  /**
   * Local registry is used to resolve cycle dependencies, since we need to store
   * already resolved Constructable instances
   * @private
   */
  private readonly localRegistry: Registry = new Registry()

  constructor (globalRegistry: Registry) {
    this.globalRegistry = globalRegistry
  }

  private resolveProperties (target: Object): void {
    const propertiesResolvers: PropertyResolver[] = Reflect.getMetadata(PROPERTIES_RESOLVERS_META, target)

    if (!propertiesResolvers?.length) {
      return
    }

    for (const { key, token } of propertiesResolvers) {
      let value: any

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

      Reflect.set(target, key, value)
    }
  }

  public resolve<T extends Constructable>(Constructable: T): T extends Constructable<infer D> ? D : T {
    if (typeof Constructable !== 'function') {
      throw new TypeError('Cannot resolve non-function constructable')
    }

    const instance = new Constructable()

    /**
     * We need to save Constructable instance to resolve it later in cycle dependencies
     */
    this.localRegistry.set(Constructable, instance)

    this.resolveProperties(instance)

    return instance
  }
}
