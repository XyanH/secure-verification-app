import { Controller, Post, Body } from '@nestjs/common';
import { BiometricsService } from './biomet.service';
import { User } from './user/user.entity';

@Controller('biomet')
export class BiometricsController {
  constructor(private readonly userService: BiometricsService) {}

  @Post('save-face')
  async saveFaceData(@Body() body: { email: string; faceData: string }) {
    return this.userService.updateFaceData(body.email, body.faceData);
  }
}
