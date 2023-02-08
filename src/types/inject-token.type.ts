import { type Constructable } from './constructable.type'

export type InjectToken = (() => Constructable) | string | symbol
