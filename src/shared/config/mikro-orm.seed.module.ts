import { User } from '@/user/domain/model/user.model'
import { UserEntity } from '@/user/infrastructure/persistence/entities/user.entity'
import { MikroORM } from '@mikro-orm/core'
import { Logger, Module, OnModuleInit } from '@nestjs/common'
import { randEmail, randFirstName } from '@ngneat/falso'

@Module({})
export class MikroOrmSeedModule implements OnModuleInit {
  private readonly logger = new Logger(MikroOrmSeedModule.name)

  constructor(private readonly orm: MikroORM) {}

  async onModuleInit() {
    if (process.env.NODE_ENV === 'production') {
      this.logger.debug('Seed module only runs in development environment')
      return
    }

    try {
      const isAlreadyInitialized = await this.checkIfAlreadyInitialized()

      if (isAlreadyInitialized) {
        this.logger.debug(
          'Database is already initialized. Skipping seed operation',
        )
        return
      }

      await this.seedDatabase()
      await this.markAsInitialized()

      this.logger.debug('Database seed completed successfully')
    } catch (error) {
      this.logger.error('Error occurred during database seeding', error.stack)
      throw error
    }
  }

  private async checkIfAlreadyInitialized(): Promise<boolean> {
    const em = this.orm.em.fork()

    try {
      const result = await em
        .getConnection()
        .execute(`SELECT * FROM db_metadata WHERE key = 'is_seeded'`)

      return result.length > 0 && result[0].value === 'true'
    } catch (e) {
      return false
    }
  }

  private async seedDatabase(): Promise<void> {
    try {
      const em = this.orm.em.fork()

      const fakeUsers = Array.from({ length: 10 }, (_, i) =>
        UserEntity.fromDomain(
          new User({
            email: randEmail(),
            name: randFirstName(),
          }),
        ),
      )

      em.persist(fakeUsers)
      await em.flush()
    } catch (e) {
      this.logger.error('Error seeding database', e.stack)
      throw e
    }
  }

  private async markAsInitialized(): Promise<void> {
    const em = this.orm.em.fork()

    try {
      await em.getConnection().execute(`
        CREATE TABLE IF NOT EXISTS db_metadata (
          key VARCHAR(255) PRIMARY KEY,
          value VARCHAR(255) NOT NULL
        )
      `)

      await em.getConnection().execute(`
        INSERT INTO db_metadata (key, value)
        VALUES ('is_seeded', 'true')
        ON CONFLICT (key) DO UPDATE SET value = 'true'
      `)

      await em.flush()
    } catch (e) {
      this.logger.error('Error marking initialization status', e.stack)
      throw e
    }
  }
}
