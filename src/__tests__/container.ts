import 'reflect-metadata'
import { Injectable } from '../decorators/injectable.decorator'
import { Inject } from '../decorators/inject.decorator'
import { Container } from '../container'

describe('Container', () => {
  let container: Container

  beforeEach(() => {
    container = new Container()
  })

  it('should resolve a single property class dependency', () => {
    @Injectable()
    class DependencyClass {}

    @Injectable()
    class Class {
      @Inject()
      public readonly dependency!: DependencyClass
    }

    const instance = container.resolve(Class)

    expect(instance.dependency).toBeDefined()
    expect(instance.dependency).toBeInstanceOf(DependencyClass)
  })

  it('should resolve multiple properties classes dependencies', () => {
    @Injectable()
    class DependencyClass1 {}

    @Injectable()
    class DependencyClass2 {}

    @Injectable()
    class Class {
      @Inject()
      public readonly dependency1!: DependencyClass1

      @Inject()
      public readonly dependency2!: DependencyClass2
    }

    const instance = container.resolve(Class)

    expect(instance.dependency1).toBeDefined()
    expect(instance.dependency2).toBeDefined()
    expect(instance.dependency1).toBeInstanceOf(DependencyClass1)
    expect(instance.dependency2).toBeInstanceOf(DependencyClass2)
  })

  it('should resolve dependency via string token', () => {
    const token = 'TOKEN'
    const value = 'VALUE'

    container.bind(token, value)

    @Injectable()
    class Class {
      @Inject(token)
      public readonly dependency!: string
    }

    const instance = container.resolve(Class)

    expect(instance.dependency).toBeDefined()
    expect(instance.dependency).toBe(value)
  })

  it('should resolve cycle dependencies', () => {
    @Injectable()
    class SecondClass {
      @Inject(() => Class)
      // this is kinda broken, 'cos we cannot use type Class before its initialization, so.. it's unknown
      public readonly dependency!: unknown
    }

    @Injectable()
    class Class {
      @Inject(() => SecondClass)
      public readonly dependency!: SecondClass
    }

    const instance = container.resolve(Class)

    expect(instance.dependency).toBeInstanceOf(SecondClass)
    expect(instance.dependency.dependency).toBeInstanceOf(Class)
    expect(instance.dependency.dependency).toBe(instance)
  })

  it('should resolve constructor dependencies marked using @Inject decorator', () => {
    @Injectable()
    class SomeClass {}

    @Injectable()
    class Class {
      constructor (
        @Inject()
        public readonly someClass: SomeClass
      ) {
      }
    }

    const instance = container.resolve(Class)

    expect(instance.someClass).toBeDefined()
    expect(instance.someClass).toBeInstanceOf(SomeClass)
  })

  it('should resolve multiple constructor dependencies marked using @Inject decorator', () => {
    @Injectable()
    class SomeClass {}

    @Injectable()
    class AnotherClass {}

    @Injectable()
    class Class {
      constructor (
        @Inject()
        public readonly someClass: SomeClass,
        @Inject()
        public readonly anotherClass: AnotherClass
      ) {
      }
    }

    const instance = container.resolve(Class)

    expect(instance.someClass).toBeDefined()
    expect(instance.someClass).toBeInstanceOf(SomeClass)
    expect(instance.anotherClass).toBeDefined()
    expect(instance.anotherClass).toBeInstanceOf(AnotherClass)
  })

  it('should auto resolve constructor dependencies', () => {
    @Injectable()
    class SomeClass {}

    @Injectable()
    class AnotherClass {}

    @Injectable()
    class Class {
      constructor (
        public readonly someClass: SomeClass,
        public readonly anotherClass: AnotherClass
      ) {
      }
    }

    const instance = container.resolve(Class)

    expect(instance.someClass).toBeDefined()
    expect(instance.someClass).toBeInstanceOf(SomeClass)
    expect(instance.anotherClass).toBeDefined()
    expect(instance.anotherClass).toBeInstanceOf(AnotherClass)
  })

  it('should throw if dependency is not registered with @Injectable', () => {
    // eslint-disable-next-line @typescript-eslint/no-extraneous-class
    class SomeClass {}

    @Injectable()
    class Class {
      @Inject()
      private readonly someClass!: SomeClass
    }

    expect(() => container.resolve(Class)).toThrow()
  })

  it('should throw if dependency is undefined', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface SomeInterface {}

    @Injectable()
    class Class {
      @Inject()
      private readonly someDependency!: SomeInterface
    }

    expect(() => container.resolve(Class)).toThrow()
  })
})
