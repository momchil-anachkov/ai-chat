import {Logger, Module} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatGateway } from './chat/chat.gateway';
import { LanguageModelService } from './language-model/language-model.service';
import { PersistenceModule } from './persistence/persistence.module';

@Module({
  imports: [PersistenceModule],
  controllers: [AppController],
  providers: [
      AppService,
      ChatGateway,
      {
          provide: Logger,
          useClass: Logger,
      },
      LanguageModelService
  ],
})
export class AppModule {}

// FIXME - rename bp-pg-db