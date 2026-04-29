import { LlmHandlerInterface, LlmMessage } from "./llm-handler.interface";
import { Injectable } from "@nestjs/common";
import { LlmHandler } from "./llm-handler.decorator";

const MAGIC_ANSWERS = [
  // Positive
  "It is certain",
  "It is decidedly so",
  "Without a doubt",
  "Yes — definitely",
  "You may rely on it",
  "As I see it, yes",
  "Most likely",
  "Outlook good",
  "Yes",
  "Signs point to yes",

  // Neutral
  "Reply hazy, try again",
  "Ask again later",
  "Better not tell you now",
  "Cannot predict now",
  "Concentrate and ask again",

  // Negative
  "Don’t count on it",
  "My reply is no",
  "My sources say no",
  "Outlook not so good",
  "Very doubtful",

  "The odds are in your favor",
  "Highly unlikely",
  "Try a different approach",
  "You already know the answer",
  "Fate says yes, logic says no",
  "Outcome unclear — proceed anyway",
  "Error 8-Ball: insufficient destiny 😄",
] as const;

@Injectable()
@LlmHandler("8ball")
export class DefaultLlmHandler implements LlmHandlerInterface {
  complete(messages: LlmMessage[]): Promise<string> {
    const index = Math.floor(Math.random() * MAGIC_ANSWERS.length);

    return Promise.resolve(MAGIC_ANSWERS[index]);
  }
}
