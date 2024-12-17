import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileService {
  private uploadPath = path.join(
    __dirname,
    '..',
    '..',
    'uploads',
    'voice-data',
  );

  constructor() {
    // Ensure the directory exists
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  saveFile(fileBuffer: Buffer, filename: string): string {
    const filePath = path.join(this.uploadPath, filename);
    fs.writeFileSync(filePath, fileBuffer);
    return filePath;
  }
}
