import { NestFactory, Reflector } from '@nestjs/core';
import { TimerAppModule } from './timer-app.module';
import { CustomExceptionFilter, Interceptor } from '@app/config';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from './config/config.type';

async function bootstrap() {
  const app = await NestFactory.create(TimerAppModule);

  const configService = app.get(ConfigService<AllConfigType>);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 정의된 필드만 받아들임
      forbidNonWhitelisted: true, // 정의되지 않은 필드가 포함되어 있으면 요청을 거부
      transform: true,
    }),
  );

  app.setGlobalPrefix(
    configService.getOrThrow('app.apiPrefix', { infer: true }),
  );

  app.useGlobalInterceptors(new Interceptor());
  app.useGlobalFilters(new CustomExceptionFilter());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.enableCors({
    origin: ['https://monta-pwa.vercel.app', 'http://localhost:5173'],
    credentials: true,
    allowedHeaders: ['Authorization'],
  });

  const PORT = process.env.SERVER_PORT || 4000;
  await app.listen(PORT);
}
bootstrap();
