import { type InjectToken } from './inject-token.type'

export interface PropertyResolver {
  token: InjectToken
  key: string | symbol
}
