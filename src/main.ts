import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for all origins
  app.enableCors({
    origin: '*', // This allows all origins, but you can specify a specific origin, like 'http://127.0.0.1:5500' if needed
    methods: 'GET, POST, PUT, DELETE', // specify the allowed HTTP methods
    allowedHeaders: 'Content-Type', // specify the allowed headers
  });

  // Set a larger size for request bodies
  app.use(bodyParser.json({ limit: '50mb' })); // Adjust the limit as needed (e.g., '50mb', '100mb')
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  await app.listen(3000);
}
bootstrap();
