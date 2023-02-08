import { type Constructable } from '../types/constructable.type'
import { definePropertyResolver, getPropertyResolver } from '../utils'

type InjectFactory = () => Constructable

export function Inject (token?: string | symbol): PropertyDecorator
export function Inject (factory?: InjectFactory): PropertyDecorator
export function Inject (tokenOrFactory?: string | symbol | InjectFactory): PropertyDecorator {
  return (target, propertyKey) => {
    const propertyResolver = getPropertyResolver(target, propertyKey, tokenOrFactory)
    definePropertyResolver(target, propertyResolver)
  }
}
