import {Injectable} from '@nestjs/common';
import OpenAI from 'openai';
import {ChatMessage} from '../chat/chat.types';
import {
    ChatCompletionAssistantMessageParam,
    ChatCompletionMessageParam,
    ChatCompletionUserMessageParam
} from 'openai/resources';
import {ChatCompletionCreateParamsNonStreaming} from 'openai/src/resources/chat/completions';

@Injectable()
export class LanguageModelService {
    private readonly openAi = new OpenAI({
        apiKey: process.env.AI_API_KEY
    });

    constructor() {
    }

    async respondInConversation(previousMessages: ChatMessage[]): Promise<string> {
        const messages = previousMessages.map((m) => ({ role: m.role, content: m.text }));

        const completion = await this.openAi.chat.completions.create({
            messages,
            model: 'gpt-3.5-turbo',
        } as ChatCompletionCreateParamsNonStreaming);

        // FIXME: Handling weird return values from the API
        return completion.choices[0].message.content;
    }
}
