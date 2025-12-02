import { Injectable, Logger } from '@nestjs/common';
import { ChannelType } from '@prisma/client';
import { Twilio } from 'twilio';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MessagingService {
  private readonly logger = new Logger(MessagingService.name);

  private readonly twilioClient =
    process.env.TWILIO_SID && process.env.TWILIO_AUTH_TOKEN
      ? new Twilio(
          process.env.TWILIO_SID,
          process.env.TWILIO_AUTH_TOKEN,
        )
      : null;

  private readonly mailer =
    process.env.MAIL_USER && process.env.MAIL_PASS
      ? nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
          },
        })
      : null;

  async sendMessage(
    channel: ChannelType,
    to: string,
    subject: string | undefined,
    body: string,
  ): Promise<{ success: boolean; providerMessageId?: string }> {
    try {
      // ✅ SMS / WhatsApp via Twilio
      if (
        (channel === ChannelType.SMS ||
          channel === ChannelType.WHATSAPP) &&
        this.twilioClient
      ) {
        const msg = await this.twilioClient.messages.create({
          body,
          from:
            channel === ChannelType.WHATSAPP
              ? `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`
              : process.env.TWILIO_SMS_FROM,
          to:
            channel === ChannelType.WHATSAPP
              ? `whatsapp:${to}`
              : to,
        });

        return { success: true, providerMessageId: msg.sid };
      }

      // ✅ Email via Gmail SMTP
      if (channel === ChannelType.EMAIL && this.mailer) {
        const info = await this.mailer.sendMail({
          from: process.env.MAIL_USER,
          to,
          subject: subject ?? 'FinXpert Update',
          text: body,
        });

        return {
          success: true,
          providerMessageId: info.messageId,
        };
      }

      // ✅ Fallback (no provider configured)
      this.logger.warn(
        `No real provider configured. Logging message: [${channel}] to=${to}, subject=${subject}`,
      );
      this.logger.log(body);

      return { success: true };
    } catch (err) {
      this.logger.error(
        `Failed to send message via ${channel} to ${to}`,
        err.stack,
      );
      return { success: false };
    }
  }
}
