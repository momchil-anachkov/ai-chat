import {Injectable} from '@nestjs/common';
import OpenAI from 'openai';
import {ChatMessage} from '../chat/chat.types';

@Injectable()
export class LanguageModelService {
    // FIXME: This ANY CRAP
    private readonly openAi: any = new OpenAI({
        apiKey: process.env.AI_API_KEY
    });

    constructor() {
    }

    async respondInConversation(previousMessages: ChatMessage[]): Promise<string> {
        const messages = previousMessages.map((m) => ({ role: m.role, content: m.text }));

        const completion = await this.openAi.chat.completions.create({
            messages,
            model: 'gpt-3.5-turbo',
        });

        // FIXME: Handling weird return values from the API
        return completion.choices[0].message.content;
    }
}
