<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
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

## Testing

```bash
# Unit tests
$ pnpm run test

# E2E tests
$ pnpm run test:e2e

# Test coverage
$ pnpm run test:cov
```

## Key Components of the Architecture

1. **Domain Layer**: Contains business logic, entities, and domain services
2. **Application Layer**: Contains use cases and orchestrates the flow of data
3. **Infrastructure Layer**: Contains implementations for external dependencies
4. **Ports**: Interfaces that define how the application interacts with external systems
5. **Adapters**: Implementations of ports that connect to external systems

## License

This project is [MIT licensed](LICENSE).
