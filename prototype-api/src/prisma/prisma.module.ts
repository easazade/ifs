import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

// One shared client per Nest application, available to all resource modules.
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
