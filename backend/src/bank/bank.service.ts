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

  async importStatement(clientId: string, file: Express.Multer.File) {
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

      // Check if Gemini AI is available
      if (!this.gemini.isAvailable()) {
        throw new InternalServerErrorException(
          'AI service is not available. Please configure GEMINI_API_KEY to use bank statement import.',
        );
      }

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
            clientId,
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
  // HELPERS
  // ============================

  private async extractPdfText(buffer: Buffer): Promise<string> {
    try {
      const pdfParse = require('pdf-parse');
      const data = await pdfParse(buffer);
      return data.text;
    } catch (error) {
      console.error('PDF parsing error:', error);
      throw new InternalServerErrorException('Failed to parse PDF file');
    }
  }

  private async extractExcelText(buffer: Buffer): Promise<string> {
    try {
      const XLSX = require('xlsx');
      const workbook = XLSX.read(buffer, { type: 'buffer' });

      // Get the first sheet
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert to JSON and then to text
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Format as readable text
      let text = '';
      if (jsonData.length > 0) {
        // Header row
        const headers = Object.keys(jsonData[0]);
        text += headers.join(' | ') + '\n';
        text += '-'.repeat(headers.length * 20) + '\n';

        // Data rows
        jsonData.forEach((row: any) => {
          text += headers.map((h) => row[h] || '').join(' | ') + '\n';
        });
      }

      return text;
    } catch (error) {
      console.error('Excel parsing error:', error);
      throw new InternalServerErrorException('Failed to parse Excel file');
    }
  }
}
