import { type Token } from './types/token.type'

export class Registry {
  private readonly registry: Map<Token, any> = new Map<Token, any>()

  public get<T = any>(token: Token): T | null {
    return this.registry.get(token) || null
  }

  public set (token: Token, value: any): void {
    this.registry.set(token, value)
  }
}
