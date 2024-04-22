import {Module} from '@nestjs/common';
import {ChatRepository} from './chat/chat.repository';
import {PostgresChatRepository} from './chat/postgres-chat.repository';
import {POSTGRES_CLIENT, postgresClientProvier} from './clients/postgres.client';

@Module({
    providers: [
        {provide: ChatRepository, useClass: PostgresChatRepository},
        {
            provide: POSTGRES_CLIENT,
            useFactory: postgresClientProvier,
        },
    ],
    exports: [ChatRepository]
})
export class PersistenceModule {
}
