import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Permite que Expo/React Native acceda a la API desde otro dispositivo de la red.
  app.enableCors();

  await app.listen(3000, '0.0.0.0');
  console.log('API disponible en http://localhost:3000');
}
bootstrap();
