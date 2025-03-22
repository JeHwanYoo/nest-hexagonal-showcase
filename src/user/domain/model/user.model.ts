import { randomUUID } from 'crypto'

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(email: string, name: string): User {
    const now = new Date()
    return new User(randomUUID(), email, name, now, now)
  }
}
