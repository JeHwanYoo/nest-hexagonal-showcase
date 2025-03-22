<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">
  <a href="https://vitest.dev" target="_blank">
    <img src="https://img.shields.io/badge/tested%20with-vitest-6E9F18.svg?style=flat" alt="Tested with Vitest" />
  </a>
  <a href="https://github.com/yourusername/nest-hexagonal-showcase/actions" target="_blank">
    <img src="https://github.com/yourusername/nest-hexagonal-showcase/actions/workflows/test.yml/badge.svg" alt="Tests" />
  </a>
  <a href="https://codecov.io/gh/yourusername/nest-hexagonal-showcase" target="_blank">
    <img src="https://codecov.io/gh/yourusername/nest-hexagonal-showcase/branch/main/graph/badge.svg?flag=unit" alt="Unit Test Coverage" />
  </a>
  <a href="https://codecov.io/gh/yourusername/nest-hexagonal-showcase" target="_blank">
    <img src="https://codecov.io/gh/yourusername/nest-hexagonal-showcase/branch/main/graph/badge.svg?flag=e2e" alt="E2E Test Coverage" />
  </a>
</p>

# NestJS Hexagonal Architecture Showcase

## Description

This project demonstrates how to implement Hexagonal Architecture (also known as Ports and Adapters), a popular clean architecture pattern, using NestJS. It serves as a showcase for developers interested in advanced architectural patterns in Node.js applications.

## About Hexagonal Architecture

Hexagonal Architecture separates the core business logic from external concerns, making your application:

- More maintainable
- Highly testable
- Framework agnostic (at the domain level)
- More resilient to changes in external dependencies

## Important Considerations

- **Advanced Skill Level Required**: This architecture requires a high level of proficiency with NestJS and deep insights into Dependency Injection. It is not recommended for production use by teams of junior developers without sufficient practice.

- **Intended for Medium to Large Organizations**: This architecture is designed with medium to large development organizations in mind. Use it when you have clear role and responsibility separation between domains. If you're developing all domains alone, this architecture might be unnecessarily complex.

- **Database Choice**: This showcase uses SQLite for simplicity. In a production environment, select the DBMS that best fits your requirements.

## Project Setup

```bash
# Install dependencies
$ pnpm install
```

## Running the Project

```bash
# Development mode
$ pnpm run start

# Watch mode
$ pnpm run start:dev

# Production mode
$ pnpm run start:prod
```

## Testing Strategy

This project implements a layered testing strategy:

### Unit Tests

- **Location**: `.spec.ts` files within each domain folder
- **Target**: Application service layer (business logic)
- **Characteristics**: Focus on domain logic, mocking external dependencies

### Integration Tests

- **Location**: `.spec.ts` files in the Infrastructure layer
- **Target**: Repository implementations
- **Characteristics**: Database integration tests (using SQLite in-memory database)

### E2E Tests

- **Location**: `.e2e-spec.ts` files in the top-level `test` folder
- **Target**: API endpoints
- **Characteristics**: Full application integration testing
- **Requirements**: Docker is required as E2E tests use test containers to provide real database instances
- **Implementation**: TestContainers are used to spin up isolated database instances for testing, ensuring tests run against environments similar to production

## Requirements

- Node.js v18+
- pnpm
- Docker (for E2E tests)

## Test Commands

Commands for each type of test:

```bash
# Unit tests
$ pnpm test

# Unit tests (watch mode)
$ pnpm test:watch

# Unit tests (with coverage)
$ pnpm test:cov

# E2E tests
$ pnpm test:e2e

# E2E tests (watch mode)
$ pnpm test:e2e:watch

# E2E tests (with coverage)
$ pnpm test:e2e:cov
```

## Test Configuration

Tests use Vitest:

- `vitest.config.ts`: Configuration for unit tests
- `vitest.config.e2e.ts`: Configuration for E2E tests

Integration tests use SQLite in-memory database: `:memory:`

E2E tests use TestContainers to provide isolated database environments that closely mirror production.

## Key Components of the Architecture

1. **Domain Layer**: Contains business logic, entities, and domain services
2. **Application Layer**: Contains use cases and orchestrates the flow of data
3. **Infrastructure Layer**: Contains implementations for external dependencies
4. **Ports**: Interfaces that define how the application interacts with external systems
5. **Adapters**: Implementations of ports that connect to external systems

## Project Structure

```
src/
├── user/                     # User domain
│   ├── application/          # Application layer (use cases)
│   │   ├── user.find.service.ts
│   │   ├── user.find.service.spec.ts  # Unit tests
│   │   ├── user.create.service.ts
│   │   └── user.create.service.spec.ts
│   ├── domain/               # Domain layer (business models, ports)
│   │   ├── model/
│   │   │   └── user.model.ts
│   │   └── ports/
│   │       ├── in/           # Inbound ports (use cases)
│   │       │   ├── create-user.usecase.ts
│   │       │   └── find-user.usecase.ts
│   │       └── out/          # Outbound ports (repositories)
│   │           └── user-repository.port.ts
│   ├── infrastructure/       # Infrastructure layer (adapters)
│   │   ├── api/              # Controllers (inbound adapters)
│   │   │   └── user.controller.ts
│   │   └── persistence/      # Repository implementations (outbound adapters)
│   │       ├── entities/
│   │       │   └── user.entity.ts
│   │       ├── user.mikro-orm.repository.ts
│   │       └── user.mikro-orm.repository.spec.ts  # Integration tests
│   └── config/               # Domain configuration
│       └── user.module.ts
test/
└── app.e2e-spec.ts           # E2E tests
```

## License

This project is [MIT licensed](LICENSE).
