// app/lib/roxy/voice.ts
import OpenAI from 'openai';

export class RoxyVoice {
  private openai = new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY 
  });

  async speak(text: string): Promise<string> {
    const mp3 = await this.openai.audio.speech.create({
      model: "tts-1",
      voice: "nova",
      input: text,
      response_format: "mp3",
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    const blob = new Blob([buffer], { type: 'audio/mpeg' });
    return URL.createObjectURL(blob);
  }
}