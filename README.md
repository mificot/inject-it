
# Inject It

This is **yet another** simple dependency injection tool that will help you resolve dependencies to focus on bisness logic instead of how and when provide dependencies.

Main features:
- property based injection
- support for multiple DI containers
- constructor based injection

## Changelog

### 1.1.0
- Add constructor based injections
- Add auto resolve constructor dependencies (no need to use **@Inject** on Injectables dependencies)
- Fix issue with resolving non-injectable dependencies

## Disclaimer
This project was built to understand how decorators and Reflect working in TypeScript and how Dependecy Injection can be impletented.
## Installation

To start using package you need to run following commands via NPM:

```bash
  npm install @mificot/inject-it reflect-metadata
```

Import ```reflect-metadata``` package in the your entry source file

```typescript

import 'reflect-metadata'

// your source code
```

Also you need to enable emitting decorator metadata in ```tsconfig.json``` file under ```compilerOptions``` key:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

That it. Now you ready to go 😊

## Usage/Examples
### Basic example
```typescript
import { Container, Inject, Injectable } from '@mificot/inject-it'

const container = new Container()

@Injectable()
class InjectableClass {
  public action(): void {
    console.log('hello there')
  }
}

@Injectable()
class BaseClass {
  @Inject()
  public readonly injectableClass: InjectableClass
}

container.resolve(BaseClass).injectableClass.action() // logs: "hello there"
```
## Todo
- [x] Constructor based injection
- [ ] Global container
- [ ] More docs