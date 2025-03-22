import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

const packageInfo = new Map<string, string>()
packageInfo.set('name', process.env.APP_NAME ?? 'nest-hexagonal-showcase')
packageInfo.set(
  'description',
  process.env.APP_DESCRIPTION ?? 'NestJS Hexagonal Architecture Showcase',
)
packageInfo.set('version', process.env.APP_VERSION ?? '0.0.1')

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
      .setTitle(packageInfo.get('name') as string)
      .setDescription(packageInfo.get('description') as string)
      .setVersion(packageInfo.get('version') as string)
      .addTag(
        (packageInfo.get('version') as string).startsWith('0.')
          ? 'beta'
          : `${(packageInfo.get('version') as string).split('.')[0]}.x`,
      )
      .build()
    const documentFactory = () => SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('docs', app, documentFactory)
  }

  await app.listen(process.env.PORT ?? 3000)
}

bootstrap().catch(console.error)
