import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user/user.entity';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class VoiceService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email });
  }

  async saveVoiceData(
    email: string,
    voiceData: string,
  ): Promise<{ success: boolean; message: string }> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    try {
      // Define the directory and file path
      const directoryPath = path.join(__dirname, '..', 'uploads', 'voices');
      const filePath = path.join(directoryPath, `${user.id}-${Date.now()}.wav`);

      // Ensure the directory exists
      await fs.mkdir(directoryPath, { recursive: true });

      // Convert Base64 to binary data and save the file
      const buffer = Buffer.from(voiceData, 'base64');
      await fs.writeFile(filePath, buffer);
      user.voiceData = filePath;
      this.userRepository.save(user);
      // Handle the audio data (e.g., save it to a database or file)
      console.log('Received voice data:', email);
      console.log('Voice Data (Base64):', voiceData);

      return { success: true, message: 'Voice data saved successfully' };
    } catch (error) {
      console.error('Error processing voice data:', error);
      throw new Error(`Failed to save voice data: ${error.message}`); // This will trigger a 500 response
    }
  }
}
