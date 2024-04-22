import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {WsAdapter} from '@nestjs/platform-ws';
import {readFileSync} from 'fs';
import {join} from 'path';
import {HttpsOptions} from '@nestjs/common/interfaces/external/https-options.interface';
import {ExpressAdapter} from '@nestjs/platform-express';


async function bootstrap() {
    const httpsOptions: HttpsOptions = {
        key: readFileSync(join(process.env.PWD, 'certs', 'localhost-key.pem')),
        cert: readFileSync(join(process.env.PWD, 'certs', 'localhost.pem')),
    }

    const app = await NestFactory.create(AppModule, new ExpressAdapter(), { httpsOptions });
    app.enableCors();

    app.useWebSocketAdapter(new WsAdapter(app));
    await app.listen(process.env.BACKEND_PORT);
}

bootstrap();
