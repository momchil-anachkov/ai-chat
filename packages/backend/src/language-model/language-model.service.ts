import {Injectable, Logger} from '@nestjs/common';
import OpenAI from 'openai';
import {ChatMessage} from '../chat/chat.types';
import {ChatCompletionCreateParamsNonStreaming} from 'openai/src/resources/chat/completions';

const CONFUSED_RESPONSE = `I'm a little dizzy right now, because my servers are experiencing issues. Please, come back a little later and I'll do my best to answer you then.`;

@Injectable()
export class LanguageModelService {
    private readonly openAi = new OpenAI({
        apiKey: process.env.AI_API_KEY
    });

    constructor(
        private readonly logger: Logger,
    ) {
    }

    async respondInConversation(previousMessages: ChatMessage[]): Promise<string> {
        try {
            const messages = previousMessages.map((m) => ({ role: m.role, content: m.text }));

            const completion = await this.openAi.chat.completions.create({
                messages,
                model: 'gpt-3.5-turbo',
            } as ChatCompletionCreateParamsNonStreaming);

            const completeResponse = completion.choices.find((choice) => choice.finish_reason === 'stop');

            if (!completeResponse) {
                return CONFUSED_RESPONSE;
            }

            return completeResponse.message.content;
        } catch (e) {
            this.logger.error(e.stack);
            return CONFUSED_RESPONSE;
        }
    }
}
