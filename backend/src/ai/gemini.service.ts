// src/ai/gemini.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private model: GenerativeModel | null = null;
  private isInitialized = false;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      this.logger.warn(
        'GEMINI_API_KEY environment variable is not set. AI features will be disabled.',
      );
      this.logger.warn(
        'To enable AI features: Get API key from https://makersuite.google.com/app/apikey and add GEMINI_API_KEY to .env',
      );
      return;
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      this.isInitialized = true;
      this.logger.log('Gemini AI service initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Gemini AI service:', error);
    }
  }

  async generate(prompt: string): Promise<string> {
    if (!this.isInitialized || !this.model) {
      throw new Error(
        'Gemini AI is not initialized. Please set GEMINI_API_KEY environment variable.',
      );
    }

    try {
      if (!this.model) {
        throw new Error('Model not initialized');
      }
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      this.logger.error('Gemini AI generation error:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  isAvailable(): boolean {
    return this.isInitialized;
  }
}
