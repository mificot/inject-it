import { type InjectToken } from './inject-token.type'

export interface ParameterResolver {
  token: InjectToken
  index: number
}
