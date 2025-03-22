import { MikroOrmModule } from '@mikro-orm/nestjs/mikro-orm.module'
import { SqliteDriver } from '@mikro-orm/sqlite'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
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
            updateSchema: isDevelopment,
            createForeignKeyConstraints: true,
          },
          debug: isDevelopment,
        }
      },
    }),
  ],
})
export class MikroOrmConfigModule {}
