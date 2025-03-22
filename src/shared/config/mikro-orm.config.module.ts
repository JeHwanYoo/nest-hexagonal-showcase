import { MikroOrmModule } from '@mikro-orm/nestjs/mikro-orm.module'
import { SqliteDriver } from '@mikro-orm/sqlite'
import { Module, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MikroORM } from '@mikro-orm/core'

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isDevelopment = configService.get('NODE_ENV') !== 'production'

        return {
          entities: ['./dist/**/*.entity.js'],
          entitiesTs: ['./src/**/*.entity.ts'],
          dbName: configService.get('DB_NAME') || 'db.sqlite',
          driver: SqliteDriver,
          discovery: {
            warnWhenNoEntities: false,
          },
          migrations: {
            path: './dist/migrations',
            pathTs: './src/migrations',
            autoRun: isDevelopment,
          },
          schemaGenerator: {
            disableForeignKeys: true,
            createForeignKeyConstraints: true,
            ignoreSchema: [],
          },
          debug: isDevelopment,
        }
      },
    }),
  ],
})
export class MikroOrmConfigModule implements OnModuleInit {
  constructor(private readonly orm: MikroORM) {}

  async onModuleInit() {
    const isDevelopment = process.env.NODE_ENV !== 'production'

    if (isDevelopment) {
      const generator = this.orm.getSchemaGenerator()
      await generator.createSchema()
      await generator.updateSchema()
    }
  }
}
