import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {WsAdapter} from '@nestjs/platform-ws';
import {readFileSync} from 'fs';
import {join} from 'path';
import {HttpsOptions} from '@nestjs/common/interfaces/external/https-options.interface';
import {createServer} from 'https';
import { WebSocketServer } from 'ws';
import {ExpressAdapter} from '@nestjs/platform-express';


async function bootstrap() {
    // const httpsOptions: HttpsOptions = {
    //     key: readFileSync(join(process.env.PWD, 'certs', 'localhost-key.pem')),
    //     cert: readFileSync(join(process.env.PWD, 'certs', 'localhost.pem')),
    // }
    //
    // const app = await NestFactory.create(AppModule, new ExpressAdapter(), { httpsOptions });
    // app.enableCors();
    //
    // const server = app.getHttpServer();
    //
    // // const server = createServer({
    // //     key: readFileSync(join(process.env.PWD, 'certs', 'localhost-key.pem')),
    // //     cert: readFileSync(join(process.env.PWD, 'certs', 'localhost.pem')),
    // // });
    // const wss = new WebSocketServer({ server });
    //
    // const adapter = new WsAdapter(server);
    //
    // app.useWebSocketAdapter(adapter);
    // await app.listen(4000);

    const httpsOptions: HttpsOptions = {
        key: readFileSync(join(process.env.PWD, 'certs', 'localhost-key.pem')),
        cert: readFileSync(join(process.env.PWD, 'certs', 'localhost.pem')),
    }

    const app = await NestFactory.create(AppModule, new ExpressAdapter(), { httpsOptions });
    app.enableCors();

    app.useWebSocketAdapter(new WsAdapter(app));
    await app.listen(4000);
}

bootstrap();
