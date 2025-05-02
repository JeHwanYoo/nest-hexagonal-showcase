import { MikroORM } from '@mikro-orm/core'
import { MikroOrmModule } from '@mikro-orm/nestjs/mikro-orm.module'
import { PostgreSqlDriver } from '@mikro-orm/postgresql'
import { Logger, Module, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      inject: [ConfigService],
      driver: PostgreSqlDriver,
      useFactory: (configService: ConfigService) => {
        const isDevelopment = configService.get('NODE_ENV') !== 'production'

        return {
          autoLoadEntities: true,
          clientUrl: configService.get('DATABASE_URL'),
          discovery: {
            warnWhenNoEntities: false,
          },
          migrations: {
            safe: true,
            dropTables: false,
          },
          driverOptions: {
            connection: {
              ssl: isDevelopment
                ? false
                : {
                    rejectUnauthorized: true,
                  },
            },
          },
          debug: isDevelopment,
        }
      },
    }),
  ],
})
export class MikroOrmConfigModule implements OnModuleInit {
  private readonly logger = new Logger(MikroOrmConfigModule.name)

  constructor(private readonly orm: MikroORM) {}

  async onModuleInit() {
    const isDevelopment = process.env.NODE_ENV !== 'production'

    if (isDevelopment) {
      this.logger.debug(
        'Initializing automatic database migration in development environment',
      )
      this.logger.debug(
        'Warning: This operation may modify database structure and potentially affect data',
      )

      const generator = this.orm.getSchemaGenerator()
      await generator.ensureDatabase()
      const updateSchemaSql = await generator.getUpdateSchemaSQL()

      if (updateSchemaSql) {
        await generator.updateSchema()
      }
    }
  }
}
