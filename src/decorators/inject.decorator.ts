import { type Constructable } from '../types/constructable.type'
import { defineResolver, getResolver } from '../utils'

type InjectFactory = () => Constructable
type InjectReturnType = (target: Object, propertyKey: string | symbol, parameterIndex?: number) => void

export function Inject (token?: string | symbol): InjectReturnType
export function Inject (factory?: InjectFactory): InjectReturnType
export function Inject (tokenOrFactory?: string | symbol | InjectFactory): InjectReturnType {
  return (target, propertyKey, index) => {
    const resolver = getResolver(target, propertyKey, index, tokenOrFactory)
    defineResolver(target, resolver)
  }
}
