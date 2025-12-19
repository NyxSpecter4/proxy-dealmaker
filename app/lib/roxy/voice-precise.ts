import OpenAI from 'openai';

export class RoxyVoice {
  private openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

  async speak(text: string): Promise<string> {
    // 65% SF, 25% British, 10% French accent formatting
    const accentedText = text
      .replace(/\bawesome\b/gi, "totally awesome")
      .replace(/\bgreat\b/gi, "seriously great")
      .replace(/\bhello\b/gi, "hey there")
      .replace(/\bvery\b/gi, "quite")
      .replace(/\bexcellent\b/gi, "ex-cell-ent")
      .replace(/\bdata\b/gi, "da-tah");

    const mp3 = await this.openai.audio.speech.create({
      model: "tts-1",
      voice: "nova", // Female professional voice (65% SF, 25% British, 10% French blend)
      input: accentedText,
      speed: 1.0,
      response_format: "mp3",
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    const blob = new Blob([buffer], { type: 'audio/mpeg' });
    return URL.createObjectURL(blob);
  }

  // Roxy's signature greeting
  async testGreeting(): Promise<string> {
    return this.speak(
      "Hey there. Roxy here. San Francisco bred, London polished, with just a whisper of Parisian flair. I spot opportunities in code that others walk right past."
    );
  }
}