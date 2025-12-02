import { Module } from '@nestjs/common';
import { MessagingService } from './messaging.service';

@Module({
  providers: [MessagingService],
  exports: [MessagingService], // ✅ MUST be exported
})
export class MessagingModule {}
