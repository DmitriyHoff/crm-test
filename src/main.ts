import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { InstanceAxios } from './axiosInstance';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await InstanceAxios.init();
    await app.listen(3000);
}
bootstrap();
