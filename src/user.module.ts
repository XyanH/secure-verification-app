import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthnController } from './authn.controller';
import { AuthnService } from './authn.service';
import { VoiceService } from './voice.service';
import { VoiceController } from './voice.controller';
import { BiometricsController } from './biomet.controller';
import { BiometricsService } from './biomet.service';
import { FileService } from 'voice-data/file.service';
import { User } from './user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthnController, VoiceController, BiometricsController],
  providers: [AuthnService, VoiceService, BiometricsService, FileService],
})
export class UserModule {}
