import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder } from '@nestjs/swagger'
import * as fs from 'fs'
import * as path from 'path'
import { SwaggerModule } from '@nestjs/swagger'

const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'),
)

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
    console.log('Swagger is enabled', packageJson)
    const config = new DocumentBuilder()
      .setTitle(packageJson.name)
      .setDescription(packageJson.description)
      .setVersion(packageJson.version)
      .addTag(
        packageJson.version.startsWith('0.')
          ? 'beta'
          : `${packageJson.version.split('.')[0]}.x`,
      )
      .build()
    const documentFactory = () => SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('docs', app, documentFactory)
  }

  await app.listen(process.env.PORT ?? 3000)
}

bootstrap().catch(console.error)
