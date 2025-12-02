// src/bank/bank.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GeminiService } from '../ai/gemini.service';
import type { Express } from 'express';

@Injectable()
export class BankService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gemini: GeminiService,
  ) {}

  async importStatement(file: Express.Multer.File) {
    try {
      // 1️⃣ Extract text (OCR / PDF / Excel)
      const rawText = file.mimetype.includes('pdf')
        ? await this.extractPdfText(file.buffer)
        : await this.extractExcelText(file.buffer);

      // 2️⃣ Ask AI to classify transactions into JSON
      const prompt = `
You are a bank statement parser. Convert this statement text into JSON with fields:
[
  {
    "date": "YYYY-MM-DD",
    "description": "...",
    "amount": 1234.56,
    "type": "CREDIT" | "DEBIT",
    "category": "Salary|Rent|Investments|Other"
  }
]

Statement text:
${rawText}

Return ONLY valid JSON. No markdown. No backticks.
      `;

      // ✅ FIXED GEMINI CALL
      const aiResult = await this.gemini.generate(prompt);

      let transactions: Array<{
        date: string;
        description: string;
        amount: number;
        type: 'CREDIT' | 'DEBIT';
        category: string;
      }>;

      try {
        const clean = aiResult
          .replace(/```json/gi, '')
          .replace(/```/g, '')
          .trim();

        transactions = JSON.parse(clean);
      } catch (err) {
        console.error('❌ Failed to parse AI JSON:', aiResult);
        throw new InternalServerErrorException('AI returned invalid JSON');
      }

      // 3️⃣ Store as bank transactions
      for (const t of transactions) {
        await this.prisma.bankTransaction.create({
          data: {
            date: new Date(t.date),
            description: t.description,
            amount: Number(t.amount),
            type: t.type,
            category: t.category,
            // ⚠️ Replace this with real clientId from JWT / request later
            clientId: 'TODO_CLIENT_ID',
          },
        });
      }

      return {
        importedCount: transactions.length,
      };
    } catch (e) {
      console.error('❌ importStatement error:', e);
      throw new InternalServerErrorException('Failed to import statement');
    }
  }

  // ============================
  // HELPERS (STUBS FOR NOW)
  // ============================

  private async extractPdfText(buffer: Buffer): Promise<string> {
    // TODO: integrate pdf-parse / OCR here
    return 'PDF TEXT HERE';
  }

  private async extractExcelText(buffer: Buffer): Promise<string> {
    // TODO: integrate xlsx parser here
    return 'EXCEL TEXT HERE';
  }
}
