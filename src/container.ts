import { type Constructable } from './types/constructable.type'
import { type Token } from './types/token.type'
import { Registry } from './registry'
import { Resolver } from './resolver'

export class Container {
  private readonly registry = new Registry()

  public resolve<T extends Token>(token: T): T extends Constructable<infer D> ? D : T {
    let value = this.registry.get(token)

    if (!value && typeof token !== 'function') {
      throw new TypeError(`Cannot resolve token ${token.toString()}. Make sure that you bind this into registry using Container.bind`)
    }

    if (!value) {
      value = new Resolver(this.registry).resolve(token as Constructable)
    }

    return value
  }

  public bind (token: Token, value: any): void {
    this.registry.set(token, value)
  }
}
