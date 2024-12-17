import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VoiceService } from './voice.service';
import { FileService } from 'voice-data/file.service';

@Controller('voice')
export class VoiceController {
  constructor(
    private readonly voiceService: VoiceService,
    private readonly fileService: FileService,
  ) {}

  @Post('save-voice')
  @UseInterceptors(FileInterceptor('file'))
  async saveVoice(
    @UploadedFile() file: Express.Multer.File,
    @Body('email') email: string,
  ) {
    try {
      // Save file to disk and get the file path
      const filePath = this.fileService.saveFile(file.buffer, `${email}.wav`);

      // Pass the file path to the service to update the database
      await this.voiceService.saveVoiceData(email, filePath);
      return { message: 'Voice data saved successfully.', filePath };
    } catch (error) {
      console.error('Error saving voice data:', error);
      throw error; // This will return a 500 status code
    }
  }
}
