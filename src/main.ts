import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder } from '@nestjs/swagger'
import * as fs from 'fs'
import * as path from 'path'
import { SwaggerModule } from '@nestjs/swagger'

const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'),
) as Record<string, unknown>

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  if (process.env.NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle(packageJson.name as string)
      .setDescription(packageJson.description as string)
      .setVersion(packageJson.version as string)
      .addTag(
        (packageJson.version as string).startsWith('0.')
          ? 'beta'
          : `${(packageJson.version as string).split('.')[0]}.x`,
      )
      .build()
    const documentFactory = () => SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('docs', app, documentFactory)
  }

  await app.listen(process.env.PORT ?? 3000)
}

bootstrap().catch(console.error)
